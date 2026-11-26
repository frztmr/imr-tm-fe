import { useEffect, useMemo, useRef, useState } from "react";
import { FileText, ImagePlus, Loader2, Paperclip, X } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/currentUser";
import { handleOf, initialsOf } from "@/lib/feed";
import {
    replyPost, uploadErrorMessage, UPLOAD_MAX_FILE_SIZE,
    PHOTO_ACCEPT, ATTACHMENT_ACCEPT, isAllowedPhoto, isAllowedAttachment,
} from "@/config/post";

const MAX_IMAGES = 4;
const MAX_FILES = 5;                    // 4 + 5 stays under the BE limit of 10 files per upload
const MAX_SIZE = UPLOAD_MAX_FILE_SIZE;  // 25 MB per file (BE limit)
const MAX_TEXT = 500;

type Props = {
    parentId: string;
    replyingTo: string;      // author name of the post being replied to
    visibility?: string;
    onReplied?: () => void;  // e.g. refetch post detail
};

// Ask the browser for the current position (backend requires lat/long)
function getCoords(): Promise<{ latitude: number; longitude: number; accuracy: number } | null> {
    return new Promise((resolve) => {
        if (!("geolocation" in navigator)) return resolve(null);
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
            }),
            () => resolve(null),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
        );
    });
}

function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function ReplyForm({ parentId, replyingTo, visibility, onReplied }: Props) {
    const me = useCurrentUser();
    const [text, setText] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [sending, setSending] = useState(false);

    const imageInput = useRef<HTMLInputElement>(null);
    const fileInput = useRef<HTMLInputElement>(null);

    // image previews (revoked on change/unmount)
    const previews = useMemo(() => images.map((f) => URL.createObjectURL(f)), [images]);
    useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

    // reset when moving to another post
    useEffect(() => {
        setText("");
        setImages([]);
        setFiles([]);
    }, [parentId]);

    const addImages = (list: FileList | null) => {
        if (!list) return;
        const all = Array.from(list);
        const picked = all.filter(isAllowedPhoto);
        if (picked.length < all.length) toast.error("Only JPG, PNG, WEBP or GIF pictures are allowed.");
        const tooBig = picked.filter((f) => f.size > MAX_SIZE);
        if (tooBig.length) toast.error(`Images must be under ${formatSize(MAX_SIZE)}.`);
        const ok = picked.filter((f) => f.size <= MAX_SIZE);
        const room = MAX_IMAGES - images.length;
        if (ok.length > room) toast.error(`Max ${MAX_IMAGES} pictures per reply.`);
        setImages((prev) => [...prev, ...ok.slice(0, Math.max(0, room))]);
    };

    const addFiles = (list: FileList | null) => {
        if (!list) return;
        const all = Array.from(list);
        const picked = all.filter(isAllowedAttachment);
        if (picked.length < all.length) toast.error("Only PDF, Word, Excel, PowerPoint, TXT or CSV files are allowed.");
        const tooBig = picked.filter((f) => f.size > MAX_SIZE);
        if (tooBig.length) toast.error(`Files must be under ${formatSize(MAX_SIZE)}.`);
        const ok = picked.filter((f) => f.size <= MAX_SIZE);
        const room = MAX_FILES - files.length;
        if (ok.length > room) toast.error(`Max ${MAX_FILES} files per reply.`);
        setFiles((prev) => [...prev, ...ok.slice(0, Math.max(0, room))]);
    };

    const canSend = !sending && (text.trim().length > 0 || images.length > 0 || files.length > 0);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSend) return;

        setSending(true);
        try {
            const coords = await getCoords();
            if (!coords) {
                toast.error("Location is required to reply. Please allow location access.");
                return;
            }

            await replyPost({
                parentId,
                text,
                images,
                files,
                latitude: coords.latitude,
                longitude: coords.longitude,
                locationAccuracy: coords.accuracy,
                visibility,
            });

            toast.success("Reply posted");
            setText("");
            setImages([]);
            setFiles([]);
            onReplied?.();
        } catch (err) {
            console.log("err at reply post", err);
            toast.error(uploadErrorMessage(err, "Failed to send reply. Please try again."));
        } finally {
            setSending(false);
        }
    };

    return (
        <form onSubmit={submit} className="flex gap-3 px-4 py-3">
            <Avatar className="mt-0.5 h-8 w-8 shrink-0">
                <AvatarFallback className="bg-primary text-[10px] font-semibold text-primary-foreground">
                    {initialsOf(me.name)}
                </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 space-y-2">
                <textarea
                    rows={2}
                    value={text}
                    maxLength={MAX_TEXT}
                    disabled={sending}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit(e);
                    }}
                    placeholder={`Reply to ${handleOf(replyingTo)}…`}
                    className="w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-muted-foreground"
                />

                {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                        {previews.map((src, i) => (
                            <div key={src} className="relative aspect-square overflow-hidden rounded-lg border">
                                <img src={src} alt={images[i]?.name} className="h-full w-full object-cover" />
                                <button
                                    type="button"
                                    aria-label="Remove picture"
                                    disabled={sending}
                                    onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                                    className="absolute right-1 top-1 rounded-full bg-background/80 p-0.5 hover:bg-background"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {files.length > 0 && (
                    <ul className="space-y-1">
                        {files.map((f, i) => (
                            <li key={`${f.name}-${i}`} className="flex items-center gap-2 rounded-md border px-2 py-1 text-xs">
                                <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                <span className="min-w-0 flex-1 truncate">{f.name}</span>
                                <span className="shrink-0 text-muted-foreground">{formatSize(f.size)}</span>
                                <button
                                    type="button"
                                    aria-label={`Remove ${f.name}`}
                                    disabled={sending}
                                    onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                                    className="rounded-full p-0.5 hover:bg-muted"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="flex items-center gap-1">
                    <input
                        ref={imageInput}
                        type="file"
                        accept={PHOTO_ACCEPT}
                        multiple
                        hidden
                        onChange={(e) => { addImages(e.target.files); e.target.value = ""; }}
                    />
                    <input
                        ref={fileInput}
                        type="file"
                        accept={ATTACHMENT_ACCEPT}
                        multiple
                        hidden
                        onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
                    />
                    <Button
                        type="button" variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground"
                        disabled={sending || images.length >= MAX_IMAGES}
                        onClick={() => imageInput.current?.click()}
                        aria-label="Add pictures"
                    >
                        <ImagePlus className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button" variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground"
                        disabled={sending || files.length >= MAX_FILES}
                        onClick={() => fileInput.current?.click()}
                        aria-label="Attach files"
                    >
                        <Paperclip className="h-4 w-4" />
                    </Button>
                    <span className="ml-auto text-[11px] text-muted-foreground">{text.length}/{MAX_TEXT}</span>
                    <Button type="submit" size="sm" className="ml-2 h-8 rounded-full" disabled={!canSend}>
                        {sending
                            ? <><Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> {images.length || files.length ? "Uploading" : "Sending"}</>
                            : "Reply"}
                    </Button>
                </div>
            </div>
        </form>
    );
}
