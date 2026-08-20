
//React Requirement
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

//Component
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, MapPin, User, Plane, FileText } from "lucide-react";

//Redux
// import { useAppSelector } from "@/store";


//Typescript, dummy data, and util
import { initialsOf } from "@/lib/feed";
import { mockFeedPosts } from "@/data/mockData";
import { mockAccounts } from "@/data/mockData";
import { mockTrips } from "@/data/mockData";

function slug(name: string) { return encodeURIComponent(name); }

export default function SearchPage() {

    //   const trips = useAppSelector((s) => s.trips.trips);
    //   const posts = useAppSelector((s) => s.posts.posts);
    //   const accounts = useAppSelector((s) => s.auth.accounts);

    const trips = mockTrips;
    const posts = mockFeedPosts;
    const accounts = mockAccounts;

    const [q, setQ] = useState("");
    const query = q.trim().toLowerCase();

    const people = useMemo(() => {
        const names = new Set<string>();
        trips.forEach((t) => names.add(t.assignee));
        posts.forEach((p) => names.add(p.author));
        accounts.forEach((a) => names.add(a.name));
        return Array.from(names)
            .filter((n) => !query || n.toLowerCase().includes(query))
            .sort();
    }, [trips, posts, accounts, query]);

    const tripHits = useMemo(
        () => trips.filter((t) =>
            !query ||
            t.title.toLowerCase().includes(query) ||
            t.country.toLowerCase().includes(query) ||
            (t.cities ?? []).some((c) => c.toLowerCase().includes(query))
        ),
        [trips, query],
    );

    const postHits = useMemo(
        () => posts.filter((p) =>
            !query ||
            p.text.toLowerCase().includes(query) ||
            p.location.toLowerCase().includes(query) ||
            p.tags.some((t) => t.toLowerCase().includes(query))
        ),
        [posts, query],
    );

    return (
        <>
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-3 flex items-center gap-2 text-2xl font-semibold tracking-tight">
                    <SearchIcon className="h-5 w-5 text-primary" /> Search
                </h1>
                <div className="relative mb-6">
                    <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        autoFocus
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search people, trips, posts, #tags…"
                        className="pl-9"
                    />
                </div>

                <section className="mb-6">
                    <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <User className="h-4 w-4" /> People ({people.length})
                    </h2>
                    {people.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No people match.</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {people.slice(0, 12).map((name) => (
                                <Link
                                    key={name}
                                    to={`/u/${slug(name)}`}
                                    className="flex items-center gap-3 rounded-lg border bg-card p-3 transition hover:bg-accent"
                                >
                                    <Avatar className="h-10 w-10 ring-2 ring-primary/30">
                                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                                            {initialsOf(name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-medium">{name}</div>
                                        <div className="text-xs text-muted-foreground">@{name.toLowerCase().replace(/\s+/g, "")}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <section className="mb-6">
                    <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <Plane className="h-4 w-4" /> Trips ({tripHits.length})
                    </h2>
                    <div className="space-y-2">
                        {tripHits.slice(0, 8).map((t) => (
                            <Link
                                key={t.id} to={`/trips/${t.id}`} >
                                <Card className="transition hover:bg-accent my-2">
                                    <CardContent className="flex items-center justify-between p-3">
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-medium">{t.title}</div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <MapPin className="h-3 w-3" />{(t.cities ?? []).join(", ")}, {t.country}
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="rounded-full">{t.status}</Badge>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                        {tripHits.length === 0 && <p className="text-sm text-muted-foreground">No trips match.</p>}
                    </div>
                </section>

                <section>
                    <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <FileText className="h-4 w-4" /> Posts ({postHits.length})
                    </h2>
                    <div className="space-y-2">
                        {postHits.slice(0, 8).map((p) => (
                            <Card key={p.id}>
                                <CardContent className="flex items-start gap-3 p-3">
                                    {p.photos[0] && (
                                        <img src={p.photos[0].url} alt="" className="h-14 w-14 rounded object-cover" />
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <Link
                                            to={`/u/${slug(p.author)}`}
                                            className="text-sm font-medium hover:underline">
                                            {p.author}
                                        </Link>
                                        <div className="line-clamp-2 text-sm text-foreground/80">{p.text}</div>
                                        {p.tags.length > 0 && (
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {p.tags.slice(0, 4).map((t) => (
                                                    <span key={t} className="text-[11px] text-primary">#{t.replace(/^#/, "")}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {postHits.length === 0 && <p className="text-sm text-muted-foreground">No posts match.</p>}
                    </div>
                </section>
            </div>
        </>
    );
}