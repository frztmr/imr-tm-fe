
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
    Users, AlertTriangle, Plus,
} from "lucide-react";
import { DraftBadge, RowActions } from "../trip.component";

//Typescript
import type { PartnerLog } from "@/types/tipes";



function emptyPartner(): Omit<PartnerLog, "id"> {
    return { partner: "", notes: "", painPoint: "", evidence: "", photos: [] };
}

function PartnerForm({ value, onChange }: { value: PartnerLog | Omit<PartnerLog, "id">; onChange: (v: any) => void }) {
    return (
        <div className="grid gap-2">
            <Input placeholder="Partner / Distributor" value={value.partner} onChange={(e) => onChange({ ...value, partner: e.target.value })} />
            <Textarea placeholder="Meeting notes" value={value.notes} onChange={(e) => onChange({ ...value, notes: e.target.value })} />
            <Input placeholder="Pain point (logistics, customs…)" value={value.painPoint} onChange={(e) => onChange({ ...value, painPoint: e.target.value })} />
            <Textarea placeholder="Evidence — what proof did you see / collect?" value={value.evidence} onChange={(e) => onChange({ ...value, evidence: e.target.value })} />
            <PhotoUploader photos={value.photos} onChange={(ps) => onChange({ ...value, photos: ps })} label="Evidence photos" />
        </div>
    );
}

export function PartnerCard({ tripId, logs }: { tripId: string; logs: PartnerLog[] }) {
    // const dispatch = useAppDispatch();
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState<Omit<PartnerLog, "id">>(emptyPartner());
    const [editId, setEditId] = useState<string | null>(null);
    const [edit, setEdit] = useState<PartnerLog | null>(null);

    const add = () => {
        if (!form.partner.trim()) { toast.error("Partner required"); return; }
        // dispatch(addPartnerLog({ tripId, log: form }));
        console.log("this should be dispatching addPartnerLog({ tripId, log: form })");
        setForm(emptyPartner()); setShowAdd(false); toast.success("Partner log added");
    };
    const saveEdit = () => {
        if (edit) {
            // dispatch(updatePartnerLog({ tripId, log: edit })); 
            console.log("this should be dispatching updatePartnerLog({ tripId, log: edit })")
            setEditId(null);
            setEdit(null);
            toast.success("Updated");
        }
    };

    return (
        <Card>
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Users className="h-4 w-4 text-primary" /> Partner Engagement Log</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    {logs.map((l) => editId === l.id && edit ? (
                        <div key={l.id} className="space-y-3 rounded-md border-2 border-border bg-card p-3">
                            <PartnerForm value={edit} onChange={setEdit as (p: PartnerLog) => void} />
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
                                        <span className="font-medium">{l.partner}</span>
                                        <DraftBadge isDraft={l.isDraft} />
                                    </div>
                                    {l.notes && <div className="mt-0.5 text-foreground/90">{l.notes}</div>}
                                    {l.painPoint && (
                                        <div className="mt-1 flex items-center gap-1 text-xs text-destructive"><AlertTriangle className="h-3 w-3" />{l.painPoint}</div>
                                    )}
                                    {l.evidence && (
                                        <div className="mt-1 rounded bg-info/10 px-2 py-1 text-xs text-info">
                                            <span className="font-medium">Evidence:</span> {l.evidence}
                                        </div>
                                    )}
                                </div>
                                <RowActions
                                    onEdit={() => { setEditId(l.id); setEdit({ ...l }); }}
                                    onDelete={
                                        // () => dispatch(deletePartnerLog({ tripId, id: l.id }))
                                        () => console.log("this should be dispatching deletePartnerLog({ tripId, id: l.id })")

                                    }
                                    onToggleDraft={
                                        // () => dispatch(updatePartnerLog({ tripId, log: { ...l, isDraft: !l.isDraft } }))
                                        () => console.log("this should be dispatching updatePartnerLog({ tripId, log: { ...l, isDraft: !l.isDraft } })")
                                    }
                                    isDraft={l.isDraft}
                                />
                            </div>
                            <PhotoGallery photos={l.photos} />
                        </div>
                    ))}
                    {logs.length === 0 && <p className="text-sm text-muted-foreground">No partner logs yet.</p>}
                </div>

                {!showAdd ? (
                    <Button variant="outline" size="sm" onClick={() => setShowAdd(true)}><Plus className="mr-1 h-4 w-4" />Add partner log</Button>
                ) : (
                    <div className="space-y-3 rounded-md border-2 border-border bg-card p-3">
                        <div className="text-sm font-medium">New partner log</div>
                        <PartnerForm value={form as PartnerLog} onChange={(p) => setForm(p)} />
                        <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setShowAdd(false); setForm(emptyPartner()); }}>Cancel</Button>
                            <Button size="sm" onClick={add}>Add</Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
