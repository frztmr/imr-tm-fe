
//React Requirement
import { useState } from "react";

//Redux
// import { useAppDispatch, useAppSelector } from "@/store";

// components and library
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PhotoUploader } from "@/components/PhotoUploader";
import {
    TrendingUp, Plus,
} from "lucide-react";
import { DraftBadge, RowActions } from "../trip.component";

//Typescript
import type { Competitor, Photo } from "@/types/tipes";

function emptyCompetitor(): Omit<Competitor, "id"> {
    return {
        brand: "",
        flavour: "",
        noodleType: "",
        price: "",
        presence: "",
        caption: ""
    };
}



function CompetitorForm({ value, onChange, onSave, onCancel }: {
    value: Competitor; onChange: (c: Competitor) => void; onSave: () => void; onCancel: () => void;
}) {
    return (
        <div className="space-y-3">
            <div className="grid gap-2 md:grid-cols-2">
                <Input placeholder="Brand" value={value.brand} onChange={(e) => onChange({ ...value, brand: e.target.value })} />
                <Input placeholder="Flavour" value={value.flavour} onChange={(e) => onChange({ ...value, flavour: e.target.value })} />
                <Input placeholder="Noodle type" value={value.noodleType} onChange={(e) => onChange({ ...value, noodleType: e.target.value })} />
                <Input placeholder="Price" value={value.price} onChange={(e) => onChange({ ...value, price: e.target.value })} />
                <Input placeholder="Presence" value={value.presence} onChange={(e) => onChange({ ...value, presence: e.target.value })} className="md:col-span-2" />
                <Textarea placeholder="Caption" value={value.caption} onChange={(e) => onChange({ ...value, caption: e.target.value })} className="md:col-span-2" />
            </div>
            <PhotoUploader
                photos={value.photo ? [value.photo] : []}
                onChange={(ps) => onChange({ ...value, photo: ps[0] })}
                label="Product photo" single
            />
            <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button size="sm" onClick={onSave}>Save</Button>
            </div>
        </div>
    );
}

export function CompetitorCard({ tripId, competitors }: { tripId: string; competitors: Competitor[] }) {
    // const dispatch = useAppDispatch();
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState<Omit<Competitor, "id">>(emptyCompetitor());
    const [photoDraft, setPhotoDraft] = useState<Photo[]>([]);
    const [editId, setEditId] = useState<string | null>(null);
    const [edit, setEdit] = useState<Competitor | null>(null);

    const reset = () => { setForm(emptyCompetitor()); setPhotoDraft([]); setShowAdd(false); };
    const add = () => {
        if (!form.brand.trim()) { toast.error("Brand required"); return; }
        // dispatch(addCompetitor({ tripId, competitor: { ...form, photo: photoDraft[0] } }));
        reset(); toast.success("Competitor logged");
    };
    const startEdit = (c: Competitor) => { setEditId(c.id); setEdit({ ...c }); };
    const saveEdit = () => {
        if (!edit) return;
        // dispatch(updateCompetitor({ tripId, competitor: edit })); setEditId(null); setEdit(null);
        toast.success("Competitor updated");
    };

    return (
        <Card>
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="h-4 w-4 text-primary" /> Competitor Benchmarking</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    {competitors.map((c) => {
                        const isEditing = editId === c.id && edit;
                        return (
                            <div key={c.id} className="rounded-md border-2 border-border bg-muted/30 p-3 text-sm">
                                {!isEditing ? (
                                    <>
                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="text-sm">{c.brand}</Badge>
                                                    <DraftBadge isDraft={c.isDraft} />
                                                </div>
                                                <div className="mt-1 text-xs text-muted-foreground">
                                                    {c.flavour && <>Flavour: {c.flavour} · </>}
                                                    {c.noodleType && <>Type: {c.noodleType} · </>}
                                                    {c.price && <>{c.price} · </>}
                                                    {c.presence}
                                                </div>
                                                {c.caption && <p className="mt-1 text-foreground/90">{c.caption}</p>}
                                            </div>
                                            <RowActions
                                                onEdit={() => startEdit(c)}
                                                onDelete={
                                                    // () => dispatch(deleteCompetitor({ tripId, id: c.id }))
                                                    () => console.log("competitor card deleted")
                                                }
                                                onToggleDraft={
                                                    // () => dispatch(updateCompetitor({ tripId, competitor: { ...c, isDraft: !c.isDraft } }))
                                                    () => console.log("competitor togeled")
                                                }
                                                isDraft={c.isDraft}
                                            />
                                        </div>
                                        {c.photo && (
                                            <figure className="mt-2 max-w-xs overflow-hidden rounded-md border-2 border-border">
                                                <img src={c.photo.url} alt={c.photo.caption || c.brand} className="h-32 w-full object-cover" />
                                                {c.photo.caption && <figcaption className="bg-card px-2 py-1 text-[11px] text-muted-foreground">{c.photo.caption}</figcaption>}
                                            </figure>
                                        )}
                                    </>
                                ) : (
                                    <CompetitorForm value={edit!} onChange={setEdit as (c: Competitor) => void}
                                        onSave={saveEdit} onCancel={() => { setEditId(null); setEdit(null); }} />
                                )}
                            </div>
                        );
                    })}
                    {competitors.length === 0 && <p className="text-sm text-muted-foreground">No competitors logged yet.</p>}
                </div>

                {!showAdd ? (
                    <Button variant="outline" size="sm" onClick={() => setShowAdd(true)}><Plus className="mr-1 h-4 w-4" />Add competitor</Button>
                ) : (
                    <div className="space-y-3 rounded-md border-2 border-border bg-card p-3">
                        <div className="text-sm font-medium">New competitor</div>
                        <div className="grid gap-2 md:grid-cols-2">
                            <Input placeholder="Brand *" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                            <Input placeholder="Flavour (e.g. Tom Yum)" value={form.flavour} onChange={(e) => setForm({ ...form, flavour: e.target.value })} />
                            <Input placeholder="Noodle type (Wavy thin, Cup, Stir-fry…)" value={form.noodleType} onChange={(e) => setForm({ ...form, noodleType: e.target.value })} />
                            <Input placeholder="Price (e.g. ฿6 / pack)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                            <Input placeholder="Presence (Dominant, Niche…)" value={form.presence} onChange={(e) => setForm({ ...form, presence: e.target.value })} className="md:col-span-2" />
                            <Textarea placeholder="Additional caption / context" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className="md:col-span-2" />
                        </div>
                        <PhotoUploader photos={photoDraft} onChange={setPhotoDraft} label="Product photo" single />
                        <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={reset}>Cancel</Button>
                            <Button size="sm" onClick={add}>Add competitor</Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}