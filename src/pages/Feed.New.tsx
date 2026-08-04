
// react requiremet
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

// components and library
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhotoUploader } from "@/components/PhotoUploader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/lib/currentUser";
import { toast } from "sonner";
import { Sparkles, Eye, Users, PenSquare } from "lucide-react";

// Typescript
import type { Photo } from "@/types/tipes";

type Kind = "post" | "see" | "meet";
const KINDS: { id: Kind; label: string; icon: React.ComponentType<{ className?: string }>; hint: string }[] = [
    { id: "post", label: "Post", icon: PenSquare, hint: "Share a quick note" },
    { id: "see", label: "I see something", icon: Eye, hint: "Product / competitor sighting" },
    { id: "meet", label: "I meet someone", icon: Users, hint: "Conversation or meeting" },
];

const NewPost = () => {

    const navigate = useNavigate();
    const user = useCurrentUser();

    // // ini untuk redux. aktifkan jika sudah siap
    // const dispatch = useAppDispatch();
    // const trips = useAppSelector((s) => s.trips.trips);


    const today = new Date().toISOString().slice(0, 10);

    // const activeTrip = useMemo(
    //     // () => trips.find((t) => t.startDate <= today && today <= t.endDate) ?? trips[0],
    //     // [trips, today],
    // );

    const [kind, setKind] = useState<Kind>("post");
    // const [tripId, setTripId] = useState<string>(activeTrip?.id ?? "");
    const [tripId, setTripId] = useState<string>("");
    const [text, setText] = useState("");
    const [location, setLocation] = useState("");
    const [tags, setTags] = useState("");
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [contact, setContact] = useState("");
    const [impression, setImpression] = useState("");
    const [expiresAt, setExpiresAt] = useState("");

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!tripId) {
            toast.error("Pick a trip tag — it's required.");
            return;
        }
        if (!text.trim() && photos.length === 0) {
            toast.error("Add some text or a photo first.");
            return;
        }
        // const trip = trips.find((t) => t.id === tripId);
        // dispatch(addPost({
        //     author: user.name,
        //     text: text.trim(),
        //     location: location.trim(),
        //     tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        //     photos,
        //     kind,
        //     tripId,
        //     tripTitle: trip?.title,
        //     contact: contact.trim() || undefined,
        //     impression: impression.trim() || undefined,
        //     expiresAt: expiresAt || undefined,
        // }));
        toast.success("Post published to the feed");
        navigate("/");
    };

    return (
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
                            <div className="grid grid-cols-3 gap-2">
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
                            {/* Perfect Select. */}
                            {/* <Select value={tripId} onValueChange={setTripId}>
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
                </Select> */}

                            {/* Dummy Select. */}
                            <Select value={tripId} onValueChange={setTripId}>
                                <SelectTrigger id="trip">
                                    <SelectValue placeholder="Select a trip…" />
                                </SelectTrigger>
                                <SelectContent>

                                    <SelectItem value="__none" disabled>No trips yet — create one first</SelectItem>

                                </SelectContent>
                            </Select>
                            <p className="text-[11px] text-muted-foreground">
                                Defaults to the trip in date today. You can tag any trip even if it's not active.
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="text" className="sr-only">
                                {kind === "see" ? "What did you see?" : kind === "meet" ? "Who did you meet & what did they say?" : "What's on your mind?"}
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
                                    <div className="mt-1 text-right text-[11px] text-muted-foreground">{text.length}/500</div>
                                </div>
                            </div>
                        </div>

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
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => navigate("/")}>Cancel</Button>
                            <Button type="submit">Publish</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )

}

export default NewPost