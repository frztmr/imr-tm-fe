import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import Dashboard from './Dashboard';


// import { useAppSelector } from "@/store";
// import { useAppDispatch } from "@/store";
// import type { Trip, FeedPost } from "@/store/types";
// import { deletePost } from "@/store/postsSlice";

//Types
import { Trip, FeedPost } from "@/types/tipes";

import NavBar from '@/components/navBar'
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { ReplyComposer, ReplyRow, ThreadActions } from "@/components/PostViews";
import {
  handleOf, initialsOf,
  relTime, repliesOf, subtreeCount
} from "@/lib/feed";

import { Card, CardContent } from "@/components/ui/card";

import {
  Heart, MessageCircle, Share2,
  Bookmark, MapPin, Sparkles,
  TrendingUp, FileText, PenSquare, Trash2
} from "lucide-react";



const photos = [];

let booted = false;
const SETTINGS_KEY = "imi.settings";

//redux
// const dispatch = useAppDispatch();

function flagOf(country: string) {
  const map: Record<string, string> = {
    Thailand: "🇹🇭", Philippines: "🇵🇭", Japan: "🇯🇵", Indonesia: "🇮🇩",
    Vietnam: "🇻🇳", Malaysia: "🇲🇾", Singapore: "🇸🇬", "South Korea": "🇰🇷",
    China: "🇨🇳", India: "🇮🇳", Australia: "🇦🇺",
  };
  return map[country] ?? "🌏";
}


function articleFor(t: Trip) {
  const compNames = t.competitors.map((c) => c.brand).join(", ") || "no major competitors logged";
  const audit = t.retailAudits[0];
  const sentiment = t.sentiment[0]?.note;
  const partner = t.partnerLogs[0];
  const cities = (t.cities ?? []).join(", ");
  return [
    `Just wrapped a market sweep across ${cities}, ${t.country}. The shelves told a clear story — ${compNames} is what we're up against, and the pricing band sits around ${audit?.shelfPrice ?? "the local sweet spot"} per pack.`,
    sentiment ? `Consumers we talked to said: "${sentiment}" — that's gold for our R&D team.` : null,
    partner ? `Met with ${partner.partner}. ${partner.notes}${partner.painPoint ? ` Their biggest pain right now: ${partner.painPoint}.` : ""}` : null,
    t.report.adjustments ? `Action item: ${t.report.adjustments}.` : null,
    t.report.forecastVolume ? `Forecast: ${t.report.forecastVolume.toLocaleString()} units in the next cycle.` : null,
  ].filter(Boolean).join("\n\n");
}


function FeedCard({ trip }: { trip: Trip }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const likes = 80 + (trip.id.charCodeAt(trip.id.length - 1) % 60) + (liked ? 1 : 0);
  const comments = 5 + (trip.retailAudits.length + trip.partnerLogs.length) * 3;
  const photos = trip.retailAudits.flatMap((a) => a.photos ?? []);
  const text = articleFor(trip);
  const citiesLabel = (trip.cities ?? []).join(", ");
  const tags = [
    `#${trip.country.replace(/\s+/g, "")}`,
    ...(trip.cities ?? []).map((c) => `#${c.replace(/\s+/g, "")}`),
    "#NoodleMarket",
    trip.status === "completed" ? "#FieldReport" : "#OnTheGround",
  ];

  const openTrip = () =>
    navigate(`/trips/${trip.id}/article`);

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={openTrip}
      onKeyDown={(e) => { if (e.key === "Enter") openTrip(); }}
      className="flex cursor-pointer gap-3 px-4 py-4 transition hover:bg-muted/30"
    >
      <Avatar className="mt-0.5 h-10 w-10 shrink-0">
        <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
          {initialsOf(trip.assignee)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-x-1.5 text-sm">
          <span className="font-semibold">{trip.assignee}</span>
          <span className="text-muted-foreground">{handleOf(trip.assignee)}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{relTime(trip.startDate)}</span>
          <span className="ml-auto text-lg leading-none" aria-hidden>{flagOf(trip.country)}</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> {citiesLabel}{citiesLabel ? ", " : ""}{trip.country}
        </div>

        <div className="space-y-2 text-[15px] leading-relaxed">
          <p className="font-semibold">{trip.title}</p>
          {text.split("\n\n").map((p, i) => (
            <p key={i} className="whitespace-pre-wrap text-foreground/90">{p}</p>
          ))}
        </div>

        <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-primary">
          {tags.map((t) => (<span key={t}>{t}</span>))}
        </div>

        <PhotoCarousel photos={photos} alt={`${citiesLabel} field photo`} />

        <ThreadActions
          liked={liked} onLike={() => setLiked((v) => !v)} likes={likes}
          comments={comments} saved={saved} onSave={() => setSaved((v) => !v)}
          onReply={openTrip}
        />

        <Link
          to={`/trips/${trip.id}`}
          // params={{ tripId: trip.id }}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          <FileText className="h-3.5 w-3.5" /> Open full report
        </Link>
      </div>
    </article>
  );
}

