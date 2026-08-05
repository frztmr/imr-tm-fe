import { Link } from "react-router-dom";


// components and library
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhotoGallery } from "@/components/PhotoUploader";
import {
    Plus, Trash2, Zap,
} from "lucide-react";
import { DraftBadge } from "../trip.component";

//Typescript
import type { Trip, Moment } from "@/types/tipes";

export function FieldLogCard({ trip }: { trip: Trip }) {
    //   const dispatch = useAppDispatch();
    const KIND_LABELS: Record<Moment["kind"], string> = {
        observation: "Observation",
        meeting: "Meeting",
        retail: "Retail",
        competitor: "Competitor",
        sentiment: "Sentiment",
        sighting: "Sighting",
        other: "Other",
    };
    function kindLabel(k: Moment["kind"]) { return KIND_LABELS[k] ?? k; }

    const moments = trip.moments ?? [];
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Zap className="h-4 w-4 text-primary" /> Field Log
                        <Badge variant="outline" className="ml-1 text-[10px]">{moments.length}</Badge>
                    </CardTitle>
                    <Link
                        to={`/trips/${trip.id}/capture`}
                        className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                    >
                        <Plus className="h-4 w-4" /> Capture moment
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                    Drop in observations during the trip. Toggle which ones become part of the final report — you can decide later.
                </p>
                {moments.length === 0 && (
                    <p className="rounded-md border-2 border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                        No field captures yet. Tap “Capture moment” when you spot something worth remembering.
                    </p>
                )}
                {moments.map((m) => (
                    <div key={m.id} className="rounded-md border-2 border-border bg-muted/30 p-3 text-sm">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="secondary" className="text-[10px]">{kindLabel(m.kind)}</Badge>
                                    {m.day && <span className="text-[11px] text-muted-foreground">{m.day}</span>}
                                    {m.location && <span className="text-[11px] text-muted-foreground">· {m.location}</span>}
                                    <DraftBadge isDraft={m.isDraft} />
                                    {m.includeInReport && !m.isDraft && (
                                        <Badge variant="outline" className="border-success/40 bg-success/10 text-[10px] text-success">In report</Badge>
                                    )}
                                </div>
                                {m.title && <div className="mt-1 font-medium">{m.title}</div>}
                                {m.contact && (
                                    <div className="mt-1 text-xs text-muted-foreground">
                                        With: <span className="text-foreground">{m.contact}</span>
                                        {m.isBusinessMeeting && <Badge variant="outline" className="ml-2 text-[10px]">Business meeting</Badge>}
                                    </div>
                                )}
                                {m.impression && (
                                    <p className="mt-1 italic text-foreground/80">“{m.impression}”</p>
                                )}
                                {m.expiresAt && (
                                    <div className="mt-1 text-[11px] text-warning-foreground">Expires {m.expiresAt}</div>
                                )}
                                {m.note && <p className="mt-1 whitespace-pre-wrap text-foreground/90">{m.note}</p>}
                                {m.photos && m.photos.length > 0 && <PhotoGallery photos={m.photos} />}
                            </div>
                            <div className="flex items-center gap-1">
                                <Button size="sm" variant="outline" onClick={
                                    // () => dispatch(toggleMomentInclude({ tripId: trip.id, id: m.id }))}
                                    () => console.log("this should be dispatch(toggleMomentInclude({ tripId: trip.id, id: m.id }))")}

                                >
                                    {m.includeInReport ? "Exclude" : "Include"}
                                </Button>
                                <Button size="icon" variant="outline" aria-label="Delete" onClick={
                                    // () => dispatch(deleteMoment({ tripId: trip.id, id: m.id }))} 
                                    () => console.log("this should be dispatch(deleteMoment({ tripId: trip.id, id: m.id }))")}
                                >
                                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
