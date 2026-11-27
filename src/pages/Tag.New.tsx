import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
    CalendarDays, FileCheck2, Flag, Hash, Loader2, Plane, Tag, Upload, UserRound, X,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/SearchableSelect";
import countriesCities from "@/data/countriesCities.json";
import { userState } from "@/store/types";

import { createUserTag, type NewTagPayload } from "@/config/users";
import {
    uploadFiles, waitForUploads, uploadErrorMessage, fileExt,
    PHOTO_EXTS, UPLOAD_MAX_FILE_SIZE,
} from "@/config/post";

// =========================================================
// tag categories — same codes as BE the_content.tag_types
// =========================================================
type TagType = NewTagPayload["tag_type"];
type JoinPolicy = NonNullable<NewTagPayload["join_policy"]>;

const TAG_TYPES: {
    code: TagType;
    label: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
    defaultJoin: JoinPolicy;
}[] = [
    { code: "simple", label: "Simple tag", desc: "Free topic / hashtag", icon: Hash, defaultJoin: "open" },
    { code: "person", label: "Special person", desc: "Partner, distributor contact, VIP", icon: UserRound, defaultJoin: "open" },
    { code: "event", label: "Event", desc: "Exhibition, meeting, product launch", icon: CalendarDays, defaultJoin: "open" },
    { code: "country", label: "Country", desc: "Posts about a country / market", icon: Flag, defaultJoin: "open" },
    { code: "trip", label: "Business trip", desc: "Based on Business Trip Approval (BTA)", icon: Plane, defaultJoin: "approval" },
];

const JOIN_POLICIES: { value: JoinPolicy; label: string }[] = [
    { value: "open", label: "Open — anyone can join" },
    { value: "approval", label: "Approval — I approve who joins" },
    { value: "invite", label: "Invite only" },
    { value: "closed", label: "Closed — only me" },
];

// BTA file: pdf / office / image (all allowed by /post/upload_file)
const BTA_EXTS = ["pdf", "doc", "docx", "xls", "xlsx", ...PHOTO_EXTS];
const BTA_ACCEPT = BTA_EXTS.map((e) => `.${e}`).join(",");

// "Seoul May Sweep" → "seoulmaysweep" (same as BE toSlug)
const toSlug = (name: string) =>
    name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "").slice(0, 100);

const NAME_MAX = 100;

const isTagType = (v: string | null): v is TagType => TAG_TYPES.some((t) => t.code === v);

