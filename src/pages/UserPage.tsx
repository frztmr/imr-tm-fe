import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
    Briefcase, CalendarDays, Hash, Loader2, MapPin, Plane, Plus, Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { initialsOf } from "@/lib/feed";
import { PostCard } from "./HomePage";
import {
    getUserBookmarks, getUserPosts, getUserProfile, getUserTags,
    type UserProfile, type UserTag,
} from "@/config/users";
import type { FeedPost } from "@/types/tipes";

type Tab = "posts" | "tags" | "bookmarks";

const formatDate = (iso?: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
        ? iso
        : d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

const tripStatusLabel: Record<string, string> = {
    planned: "Planned",
    in_progress: "In progress",
    completed: "Completed",
};

// =========================================================
// small pieces
// =========================================================

function Centered({ children }: { children: React.ReactNode }) {
    return <div className="px-4 py-10 text-center text-sm text-muted-foreground">{children}</div>;
}

function Loading() {
    return (
        <Centered>
            <Loader2 className="mx-auto h-5 w-5 animate-spin" />
        </Centered>
    );
}

function TagCard({ tag }: { tag: UserTag }) {
    const isTrip = tag.tag_type === "trip";
    const place = [tag.cities?.join(", "), tag.country].filter(Boolean).join(", ");
    const dates = tag.start_date
        ? `${formatDate(tag.start_date)}${tag.end_date ? ` – ${formatDate(tag.end_date)}` : ""}`
        : "";

    return (
        <article className="space-y-1.5 px-4 py-3">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="inline-flex items-center gap-1 font-semibold">
                    {isTrip ? <Plane className="h-4 w-4 text-primary" /> : <Hash className="h-4 w-4 text-primary" />}
                    {tag.name}
                </span>
                <span className="text-sm text-primary">#{tag.slug}</span>
                <div className="ml-auto flex flex-wrap gap-1">
                    <Badge variant="secondary" className="rounded-full font-normal">
                        {tag.tag_type_name || tag.tag_type}
                    </Badge>
                    {tag.role === "owner" && (
                        <Badge variant="outline" className="rounded-full font-normal">Owner</Badge>
                    )}
                    {tag.member_status === "pending" && (
                        <Badge variant="outline" className="rounded-full border-amber-500/50 font-normal text-amber-600">
                            Waiting approval
                        </Badge>
                    )}
                    {isTrip && tag.trip_status && (
                        <Badge variant="outline" className="rounded-full font-normal">
                            {tripStatusLabel[tag.trip_status] ?? tag.trip_status}
                        </Badge>
                    )}
                </div>
            </div>

            {tag.description && (
                <p className="line-clamp-2 text-sm text-foreground/80">{tag.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                {place && (
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {place}</span>
                )}
                {dates && (
                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {dates}</span>
                )}
                <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" /> {tag.member_count} {tag.member_count === 1 ? "member" : "members"}
                </span>
                <span>{tag.post_count} {tag.post_count === 1 ? "post" : "posts"}</span>
                {tag.role !== "owner" && <span>by @{tag.owner_uname}</span>}
            </div>
        </article>
    );
}

// =========================================================
// page
// =========================================================

const ProfilePage = () => {
    // /user/:userId — userId is the uname. "$userId" (old placeholder links) or empty = me
    const { userId = "" } = useParams<{ userId: string }>();
    const raw = decodeURIComponent(userId).trim();
    const uname = raw && !raw.startsWith("$") ? raw : undefined;

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [profileError, setProfileError] = useState("");
    const [loadingProfile, setLoadingProfile] = useState(true);

    // ?tab=tags | bookmarks opens that tab (e.g. after creating a tag)
    const [searchParams] = useSearchParams();
    const initialTab = (["posts", "tags", "bookmarks"] as const).find((t) => t === searchParams.get("tab")) ?? "posts";
    const [tab, setTab] = useState<Tab>(initialTab);

    // per-tab data. null = not loaded yet
    const [posts, setPosts] = useState<FeedPost[] | null>(null);
    const [bookmarks, setBookmarks] = useState<FeedPost[] | null>(null);
    const [tags, setTags] = useState<UserTag[] | null>(null);
    const [tabError, setTabError] = useState("");

    // ===== GET /users/profile =====
    useEffect(() => {
        let cancelled = false;
        setLoadingProfile(true);
        setProfileError("");
        setProfile(null);
        setTab(initialTab);
        setPosts(null);
        setBookmarks(null);
        setTags(null);

        getUserProfile(uname)
            .then((p) => {
                if (cancelled) return;
                setProfile(p);
                // bookmarks are private → not available on someone else's profile
                if (!p.is_me) setTab((t) => (t === "bookmarks" ? "posts" : t));
            })
            .catch((err) => {
                console.log("err at get profile", err);
                if (cancelled) return;
                const status = err?.response?.status;
                if (status === 404) return setProfileError("This user doesn't exist.");
                // show what actually went wrong (BE msg / status / timeout) to make it easier to debug
                const detail = err?.response?.data?.msg
                    || (err?.code === "ECONNABORTED" ? "request timed out" : err?.message)
                    || "unknown error";
                setProfileError(`Failed to load profile (${status ?? "no response"}: ${detail}).`);
            })
            .finally(() => { if (!cancelled) setLoadingProfile(false); });

        return () => { cancelled = true; };
    }, [uname]);

    // ===== load the active tab once (GET /users/post | /users/tag | /users/bookmark) =====
    useEffect(() => {
        if (!profile) return;
        let cancelled = false;
        setTabError("");

        const fail = (err: any) => {
            console.log(`err at get user ${tab}`, err);
            if (cancelled) return;
            const detail = err?.response?.data?.msg || err?.message || "unknown error";
            setTabError(`Failed to load ${tab} (${err?.response?.status ?? "no response"}: ${detail}).`);
        };

        if (tab === "posts" && posts === null) {
            getUserPosts(uname).then((d) => { if (!cancelled) setPosts(d); }).catch(fail);
        }
        if (tab === "tags" && tags === null) {
            getUserTags(uname).then((d) => { if (!cancelled) setTags(d); }).catch(fail);
        }
        if (tab === "bookmarks" && bookmarks === null && profile.is_me) {
            getUserBookmarks().then((d) => { if (!cancelled) setBookmarks(d); }).catch(fail);
        }

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab, profile, uname]);

    if (loadingProfile) return <div className="mx-auto max-w-xl"><Loading /></div>;
    if (profileError || !profile) {
        return <div className="mx-auto max-w-xl"><Centered>{profileError || "Profile not found."}</Centered></div>;
    }

    const displayName = profile.full_name?.trim() || profile.uname;
    const work = [profile.job_title, profile.department || profile.division].filter(Boolean).join(" · ");

    // bookmarks are private → only on my own profile
    const tabs: { key: Tab; label: string }[] = [
        { key: "posts", label: "Posts" },
        { key: "tags", label: "Tags" },
        ...(profile.is_me ? [{ key: "bookmarks" as Tab, label: "Bookmarks" }] : []),
    ];

    const removeFrom = (setter: React.Dispatch<React.SetStateAction<FeedPost[] | null>>, id: string) =>
        setter((prev) => prev && prev.filter((p) => p.id !== id));

    const renderPosts = (list: FeedPost[] | null, empty: string, setter: typeof setPosts) => {
        if (list === null) return tabError ? <Centered>{tabError}</Centered> : <Loading />;
        if (list.length === 0) return <Centered>{empty}</Centered>;
        return (
            <div className="divide-y">
                {list.map((p) => (
                    <PostCard key={p.id} post={p} onDeleted={() => removeFrom(setter, p.id)} />
                ))}
            </div>
        );
    };

    return (
        <div className="mx-auto max-w-xl">
            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                {/* ===== header (Threads style: name left, avatar right) ===== */}
                <header className="space-y-4 px-5 pb-4 pt-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 space-y-1">
                            <h1 className="truncate text-2xl font-bold leading-tight">{displayName}</h1>
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                                <span>@{profile.uname}</span>
                                {profile.role_name && (
                                    <Badge variant="secondary" className="rounded-full px-2 py-0 text-[11px] font-normal">
                                        {profile.role_name}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <Avatar className="h-20 w-20 shrink-0">
                            <AvatarFallback className="bg-primary text-xl font-semibold text-primary-foreground">
                                {initialsOf(displayName)}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    {profile.bio && <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{profile.bio}</p>}

                    {(work || profile.location_base) && (
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                            {work && (
                                <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {work}</span>
                            )}
                            {profile.location_base && (
                                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {profile.location_base}</span>
                            )}
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-x-1.5 text-sm text-muted-foreground">
                        <span><span className="font-medium text-foreground">{profile.post_count}</span> posts</span>
                        <span>·</span>
                        <span><span className="font-medium text-foreground">{profile.trip_count}</span> trips</span>
                        <span>·</span>
                        <span><span className="font-medium text-foreground">{profile.tag_count}</span> tags</span>
                        <span>·</span>
                        <span><span className="font-medium text-foreground">{profile.like_count}</span> likes</span>
                    </div>

                </header>

                {/* ===== tabs ===== */}
                <nav className="flex border-b" role="tablist">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            role="tab"
                            aria-selected={tab === t.key}
                            onClick={() => setTab(t.key)}
                            className={`flex-1 border-b-2 py-3 text-sm font-semibold transition ${
                                tab === t.key
                                    ? "border-foreground text-foreground"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </nav>

                {/* ===== tab content ===== */}
                {tab === "posts" && renderPosts(
                    posts,
                    profile.is_me ? "You haven't posted anything yet." : "No posts yet.",
                    setPosts,
                )}

                {tab === "bookmarks" && renderPosts(bookmarks, "No bookmarks yet.", setBookmarks)}

                {/* "New tag" only on my own profile, inside the Tags tab */}
                {tab === "tags" && profile.is_me && (
                    <div className="border-b px-4 py-3">
                        <Button asChild variant="outline" className="w-full rounded-xl">
                            <Link to="/tags/new"><Plus className="mr-1 h-4 w-4" /> New tag</Link>
                        </Button>
                    </div>
                )}

                {tab === "tags" && (
                    tags === null
                        ? (tabError ? <Centered>{tabError}</Centered> : <Loading />)
                        : tags.length === 0
                            ? <Centered>No tags yet.</Centered>
                            : <div className="divide-y">{tags.map((t) => <TagCard key={t.tag_id} tag={t} />)}</div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
