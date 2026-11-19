import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { likeUnlikePost } from "@/config/post";
import type { FeedPost } from "@/types/tipes";

/**
 * Like / unlike a post via POST /post/like_unlike/:post_id.
 * Updates the UI immediately (optimistic), then syncs with the backend response.
 * Rolls back if the request fails.
 */
export function useLike(post: Pick<FeedPost, "id" | "likeCount" | "likedByMe">) {
    const [liked, setLiked] = useState(post.likedByMe ?? false);
    const [likes, setLikes] = useState(post.likeCount ?? 0);
    const pending = useRef(false);

    // re-sync when a different post / fresh data comes in
    useEffect(() => {
        setLiked(post.likedByMe ?? false);
        setLikes(post.likeCount ?? 0);
    }, [post.id, post.likedByMe, post.likeCount]);

    const toggle = async () => {
        if (pending.current) return; // ignore double clicks while a request is running
        pending.current = true;

        const prevLiked = liked;
        const prevLikes = likes;
        const nextLiked = !prevLiked;

        setLiked(nextLiked);
        setLikes(Math.max(0, prevLikes + (nextLiked ? 1 : -1)));

        try {
            const res = await likeUnlikePost(post.id);
            if (res.liked !== undefined) setLiked(res.liked);
            if (res.likeCount !== undefined) setLikes(res.likeCount);
        } catch (err) {
            console.log("err at like_unlike", err);
            setLiked(prevLiked);
            setLikes(prevLikes);
            toast.error("Couldn't update like. Please try again.");
        } finally {
            pending.current = false;
        }
    };

    return { liked, likes, toggle };
}