function PostCard({ post }: { post: FeedPost }) {

  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [replying, setReplying] = useState(false);
  const likes = 12 + (post.id.charCodeAt(post.id.length - 1) % 40) + (liked ? 1 : 0);
  const kindLabel = post.kind === "see" ? "saw something" : post.kind === "meet" ? "met someone" : null;
  const replies = repliesOf(post, undefined);
  const bonded = replies.length > 0 || replying;
  const open = () => navigate(`/p/${post.id}`);

  return (
    <article className="px-4 py-4 transition hover:bg-muted/30">
      <div
        role="link"
        tabIndex={0}
        onClick={open}
        onKeyDown={(e) => { if (e.key === "Enter") open(); }}
        className="group flex cursor-pointer gap-3"
      >
        <div className="flex w-10 shrink-0 flex-col items-center">
          <Avatar className="mt-0.5 h-10 w-10">
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              {initialsOf(post.author)}
            </AvatarFallback>
          </Avatar>
          {bonded && <div className="mt-2 w-0.5 flex-1 rounded-full bg-border" />}
        </div>
        <div className="min-w-0 flex-1 space-y-2 pb-1">
          <div className="flex flex-wrap items-center gap-x-1.5 text-sm">
            <Link
              to="/u/$userId"
              // params={{ userId: encodeURIComponent(post.author) }}
              onClick={(e) => e.stopPropagation()}
              className="font-semibold hover:underline"
            >
              {post.author}
            </Link>
            <span className="text-muted-foreground">{handleOf(post.author)}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{relTime(post.createdAt)}</span>
            <button
              // onClick={(e) => { e.stopPropagation(); dispatch(deletePost(post.id)); }}
              aria-label="Delete post"
              className="ml-auto rounded-full p-1 text-muted-foreground opacity-0 transition hover:text-destructive focus:opacity-100 group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {(kindLabel || post.tripTitle || post.location) && (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              {kindLabel && (
                <Badge variant="secondary" className="rounded-full font-normal">{kindLabel}</Badge>
              )}
              {post.tripTitle && <span className="text-primary">#{post.tripTitle.replace(/\s+/g, "")}</span>}
              {post.location && (<span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {post.location}</span>)}
            </div>
          )}

          {post.text && (
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">{post.text}</p>
          )}

          {(post.contact || post.impression || post.expiresAt) && (
            <div className="rounded-xl border bg-muted/40 p-3 text-xs text-muted-foreground">
              {post.contact && <div>With <span className="text-foreground">{post.contact}</span></div>}
              {post.impression && <div>Impression — <span className="text-foreground">{post.impression}</span></div>}
              {post.expiresAt && <div>Valid until <span className="text-foreground">{post.expiresAt}</span></div>}
            </div>
          )}

          <PhotoCarousel photos={post.photos} alt="Post photo" />

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-primary">
              {post.tags.map((t) => (<span key={t}>#{t.replace(/^#/, "")}</span>))}
            </div>
          )}

          <ThreadActions
            liked={liked} onLike={() => setLiked((v) => !v)} likes={likes}
            comments={subtreeCount(post, undefined)} saved={saved} onSave={() => setSaved((v) => !v)}
            onReply={() => setReplying((v) => !v)}
          />
        </div>
      </div>

      {bonded && (
        <div className="mt-1">
          {replies.map((r, i) => (
            <ReplyRow key={r.id} post={post} reply={r} showConnector={i < replies.length - 1 || replying} />
          ))}
          {replying && (
            <ReplyComposer postId={post.id} replyingTo={post.author} onDone={() => setReplying(false)} />
          )}
        </div>
      )}
    </article>
  );
}

const Index = () => {
  //nyalakan redux ini hanya ketika sudah siap
  // const trips = useAppSelector((s) => s.trips.trips);
  // const posts = useAppSelector((s) => s.posts.posts);
  const [tab, setTab] = useState<"foryou" | "following">("foryou");

  const trips = [];
  const posts = [];

  const items = useMemo(() => {
    const tripItems = trips
      .filter((t) => tab === "foryou" || t.status !== "planned")
      .map((t) => ({ kind: "trip" as const, id: `trip-${t.id}`, date: t.startDate, trip: t }));
    const postItems = posts.map((p) => ({
      kind: "post" as const, id: `post-${p.id}`, date: p.createdAt.slice(0, 10), post: p,
    }));
    return [...tripItems, ...postItems].sort((a, b) => (b.date > a.date ? 1 : -1));
  }, [trips, posts, tab]);

  return <>
    
    <div className="mx-auto max-w-xl">

      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Sparkles className="h-5 w-5 text-primary" /> For You
          </h1>
          <p className="text-sm text-muted-foreground">Field stories from the IMI team.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/reports"
            className="hidden items-center gap-1 text-sm text-primary hover:underline sm:inline-flex"
          >
            <TrendingUp className="h-4 w-4" /> Articles
          </Link>
          <Link
            to="/feed/new"
            className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow hover:opacity-90"
          >
            <PenSquare className="h-4 w-4" /> New Post
          </Link>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 rounded-full bg-muted p-1 text-sm font-medium">
        {(["foryou", "following"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 transition ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
          >
            {t === "foryou" ? "For You" : "Following"}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <Link
          to="/feed/new"
          className="flex items-center gap-3 border-b px-4 py-3 text-sm text-muted-foreground transition hover:bg-muted/40"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-muted text-[10px] font-semibold">IMI</AvatarFallback>
          </Avatar>
          <span className="flex-1">What's happening in the field?</span>
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">Post</span>
        </Link>
        <div className="divide-y">
          {items.map((it) =>
            it.kind === "trip" ? (
              <FeedCard key={it.id} trip={it.trip} />
            ) : (
              <PostCard key={it.id} post={it.post} />
            ),
          )}
        </div>
      </div>
    </div>;
    {/* <NavBar /> */}
  </>

};

export default Index;
