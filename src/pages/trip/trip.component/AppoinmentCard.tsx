
// react requiremet 
import { useState } from "react";

// components and library
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
    Calendar, Plus, X,
    ChevronDown, ChevronUp, Trash2,
} from "lucide-react";
import { DraftBadge } from "../trip.component";

//Typescript
import type { Appointment } from "@/types/tipes";



function emptyAppointment(): Omit<Appointment, "id"> {
    return { partner: "", date: "", status: "confirmed", location: "", contact: "", agenda: "", outcome: "", notes: "" };
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="grid grid-cols-[110px_1fr] gap-2">
            <span className="text-muted-foreground">{label}</span>
            <span className="whitespace-pre-wrap text-foreground">{value}</span>
        </div>
    );
}

export function AppointmentCard({ tripId, appointments }: { tripId: string; appointments: Appointment[] }) {

    //redux
    // const dispatch = useAppDispatch();

    const [form, setForm] = useState<Omit<Appointment, "id">>(emptyAppointment());
    const [showAdd, setShowAdd] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Appointment | null>(null);

    const add = () => {
        if (!form.partner || !form.date) { toast.error("Partner and date required"); return; }
        // dispatch(addAppointment({ tripId, appointment: form }));
        setForm(emptyAppointment()); setShowAdd(false); toast.success("Meeting added");
    };
    const saveEdit = () => {
        if (!editForm) return;
        // dispatch(updateAppointment({ tripId, appointment: editForm }));
        setEditForm(null); toast.success("Meeting updated");
    };

    return (
        <Card>
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Calendar className="h-4 w-4 text-primary" /> Meeting Scheduler</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    {appointments.map((a) => {
                        const open = expanded === a.id;
                        const isEditing = editForm?.id === a.id;
                        return (
                            <div key={a.id} className="rounded-md border-2 border-border bg-muted/30 p-3 text-sm">
                                <div className="flex items-start justify-between gap-2">
                                    <button type="button" onClick={() => setExpanded(open ? null : a.id)} className="flex-1 text-left">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{a.partner}</span>
                                            <DraftBadge isDraft={a.isDraft} />
                                        </div>
                                        <div className="text-xs text-muted-foreground">{a.date}{a.location ? " · " + a.location : ""}</div>
                                    </button>
                                    <div className="flex items-center gap-1">
                                        <Badge variant="outline" className={a.status === "confirmed" ? "border-success/40 text-success" : ""}>{a.status}</Badge>
                                        <Button size="icon" variant="outline" onClick={() => setExpanded(open ? null : a.id)} aria-label="Toggle">
                                            {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            // onClick={() => dispatch(deleteAppointment({ tripId, id: a.id }))}
                                            onClick={() => console.log("delete appoinment")}
                                            aria-label="Delete"
                                        >
                                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                        </Button>
                                    </div>
                                </div>

                                {open && !isEditing && (
                                    <div className="mt-3 space-y-2 border-t-2 border-border pt-3 text-xs">
                                        {a.contact && <DetailRow label="Contact" value={a.contact} />}
                                        {a.agenda && <DetailRow label="Agenda" value={a.agenda} />}
                                        {a.outcome && <DetailRow label="Outcome" value={a.outcome} />}
                                        {a.notes && <DetailRow label="Notes" value={a.notes} />}
                                        <div className="flex justify-end gap-2 pt-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={
                                                    // () => dispatch(updateAppointment({ tripId, appointment: { ...a, isDraft: !a.isDraft } }))
                                                    () => console.log("editing appoinment")
                                                }
                                            >
                                                {a.isDraft ? "Mark final" : "Mark draft"}
                                            </Button>
                                            <Button size="sm" onClick={() => setEditForm({ ...a })}>Edit details</Button>
                                        </div>
                                    </div>
                                )}

                                {open && isEditing && editForm && (
                                    <div className="mt-3 grid gap-2 border-t-2 border-border pt-3">
                                        <Input placeholder="Partner" value={editForm.partner} onChange={(e) => setEditForm({ ...editForm, partner: e.target.value })} />
                                        <div className="grid gap-2 md:grid-cols-2">
                                            <Input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} />
                                            <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v as never })}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Input placeholder="Location" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
                                        <Input placeholder="Contact" value={editForm.contact} onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })} />
                                        <Textarea placeholder="Agenda" value={editForm.agenda} onChange={(e) => setEditForm({ ...editForm, agenda: e.target.value })} />
                                        <Textarea placeholder="Outcome" value={editForm.outcome} onChange={(e) => setEditForm({ ...editForm, outcome: e.target.value })} />
                                        <Textarea placeholder="Notes" value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} />
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="outline" onClick={() => setEditForm(null)}>Cancel</Button>
                                            <Button size="sm" onClick={saveEdit}>Save</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {appointments.length === 0 && <p className="text-sm text-muted-foreground">No meetings yet.</p>}
                </div>

                {!showAdd ? (
                    <Button variant="outline" size="sm" onClick={() => setShowAdd(true)}><Plus className="mr-1 h-4 w-4" />Add meeting</Button>
                ) : (
                    <div className="grid gap-2 rounded-md border-2 border-border bg-card p-3">
                        <div className="text-sm font-medium">New meeting</div>
                        <Input placeholder="Partner" value={form.partner} onChange={(e) => setForm({ ...form, partner: e.target.value })} />
                        <div className="grid gap-2 md:grid-cols-2">
                            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as never })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                        <Input placeholder="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
                        <Textarea placeholder="Agenda" value={form.agenda} onChange={(e) => setForm({ ...form, agenda: e.target.value })} />
                        <Textarea placeholder="Outcome" value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })} />
                        <Textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                        <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setShowAdd(false); setForm(emptyAppointment()); }}>Cancel</Button>
                            <Button size="sm" onClick={add}>Add meeting</Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}