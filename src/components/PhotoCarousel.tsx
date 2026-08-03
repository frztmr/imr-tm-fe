import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Photo } from "@/store/types";

export function PhotoCarousel({
  photos,
  alt = "Photo",
  className = "",
}: {
  photos: Photo[];
  alt?: string;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  if (!photos || photos.length === 0) return null;

  const single = photos.length === 1;

  const scrollTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.max(0, Math.min(photos.length - 1, i));
    const child = el.children[next] as HTMLElement | undefined;
    if (child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
    setIndex(next);
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const w = el.clientWidth * (single ? 1 : 0.82);
    setIndex(Math.round(el.scrollLeft / Math.max(1, w)));
  };

  return (
    <div className={`group/carousel relative ${className}`} onClick={(e) => e.stopPropagation()}>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((p, i) => (
          <figure
            key={p.id ?? i}
            className={`relative shrink-0 snap-start overflow-hidden rounded-2xl border bg-muted ${
              single ? "w-full" : "w-[80%] max-w-[320px]"
            }`}
          >
            <img
              src={p.url}
              alt={p.caption || `${alt} ${i + 1}`}
              loading="lazy"
              className={single ? "max-h-96 w-full object-cover" : "aspect-square w-full object-cover"}
            />
            {p.caption && (
              <figcaption className="px-3 py-1.5 text-[11px] text-muted-foreground">{p.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => scrollTo(index - 1)}
            disabled={index === 0}
            className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-background/85 p-1.5 shadow ring-1 ring-border transition disabled:opacity-0 group-hover/carousel:block"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => scrollTo(index + 1)}
            disabled={index >= photos.length - 1}
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-background/85 p-1.5 shadow ring-1 ring-border transition disabled:opacity-0 group-hover/carousel:block"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {photos.map((p, i) => (
              <button
                key={p.id ?? i}
                type="button"
                aria-label={`Go to photo ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-4 bg-primary" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
