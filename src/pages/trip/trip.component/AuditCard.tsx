

// react requiremet 
import { useState } from "react";

// components and library
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PhotoUploader, PhotoGallery } from "@/components/PhotoUploader";
import {
    MapPin, Camera, Plus, X,
} from "lucide-react";
import { DraftBadge, RowActions } from "../trip.component";

//Typescript
import type { RetailAudit, AuditDetail } from "@/types/tipes";

function emptyAudit(): Omit<RetailAudit, "id"> {
    return {
        storeName: "", lat: 0, lng: 0, shelfPrice: "", promoPrice: "", category: "",
        contactPerson: "", notes: "", details: [], photos: []
    };
}

function AuditEditor({ value, onChange }: { value: RetailAudit; onChange: (a: RetailAudit) => void }) {
    const updateDetail = (id: string, patch: Partial<AuditDetail>) =>
        onChange({ ...value, details: value.details.map((d) => d.id === id ? { ...d, ...patch } : d) });
    const removeDetail = (id: string) => onChange({ ...value, details: value.details.filter((d) => d.id !== id) });
    const addDetail = () => onChange({ ...value, details: [...value.details, { id: Math.random().toString(36).slice(2), label: "", value: "" }] });
    return (
        <div className="space-y-3">
            <div className="grid gap-2 md:grid-cols-2">
                <Input placeholder="Store" value={value.storeName} onChange={(e) => onChange({ ...value, storeName: e.target.value })} />
                <Input placeholder="Category" value={value.category} onChange={(e) => onChange({ ...value, category: e.target.value })} />
                <Input placeholder="Contact" value={value.contactPerson} onChange={(e) => onChange({ ...value, contactPerson: e.target.value })} />
                <Input placeholder="Shelf price" value={value.shelfPrice} onChange={(e) => onChange({ ...value, shelfPrice: e.target.value })} />
                <Input placeholder="Promo price" value={value.promoPrice} onChange={(e) => onChange({ ...value, promoPrice: e.target.value })} />
                <Textarea placeholder="Notes" value={value.notes} onChange={(e) => onChange({ ...value, notes: e.target.value })} className="md:col-span-2" />
            </div>
            <div className="rounded-md border-2 border-border bg-card/50 p-3">
                <div className="mb-2 flex items-center justify-between">
                    <Label className="text-sm font-medium">Details</Label>
                    <Button size="sm" variant="outline" onClick={addDetail}><Plus className="mr-1 h-3 w-3" />Row</Button>
                </div>
                <div className="space-y-2">
                    {value.details.map((d) => (
                        <div key={d.id} className="grid gap-2 md:grid-cols-[1fr_2fr_auto]">
                            <Input placeholder="Label" value={d.label} onChange={(e) => updateDetail(d.id, { label: e.target.value })} />
                            <Input placeholder="Value" value={d.value} onChange={(e) => updateDetail(d.id, { value: e.target.value })} />
                            <Button size="icon" variant="outline" onClick={() => removeDetail(d.id)}><X className="h-3.5 w-3.5" /></Button>
                        </div>
                    ))}
                </div>
            </div>
            <PhotoUploader photos={value.photos} onChange={(ps) => onChange({ ...value, photos: ps })} label="Store photos" />
        </div>
    );
}

