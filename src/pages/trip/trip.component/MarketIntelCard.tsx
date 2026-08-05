
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
import { Labeled } from "./Labeled";

//Typescript
import type { MarketIntel } from "@/types/tipes";




export function MarketIntelCard({ tripId, intel, dispatch }: { tripId: string; intel: MarketIntel; dispatch: any }) {
    //   const dispatch = useAppDispatch();
    const [form, setForm] = useState<MarketIntel>({ ...intel });
    return (
        <Card>
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><ShoppingBag className="h-4 w-4 text-primary" /> Market Intelligence</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-3">
                    <Labeled label="Import duty"><Input value={form.importDuty} onChange={(e) => setForm({ ...form, importDuty: e.target.value })} /></Labeled>
                    <Labeled label="VAT"><Input value={form.vat} onChange={(e) => setForm({ ...form, vat: e.target.value })} /></Labeled>
                    <Labeled label="Certifications"><Input value={form.certifications} onChange={(e) => setForm({ ...form, certifications: e.target.value })} /></Labeled>
                </div>
                <div className="flex justify-end">
                    <Button onClick={() => {
                        // dispatch(updateMarketIntel({ tripId, intel: form })); toast.success("Market intel saved");
                    }}>Save</Button>
                </div>
            </CardContent>
        </Card>
    );
}