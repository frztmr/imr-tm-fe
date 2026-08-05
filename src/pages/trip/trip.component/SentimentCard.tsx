
// react requiremet 
import { useState } from "react";

// components and library
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PhotoUploader, PhotoGallery } from "@/components/PhotoUploader";
import {
    MessageSquare, Plus
} from "lucide-react";
import { DraftBadge, RowActions } from "../trip.component";

//Typescript
import type { SentimentLog } from "@/types/tipes";

function emptySentiment(): Omit<SentimentLog, "id"> {
    return { note: "", competitor: "", photos: [] };
}

function SentimentForm({ value, onChange }: { value: SentimentLog | Omit<SentimentLog, "id">; onChange: (v: any) => void }) {
    return (
        <div className="grid gap-2">
            <Textarea placeholder='What did the consumer say? Why do they buy competitor X?'
                value={value.note} onChange={(e) => onChange({ ...value, note: e.target.value })} />
            <Input placeholder="Competitor referenced (optional)" value={value.competitor} onChange={(e) => onChange({ ...value, competitor: e.target.value })} />
            <PhotoUploader photos={value.photos} onChange={(ps) => onChange({ ...value, photos: ps })} label="Evidence photos" />
        </div>
    );
}

export function SentimentCard({ tripId, logs }: { tripId: string; logs: SentimentLog[] }) {
    //   const dispatch = useAppDispatch();
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState<Omit<SentimentLog, "id">>(emptySentiment());
    const [editId, setEditId] = useState<string | null>(null);
    const [edit, setEdit] = useState<SentimentLog | null>(null);

    const add = () => {
        if (!form.note.trim()) { toast.error("Note required"); return; }
        // dispatch(addSentiment({ tripId, log: form }));
        console.log("this should be dispatching addSentiment({ tripId, log: form })");
        setForm(emptySentiment()); setShowAdd(false); toast.success("Sentiment logged");
    };
    const saveEdit = () => {
        if (edit) {
            // dispatch(updateSentiment({ tripId, log: edit }));
            console.log("this should be dispatching updateSentiment({ tripId, log: edit })")
            setEditId(null);
            setEdit(null);
            toast.success("Updated");
        }
    };

    return (
        <Card>
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><MessageSquare className="h-4 w-4 text-primary" /> Consumer Sentiment</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    {logs.map((l) => editId === l.id && edit ? (
                        <div key={l.id} className="space-y-3 rounded-md border-2 border-border bg-card p-3">
                            <SentimentForm value={edit} onChange={setEdit as (s: SentimentLog) => void} />
                            <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline" onClick={() => { setEditId(null); setEdit(null); }}>Cancel</Button>
                                <Button size="sm" onClick={saveEdit}>Save</Button>
                            </div>
                        </div>
                    ) : (
                        <div key={l.id} className="rounded-md border-2 border-border bg-muted/30 p-3 text-sm">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-foreground">"{l.note}"</span>
                                        <DraftBadge isDraft={l.isDraft} />
                                    </div>
                                    {l.competitor && <div className="mt-1 text-xs text-muted-foreground">vs. {l.competitor}</div>}
                                </div>
                                <RowActions
                                    onEdit={() => { setEditId(l.id); setEdit({ ...l }); }}
                                    // onDelete={() => dispatch(deleteSentiment({ tripId, id: l.id }))}
                                    onDelete={() => console.log("this should be dispatching updateSentiment({ tripId, log: edit })")}
                                    // onToggleDraft={() => dispatch(updateSentiment({ tripId, log: { ...l, isDraft: !l.isDraft } }))}
                                    onToggleDraft={() => console.log("this should be dispatching updateSentiment({ tripId, log: { ...l, isDraft: !l.isDraft } })")}
                                    isDraft={l.isDraft}
                                />
                            </div>
                            <PhotoGallery photos={l.photos} />
                        </div>
                    ))}
                    {logs.length === 0 && <p className="text-sm text-muted-foreground">No sentiment logs yet.</p>}
                </div>

                {!showAdd ? (
                    <Button variant="outline" size="sm" onClick={() => setShowAdd(true)}><Plus className="mr-1 h-4 w-4" />Add sentiment</Button>
                ) : (
                    <div className="space-y-3 rounded-md border-2 border-border bg-card p-3">
                        <div className="text-sm font-medium">New consumer sentiment</div>
                        <SentimentForm value={form as SentimentLog} onChange={(s) => setForm(s)} />
                        <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setShowAdd(false); setForm(emptySentiment()); }}>Cancel</Button>
                            <Button size="sm" onClick={add}>Add</Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}