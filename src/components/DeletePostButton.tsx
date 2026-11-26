import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deletePost } from "@/config/post";

/**
 * Trash button + confirm dialog → DELETE /post/delete/:post_id.
 * Only render it when the post's is_deletable is true.
 */
export function DeletePostButton({
    postId, onDeleted, className = "", iconClassName = "h-4 w-4",
}: {
    postId: string;
    onDeleted?: () => void;
    className?: string;
    iconClassName?: string;
}) {
    const [open, setOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const confirm = async (e: React.MouseEvent) => {
        e.preventDefault(); // keep dialog open while the request runs
        if (deleting) return;
        setDeleting(true);
        try {
            await deletePost(postId);
            toast.success("Post deleted");
            setOpen(false);
            onDeleted?.();
        } catch (err) {
            console.log("err at delete post", err);
            toast.error("Couldn't delete this post. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        // dialog is portaled, but React events still bubble to the post card → stop them here
        <span onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} className="contents">
            <AlertDialog open={open} onOpenChange={(v) => !deleting && setOpen(v)}>
                <AlertDialogTrigger asChild>
                    <button
                        type="button"
                        aria-label="Delete post"
                        className={`rounded-full p-1 text-muted-foreground transition hover:text-destructive ${className}`}
                    >
                        <Trash2 className={iconClassName} />
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This can't be undone. The post will be removed from the feed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirm}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </span>
    );
}
