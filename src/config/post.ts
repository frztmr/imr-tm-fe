import Axios from "./axios";
import type { FeedPost, ParentPost } from "@/types/tipes";

// Row shape returned by BE getPostSql.getSimplePost
export type SimplePostRow = {
    post_id?: string;
    parent_id?: string | null;
    root_id?: string | null;     // only in /post/detail rows
    event_date?: string | null;
    // parent post info — only in /post/simple_post rows that are replies
    parent_title?: string | null;
    parent_body?: string | null;
    parent_created_at?: string | null;
    parent_event_date?: string | null;
    parent_uname?: string | null;
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
    eventDate: row.event_date || undefined,
    title: row.title?.trim() || undefined,
    text: row.body ?? "",
    location: row.location_literal ?? "",
    tags: [],
    photos: [],
    kind: "post",
    likeCount: Number(row.like_count) || 0,
    replyCount: Number(row.reply_count) || 0,
    parentId: row.parent_id || undefined,
    rootId: row.root_id || undefined,
    // parent post preview (only when the parent is still available)
    parent: row.parent_id && row.parent_uname
        ? {
            id: row.parent_id,
            author: row.parent_uname,
            title: row.parent_title?.trim() || undefined,
            text: row.parent_body ?? "",
            createdAt: row.parent_created_at ?? "",
            eventDate: row.parent_event_date || undefined,
        }
        : undefined,
});

// Turn a full post into the small parent-preview shape
export const toParentPost = (p: FeedPost): ParentPost => ({
    id: p.id,
    author: p.author,
    title: p.title,
    text: p.text,
    createdAt: p.createdAt,
    eventDate: p.eventDate,
});

// GET /post/simple_post — fetch the feed posts from backend
export const getSimplePost = async (): Promise<FeedPost[]> => {
    const res = await Axios.get("/post/simple_post");
    // BE response: { msg, posts: SimplePostRow[] }
    const rows: SimplePostRow[] = Array.isArray(res.data?.posts) ? res.data.posts : [];
    return rows.map(mapSimplePost);
}

// POST /upload — upload one file, BE returns { id, url, name }
export const uploadFile = async (file: File): Promise<{ id: string; url: string; name: string }> => {
    const form = new FormData();
    form.append("file", file);
    const res = await Axios.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

export type ReplyPayload = {
    parentId: string;        // post being replied to
    text: string;
    images: File[];
    files: File[];
    latitude: number;
    longitude: number;
    locationAccuracy: number;
    visibility?: string;
};

// Reply to a post. Uploads files first, then POST /post/new_reply_post
export const replyPost = async (p: ReplyPayload) => {
    const photos: { id: string; url: string; name: string }[] = [];
    for (const f of p.images) photos.push(await uploadFile(f));

    const attachments: { name: string; url: string; size: number; mimeType: string }[] = [];
    for (const f of p.files) {
        const up = await uploadFile(f);
        attachments.push({ name: up.name, url: up.url, size: f.size, mimeType: f.type });
    }

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    // only the fields a reply actually needs
    return Axios.post("/post/new_reply_post", {
        parent_id: p.parentId,
        kind: "reply",
        eventDate: today,
        text: p.text.trim() || null,
        latitude: p.latitude,
        longitude: p.longitude,
        visibility: p.visibility ?? "everyone",
        photos,
        attachments,
    });
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
