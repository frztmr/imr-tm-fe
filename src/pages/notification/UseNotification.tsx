

// react requiremet
import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// components and library
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Eye, Handshake, Plane, FileText } from "lucide-react";

// Typescript 
import { Notif } from "./type";

export function useNotifications(): Notif[] {

    // const posts = useAppSelector((s) => s.posts.posts);
    // const trips = useAppSelector((s) => s.trips.trips);
    
    return useMemo(() => {
        const list: Notif[] = [];
        posts.forEach((p) => {
            list.push({
                id: `p-${p.id}`,
                actor: p.author,
                createdAt: p.createdAt,
                kind: (p.kind as Notif["kind"]) ?? "post",
                text:
                    p.kind === "see"
                        ? `spotted something${p.location ? ` in ${p.location}` : ""}`
                        : p.kind === "meet"
                            ? `met ${p.contact || "someone"}${p.location ? ` in ${p.location}` : ""}`
                            : `posted an update${p.location ? ` from ${p.location}` : ""}`,
                to: p.tripId ? { tripId: p.tripId } : undefined,
            });
        });
        trips.forEach((t) => {
            list.push({
                id: `t-${t.id}`,
                actor: t.assignee,
                createdAt: t.startDate || new Date().toISOString(),
                kind: "trip",
                text: `started the trip tag #${t.title.replace(/\s+/g, "")}`,
                to: { tripId: t.id },
            });
        });
        return list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 60);
    }, [posts, trips]);
}
