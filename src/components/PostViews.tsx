import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FeedPost, PostReply } from "@/types/tipes"

// import { useAppDispatch } from "@/store";
// import { addReply, deleteReply } from "@/store/postsSlice";
// import type { FeedPost, PostReply } from "@/store/types";


import {
  Heart, MessageCircle, Share2,
  Bookmark, Trash2, MapPin
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { useCurrentUser } from "@/lib/currentUser";
import { handleOf, initialsOf, relTime, repliesOf, subtreeCount } from "@/lib/feed";

export function ThreadActions({
  liked, onLike, likes, comments, saved, onSave, onReply,
}: {
  liked: boolean; onLike: () => void; likes: number; comments: number;
  saved: boolean; onSave: () => void; onReply?: () => void;
}) {
  const stop = (fn?: () => void) => (e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); fn?.(); };
  return (
    <div className="flex items-center gap-5 pt-1 text-muted-foreground">
      <button onClick={stop(onLike)} aria-label="Like" className="inline-flex items-center gap-1.5 text-xs transition hover:text-destructive">
        <Heart className={`h-[18px] w-[18px] ${liked ? "fill-destructive text-destructive" : ""}`} />
        {likes.toLocaleString()}
      </button>
      <button onClick={stop(onReply)} aria-label="Reply" className="inline-flex items-center gap-1.5 text-xs transition hover:text-primary">
        <MessageCircle className="h-[18px] w-[18px]" /> {comments}
      </button>
      <button onClick={stop()} aria-label="Share" className="inline-flex items-center gap-1.5 text-xs transition hover:text-primary">
        <Share2 className="h-[18px] w-[18px]" />
      </button>
      <button onClick={stop(onSave)} aria-label="Save" className="ml-auto inline-flex items-center transition hover:text-primary">
        <Bookmark className={`h-[18px] w-[18px] ${saved ? "fill-primary text-primary" : ""}`} />
      </button>
    </div>
  );
}

function PollBlock({ post }: { post: FeedPost }) {

  // // data poll dari redux
  // const dispatch = useAppDispatch();
  const me = useCurrentUser();
  const poll = post.poll!;
  const total = poll.options.reduce((n, o) => n + o.votes.length, 0);
  const myVote = poll.options.find((o) => o.votes.includes(me.name))?.id;
  return (
    <div className="space-y-2 rounded-xl border bg-muted/30 p-3" onClick={(e) => e.stopPropagation()}>
      <p className="text-sm font-semibold">{poll.question}</p>
      <div className="space-y-1.5">
        {poll.options.map((o) => {
          const pct = total ? Math.round((o.votes.length / total) * 100) : 0;
          const mine = myVote === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => dispatch(votePoll({ postId: post.id, optionId: o.id, voter: me.name }))}
              className={`relative w-full overflow-hidden rounded-lg border px-3 py-2 text-left text-sm transition ${mine ? "border-primary" : "hover:border-primary/50"
                }`}
            >
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 bg-primary/15"
                style={{ width: `${pct}%` }}
              />
              <span className="relative flex items-center justify-between gap-2">
                <span className="truncate">{o.label}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{pct}%</span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-muted-foreground">
        {total} vote{total === 1 ? "" : "s"}{myVote ? " · you voted" : " · tap an option to vote"}
      </p>
    </div>
  );
}

export function PostBody({ post }: { post: FeedPost }) {
  const kindLabel =
    post.kind === "see" ? "saw something"
      : post.kind === "meet" ? "met someone"
        : post.kind === "expense" ? "expense & receipt"
          : post.kind === "feeling" ? "how it felt"
            : post.kind === "poll" ? "poll"
              : null;
  return (
    <>
      {(kindLabel || post.tripTitle || post.location) && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          {kindLabel && <Badge variant="secondary" className="rounded-full font-normal">{kindLabel}</Badge>}
          {post.visibility === "restricted" && (
            <Badge variant="outline" className="rounded-full font-normal">
              <Lock className="mr-1 h-3 w-3" /> Hidden
            </Badge>
          )}
          {post.tripTitle && <span className="text-primary">#{post.tripTitle.replace(/\s+/g, "")}</span>}
          {post.location && (<span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {post.location}</span>)}
        </div>
      )}

      {post.rating ? (
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} className={`h-4 w-4 ${n <= post.rating! ? "fill-primary text-primary" : "text-muted-foreground/40"}`} />
          ))}
          <span className="ml-1 text-xs text-muted-foreground">{post.rating}/5</span>
        </div>
      ) : null}

      {post.text && (
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">{post.text}</p>
      )}

      {post.poll && post.poll.options.length > 0 && <PollBlock post={post} />}

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
    </>
  );
}

