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
    is_liked?: boolean | null;           // whether the current user already liked this post
    liked_by_me?: boolean | null;        // older name, kept as fallback
    is_bookmarked?: boolean | null;      // whether the current user bookmarked this post
    is_deletable?: boolean | null;       // whether the current user may delete this post
    reply_count: number | null;
    repost_count: number | null;
    is_edited: boolean | null;
};

// pg numeric comes as string → number; undefined when missing / invalid / out of range
const toCoord = (v: string | number | null | undefined, limit: number): number | undefined => {
    if (v === null || v === undefined || v === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) && Math.abs(n) <= limit ? n : undefined;
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
    location: row.location_literal?.trim() ?? "",
    latitude: toCoord(row.latitude, 90),
    longitude: toCoord(row.longitude, 180),
    tags: [],
    photos: [],
    kind: "post",
    likeCount: Number(row.like_count) || 0,
    likedByMe: (row.is_liked ?? row.liked_by_me) === true,
    bookmarkedByMe: row.is_bookmarked === true,
    isDeletable: row.is_deletable === true,
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

// =========================================================
// FILE UPLOAD
// 1. POST /post/upload_file (multipart, field "files")  → file_id per file (status "queued")
// 2. GET  /post/upload_status?ids=a,b,c                  → poll until ready / failed
// 3. send file_id arrays as `photos` / `attachments` in new_post / new_reply_post
// 4. GET  /post/file/:file_id                            → the file (img src / download)
// =========================================================

// mirrors BE config/storage.ts (ALLOWED_POST_FILES, UPLOAD_MAX_FILE_MB, UPLOAD_MAX_FILES)
export const UPLOAD_MAX_FILE_SIZE = 25 * 1024 * 1024;
export const UPLOAD_MAX_FILES = 10; // per request
export const PHOTO_EXTS = ["jpg", "jpeg", "png", "webp", "gif"];
export const ATTACHMENT_EXTS = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv"];
export const PHOTO_ACCEPT = PHOTO_EXTS.map((e) => `.${e}`).join(",");
export const ATTACHMENT_ACCEPT = ATTACHMENT_EXTS.map((e) => `.${e}`).join(",");

export const fileExt = (name: string) => (name.split(".").pop() ?? "").toLowerCase();
export const isAllowedPhoto = (f: File) => PHOTO_EXTS.includes(fileExt(f.name));
export const isAllowedAttachment = (f: File) => ATTACHMENT_EXTS.includes(fileExt(f.name));

export type UploadStatus = "queued" | "processing" | "ready" | "failed";

export type UploadedFile = {
    file_id: string;
    kind: "photo" | "attachment";
    original_name: string;
    size_bytes: number;
    status: UploadStatus;
    error?: string | null;
};

// URL of an uploaded file. Works directly as <img src> / <a href> (login cookie is sent).
export const fileUrl = (fileId: string) =>
    `${(Axios.defaults.baseURL ?? "").replace(/\/$/, "")}/post/file/${encodeURIComponent(fileId)}`;

// POST /post/upload_file — BE takes max UPLOAD_MAX_FILES per request, so send in batches.
// Returned in the same order as `files`.
export const uploadFiles = async (
    files: File[],
    onProgress?: (percent: number) => void
): Promise<UploadedFile[]> => {
    if (files.length === 0) return [];

    const totalBytes = files.reduce((n, f) => n + f.size, 0) || 1;
    let doneBytes = 0;
    const out: UploadedFile[] = [];

    for (let i = 0; i < files.length; i += UPLOAD_MAX_FILES) {
        const batch = files.slice(i, i + UPLOAD_MAX_FILES);
        const batchBytes = batch.reduce((n, f) => n + f.size, 0);

        const form = new FormData();
        batch.forEach((f) => form.append("files", f)); // BE field name: "files"

        const res = await Axios.post("/post/upload_file", form, {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 5 * 60 * 1000, // big files take longer than the default 5s
            onUploadProgress: (e) => {
                if (!onProgress || !e.total) return;
                const sent = doneBytes + (e.loaded / e.total) * batchBytes;
                onProgress(Math.min(100, Math.round((sent / totalBytes) * 100)));
            },
        });
        doneBytes += batchBytes;
        if (Array.isArray(res.data?.files)) out.push(...res.data.files);
    }
    return out;
}

// GET /post/upload_status?ids=a,b,c
export const getUploadStatus = async (
    ids: string[]
): Promise<{ files: UploadedFile[]; allDone: boolean }> => {
    const res = await Axios.get("/post/upload_status", { params: { ids: ids.join(",") } });
    return {
        files: Array.isArray(res.data?.files) ? res.data.files : [],
        allDone: res.data?.all_done === true,
    };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Poll upload_status until every file is ready / failed, or until the timeout.
 * Throws if any file failed processing (names in the message).
 * On timeout it just returns — BE still attaches files that are queued/processing.
 */
export const waitForUploads = async (ids: string[], timeoutMs = 60_000, intervalMs = 1000) => {
    if (ids.length === 0) return;
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
        const { files, allDone } = await getUploadStatus(ids);
        const failed = files.filter((f) => f.status === "failed");
        if (failed.length) {
            throw new Error(`Couldn't process: ${failed.map((f) => f.original_name).join(", ")}`);
        }
        if (allDone) return;
        await sleep(intervalMs);
    }
}

/**
 * Upload photos + attachments, wait for processing, return the file_id arrays
 * to send as `photos` / `attachments` in new_post / new_reply_post.
 */
export const uploadPostFiles = async (
    photos: File[],
    attachments: File[],
    onProgress?: (percent: number) => void
): Promise<{ photos: string[]; attachments: string[] }> => {
    const all = [...photos, ...attachments];
    if (all.length === 0) return { photos: [], attachments: [] };

    const uploaded = await uploadFiles(all, onProgress);
    await waitForUploads(uploaded.map((f) => f.file_id));

    return {
        photos: uploaded.filter((f) => f.kind === "photo").map((f) => f.file_id),
        attachments: uploaded.filter((f) => f.kind === "attachment").map((f) => f.file_id),
    };
}

// pull the BE's { msg } out of an axios error (e.g. "file too large. max 25 MB")
export const uploadErrorMessage = (err: unknown, fallback = "Upload failed. Please try again.") => {
    const e = err as { response?: { data?: { msg?: string } }; message?: string };
    return e?.response?.data?.msg || e?.message || fallback;
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
    const { photos, attachments } = await uploadPostFiles(p.images, p.files); // → file_id arrays

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

// POST /post/like_unlike/:post_id — toggles like for the current user.
// BE may return { liked, like_count }; if it doesn't, the caller keeps its optimistic state.
export const likeUnlikePost = async (
    postId: string
): Promise<{ liked?: boolean; likeCount?: number }> => {
    const res = await Axios.post(`/post/like_unlike/${encodeURIComponent(postId)}`);
    const d = res.data ?? {};
    return {
        liked: typeof d.liked === "boolean" ? d.liked : undefined,
        likeCount: d.like_count != null && !Number.isNaN(Number(d.like_count)) ? Number(d.like_count) : undefined,
    };
}

// POST /post/bookmark_unbookmark/:post_id — toggles bookmark for the current user.
// BE may return { bookmarked }; if it doesn't, the caller keeps its optimistic state.
export const bookmarkUnbookmarkPost = async (
    postId: string
): Promise<{ bookmarked?: boolean }> => {
    const res = await Axios.post(`/post/bookmark/${encodeURIComponent(postId)}`);

    const d = res.data ?? {};
    return {
        bookmarked: typeof d.bookmarked === "boolean" ? d.bookmarked
            : typeof d.is_bookmarked === "boolean" ? d.is_bookmarked
                : undefined,
    };
}

// DELETE /post/delete/:post_id — delete a post (only when is_deletable is true)
export const deletePost = async (postId: string) => {
    return Axios.delete(`/post/delete/${encodeURIComponent(postId)}`);
}

type PostFileRow = {
    file_id: string;
    kind: "photo" | "attachment";
    original_name: string | null;
    mime: string | null;
    size_bytes: number | string | null;
};

// GET /post/detail/:post_id
// BE response: { msg, post_parent: [the post itself], post_root: [direct replies (parent_id = post_id)] }
export const getPostDetail = async (
    postId: string
): Promise<{ post: FeedPost | null; replies: FeedPost[] }> => {
    const res = await Axios.get(`/post/detail/${encodeURIComponent(postId)}`);
    const postRows: SimplePostRow[] = Array.isArray(res.data?.post_parent) ? res.data.post_parent : [];
    const replyRows: SimplePostRow[] = Array.isArray(res.data?.post_root) ? res.data.post_root : [];

    // files of the main post: { file_id, kind, original_name, mime, size_bytes, metadata }[]
    const fileRows: PostFileRow[] = Array.isArray(res.data?.files) ? res.data.files : [];

    const replies = replyRows
        .map(mapSimplePost)
        .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)); // oldest reply first

    const post = postRows.length ? mapSimplePost(postRows[0], 0) : null;
    if (post) {
        post.photos = fileRows
            .filter((f) => f.kind === "photo")
            .map((f) => ({ id: f.file_id, url: fileUrl(f.file_id), caption: f.original_name ?? "" }));
        post.attachments = fileRows
            .filter((f) => f.kind === "attachment")
            .map((f) => ({
                id: f.file_id,
                name: f.original_name ?? "file",
                url: fileUrl(f.file_id),
                size: Number(f.size_bytes) || 0,
                mime: f.mime ?? "",
            }));
    }

    return { post, replies };
}
