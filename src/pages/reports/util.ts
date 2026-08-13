import { Link } from "react-router-dom";
// import { useAppSelector } from "@/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, MapPin, TrendingUp, ArrowRight, BookOpen, Receipt, FileText } from "lucide-react";
import type { Trip } from "@/types/tipes";


export function initialsOf(name: string) {
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export function readMinutes(t: Trip) {
    const words =
        (t.report.adjustments?.length ?? 0) +
        t.partnerLogs.reduce((s, p) => s + p.notes.length, 0) +
        t.sentiment.reduce((s, p) => s + p.note.length, 0);
    return Math.max(2, Math.round(words / 250) + 2);
}

export function snippet(t: Trip) {
    const comp = t.competitors[0];
    const cities = (t.cities ?? []).join(", ");
    return `In ${cities}, ${t.country}, the shelf reality is clear${comp ? `: ${comp.brand} sits at ${comp.price}, ${comp.presence.toLowerCase()}` : ""}. Our forecast lands at ${t.report.forecastVolume.toLocaleString()} units, with ${t.retailAudits.length} store audits and ${t.partnerLogs.length} partner conversations behind it.`;
}