export function ReplyComposer({
  postId, parentId, replyingTo, onDone, autoFocus = true, inputRef,
}: {
  postId: string; parentId?: string; replyingTo: string; onDone?: () => void; autoFocus?: boolean;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
}) {

  // const dispatch = useAppDispatch();
  const me = useCurrentUser();
  const [draft, setDraft] = useState("");

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    // dispatch(addReply({ postId, parentId, author: me.name, text }));
    setDraft("");
    onDone?.();
  };

  return (
    <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
      <div className="flex w-10 shrink-0 justify-center">
        <Avatar className="h-7 w-7">
          <AvatarFallback className="bg-primary text-[10px] font-semibold text-primary-foreground">
            {initialsOf(me.name)}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="min-w-0 flex-1">
        <textarea
          ref={inputRef}
          autoFocus={autoFocus}
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
          placeholder={`Reply to ${handleOf(replyingTo)}...`}
          className="w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-muted-foreground"
        />
        <div className="flex items-center justify-end gap-2 pt-1">
          <button onClick={() => { setDraft(""); onDone?.(); }} className="rounded-full px-3 py-1 text-xs text-muted-foreground hover:text-foreground">
            Cancel
          </button>
          <button onClick={submit} disabled={!draft.trim()} className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground disabled:opacity-40">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}

/** A reply rendered as a thread row. Clicking it opens that reply as its own detail page. */
export function ReplyRow({
  post, reply, depth = 0,
}: {
  post: FeedPost; reply: PostReply; depth?: number;
}) {
  // const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [replying, setReplying] = useState(false);
  const kids = repliesOf(post, reply.id);
  const likes = 3 + (reply.id.charCodeAt(reply.id.length - 1) % 20) + (liked ? 1 : 0);
  const hasBranch = kids.length > 0 || replying;

  return (
    <div className="group/reply relative">
      {hasBranch && (
        <span aria-hidden className="pointer-events-none absolute bottom-2 left-[17px] top-9 w-px rounded-full bg-border" />
      )}
      <div
        role="link"
        tabIndex={0}
        // onClick={() => navigate({ to: "/p/$postId", params: { postId: reply.id } })}
        // onClick={() => navigate({ to: "/p/$postId", params: { postId: reply.id } })}
        onKeyDown={
          (e) => {
            if (e.key === "Enter") {
              // navigate({ to: "/p/$postId", params: { postId: reply.id } })
            };
          }}
        className="flex cursor-pointer gap-3 rounded-lg transition hover:bg-muted/30"
      >
        <div className="flex w-9 shrink-0 flex-col items-center">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-muted text-[10px] font-semibold">{initialsOf(reply.author)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="min-w-0 flex-1 pb-3">
          <div className="flex items-center gap-x-1.5 text-sm">
            <span className="font-semibold">{reply.author}</span>
            <span className="text-xs text-muted-foreground">{relTime(reply.createdAt)}</span>
            {reply.author === post.author && (
              <span className="rounded-full border px-1.5 py-px text-[10px] text-muted-foreground">Author</span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                // dispatch(deleteReply({ postId: post.id, replyId: reply.id }));
              }}
              aria-label="Delete reply"
              className="ml-auto rounded-full p-1 text-muted-foreground opacity-0 transition hover:text-destructive focus:opacity-100 group-hover/reply:opacity-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">{reply.text}</p>
          <ThreadActions
            liked={liked} onLike={() => setLiked((v) => !v)} likes={likes}
            comments={subtreeCount(post, reply.id)} saved={saved} onSave={() => setSaved((v) => !v)}
            onReply={() => setReplying((v) => !v)}
          />
        </div>
      </div>

      {(kids.length > 0 || replying) && (
        <div className="pl-7">
          {replying && (
            <div className="pb-3">
              <ReplyComposer postId={post.id} parentId={reply.id} replyingTo={reply.author} onDone={() => setReplying(false)} />
            </div>
          )}
          {depth < 4
            ? kids.map((k) => <ReplyRow key={k.id} post={post} reply={k} depth={depth + 1} />)
            : kids.length > 0 && (
              <button
                onClick={() => {
                  // navigate({ to: "/p/$postId", params: { postId: reply.id } })
                }}
                className="pb-3 text-xs text-primary"
              >
                View {kids.length} more {kids.length === 1 ? "reply" : "replies"}
              </button>
            )}
        </div>
      )}
    </div>
  );
}