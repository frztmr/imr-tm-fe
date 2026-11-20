import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CornerUpLeft } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ParentPreview, PostBody, PostDates, ThreadActions } from "@/components/PostViews";
import { ReplyForm } from "@/components/ReplyForm";
import { useLike } from "@/lib/useLike";
import { useBookmark } from "@/lib/useBookmark";
import { handleOf, initialsOf, relTime } from "@/lib/feed";
import { getPostDetail, toParentPost } from "@/config/post";
import type { FeedPost, ParentPost } from "@/types/tipes";

// One reply row — replies are posts too, so clicking opens their own detail page
function ReplyItem({ reply }: { reply: FeedPost }) {
    const navigate = useNavigate();
    const { liked, likes, toggle: toggleLike } = useLike(reply);
    const { saved, toggle: toggleSave } = useBookmark(reply);
    const open = () => navigate(`/p/${reply.id}`);

    return (
        <article
            role="link"
            tabIndex={0}
            onClick={open}
            onKeyDown={(e) => { if (e.key === "Enter") open(); }}
            className="flex cursor-pointer gap-3 px-4 py-3 transition hover:bg-muted/30"
        >
            <Avatar className="mt-0.5 h-8 w-8 shrink-0">
                <AvatarFallback className="bg-muted text-[10px] font-semibold">{initialsOf(reply.author)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-x-1.5 text-sm">
                    <span className="font-semibold">{reply.author}</span>
                    <span className="text-muted-foreground">{handleOf(reply.author)}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{relTime(reply.createdAt)}</span>
                </div>
                <PostBody post={reply} />
                <PostDates createdAt={reply.createdAt} eventDate={reply.eventDate} showPosted />
                <ThreadActions
                    liked={liked} onLike={toggleLike} likes={likes}
                    comments={reply.replyCount ?? 0} saved={saved} onSave={toggleSave}
                    onReply={open}
                />
            </div>
        </article>
    );
}

export default function PostDetail() {
    const { postId = "" } = useParams<{ postId: string }>();
    const navigate = useNavigate();

    const [post, setPost] = useState<FeedPost | null>(null);
    const [parent, setParent] = useState<ParentPost | null>(null);
    const [replies, setReplies] = useState<FeedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    // hooks can't be conditional → feed a placeholder until the post is loaded
    const like = useLike(post ?? { id: postId, likeCount: 0, likedByMe: false });
    const bookmark = useBookmark(post ?? { id: postId, bookmarkedByMe: false });
    const [reloadKey, setReloadKey] = useState(0); // bump to refetch after replying
    const replyBoxRef = useRef<HTMLDivElement>(null);

    // reset per-post UI state when moving to another post
    useEffect(() => {
        setLoading(true);
    }, [postId]);

    // ===== GET /post/detail/:post_id =====
    useEffect(() => {
        let cancelled = false;
        setError("");

        getPostDetail(postId)
            .then(({ post, replies }) => {
                if (cancelled) return;
                setPost(post);
                setReplies(replies);
                if (!post) setError("Post not found or has been deleted.");
            })
            .catch((err) => {
                console.log("err at get post detail", err);
                if (!cancelled) setError("Failed to load this post.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [postId, reloadKey]);

    // ===== parent post (when this post is a reply) =====
    const parentId = post?.parentId;
    useEffect(() => {
        setParent(null);
        if (!parentId) return;
        let cancelled = false;
        getPostDetail(parentId)
            .then(({ post: p }) => {
                if (!cancelled && p) setParent(toParentPost(p));
            })
            .catch((err) => console.log("err at get parent post", err)); // falls back to "View parent post" link
        return () => {
            cancelled = true;
        };
    }, [parentId]);

    return (
        <div className="mx-auto max-w-xl">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                {loading && (
                    <p className="px-4 py-6 text-center text-sm text-muted-foreground">Loading post…</p>
                )}

                {!loading && error && (
                    <p className="px-4 py-6 text-center text-sm text-muted-foreground">{error}</p>
                )}

                {!loading && post && (
                    <>
                        <article className="space-y-3 px-4 py-4">
                            {/* reply → parent post on top, connected by a line */}
                            {post.parentId && (
                                parent ? (
                                    <div className="-mb-3">
                                        <ParentPreview parent={parent} />
                                    </div>
                                ) : (
                                    <Link
                                        to={`/p/${post.parentId}`}
                                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                    >
                                        <CornerUpLeft className="h-3.5 w-3.5" /> View parent post
                                    </Link>
                                )
                            )}

                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                                        {initialsOf(post.author)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-sm">
                                    <div className="font-semibold">{post.author}</div>
                                    <div className="text-muted-foreground">
                                        {handleOf(post.author)} · {relTime(post.createdAt)}
                                    </div>
                                    {parent && (
                                        <div className="text-xs text-muted-foreground">
                                            Replying to <span className="text-primary">{handleOf(parent.author)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <PostBody post={post} />

                            <PostDates createdAt={post.createdAt} eventDate={post.eventDate} showPosted />

                            <ThreadActions
                                liked={like.liked} onLike={like.toggle} likes={like.likes}
                                comments={Math.max(post.replyCount ?? 0, replies.length)} saved={bookmark.saved} onSave={bookmark.toggle}
                                onReply={() => replyBoxRef.current?.querySelector("textarea")?.focus()}
                            />
                        </article>

                        {/* ===== Reply form ===== */}
                        <div ref={replyBoxRef} className="border-t">
                            <ReplyForm
                                parentId={post.id}
                                visibility={post.visibility}
                                replyingTo={post.author}
                                onReplied={() => setReloadKey((k) => k + 1)}
                            />
                        </div>

                        <div className="border-t">
                            <div className="px-4 py-2 text-xs font-semibold uppercase text-muted-foreground">
                                Replies ({replies.length})
                            </div>
                            {replies.length === 0 ? (
                                <p className="px-4 pb-6 text-sm text-muted-foreground">No replies yet.</p>
                            ) : (
                                <div className="divide-y">
                                    {replies.map((r) => <ReplyItem key={r.id} reply={r} />)}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
