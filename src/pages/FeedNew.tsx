import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhotoUploader } from "@/components/PhotoUploader";
import { toast } from "sonner";
import { Sparkles, MapPin, RefreshCw } from "lucide-react";

import { KindSelect } from "./feed/KindSelect";
import { TagSelect } from "./feed/TagSelect";
import { MainContent } from "./feed/MainContent";
import { MeetFields } from "./feed/MeetFields";
import { SeeFields } from "./feed/SeeFields";
import { PollFields } from "./feed/PollFields";
import { ExpenseFields } from "./feed/ExpenseFields";
import { FeelingFields } from "./feed/FeelingFields";
import { AttachmentsField } from "./feed/AttachmentsField";
import { VisibilityField } from "./feed/VisibilityField";

import type { Kind, Visibility, ExpenseData, FeelingData } from "./feed/types";
import type { Photo } from "@/store/types";
import { useCurrentUser } from "@/lib/currentUser";
import { mockTrips } from "@/data/mockData";
import Axios from "../config/axios";
import {
    uploadFiles, waitForUploads, uploadErrorMessage,
    isAllowedPhoto, isAllowedAttachment, UPLOAD_MAX_FILE_SIZE,
} from "@/config/post";

export default function FeedNew() {
    const navigate = useNavigate();
    const user = useCurrentUser();
    const trips = mockTrips;
    // local date (YYYY-MM-DD) — toISOString() would give UTC and can be off by a day
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    // form state
    const [kind, setKind] = useState<Kind>("post");
    const [tripIds, setTripIds] = useState<string[]>([]);
    // first selected tag — used for expense local currency & redirect
    const tripId = tripIds[0] ?? "";
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [location, setLocation] = useState("");
    const [eventDate, setEventDate] = useState(today);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [uploadPct, setUploadPct] = useState<number | null>(null); // null = not uploading bytes
    const [visibility, setVisibility] = useState<Visibility>("everyone");
    const [allowedViewers, setAllowedViewers] = useState("");
    const [teamId, setTeamId] = useState("");
    const [contact, setContact] = useState("");
    const [impression, setImpression] = useState("");
    const [expiresAt, setExpiresAt] = useState("");
    const [pollQuestion, setPollQuestion] = useState("");
    const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
    const [sharedWith, setSharedWith] = useState("");

    const [expense, setExpense] = useState<ExpenseData>({
        date: today, desc: "", category: "Meals", currency: "IDR",
        amount: "", receipt: false, notes: "",
    });

    const [feeling, setFeeling] = useState<FeelingData>({ rating: 0, text: "", photos: [] });

    // ===== Geolocation (required by backend) =====
    type Coords = { latitude: number; longitude: number; accuracy: number };
    const [coords, setCoords] = useState<Coords | null>(null);
    const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
    const [geoError, setGeoError] = useState("");

    function captureLocation(): Promise<Coords | null> {
        return new Promise((resolve) => {
            if (!("geolocation" in navigator)) {
                setGeoStatus("error");
                setGeoError("This browser doesn't support location.");
                resolve(null);
                return;
            }
            setGeoStatus("loading");
            setGeoError("");
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const c = {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                        accuracy: pos.coords.accuracy,
                    };
                    setCoords(c);
                    setGeoStatus("ok");
                    resolve(c);
                },
                (err) => {
                    setGeoStatus("error");
                    setGeoError(
                        err.code === err.PERMISSION_DENIED
                            ? "Location permission denied. Allow location access in your browser to post."
                            : "Couldn't get your location. Please try again."
                    );
                    resolve(null);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
            );
        });
    }

    useEffect(() => {
        captureLocation();
    }, []);

    const selectedTrip = trips.find((t) => t.id === tripId);
    const localCode = selectedTrip?.approval?.localCurrency || "";

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ===== Validasi =====
        if (kind === "expense") {
            if (!expense.desc.trim() || !Number(expense.amount)) {
                toast.error("Add a description and an amount.");
                return;
            }
            if (expense.receipt && photos.length === 0) {
                toast.error("Attach at least one receipt photo, or turn 'Receipt available' off.");
                return;
            }
        } else if (kind === "poll") {
            const opts = pollOptions.map((o) => o.trim()).filter(Boolean);
            if (!pollQuestion.trim() || opts.length < 2) {
                toast.error("Add a question and at least two options.");
                return;
            }
        } else if (!text.trim() && photos.length === 0) {
            toast.error("Add some text or a photo first.");
            return;
        }

        const finalEventDate = kind === "expense" ? expense.date : eventDate;
        if (!finalEventDate) {
            toast.error("Pick an event date.");
            return;
        }
        if (finalEventDate > today) {
            toast.error("Event date can't be in the future.");
            return;
        }

        // ===== Location (required) — retry once if not captured yet =====
        const finalCoords = coords ?? (await captureLocation());
        if (!finalCoords) {
            toast.error("Location is required to post. Please allow location access.");
            return;
        }

        // ===== Validate files against BE rules (type + size) =====
        const photoFiles = photos.map((p) => p.file).filter((f): f is File => Boolean(f));
        const feelingFiles = kind === "expense"
            ? feeling.photos.map((p) => p.file).filter((f): f is File => Boolean(f))
            : [];
        const badPhoto = [...photoFiles, ...feelingFiles].find((f) => !isAllowedPhoto(f));
        if (badPhoto) {
            toast.error(`${badPhoto.name}: only JPG, PNG, WEBP or GIF pictures are allowed.`);
            return;
        }
        const badFile = attachments.find((f) => !isAllowedAttachment(f));
        if (badFile) {
            toast.error(`${badFile.name}: only PDF, Word, Excel, PowerPoint, TXT or CSV files are allowed.`);
            return;
        }
        const tooBig = [...photoFiles, ...feelingFiles, ...attachments].find((f) => f.size > UPLOAD_MAX_FILE_SIZE);
        if (tooBig) {
            toast.error(`${tooBig.name} is too large. Max ${UPLOAD_MAX_FILE_SIZE / 1024 / 1024} MB per file.`);
            return;
        }

        setSubmitting(true);
        try {
            // ===== Upload files: POST /post/upload_file → poll /post/upload_status =====
            // one list, same order back → split into photos / feeling photos / attachments
            const allFiles = [...photoFiles, ...feelingFiles, ...attachments];
            let photoIds: string[] = [];
            let feelingIds: string[] = [];
            let attachmentIds: string[] = [];

            if (allFiles.length > 0) {
                setUploadPct(0);
                const uploaded = await uploadFiles(allFiles, setUploadPct);
                if (uploaded.length !== allFiles.length) throw new Error("Some files were not uploaded.");
                setUploadPct(null); // now waiting for the BE to process them
                await waitForUploads(uploaded.map((f) => f.file_id));

                const ids = uploaded.map((f) => f.file_id);
                photoIds = ids.slice(0, photoFiles.length);
                feelingIds = ids.slice(photoFiles.length, photoFiles.length + feelingFiles.length);
                attachmentIds = ids.slice(photoFiles.length + feelingFiles.length);
            }

            // ===== Bangun body =====
            const selectedTags = tripIds
                .map((id) => trips.find((t) => t.id === id))
                .filter((t): t is (typeof trips)[number] => Boolean(t));

            const body = {
                kind,
                eventDate: finalEventDate,
                latitude: finalCoords.latitude,
                longitude: finalCoords.longitude,
                locationAccuracy: finalCoords.accuracy, // meters
                tag: selectedTags.map((t) => ({ tripId: t.id, tripTitle: t.title, tripCountry: t.country })), // [] when none
                title: kind !== "expense" ? title.trim().slice(0, 150) || null : null, // optional, max 150 chars
                text: text.trim() || null,
                location: location.trim() || null,
                contact: kind === "meet" ? contact.trim() || null : null,
                impression: kind === "meet" ? impression.trim() || null : null,
                expiresAt: kind === "see" ? expiresAt || null : null,

                poll: kind === "poll"
                    ? {
                        question: pollQuestion.trim(),
                        options: pollOptions
                            .map((o) => o.trim())
                            .filter(Boolean)
                            .map((label, i) => ({ id: `o${i + 1}`, label, votes: [] })),
                    }
                    : null,

                visibility,
                allowedViewers: visibility === "restricted"
                    ? allowedViewers.split(",").map((s) => s.trim()).filter(Boolean)
                    : [],
                teamId: visibility === "my_team" ? teamId.trim() || null : null,
                status: visibility === "draft" ? "draft" : "published",

                photos: photoIds,             // file_id[] from /post/upload_file
                attachments: attachmentIds,   // file_id[] from /post/upload_file

                expense: kind === "expense"
                    ? {
                        date: expense.date,
                        description: expense.desc.trim(),
                        category: expense.category,
                        currency: expense.currency,
                        localCurrency: expense.currency === "LOCAL" ? localCode || "Local" : null,
                        amount: Number(expense.amount),
                        receipt: expense.receipt,
                        notes: expense.notes.trim() || null,
                    }
                    : null,

                feeling: kind === "expense" && (feeling.rating > 0 || feeling.text.trim() || feeling.photos.length > 0)
                    ? {
                        rating: feeling.rating || null,
                        text: feeling.text.trim() || null,
                        photos: feelingIds,
                    }
                    : null,
            };

            // ===== Kirim post =====
            console.log("req body", body)
            const res = await Axios.post("/post/new_post", body);
            toast.success(visibility === "draft" ? "Saved as draft" : "Post published");

            if (kind === "expense" && tripId) {
                navigate(`/trips/${tripId}/expenses`);
            } else {
                navigate("/");
            }
        } catch (err) {
            console.log("error create post", err);
            toast.error(uploadErrorMessage(err, "Failed to submit. Please try again."));
        } finally {
            setSubmitting(false);
            setUploadPct(null);
        }
    };

    return (
        <div className="mx-auto max-w-xl">
            <h1 className="mb-4 flex items-center gap-2 text-2xl font-semibold tracking-tight">
                <Sparkles className="h-5 w-5 text-primary" /> New Post
            </h1>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Share something with us!</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        {kind !== "expense" && (
                            <MainContent
                                kind={kind}
                                title={title} onTitleChange={setTitle}
                                text={text} onChange={setText}
                                userName={user.name}
                            />
                        )}

                        <KindSelect value={kind} onChange={setKind} />

                        <TagSelect trips={trips} value={tripIds} onChange={setTripIds} />

                        {kind !== "expense" && (
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium" htmlFor="eventDate">Event date</label>
                                <input
                                    id="eventDate"
                                    type="date"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                    value={eventDate}
                                    max={today}
                                    onChange={(e) => setEventDate(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Defaults to today. Pick an earlier date to backlog a past event.
                                </p>
                            </div>
                        )}

                        {kind === "expense" && (
                            <>
                                <ExpenseFields
                                    data={expense}
                                    onChange={(patch) => setExpense((p) => ({ ...p, ...patch }))}
                                    photos={photos}
                                    onPhotos={setPhotos}
                                    sharedWith={sharedWith}
                                    onSharedWith={setSharedWith}
                                    localCode={localCode}
                                />
                                <FeelingFields
                                    data={feeling}
                                    onChange={(patch) => setFeeling((p) => ({ ...p, ...patch }))}
                                />
                            </>
                        )}

                        {kind === "meet" && (
                            <MeetFields
                                contact={contact} impression={impression}
                                onContact={setContact} onImpression={setImpression}
                            />
                        )}

                        {kind === "see" && (
                            <SeeFields expiresAt={expiresAt} onChange={setExpiresAt} />
                        )}

                        {kind === "poll" && (
                            <PollFields
                                question={pollQuestion}
                                options={pollOptions}
                                onQuestion={setPollQuestion}
                                onOptions={setPollOptions}
                            />
                        )}

                        {kind !== "expense" && (
                            <>
                                <AttachmentsField files={attachments} onChange={setAttachments} />
                                <PhotoUploader photos={photos} onChange={setPhotos} label="Photos" />
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium" htmlFor="loc">Location (optional)</label>
                                    <input
                                        id="loc"
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Bangkok, Thailand"
                                    />
                                </div>
                            </>
                        )}

                        {kind !== "expense" && (
                            <VisibilityField
                                visibility={visibility}
                                onVisibility={setVisibility}
                                allowedViewers={allowedViewers}
                                onAllowedViewers={setAllowedViewers}
                                teamId={teamId}
                                onTeamId={setTeamId}
                            />
                        )}

                        <div className="flex items-center justify-between gap-2 rounded-md border border-input px-3 py-2 text-xs">
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5" />
                                {geoStatus === "loading" && "Getting your location…"}
                                {geoStatus === "ok" && coords &&
                                    `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)} (±${Math.round(coords.accuracy)} m)`}
                                {geoStatus === "error" && <span className="text-destructive">{geoError}</span>}
                                {geoStatus === "idle" && "Location not captured yet"}
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2"
                                disabled={geoStatus === "loading"}
                                onClick={() => captureLocation()}
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                            </Button>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => navigate("/")}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting
                                    ? uploadPct !== null
                                        ? `Uploading ${uploadPct}%`
                                        : "Processing…"
                                    : kind === "expense"
                                    ? "Save expense"
                                    : visibility === "draft"
                                        ? "Save as draft"
                                        : "Publish"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}