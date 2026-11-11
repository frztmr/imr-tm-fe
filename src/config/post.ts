import Axios from "./axios";
import type { FeedPost } from "@/types/tipes";

// Row shape returned by BE getPostSql.getSimplePost
export type SimplePostRow = {
    post_id?: string;            // not selected by BE yet — see note in mapSimplePost
    uname: string;
    public_share_id: string;
    body: string | null;
    created_at: string;
    visibility: string | null;
    location_literal: string | null;
    longitude: number | null;
    latitude: number | null;
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
    text: row.body ?? "",
    location: row.location_literal ?? "",
    tags: [],
    photos: [],
    kind: "post",
});

// GET /post/simple_post — fetch the feed posts from backend
export const getSimplePost = async (): Promise<FeedPost[]> => {
    const res = await Axios.get("/post/simple_post");
    const rows: SimplePostRow[] = res.data?.resGetSimplePost?.rows ?? [];
    return rows.map(mapSimplePost);
}
