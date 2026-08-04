
// react requiremet
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

// components and library
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Plus } from "lucide-react";

// Typescript
import type { Photo } from "@/types/tipes";

const tones: Record<string, string> = {
    planned: "bg-info/10 text-info border-info/20",
    in_progress: "bg-warning/15 text-warning-foreground border-warning/30",
    completed: "bg-success/10 text-success border-success/20",
};

const TripIndex = () => {



    // Redux. Activate when ready
    // const dispatch = useAppDispatch(); 

    // ini untuk dapatkan data trip. 
    // Dia pake redux.
    // Harusnya dari database
    // const trips = useAppSelector((s) => s.trips.trips);
    const trips = [];

    const [q, setQ] = useState("");

    // proses filtering di frontend?
    const filtered = trips.filter((t) =>
        (t.title + t.country + (t.cities ?? []).join(" ") + t.assignee).toLowerCase().includes(q.toLowerCase()),
    );


    return (
        <>
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold">Trips</h1>
                    <p className="text-sm text-muted-foreground">All business trips & their status.</p>
                </div>
                <Link
                    to="/trips/new"
                    className="hidden items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground sm:flex"
                >
                    <Plus className="h-4 w-4" /> New
                </Link>
            </div>

            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search trips, countries, assignees…" className="pl-9" />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
                {filtered.map((t) => (
                    <Link
                        key={t.id}
                        to={`/trips/${t.id}`} 
                    >
                        <Card className="transition hover:border-primary/40 hover:shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="font-medium">{t.title}</div>
                                    <Badge variant="outline" className={tones[t.status]}>
                                        {t.status.replace("_", " ")}
                                    </Badge>
                                </div>
                                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{(t.cities ?? []).join(", ")}, {t.country}</span>
                                    <span>·</span><span>{t.assignee}</span>
                                    <span>·</span><span>{t.startDate} → {t.endDate}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
                        No trips match your search.
                    </div>
                )}
            </div>
        </>
    )

}

export default TripIndex