import Axios from "./axios";
import type { FeedPost } from "@/types/tipes";

// Row shape returned by BE getPostSql.getSimplePost
export type SimplePostRow = {
    post_id?: string;
    parent_id?: string | null;   // only in /post/detail rows
    root_id?: string | null;     // only in /post/detail rows
    uname: string;
    public_share_id: string;
    title: string | null;        // optional post title
    body: string | null;
    created_at: string;
    visibility: string | null;
    location_literal: string | null;
    longitude: string | null;    // pg numeric → comes as string, e.g. "106.822465"
    latitude: string | null;     // pg numeric → comes as string, e.g. "-6.208441"
    like_count: number | string | null;  // string if the column/COUNT is bigint
    reply_count: number | null;
    repost_count: number | null;
    is_edited: boolean | null;
};

// Convert a BE row into the FeedPost shape the feed UI already uses
const mapSimplePost = (row: SimplePostRow, index: number): FeedPost => ({
    // BE doesn't return the post id yet; fall back to a key that is unique per page load
    id: row.post_id ?? `${row.public_share_id}-${row.created_at}-${index}`,
    author: row.uname,
    createdAt: row.created_at,
    title: row.title?.trim() || undefined,
    text: row.body ?? "",
    location: row.location_literal ?? "",
    tags: [],
    photos: [],
    kind: "post",
    likeCount: Number(row.like_count) || 0,
    replyCount: Number(row.reply_count) || 0,
    parentId: row.parent_id || undefined,
});

// GET /post/simple_post — fetch the feed posts from backend
export const getSimplePost = async (): Promise<FeedPost[]> => {
    const res = await Axios.get("/post/simple_post");
    // BE response: { msg, posts: SimplePostRow[] }
    const rows: SimplePostRow[] = Array.isArray(res.data?.posts) ? res.data.posts : [];
    return rows.map(mapSimplePost);
}

// GET /post/detail/:post_id
// BE response: { msg, post_parent: [the post itself], post_root: [direct replies (parent_id = post_id)] }
export const getPostDetail = async (
    postId: string
): Promise<{ post: FeedPost | null; replies: FeedPost[] }> => {
    const res = await Axios.get(`/post/detail/${encodeURIComponent(postId)}`);
    const postRows: SimplePostRow[] = Array.isArray(res.data?.post_parent) ? res.data.post_parent : [];
    const replyRows: SimplePostRow[] = Array.isArray(res.data?.post_root) ? res.data.post_root : [];

    const replies = replyRows
        .map(mapSimplePost)
        .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)); // oldest reply first

    return {
        post: postRows.length ? mapSimplePost(postRows[0], 0) : null,
        replies,
    };
}
