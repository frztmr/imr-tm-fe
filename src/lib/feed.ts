import type { FeedPost, PostReply } from "@/types/types";

export function initialsOf(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export function handleOf(name: string) {
  return "@" + name.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function relTime(iso: string) {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return iso;
  const s = Math.max(1, Math.floor((Date.now() - t) / 1000));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 604800) return `${Math.floor(s / 86400)}d`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function repliesOf(post: FeedPost | undefined, parentId?: string) {
  return (post?.replies ?? []).filter((r) => (r.parentId ?? undefined) === parentId);
}

/** Total replies in the subtree below a node (post root when parentId is undefined). */
export function subtreeCount(post: FeedPost | undefined, parentId?: string): number {
  const kids = repliesOf(post, parentId);
  return kids.reduce((n, k) => n + 1 + subtreeCount(post, k.id), 0);
}

/** Finds the post that owns a node id (post id or reply id). */
export function findNode(posts: FeedPost[], nodeId: string) {
  const post = posts.find((p) => p.id === nodeId);
  if (post) return { post, reply: undefined as PostReply | undefined };
  for (const p of posts) {
    const reply = (p.replies ?? []).find((r) => r.id === nodeId);
    if (reply) return { post: p, reply };
  }
  return { post: undefined, reply: undefined };
}

/** Chain of nodes from the root post down to (excluding) the focused reply. */
export function ancestorsOf(post: FeedPost, reply?: PostReply): PostReply[] {
  const chain: PostReply[] = [];
  let cur = reply?.parentId;
  while (cur) {
    const parent = (post.replies ?? []).find((r) => r.id === cur);
    if (!parent) break;
    chain.unshift(parent);
    cur = parent.parentId;
  }
  return chain;
}