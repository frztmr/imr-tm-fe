
// React Requirement
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

// Component
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhotoUploader } from "@/components/PhotoUploader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Eye, Users, PenSquare, Receipt, BarChart3, X, Plus } from "lucide-react";
import { Star, Lock } from "lucide-react";

//Redux
// import { useAppDispatch, useAppSelector } from "@/store";
// import { addPost } from "@/store/postsSlice";
// import { addExpense } from "@/store/tripsSlice";


//typescript, Utils, and Dummy Data
import type { Photo, ExpenseCategory, ExpenseCurrency } from "@/store/types";
import { useCurrentUser } from "@/lib/currentUser";
import { mockTrips } from "@/data/mockData";



type Kind = "post" | "see" | "meet" | "expense" | "poll";
const KINDS: { id: Kind; label: string; icon: React.ComponentType<{ className?: string }>; hint: string }[] = [
    { id: "post", label: "Post", icon: PenSquare, hint: "Share a quick note" },
    { id: "see", label: "I see something", icon: Eye, hint: "Product / competitor sighting" },
    { id: "meet", label: "I meet someone", icon: Users, hint: "Conversation or meeting" },
    { id: "expense", label: "Expenses and Receipts", icon: Receipt, hint: "Log a trip expense" },
    { id: "poll", label: "Polling", icon: BarChart3, hint: "Ask the team to vote" },
];

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
    "Accomodation", "Airport Tax", "Allowance", "Communication", "Meals",
    "Office", "Promotion", "Sample", "Ticket", "Transport", "Visa",
    "Laundry", "Entertainment", "Other",
];