// =========================================================
// page — /tags/new?type=trip  (also used by /trips/new with defaultType="trip")
// =========================================================
const NewTag = ({ defaultType }: { defaultType?: TagType }) => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const myUname = useSelector((s: userState) => s.personalData?.personalData?.uname);

    const data = countriesCities as Record<string, string[]>;
    const countries = useMemo(() => Object.keys(data).sort(), [data]);

    const queryType = params.get("type");
    const [type, setType] = useState<TagType>(defaultType ?? (isTagType(queryType) ? queryType : "simple"));
    const meta = TAG_TYPES.find((t) => t.code === type)!;

    // common
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [joinPolicy, setJoinPolicy] = useState<JoinPolicy | "">(""); // "" = category default

    // place (event / country / trip)
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const cities = useMemo(() => (country ? data[country] || [] : []), [country, data]);

    // dates (event / trip)
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // person
    const [company, setCompany] = useState("");
    const [position, setPosition] = useState("");

    // event
    const [venue, setVenue] = useState("");

    // trip
    const [tripMode, setTripMode] = useState<"approval" | "instant">("approval");
    const [btaFile, setBtaFile] = useState<File | null>(null);
    const [localCurrency, setLocalCurrency] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [stage, setStage] = useState(""); // button label while submitting

    const slug = toSlug(name);

    const changeType = (t: TagType) => {
        setType(t);
        setJoinPolicy("");
        // country tag: name follows the picked country
        if (t === "country" && country && !name) setName(country);
    };

    const pickCountry = (c: string) => {
        setCountry(c);
        setCity("");
        if (type === "country" && (!name || name === country)) setName(c);
    };

    const pickBta = (f: File | undefined) => {
        if (!f) return;
        if (!BTA_EXTS.includes(fileExt(f.name))) {
            toast.error("BTA file must be PDF, Word, Excel or an image.");
            return;
        }
        if (f.size > UPLOAD_MAX_FILE_SIZE) {
            toast.error(`BTA file is too large. Max ${UPLOAD_MAX_FILE_SIZE / 1024 / 1024} MB.`);
            return;
        }
        setBtaFile(f);
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return;

        // ===== validation (mirrors BE /users/tag/new) =====
        if (!name.trim()) return void toast.error(type === "person" ? "Enter the person's name." : "Give the tag a name.");
        if (!slug) return void toast.error("The name needs at least one letter or number.");
        if (type === "country" && !country) return void toast.error("Pick a country.");
        if (startDate && endDate && endDate < startDate) return void toast.error("End date must be on or after start date.");
        if (type === "trip" && tripMode === "instant" && !btaFile) {
            return void toast.error("Upload the signed Business Trip Approval file.");
        }
        if (localCurrency && !/^[A-Za-z]{3}$/.test(localCurrency)) {
            return void toast.error("Local currency must be a 3-letter code, e.g. MYR.");
        }

        setSubmitting(true);
        try {
            // ===== BTA file → /post/upload_file → approval_file_id =====
            let approvalFileId: string | undefined;
            if (type === "trip" && tripMode === "instant" && btaFile) {
                setStage("Uploading BTA…");
                const [up] = await uploadFiles([btaFile]);
                if (!up) throw new Error("BTA file was not uploaded.");
                setStage("Processing BTA…");
                await waitForUploads([up.file_id]);
                approvalFileId = up.file_id;
            }

            // ===== body: only the fields this category uses =====
            const usesPlace = type === "event" || type === "country" || type === "trip";
            const usesDates = type === "event" || type === "trip";

            const attributes: Record<string, string> = {};
            if (type === "person") {
                if (company.trim()) attributes.company = company.trim();
                if (position.trim()) attributes.position = position.trim();
            }
            if (type === "event" && venue.trim()) attributes.venue = venue.trim();

            const body: NewTagPayload = {
                tag_type: type,
                name: name.trim().slice(0, NAME_MAX),
                ...(description.trim() ? { description: description.trim() } : {}),
                ...(usesPlace && country ? { country } : {}),
                ...(usesPlace && city ? { cities: [city] } : {}),
                ...(usesDates && startDate ? { start_date: startDate } : {}),
                ...(usesDates && endDate ? { end_date: endDate } : {}),
                ...(joinPolicy ? { join_policy: joinPolicy } : {}),
                ...(Object.keys(attributes).length ? { attributes } : {}),
                ...(type === "trip"
                    ? {
                        trip_mode: tripMode,
                        ...(approvalFileId ? { approval_file_id: approvalFileId } : {}),
                        ...(localCurrency ? { local_currency: localCurrency.toUpperCase() } : {}),
                    }
                    : {}),
            };

            setStage("Creating tag…");
            const tag = await createUserTag(body);

            toast.success(`#${tag?.slug ?? slug} created`);
            // back to my profile → Tags tab
            navigate(myUname ? `/user/${encodeURIComponent(String(myUname))}?tab=tags` : "/");
        } catch (err) {
            console.log("err at create tag", err);
            toast.error(uploadErrorMessage(err, "Failed to create tag. Please try again."));
        } finally {
            setSubmitting(false);
            setStage("");
        }
    };

    // ===== labels per category =====
    const nameLabel = {
        simple: "Tag name",
        person: "Person's name",
        event: "Event name",
        country: "Tag name",
        trip: "Trip name",
    }[type];
    const namePlaceholder = {
        simple: "e.g. Halal Certification",
        person: "e.g. Kevin Sietho or Elly Betty",
        event: "e.g. SIAL Paris 2026",
        country: "e.g. Malaysia",
        trip: "e.g. Seoul May Sweep",
    }[type];
    const descLabel = {
        simple: "Description",
        person: "Notes about this person",
        event: "About this event",
        country: "Description",
        trip: "Purpose or goal of trip",
    }[type];

    return (
        <div className="mx-auto max-w-xl">
            <div className="mb-4">
                <h1 className="flex items-center gap-2 text-2xl font-semibold">
                    <Tag className="h-5 w-5 text-primary" /> New {type === "trip" ? "Trip " : ""}Tag
                </h1>
                <p className="text-sm text-muted-foreground">Pick what kind of tag you want to create.</p>
            </div>

            {/* ===== category ===== */}
            {!defaultType && (
                <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {TAG_TYPES.map((t) => {
                        const Icon = t.icon;
                        const active = t.code === type;
                        return (
                            <button
                                key={t.code}
                                type="button"
                                onClick={() => changeType(t.code)}
                                disabled={submitting}
                                aria-pressed={active}
                                className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition ${
                                    active ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50"
                                }`}
                            >
                                <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                                <span className="text-sm font-semibold">{t.label}</span>
                                <span className="text-xs leading-snug text-muted-foreground">{t.desc}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* ===== trip: BTA vs instant (previous trip tag design) ===== */}
            {type === "trip" && (
                <div className="mb-4 grid grid-cols-2 rounded-full bg-muted p-1 text-sm font-medium">
                    {([
                        { k: "approval", label: "Business Trip Approval" },
                        { k: "instant", label: "Instant Trip Tag" },
                    ] as const).map((o) => (
                        <button
                            key={o.k}
                            type="button"
                            onClick={() => setTripMode(o.k)}
                            disabled={submitting}
                            className={`rounded-full px-4 py-1.5 transition ${
                                tripMode === o.k ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                            }`}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>
            )}

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">{meta.label}</CardTitle>
                    <CardDescription>
                        {type === "trip"
                            ? tripMode === "approval"
                                ? "Name the trip. Members join after the owner approves (BTA flow)."
                                : "Name the trip and attach your signed Business Trip Approval file."
                            : meta.desc}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-4">
                        {/* name + hashtag preview */}
                        <div className="grid gap-1.5">
                            <Label htmlFor="tag-name">
                                {nameLabel} <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="tag-name"
                                value={name}
                                maxLength={NAME_MAX}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={namePlaceholder}
                                autoFocus
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{slug ? <>Hashtag: <span className="text-primary">#{slug}</span></> : " "}</span>
                                <span>{name.length}/{NAME_MAX}</span>
                            </div>
                        </div>

                        {/* person */}
                        {type === "person" && (
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="company">Company (optional)</Label>
                                    <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Lotte Mart" />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="position">Position (optional)</Label>
                                    <Input id="position" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="e.g. Purchasing Manager" />
                                </div>
                            </div>
                        )}

                        {/* event venue */}
                        {type === "event" && (
                            <div className="grid gap-1.5">
                                <Label htmlFor="venue">Venue (optional)</Label>
                                <Input id="venue" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="e.g. Paris Nord Villepinte" />
                            </div>
                        )}

                        {/* place */}
                        {(type === "event" || type === "country" || type === "trip") && (
                            <>
                                <div className="grid gap-1.5">
                                    <Label>
                                        Country {type === "country" ? <span className="text-destructive">*</span> : "(optional)"}
                                    </Label>
                                    <SearchableSelect
                                        value={country}
                                        onChange={pickCountry}
                                        options={countries}
                                        placeholder="Pick a country"
                                        searchPlaceholder="Search country..."
                                    />
                                </div>
                                {type !== "country" && country && cities.length > 0 && (
                                    <div className="grid gap-1.5">
                                        <Label>City (optional)</Label>
                                        <SearchableSelect
                                            value={city}
                                            onChange={setCity}
                                            options={cities}
                                            placeholder="Pick a city"
                                            searchPlaceholder="Search city..."
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        {/* description */}
                        <div className="grid gap-1.5">
                            <Label htmlFor="desc">{descLabel} (optional)</Label>
                            {type === "trip" ? (
                                <Input
                                    id="desc"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="e.g. Market research, Client meetings, Site inspection"
                                />
                            ) : (
                                <Textarea
                                    id="desc"
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="resize-none"
                                />
                            )}
                        </div>

                        {/* dates */}
                        {(type === "event" || type === "trip") && (
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="start">Start (optional)</Label>
                                    <Input id="start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="end">End (optional)</Label>
                                    <Input id="end" type="date" value={endDate} min={startDate || undefined} onChange={(e) => setEndDate(e.target.value)} />
                                </div>
                            </div>
                        )}

                        {/* trip extras */}
                        {type === "trip" && (
                            <div className="grid gap-1.5">
                                <Label htmlFor="currency">Local currency (optional)</Label>
                                <Input
                                    id="currency"
                                    value={localCurrency}
                                    maxLength={3}
                                    onChange={(e) => setLocalCurrency(e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase())}
                                    placeholder="e.g. KRW, MYR"
                                    className="uppercase"
                                />
                            </div>
                        )}

                        {type === "trip" && tripMode === "instant" && (
                            <div className="grid gap-1.5">
                                <Label htmlFor="approval-file">
                                    Business Trip Approval file <span className="text-destructive">*</span>
                                </Label>
                                {btaFile ? (
                                    <div className="flex items-center justify-between gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
                                        <span className="flex min-w-0 items-center gap-2">
                                            <FileCheck2 className="h-4 w-4 shrink-0 text-primary" />
                                            <span className="truncate">{btaFile.name}</span>
                                        </span>
                                        <button type="button" disabled={submitting} onClick={() => setBtaFile(null)} aria-label="Remove file">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="approval-file"
                                        className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed px-3 py-6 text-sm text-muted-foreground hover:bg-accent"
                                    >
                                        <Upload className="h-4 w-4" /> Upload PDF, image, Word or Excel (max 25 MB)
                                    </label>
                                )}
                                <input
                                    id="approval-file"
                                    type="file"
                                    accept={BTA_ACCEPT}
                                    className="hidden"
                                    onChange={(e) => { pickBta(e.target.files?.[0]); e.target.value = ""; }}
                                />
                            </div>
                        )}

                        {/* who can join */}
                        <div className="grid gap-1.5">
                            <Label htmlFor="join">Who can join</Label>
                            <select
                                id="join"
                                value={joinPolicy || meta.defaultJoin}
                                onChange={(e) => setJoinPolicy(e.target.value as JoinPolicy)}
                                className="h-9 rounded-md border bg-background px-3 text-sm"
                            >
                                {JOIN_POLICIES.map((p) => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" disabled={submitting} onClick={() => navigate(-1)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting
                                    ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> {stage || "Saving…"}</>
                                    : type === "trip"
                                        ? "Create trip tag"
                                        : "Create tag"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default NewTag;
