import Axios from "./axios";
import { mapSimplePost, type SimplePostRow } from "./post";
import type { FeedPost } from "@/types/tipes";

// =========================================================
// /users/* — profile page
// every GET takes ?uname=xxx to look at another user (empty = me),
// except /users/bookmark which is always the logged-in user's own.
// =========================================================

export type UserProfile = {
    uname: string;
    public_share_id: string;
    role_name: string | null;
    person_id: string | null;
    full_name: string | null;
    job_title: string | null;
    division: string | null;
    department: string | null;
    location_base: string | null;
    bio: string | null;
    post_count: number;
    like_count: number;
    trip_count: number;
    tag_count: number;
    is_me: boolean;
    // only sent when is_me
    employee?: {
        nik: string | null;
        level_name: string | null;
        grade: string | null;
        cost_centre: string | null;
    };
};

export type UserTag = {
    tag_id: string;
    tag_type: string;                 // simple | person | event | country | trip
    tag_type_name: string | null;
    name: string;
    slug: string;
    description: string | null;
    country: string | null;
    cities: string[] | null;
    start_date: string | null;
    end_date: string | null;
    usable_from: string | null;
    usable_until: string | null;
    join_policy: string | null;
    trip_mode: string | null;
    local_currency: string | null;
    created_at: string;
    owner_uname: string;
    role: string;                     // owner | member | ...
    member_status: string;            // active | pending
    joined_at: string | null;
    is_usable: boolean;
    trip_status: "planned" | "in_progress" | "completed" | null;
    member_count: number;
    dummy_member_count: number;
    post_count: number;
    has_approval_file: boolean;
};

const unameParam = (uname?: string) => (uname ? { uname } : {});

// GET /users/profile?uname=
export const getUserProfile = async (uname?: string): Promise<UserProfile> => {
    const res = await Axios.get("/users/profile", { params: unameParam(uname) });
    return res.data.profile;
};

// GET /users/post?uname=&limit=&offset=  (rows have the same shape as /post/simple_post)
export const getUserPosts = async (uname?: string, limit = 50, offset = 0): Promise<FeedPost[]> => {
    const res = await Axios.get("/users/post", { params: { ...unameParam(uname), limit, offset } });
    const rows: SimplePostRow[] = Array.isArray(res.data?.posts) ? res.data.posts : [];
    return rows.map(mapSimplePost);
};

// GET /users/bookmark?limit=&offset=  (always the logged-in user)
export const getUserBookmarks = async (limit = 50, offset = 0): Promise<FeedPost[]> => {
    const res = await Axios.get("/users/bookmark", { params: { limit, offset } });
    const rows: SimplePostRow[] = Array.isArray(res.data?.posts) ? res.data.posts : [];
    return rows.map(mapSimplePost);
};

// GET /users/tag?uname=&type=
export const getUserTags = async (uname?: string, type?: string): Promise<UserTag[]> => {
    const res = await Axios.get("/users/tag", { params: { ...unameParam(uname), ...(type ? { type } : {}) } });
    return Array.isArray(res.data?.tags) ? res.data.tags : [];
};

export type NewTagPayload = {
    tag_type: "trip" | "simple" | "person" | "event" | "country";
    name: string;
    description?: string;
    country?: string;
    cities?: string[];
    start_date?: string;          // YYYY-MM-DD
    end_date?: string;            // YYYY-MM-DD
    usable_from?: string;         // ISO datetime
    usable_until?: string;        // ISO datetime
    join_policy?: "open" | "approval" | "invite" | "closed";
    trip_mode?: "approval" | "instant";
    approval_file_id?: string;    // file_id from /post/upload_file (required for instant trip)
    local_currency?: string;      // 3 letters, e.g. MYR
    attributes?: Record<string, unknown>;
};

// POST /users/tag/new  → 201 { msg, tag }, 409 if you already have a tag with that name
export const createUserTag = async (body: NewTagPayload): Promise<UserTag> => {
    const res = await Axios.post("/users/tag/new", body);
    return res.data.tag;
};
