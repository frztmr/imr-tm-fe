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
import { DraftBadge, RowActions } from "../trip.component";

//Typescript
import type { Photo } from "@/types/tipes";

export function PostVisitPhotosCard({ tripId, photos }: { tripId: string; photos: Photo[] }) {
    //   const dispatch = useAppDispatch();
    const onChange = (next: Photo[]) => {
        // Diff: detect adds, removes, caption updates
        const prevById = new Map(photos.map((p) => [p.id, p]));
        const nextById = new Map(next.map((p) => [p.id, p]));
        const added = next.filter((p) => !prevById.has(p.id));
        if (added.length > 0) {
            // dispatch(addPostVisitPhotos({ tripId, photos: added }));
            console.log("this should be dispatch(addPostVisitPhotos({ tripId, photos: added }));");
        }
        for (const p of photos) {
            if (!nextById.has(p.id)) {
                // dispatch(deletePostVisitPhoto({ tripId, id: p.id }));
                console.log("this should be dispatch(deletePostVisitPhoto({ tripId, id: p.id }));");


            }
        }
        for (const p of next) {
            const prev = prevById.get(p.id);
            if (prev && prev.caption !== p.caption) {
                // dispatch(updatePostVisitPhoto({ tripId, photo: p }));
                console.log("this should be dispatch(updatePostVisitPhoto({ tripId, photo: p }));");

            }
        }
    };
    return (
        <Card>
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Image className="h-4 w-4 text-primary" /> Post-Visit Photo Journal</CardTitle></CardHeader>
            <CardContent>
                <PhotoUploader photos={photos} onChange={onChange} label="Trip photos" max={50} />
            </CardContent>
        </Card>
    );
}
