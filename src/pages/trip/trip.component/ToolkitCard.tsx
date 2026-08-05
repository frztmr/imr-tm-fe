

// react requiremet
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";

// components and library
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PhotoUploader, PhotoGallery } from "@/components/PhotoUploader";
import {
    ArrowLeft, MapPin, Calendar, FileText, Camera, Users, MessageSquare,
    TrendingUp, Mail, ShoppingBag, AlertTriangle, BookOpen, Plus, X,
    ChevronDown, ChevronUp, Image, Pencil, Trash2, FileEdit, Zap, Sparkles,
} from "lucide-react";
import { DraftBadge } from "../trip.component";

//Typescript
import type { Toolkit, ToolkitItem } from "@/types/tipes";



export function ToolkitCard({ tripId, toolkit }: { tripId: string; toolkit: Toolkit }) {
    //   const dispatch = useAppDispatch();
    const [newLabel, setNewLabel] = useState("");
    const updateItem = (id: string, patch: Partial<ToolkitItem>) => {
        // dispatch(updateToolkit({ tripId, toolkit: { items: toolkit.items.map((it) => it.id === id ? { ...it, ...patch } : it) } }));
        console.log("update item at toolkit card")
    };

    const remove = (id: string) =>
        // dispatch(updateToolkit({ tripId, toolkit: { items: toolkit.items.filter((it) => it.id !== id) } })
        console.log("remove item at toolkit card");

    const addCustom = () => {
        if (!newLabel.trim()) return;
        // dispatch(addToolkitItem({ tripId, item: { label: newLabel.trim(), checked: false, notes: "" } }));
        console.log("addCustom item at toolkit card");
        setNewLabel(""); toast.success("Item added");
    };
    return (
        <Card>
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><FileText className="h-4 w-4 text-primary" /> Sales Toolkit Checklist</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                <ul className="space-y-2">
                    {toolkit.items.map((it) => (
                        <li key={it.id} className="rounded-md border-2 border-border bg-card p-3">
                            <div className="flex items-start gap-3">
                                <Checkbox id={it.id} checked={it.checked} onCheckedChange={(v) => updateItem(it.id, { checked: !!v })} className="mt-0.5" />
                                <div className="flex-1">
                                    <Label htmlFor={it.id} className="cursor-pointer text-sm font-medium">{it.label}</Label>
                                    <Textarea placeholder="Details — quantity, version, owner…" value={it.notes}
                                        onChange={(e) => updateItem(it.id, { notes: e.target.value })} className="mt-2 min-h-[60px] text-sm" />
                                </div>
                                <button type="button" onClick={() => remove(it.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="flex gap-2 pt-1">
                    <Input placeholder="Add custom toolkit item…" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
                    <Button variant="outline" onClick={addCustom}><Plus className="mr-1 h-4 w-4" />Add</Button>
                </div>
            </CardContent>
        </Card>
    );
}