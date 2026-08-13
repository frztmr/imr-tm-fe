

// react requiremet
import { useMemo, } from "react";

// components and library 

// Typescript 
import { Notif } from "./type";

export function useNotifications(): Notif[] {

    //post dan trip dari redux. harusnya dari database
    // const posts = useAppSelector((s) => s.posts.posts);
    // const trips = useAppSelector((s) => s.trips.trips);
    const posts = [];
    const trips = [];

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
