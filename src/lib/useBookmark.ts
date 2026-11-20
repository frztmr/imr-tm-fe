import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { bookmarkUnbookmarkPost } from "@/config/post";
import type { FeedPost } from "@/types/tipes";

/**
 * Bookmark / unbookmark a post via POST /post/bookmark_unbookmark/:post_id.
 * Updates the UI immediately (optimistic), rolls back if the request fails.
 */
export function useBookmark(post: Pick<FeedPost, "id" | "bookmarkedByMe">) {
    const [saved, setSaved] = useState(post.bookmarkedByMe ?? false);
    const pending = useRef(false);

    // re-sync when a different post / fresh data comes in
    useEffect(() => {
        setSaved(post.bookmarkedByMe ?? false);
    }, [post.id, post.bookmarkedByMe]);

    const toggle = async () => {
        if (pending.current) return; // ignore double clicks while a request is running
        pending.current = true;

        const prev = saved;
        setSaved(!prev);

        try {
            const res = await bookmarkUnbookmarkPost(post.id);
            if (res.bookmarked !== undefined) setSaved(res.bookmarked);
        } catch (err) {
            console.log("err at bookmark_unbookmark", err);
            setSaved(prev);
            toast.error("Couldn't update bookmark. Please try again.");
        } finally {
            pending.current = false;
        }
    };

    return { saved, toggle };
}