export default function FeedNew() {

    const navigate = useNavigate();
    // const dispatch = useAppDispatch();

    // const trips = useAppSelector((s) => s.trips.trips);
    const user = useCurrentUser();
    const trips = mockTrips;


    const today = new Date().toISOString().slice(0, 10);
    const activeTrip = useMemo(
        () => trips.find((t) => t.startDate <= today && today <= t.endDate) ?? trips[0],
        [trips, today],
    );

    const [kind, setKind] = useState<Kind>("post");
    const [tripId, setTripId] = useState<string>(activeTrip?.id ?? "");
    const [text, setText] = useState("");
    const [location, setLocation] = useState("");
    const [tags, setTags] = useState("");
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [contact, setContact] = useState("");
    const [impression, setImpression] = useState("");
    const [expiresAt, setExpiresAt] = useState("");

    // Polling
    const [pollQuestion, setPollQuestion] = useState("");
    const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);

    // Expenses & Receipts
    const [expDate, setExpDate] = useState(today);
    const [expDesc, setExpDesc] = useState("");
    const [expCategory, setExpCategory] = useState<ExpenseCategory>("Meals");
    const [expCurrency, setExpCurrency] = useState<ExpenseCurrency>("IDR");
    const [expAmount, setExpAmount] = useState("");
    const [expReceipt, setExpReceipt] = useState(false);
    const [expNotes, setExpNotes] = useState("");

    // "Tell us how you feel!" — public companion post
    const [rating, setRating] = useState(0);
    const [feeling, setFeeling] = useState("");
    const [feelingPhotos, setFeelingPhotos] = useState<Photo[]>([]);
    const [sharedWith, setSharedWith] = useState("");

    const selectedTrip = trips.find((t) => t.id === tripId);
    const localCode = selectedTrip?.approval?.localCurrency || "";

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!tripId) {
            toast.error("Pick a trip tag — it's required.");
            return;
        }
        if (kind === "expense") {
            const amount = Number(expAmount);
            if (!expDesc.trim() || !amount) {
                toast.error("Add a description and an amount.");
                return;
            }
            if (expReceipt && photos.length === 0) {
                toast.error("Attach at least one receipt photo, or turn “Receipt available” off.");
                return;
            }
            /*
            // transaction that applied with redux.
            dispatch(addExpense({
                tripId,
                expense: {
                    author: user.name,
                    date: expDate,
                    description: expDesc.trim(),
                    category: expCategory,
                    currency: expCurrency,
                    localCurrency: expCurrency === "LOCAL" ? (localCode || "Local") : undefined,
                    amount,
                    receipt: expReceipt,
                    notes: expNotes.trim(),
                    photos,
                },
            }));
            */
            const viewers = sharedWith.split(",").map((s) => s.trim()).filter(Boolean);
            // Hidden post: the expense itself, visible to the author + selected people

            /*
            // transaction that applied with redux.
            dispatch(addPost({
                author: user.name,
                text: `${expCategory} · ${expDesc.trim()} — ${expCurrency === "LOCAL" ? (localCode || "Local") : expCurrency} ${amount.toLocaleString()}${expNotes.trim() ? `\n${expNotes.trim()}` : ""}`,
                location: "",
                tags: ["expense", expCategory.toLowerCase()],
                photos,
                kind: "expense",
                visibility: "restricted",
                allowedViewers: viewers,
                tripId,
                tripTitle: selectedTrip?.title,
            }));
            */

            // Public post: how you feel
            if (rating > 0 || feeling.trim() || feelingPhotos.length > 0) {
                /*
                // transaction that applied with redux.
                dispatch(addPost({
                    author: user.name,
                    text: feeling.trim(),
                    location: "",
                    tags: [],
                    photos: feelingPhotos,
                    kind: "feeling",
                    visibility: "public",
                    rating: rating || undefined,
                    tripId,
                    tripTitle: selectedTrip?.title,
                }));
                */
            }
            toast.success("Expense added to the Travel Expense Statement");
            navigate(`/trips/${tripId}/expenses`);
            return;
        }
        if (!text.trim() && photos.length === 0) {
            if (kind !== "poll") {
                toast.error("Add some text or a photo first.");
                return;
            }
        }
        let poll: { question: string; options: { id: string; label: string; votes: string[] }[] } | undefined;
        if (kind === "poll") {
            const opts = pollOptions.map((o) => o.trim()).filter(Boolean);
            if (!pollQuestion.trim() || opts.length < 2) {
                toast.error("Add a poll question and at least two options.");
                return;
            }
            poll = {
                question: pollQuestion.trim(),
                options: opts.map((label, i) => ({ id: `o${i}-${Math.random().toString(36).slice(2, 7)}`, label, votes: [] })),
            };
        }
        const trip = trips.find((t) => t.id === tripId);
        /*
        // transaction that applied with redux.
            dispatch(addPost({
                author: user.name,
                text: text.trim(),
                location: location.trim(),
                tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
                photos,
                kind,
                poll,
                tripId,
                tripTitle: trip?.title,
                contact: contact.trim() || undefined,
                impression: impression.trim() || undefined,
                expiresAt: expiresAt || undefined,
            }));
        */
        toast.success("Post published to the feed");
        navigate("/");
    };

    const tripInDate = (t: { startDate: string; endDate: string }) =>
        t.startDate <= today && today <= t.endDate;

    return (
        <>
            <div className="mx-auto max-w-xl">
                <h1 className="mb-4 flex items-center gap-2 text-2xl font-semibold tracking-tight">
                    <Sparkles className="h-5 w-5 text-primary" /> New Post
                </h1>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Share something with the team</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label>What are you posting?</Label>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    {KINDS.map((k) => {
                                        const Icon = k.icon;
                                        const active = kind === k.id;
                                        return (
                                            <button
                                                type="button"
                                                key={k.id}
                                                onClick={() => setKind(k.id)}
                                                className={`flex flex-col items-center gap-1 rounded-md border-2 p-3 text-center text-xs transition ${active ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card/50 text-muted-foreground hover:border-primary/50"
                                                    }`}
                                            >
                                                <Icon className="h-5 w-5" />
                                                <span className="font-medium">{k.label}</span>
                                                <span className="text-[10px] opacity-80">{k.hint}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="trip">
                                    Trip tag <span className="text-destructive">*</span>
                                </Label>
                                <Select value={tripId} onValueChange={setTripId}>
                                    <SelectTrigger id="trip">
                                        <SelectValue placeholder="Select a trip…" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {trips.length === 0 && (
                                            <SelectItem value="__none" disabled>No trips yet — create one first</SelectItem>
                                        )}
                                        {trips.filter(tripInDate).length > 0 && (
                                            <>
                                                <div className="px-2 py-1 text-[10px] font-semibold uppercase text-muted-foreground">Currently in date</div>
                                                {trips.filter(tripInDate).map((t) => (
                                                    <SelectItem key={t.id} value={t.id}>
                                                        {t.title} · {t.country}
                                                    </SelectItem>
                                                ))}
                                            </>
                                        )}
                                        {trips.filter((t) => !tripInDate(t)).length > 0 && (
                                            <>
                                                <div className="px-2 py-1 text-[10px] font-semibold uppercase text-muted-foreground">Other trips</div>
                                                {trips.filter((t) => !tripInDate(t)).map((t) => (
                                                    <SelectItem key={t.id} value={t.id}>
                                                        {t.title} · {t.country} ({t.startDate})
                                                    </SelectItem>
                                                ))}
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>
                                <p className="text-[11px] text-muted-foreground">
                                    Defaults to the trip in date today. You can tag any trip even if it's not active.
                                </p>
                            </div>

                            {kind !== "expense" && (
                                <div className="space-y-1.5">
                                    <Label htmlFor="text" className="sr-only">
                                        {kind === "see" ?
                                            "What did you see?" :
                                            kind === "meet" ?
                                                "Who did you meet & what did they say?" :
                                                "What's on your mind?"
                                        }
                                    </Label>
                                    <div className="flex gap-3 rounded-xl border bg-background p-3">
                                        <Avatar className="mt-0.5 h-10 w-10 shrink-0">
                                            <AvatarFallback className="bg-primary text-[11px] font-semibold text-primary-foreground">
                                                {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-semibold">
                                                {user.name}{" "}
                                                <span className="font-normal text-muted-foreground">
                                                    @{user.name.toLowerCase().replace(/[^a-z0-9]+/g, "")}
                                                </span>
                                            </div>
                                            <Textarea
                                                id="text"
                                                rows={4}
                                                value={text}
                                                onChange={(e) => setText(e.target.value)}
                                                className="resize-none border-0 bg-transparent p-0 text-[15px] leading-relaxed shadow-none focus-visible:ring-0"
                                                placeholder={
                                                    kind === "see"
                                                        ? "Describe the product, shelf, or competitor signal…"
                                                        : kind === "meet"
                                                            ? "Quick recap of the conversation or meeting…"
                                                            : "Quick note, observation, or thought from the field…"
                                                }
                                            />
                                            <div className="mt-1 text-right text-[11px] text-muted-foreground">
                                                {text.length}/500
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {kind === "expense" && (
                                <Accordion type="multiple" defaultValue={["expense", "feeling"]} className="space-y-3">
                                    <AccordionItem value="expense" className="rounded-xl border bg-background px-4">
                                        <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                                            <span className="flex items-center gap-2">
                                                <Receipt className="h-4 w-4 text-primary" /> Expenses and Receipts
                                            </span>
                                        </AccordionTrigger>
                                        <AccordionContent className="space-y-4 pb-4">
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="expDate">Date of transaction</Label>
                                                    <Input id="expDate" type="date" value={expDate} onChange={(e) => setExpDate(e.target.value)} />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="expCat">Category</Label>
                                                    <Select value={expCategory} onValueChange={(v) => setExpCategory(v as ExpenseCategory)}>
                                                        <SelectTrigger id="expCat"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {EXPENSE_CATEGORIES.map((c) => (
                                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="expDesc">Description</Label>
                                                <Input id="expDesc" value={expDesc} onChange={(e) => setExpDesc(e.target.value)} placeholder="Taxi from airport to hotel" />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label>Currency (pick one)</Label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {([
                                                        { id: "IDR" as const, label: "IDR" },
                                                        { id: "USD" as const, label: "USD" },
                                                        { id: "LOCAL" as const, label: localCode ? `Local (${localCode})` : "Local currency" },
                                                    ]).map((c) => (
                                                        <button
                                                            type="button"
                                                            key={c.id}
                                                            onClick={() => setExpCurrency(c.id)}
                                                            className={`rounded-md border-2 px-3 py-2 text-xs font-medium transition ${expCurrency === c.id ? "border-primary bg-primary/10" : "border-border text-muted-foreground hover:border-primary/50"
                                                                }`}
                                                        >
                                                            {c.label}
                                                        </button>
                                                    ))}
                                                </div>
                                                {expCurrency === "LOCAL" && !localCode && (
                                                    <p className="text-[11px] text-muted-foreground">
                                                        No local currency set on this trip's approval form — it will be recorded as “Local”.
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="expAmount">
                                                    Value ({expCurrency === "LOCAL" ? (localCode || "Local") : expCurrency})
                                                </Label>
                                                <Input
                                                    id="expAmount" type="number" min="0" step="any" inputMode="decimal"
                                                    value={expAmount} onChange={(e) => setExpAmount(e.target.value)} placeholder="0"
                                                />
                                            </div>

                                            <div className="space-y-3 rounded-md border p-3">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <Label htmlFor="expReceipt">Receipt available</Label>
                                                        <p className="text-[11px] text-muted-foreground">Toggle on if you have the physical/digital receipt.</p>
                                                    </div>
                                                    <Switch id="expReceipt" checked={expReceipt} onCheckedChange={setExpReceipt} />
                                                </div>
                                                {expReceipt && (
                                                    <>
                                                        <PhotoUploader
                                                            photos={photos}
                                                            onChange={setPhotos}
                                                            label="Receipt photos (required)"
                                                        />
                                                        {photos.length === 0 && (
                                                            <p className="text-[11px] text-destructive">At least one receipt photo is required.</p>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="expNotes">Notes</Label>
                                                <Textarea id="expNotes" rows={3} value={expNotes} onChange={(e) => setExpNotes(e.target.value)} placeholder="Details of the expense…" />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="expShare">Who else can see this (comma separated names)</Label>
                                                <Input id="expShare" value={sharedWith} onChange={(e) => setSharedWith(e.target.value)} placeholder="Finance Team, Rina Putri" />
                                                <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                    <Lock className="h-3 w-3" /> This expense is a hidden post — only you and these people can see, reply, and like it.
                                                </p>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="feeling" className="rounded-xl border bg-background px-4">
                                        <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                                            <span className="flex items-center gap-2">
                                                <Star className="h-4 w-4 text-primary" /> Tell us how do you feel!
                                            </span>
                                        </AccordionTrigger>
                                        <AccordionContent className="space-y-4 pb-4">
                                            <div className="space-y-1.5">
                                                <Label>Rating</Label>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((n) => (
                                                        <button
                                                            key={n}
                                                            type="button"
                                                            aria-label={`${n} star${n > 1 ? "s" : ""}`}
                                                            onClick={() => setRating(n === rating ? 0 : n)}
                                                            className="p-1 transition hover:scale-110"
                                                        >
                                                            <Star className={`h-7 w-7 ${n <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                                                        </button>
                                                    ))}
                                                    <span className="ml-2 text-xs text-muted-foreground">{rating ? `${rating}/5` : "No rating yet"}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="feeling">Tell us what you feel about that</Label>
                                                <Textarea
                                                    id="feeling" rows={3} value={feeling} onChange={(e) => setFeeling(e.target.value)}
                                                    placeholder="How was the meal, ride, or stay?"
                                                />
                                            </div>
                                            <PhotoUploader photos={feelingPhotos} onChange={setFeelingPhotos} label="Experience photos (public)" />
                                            <p className="text-[11px] text-muted-foreground">
                                                This box is published as a normal public post — separate from your receipt photos.
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            )}

                            {kind === "meet" && (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="contact">Contact / person</Label>
                                        <Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Name, role, company" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="impression">Impression</Label>
                                        <Input id="impression" value={impression} onChange={(e) => setImpression(e.target.value)} placeholder="What stuck with you?" />
                                    </div>
                                </div>
                            )}

                            {kind === "see" && (
                                <div className="space-y-1.5">
                                    <Label htmlFor="exp">Expires / valid until (optional)</Label>
                                    <Input id="exp" type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
                                </div>
                            )}

                            {kind === "poll" && (
                                <div className="space-y-3 rounded-xl border bg-background p-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="pollQ">Poll question</Label>
                                        <Input
                                            id="pollQ" value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)}
                                            placeholder="Which flavour should we push next quarter?"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Options</Label>
                                        {pollOptions.map((o, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <Input
                                                    value={o}
                                                    onChange={(e) => setPollOptions((prev) => prev.map((p, j) => (j === i ? e.target.value : p)))}
                                                    placeholder={`Option ${i + 1}`}
                                                />
                                                {pollOptions.length > 2 && (
                                                    <Button
                                                        type="button" size="icon" variant="ghost" aria-label="Remove option"
                                                        onClick={() => setPollOptions((prev) => prev.filter((_, j) => j !== i))}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        {pollOptions.length < 6 && (
                                            <Button type="button" variant="outline" size="sm" onClick={() => setPollOptions((p) => [...p, ""])}>
                                                <Plus className="mr-1 h-3.5 w-3.5" /> Add option
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {kind !== "expense" && (
                                <>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="loc">Location (optional)</Label>
                                            <Input id="loc" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Bangkok, Thailand" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="tags">Tags (comma separated)</Label>
                                            <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="noodles, retail, idea" />
                                        </div>
                                    </div>
                                    <PhotoUploader photos={photos} onChange={setPhotos} label="Photos" />
                                </>
                            )}
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate("/")}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">{kind === "expense" ? "Save expense" : "Publish"}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
