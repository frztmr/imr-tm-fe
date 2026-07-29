import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, ImagePlus } from "lucide-react";
import { nanoid } from "@reduxjs/toolkit";
import type { Photo } from "@/store/types";

export interface PhotoUploaderProps {
  photos: Photo[];
  onChange: (photos: Photo[]) => void;
  label?: string;
  max?: number;
  /** Render a single image picker (no list) — used for one-shot photo (e.g. competitor). */
  single?: boolean;
}

function readFiles(files: FileList): Promise<Photo[]> {
  return Promise.all(
    Array.from(files).map(
      (f) =>
        new Promise<Photo>((res, rej) => {
          const r = new FileReader();
          r.onload = () => res({ id: nanoid(), url: String(r.result), caption: "" });
          r.onerror = rej;
          r.readAsDataURL(f);
        }),
    ),
  );
}

export function PhotoUploader({ photos, onChange, label = "Photos", max = 12, single }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = `pu-${label.replace(/\s+/g, "-").toLowerCase()}`;

  const onPick = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = await readFiles(files);
    if (single) {
      onChange([list[0]]);
    } else {
      onChange([...photos, ...list].slice(0, max));
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const setCaption = (id: string, caption: string) =>
    onChange(photos.map((p) => (p.id === id ? { ...p, caption } : p)));
  const remove = (id: string) => onChange(photos.filter((p) => p.id !== id));

  return (
    <div className="space-y-2 rounded-md border-2 border-border bg-card/50 p-3">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
          {label} ({photos.length}{max ? `/${max}` : ""})
        </Label>
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          <ImagePlus className="mr-1 h-3.5 w-3.5" /> {single ? "Choose photo" : "Add photos"}
        </Button>
      </div>
      <Input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        multiple={!single}
        capture="environment"
        className="hidden"
        onChange={(e) => onPick(e.target.files)}
      />
      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {photos.map((p) => (
            <div key={p.id} className="relative rounded-md border-2 border-border bg-background p-2">
              <img src={p.url} alt={p.caption || "photo"} className="h-24 w-full rounded object-cover" />
              <Input
                value={p.caption}
                onChange={(e) => setCaption(p.id, e.target.value)}
                placeholder="Caption…"
                className="mt-2 h-8 text-xs"
              />
              <button
                type="button"
                onClick={() => remove(p.id)}
                aria-label="Remove photo"
                className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground shadow"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function PhotoGallery({ photos }: { photos: Photo[] }) {
  if (!photos || photos.length === 0) return null;
  return (
    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
      {photos.map((p) => (
        <figure key={p.id} className="overflow-hidden rounded-md border-2 border-border bg-background">
          <img src={p.url} alt={p.caption || "photo"} loading="lazy" className="h-28 w-full object-cover" />
          {p.caption && <figcaption className="px-2 py-1 text-[11px] text-muted-foreground">{p.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
