import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhotoUploader } from "@/components/PhotoUploader";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

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

export default function FeedNew() {
    const navigate = useNavigate();
    const user = useCurrentUser();
    const trips = mockTrips;
    const today = new Date().toISOString().slice(0, 10);

    // form state
    const [kind, setKind] = useState<Kind>("post");
    const [tripId, setTripId] = useState("");
    const [text, setText] = useState("");
    const [location, setLocation] = useState("");
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [attachments, setAttachments] = useState<File[]>([]);
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

    const selectedTrip = trips.find((t) => t.id === tripId);
    const localCode = selectedTrip?.approval?.localCurrency || "";

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi
        if (kind === "expense") {
            if (!expense.desc.trim() || !Number(expense.amount)) {
                toast.error("Add a description and an amount.");
                return;
            }
            if (expense.receipt && photos.length === 0) {
                toast.error("Attach at least one receipt photo, or turn 'Receipt available' off.");
                return;
            }
            // TODO: dispatch(addExpense / addPost)
            toast.success("Expense saved");
            navigate(tripId ? `/trips/${tripId}/expenses` : "/");
            return;
        }

        if (kind === "poll") {
            const opts = pollOptions.map((o) => o.trim()).filter(Boolean);
            if (!pollQuestion.trim() || opts.length < 2) {
                toast.error("Add a question and at least two options.");
                return;
            }
        } else if (!text.trim() && photos.length === 0) {
            toast.error("Add some text or a photo first.");
            return;
        }

        // TODO: dispatch(addPost)
        toast.success(visibility === "draft" ? "Saved as draft" : "Post published");
        navigate("/");
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
                        <KindSelect value={kind} onChange={setKind} />

                        <TagSelect trips={trips} value={tripId} onChange={setTripId} />

                        {kind !== "expense" && (
                            <MainContent kind={kind} text={text} onChange={setText} userName={user.name} />
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

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => navigate("/")}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {kind === "expense"
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