export function AuditCard({ tripId, audits }: { tripId: string; audits: RetailAudit[] }) {
    //   const dispatch = useAppDispatch();
    const [form, setForm] = useState<Omit<RetailAudit, "id">>(emptyAudit());
    const [detail, setDetail] = useState({ label: "", value: "" });
    const [editId, setEditId] = useState<string | null>(null);
    const [edit, setEdit] = useState<RetailAudit | null>(null);

    const capture = () => {
        if (!navigator.geolocation) { toast.error("Geolocation unavailable"); return; }
        navigator.geolocation.getCurrentPosition(
            (pos) => { setForm((f) => ({ ...f, lat: +pos.coords.latitude.toFixed(4), lng: +pos.coords.longitude.toFixed(4) })); toast.success("Location captured"); },
            () => toast.error("Permission denied"),
        );
    };
    const addDetail = () => {
        if (!detail.label.trim()) return;
        setForm((f) => ({ ...f, details: [...f.details, { id: Math.random().toString(36).slice(2), label: detail.label, value: detail.value }] }));
        setDetail({ label: "", value: "" });
    };
    const removeDetail = (id: string) => setForm((f) => ({ ...f, details: f.details.filter((d) => d.id !== id) }));
    const add = () => {
        if (!form.storeName) { toast.error("Store name required"); return; }
        // dispatch(addAudit({ tripId, audit: form })); setForm(emptyAudit()); toast.success("Audit logged");
        console.log("this should be dispatching... AddAudit")
    };
    const startEdit = (a: RetailAudit) => { setEditId(a.id); setEdit({ ...a }); };
    const saveEdit = () => {
        if (edit) {
            // dispatch(updateAudit({ tripId, audit: edit }));
            console.log("this should be dispatching... updateAudit")
            setEditId(null);
            setEdit(null);
            toast.success("Audit updated");
        }
    };

    return (
        <Card>
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Camera className="h-4 w-4 text-primary" /> Retail Audit · Store Check</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    {audits.map((a) => editId === a.id && edit ? (
                        <div key={a.id} className="space-y-3 rounded-md border-2 border-border bg-card p-3">
                            <AuditEditor value={edit} onChange={setEdit as (a: RetailAudit) => void} />
                            <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline" onClick={() => { setEditId(null); setEdit(null); }}>Cancel</Button>
                                <Button size="sm" onClick={saveEdit}>Save</Button>
                            </div>
                        </div>
                    ) : (
                        <div key={a.id} className="rounded-md border-2 border-border bg-muted/30 p-3 text-sm">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{a.storeName}</span>
                                        <DraftBadge isDraft={a.isDraft} />
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {a.category && <span>{a.category} · </span>}
                                        Shelf: {a.shelfPrice || "—"} · Promo: {a.promoPrice || "—"} · {a.photos.length} photo(s)
                                    </div>
                                    {a.contactPerson && <div className="text-xs text-muted-foreground">Contact: {a.contactPerson}</div>}
                                </div>
                                <RowActions
                                    onEdit={() => startEdit(a)}
                                    onDelete={
                                        // () => dispatch(deleteAudit({ tripId, id: a.id }))
                                        () => console.log("this should be dispatching... dispatch")
                                    }
                                    onToggleDraft={
                                        // () => dispatch(updateAudit({ tripId, audit: { ...a, isDraft: !a.isDraft } }))
                                        () => console.log("this should be dispatching... updateAudit")
                                    }

                                    isDraft={a.isDraft}
                                />
                            </div>
                            {a.notes && <div className="mt-1 text-sm">{a.notes}</div>}
                            {a.details.length > 0 && (
                                <ul className="mt-2 space-y-1 text-xs">
                                    {a.details.map((d: AuditDetail) => (
                                        <li key={d.id} className="grid grid-cols-[120px_1fr] gap-2">
                                            <span className="text-muted-foreground">{d.label}</span><span>{d.value}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <PhotoGallery photos={a.photos} />
                        </div>
                    ))}
                    {audits.length === 0 && <p className="text-sm text-muted-foreground">No store audits yet.</p>}
                </div>

                <div className="space-y-3 rounded-md border-2 border-border bg-card p-3">
                    <div className="text-sm font-medium">New audit</div>
                    <div className="grid gap-2 md:grid-cols-2">
                        <Input placeholder="Store name *" value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} />
                        <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                        <div className="flex gap-2">
                            <Input placeholder="Lat" value={form.lat || ""} onChange={(e) => setForm({ ...form, lat: +e.target.value })} />
                            <Input placeholder="Lng" value={form.lng || ""} onChange={(e) => setForm({ ...form, lng: +e.target.value })} />
                            <Button type="button" variant="outline" onClick={capture}><MapPin className="h-4 w-4" /></Button>
                        </div>
                        <Input placeholder="Contact person" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
                        <Input placeholder="Shelf price" value={form.shelfPrice} onChange={(e) => setForm({ ...form, shelfPrice: e.target.value })} />
                        <Input placeholder="Promo price" value={form.promoPrice} onChange={(e) => setForm({ ...form, promoPrice: e.target.value })} />
                        <Textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="md:col-span-2" />
                    </div>

                    <div className="rounded-md border-2 border-border bg-card/50 p-3">
                        <Label className="mb-2 block text-sm font-medium">Additional details</Label>
                        {form.details.length > 0 && (
                            <ul className="mb-2 space-y-1">
                                {form.details.map((d) => (
                                    <li key={d.id} className="flex items-center justify-between gap-2 rounded bg-muted/50 px-2 py-1 text-xs">
                                        <span><span className="font-medium">{d.label}:</span> {d.value}</span>
                                        <button type="button" onClick={() => removeDetail(d.id)} className="text-muted-foreground hover:text-destructive"><X className="h-3 w-3" /></button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="grid gap-2 md:grid-cols-[1fr_2fr_auto]">
                            <Input placeholder="Label (e.g. Facings)" value={detail.label} onChange={(e) => setDetail({ ...detail, label: e.target.value })} />
                            <Input placeholder="Value" value={detail.value} onChange={(e) => setDetail({ ...detail, value: e.target.value })} />
                            <Button type="button" variant="outline" onClick={addDetail}><Plus className="h-4 w-4" /></Button>
                        </div>
                    </div>

                    <PhotoUploader photos={form.photos} onChange={(ps) => setForm({ ...form, photos: ps })} label="Store photos" />
                    <div className="flex justify-end"><Button onClick={add}>Log audit</Button></div>
                </div>
            </CardContent>
        </Card>
    );
}

