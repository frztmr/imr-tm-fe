import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Heart, MessageCircle, Share2, Bookmark, Trash2, MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { useAppDispatch } from "@/store";
import { addReply, deleteReply } from "@/store/postsSlice";
import { useCurrentUser } from "@/lib/currentUser";
import { handleOf, initialsOf, relTime, repliesOf, subtreeCount } from "@/lib/feed";
import type { FeedPost, PostReply } from "@/store/types";

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

export function PostBody({ post }: { post: FeedPost }) {
  const kindLabel = post.kind === "see" ? "saw something" : post.kind === "meet" ? "met someone" : null;
  return (
    <>
      {(kindLabel || post.tripTitle || post.location) && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          {kindLabel && <Badge variant="secondary" className="rounded-full font-normal">{kindLabel}</Badge>}
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
    </>
  );
}

export function ReplyComposer({
  postId, parentId, replyingTo, onDone, autoFocus = true, inputRef,
}: {
  postId: string; parentId?: string; replyingTo: string; onDone?: () => void; autoFocus?: boolean;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const dispatch = useAppDispatch();
  const me = useCurrentUser();
  const [draft, setDraft] = useState("");

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    dispatch(addReply({ postId, parentId, author: me.name, text }));
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
  post, reply, showConnector,
}: {
  post: FeedPost; reply: PostReply; showConnector: boolean;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [replying, setReplying] = useState(false);
  const kids = repliesOf(post, reply.id);
  const likes = 3 + (reply.id.charCodeAt(reply.id.length - 1) % 20) + (liked ? 1 : 0);

  return (
    <div className="group/reply">
      <div
        role="link"
        tabIndex={0}
        onClick={() => navigate({ to: "/p/$postId", params: { postId: reply.id } })}
        onKeyDown={(e) => { if (e.key === "Enter") navigate({ to: "/p/$postId", params: { postId: reply.id } }); }}
        className="flex cursor-pointer gap-3 transition hover:bg-muted/30"
      >
        <div className="flex w-10 shrink-0 flex-col items-center">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-muted text-[10px] font-semibold">{initialsOf(reply.author)}</AvatarFallback>
          </Avatar>
          {(showConnector || replying) && <div className="mt-1.5 w-0.5 flex-1 rounded-full bg-border" />}
        </div>
        <div className="min-w-0 flex-1 pb-3">
          <div className="flex items-center gap-x-1.5 text-sm">
            <span className="font-semibold">{reply.author}</span>
            <span className="text-muted-foreground">{handleOf(reply.author)}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{relTime(reply.createdAt)}</span>
            <button
              onClick={(e) => { e.stopPropagation(); dispatch(deleteReply({ postId: post.id, replyId: reply.id })); }}
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
          {kids.length > 0 && (
            <div className="pt-1 text-xs text-primary">
              View {kids.length} {kids.length === 1 ? "reply" : "replies"}
            </div>
          )}
        </div>
      </div>
      {replying && (
        <div className="pb-3">
          <ReplyComposer postId={post.id} parentId={reply.id} replyingTo={reply.author} onDone={() => setReplying(false)} />
        </div>
      )}
    </div>
  );
}