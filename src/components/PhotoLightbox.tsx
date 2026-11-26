import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Photo } from "@/store/types";

/**
 * Fullscreen photo viewer (Threads-style).
 * - dark backdrop, photo fit to screen
 * - close: X button, Esc, or click outside the photo
 * - next / prev: arrow buttons, ← → keys, or swipe on touch screens
 */
export function PhotoLightbox({
    photos, startIndex = 0, onClose, alt = "Photo",
}: {
    photos: Photo[];
    startIndex?: number;
    onClose: () => void;
    alt?: string;
}) {
    const [index, setIndex] = useState(startIndex);
    const touchX = useRef<number | null>(null);
    const closeRef = useRef<HTMLButtonElement>(null);

    const count = photos.length;
    const go = (i: number) => setIndex(Math.max(0, Math.min(count - 1, i)));

    // keyboard + lock page scroll while open
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
            if (e.key === "ArrowRight") setIndex((i) => Math.min(count - 1, i + 1));
        };
        window.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeRef.current?.focus();
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [count, onClose]);

    const photo = photos[index];
    if (!photo) return null;

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            onClick={onClose} // click on the dark area closes
            onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
                if (touchX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                touchX.current = null;
                if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 animate-in fade-in-0"
        >
            <button
                ref={closeRef}
                type="button"
                aria-label="Close"
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="absolute left-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            >
                <X className="h-5 w-5" />
            </button>

            {count > 1 && (
                <div className="absolute right-4 top-5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white">
                    {index + 1} / {count}
                </div>
            )}

            <img
                key={photo.id ?? index}
                src={photo.url}
                alt={photo.caption || `${alt} ${index + 1}`}
                onClick={(e) => e.stopPropagation()} // clicking the photo itself doesn't close
                draggable={false}
                className="max-h-[92vh] max-w-[94vw] select-none object-contain"
            />

            {photo.caption && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-6 left-1/2 max-w-[90vw] -translate-x-1/2 rounded-lg bg-black/60 px-3 py-1.5 text-center text-sm text-white"
                >
                    {photo.caption}
                </div>
            )}

            {count > 1 && index > 0 && (
                <button
                    type="button"
                    aria-label="Previous photo"
                    onClick={(e) => { e.stopPropagation(); go(index - 1); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/20"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
            )}
            {count > 1 && index < count - 1 && (
                <button
                    type="button"
                    aria-label="Next photo"
                    onClick={(e) => { e.stopPropagation(); go(index + 1); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/20"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            )}
        </div>,
        document.body
    );
}
