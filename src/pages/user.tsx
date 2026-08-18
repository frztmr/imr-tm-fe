
//React Requirement
import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";


//Component
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Grid3x3, Plane, Bookmark,
    MapPin, Trash2, FileText,
    Receipt, BookOpen
} from "lucide-react";
// import { deletePost } from "@/store/postsSlice";


// Redux
// import { useAppSelector, useAppDispatch } from "@/store";

// Typescript and Utils
import { } from '../types/tipes'
import { initialsOf } from '../lib/utils'
import { dummyTrip, dummyAccount, dummyFeedPost } from '../store/dummyData'


const ProfilePage = () => {

    const { userId } = useParams();
    const name = decodeURIComponent(userId);

    //ini tab di atas gambar
    const [tab, setTab] = useState<"posts" | "articles" | "trips" | "saved">("posts");

    // const posts = useAppSelector((s) => s.posts.posts).filter((p) => p.author === name);
    // const trips = useAppSelector((s) => s.trips.trips).filter((t) => t.assignee === name);
    // const account = useAppSelector((s) => s.auth.accounts).find((a) => a.name === name);
    const posts = [dummyFeedPost]
    const trips = [dummyTrip]
    const account = dummyAccount

    const tripPhotoTiles = useMemo(() => {
        const tiles: { id: string; url: string; tripId: string; caption: string }[] = [];
        trips.forEach((t) => {
            t.retailAudits.forEach((r) =>
                r.photos.forEach((p) =>
                    tiles.push({ id: p.id, url: p.url, tripId: t.id, caption: p.caption }),
                ),
            );
        });
        return tiles;
    }, [trips]);

    const totalLikes = posts.length * 24 + trips.length * 80;
    const handle = name.toLowerCase().replace(/\s+/g, "");

    return (
        <>
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <header className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                    <Avatar className="h-24 w-24 ring-4 ring-primary/20 sm:h-28 sm:w-28">
                        <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                            {initialsOf(name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-3">
                            <h1 className="text-xl font-semibold">{name}</h1>
                            <span className="text-sm text-muted-foreground">@{handle}</span>
                            {account?.role === "admin" && (
                                <Badge variant="secondary" className="rounded-full">Admin</Badge>
                            )}
                        </div>
                        <div className="mt-3 flex items-center justify-center gap-6 text-sm sm:justify-start">
                            <div><span className="font-semibold">{posts.length + tripPhotoTiles.length}</span> <span className="text-muted-foreground">posts</span></div>
                            <div><span className="font-semibold">{trips.length}</span> <span className="text-muted-foreground">trips</span></div>
                            <div><span className="font-semibold">{totalLikes}</span> <span className="text-muted-foreground">likes</span></div>
                        </div>
                        <p className="mt-3 text-sm text-foreground/80">
                            {account?.role === "admin" ? "Admin" : "Field Researcher"} at IMI · capturing market truth on the ground.
                        </p>
                    </div>
                </header>

                {/* Tabs */}
                <div className="mb-3 grid grid-cols-4 border-y">
                    {([
                        { k: "posts", label: "Posts", Icon: Grid3x3 },
                        { k: "articles", label: "Articles", Icon: FileText },
                        { k: "trips", label: "Trips", Icon: Plane },
                        { k: "saved", label: "Tagged", Icon: Bookmark },
                    ] as const).map(({ k, label, Icon }) => (
                        <button
                            key={k}
                            onClick={() => setTab(k)}
                            className={`flex items-center justify-center gap-1.5 py-3 text-[11px] font-semibold uppercase tracking-wider transition sm:gap-2 sm:text-xs ${tab === k ? "border-t-2 border-foreground text-foreground -mt-px" : "text-muted-foreground"
                                }`}
                        >
                            <Icon className="h-4 w-4" /> {label}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {tab === "posts" && (
                    posts.length === 0 ? (
                        <p className="py-10 text-center text-sm text-muted-foreground">No posts yet.</p>
                    ) : (
                        <div className="grid grid-cols-3 gap-1">
                            {posts.map((p) => {
                                const cover = p.photos[0]?.url;
                                return (
                                    <div key={p.id} className="group relative aspect-square overflow-hidden bg-muted">
                                        {cover ? (
                                            <img src={cover} alt={p.text.slice(0, 40)} loading="lazy" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center p-2 text-center text-[11px] text-muted-foreground">
                                                {p.text.slice(0, 80) || "Text post"}
                                            </div>
                                        )}
                                        <button

                                            // // ini untuk delete post
                                            // onClick={
                                            //     () =>
                                            //         dispatch(deletePost(p.id))
                                            // }
                                            aria-label="Delete"
                                            className="absolute right-1 top-1 hidden rounded-full bg-background/80 p-1.5 text-destructive group-hover:block"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )
                )}

                {tab === "articles" && (
                    trips.length === 0 ? (
                        <p className="py-10 text-center text-sm text-muted-foreground">No articles or documents yet.</p>
                    ) : (
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <h2 className="flex items-center gap-2 text-sm font-semibold"><BookOpen className="h-4 w-4 text-primary" /> Reports</h2>
                                {trips.map((t) => {
                                    const count = (t.moments?.length ?? 0) + posts.filter((p) => p.tripId === t.id).length;
                                    return (
                                        <Link
                                            key={t.id}
                                            to={` /trips/${t.id}/article `} >
                                            <Card className="transition hover:bg-accent">
                                                <CardContent className="flex items-center justify-between gap-3 p-3">
                                                    <div className="min-w-0">
                                                        <div className="truncate text-sm font-medium">{t.title}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {(t.cities ?? []).join(", ")}, {t.country} · {count} entr{count === 1 ? "y" : "ies"}
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className="rounded-full">Report</Badge>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="space-y-2">
                                <h2 className="flex items-center gap-2 text-sm font-semibold"><FileText className="h-4 w-4 text-primary" /> Documents</h2>
                                {trips.map((t) => {
                                    const items = (t.expenses ?? []).filter((e) => e.author === name);
                                    return (
                                        <Link
                                            to={`/trips/${t.id}/expenses`} >
                                            <Card className="transition hover:bg-accent">
                                                <CardContent className="flex items-center justify-between gap-3 p-3">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 text-sm font-medium">
                                                            <Receipt className="h-4 w-4 text-primary" /> Travel Expense Statement
                                                        </div>
                                                        <div className="truncate text-xs text-muted-foreground">
                                                            {t.title} · {items.length} line item{items.length === 1 ? "" : "s"}
                                                        </div>
                                                    </div>
                                                    <Badge variant="secondary" className="rounded-full">Document</Badge>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )
                )}

                {tab === "trips" && (
                    trips.length === 0 ? (
                        <p className="py-10 text-center text-sm text-muted-foreground">No trips yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {trips.map((t) => (
                                <Link
                                    to={`/trips/${t.id}`} >
                                    <Card className="transition hover:bg-accent">
                                        <CardContent className="flex items-center justify-between p-3">
                                            <div>
                                                <div className="text-sm font-medium">{t.title}</div>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <MapPin className="h-3 w-3" />
                                                    {(t.cities ?? []).join(", ")}, {t.country} · {t.startDate}
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="rounded-full">{t.status}</Badge>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )
                )}

                {tab === "saved" && (
                    tripPhotoTiles.length === 0 ? (
                        <p className="py-10 text-center text-sm text-muted-foreground">No tagged shots yet.</p>
                    ) : (
                        <div className="grid grid-cols-3 gap-1">
                            {tripPhotoTiles.map((tile) => (
                                <Link
                                    to={`/trips/${t.id}`}
                                    className="relative aspect-square overflow-hidden bg-muted"
                                >
                                    <img src={tile.url} alt={tile.caption}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition group-hover:scale-105" />
                                </Link>
                            ))}
                        </div>
                    )
                )}
            </div>
        </>
    );
}
export default ProfilePage;

