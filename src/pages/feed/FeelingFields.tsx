import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhotoUploader } from "@/components/PhotoUploader";
import { Star } from "lucide-react";
import type { FeelingData } from "./types";
import type { Photo } from "@/store/types";

type Props = {
    data: FeelingData;
    onChange: (patch: Partial<FeelingData>) => void;
};

export function FeelingFields({ data, onChange }: Props) {
    return (
        <div className="space-y-4 rounded-xl border bg-background p-4">
            <div className="space-y-1.5">
                <Label>Rating</Label>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <button
                            key={n}
                            type="button"
                            aria-label={`${n} star${n > 1 ? "s" : ""}`}
                            onClick={() => onChange({ rating: n === data.rating ? 0 : n })}
                            className="p-1 transition hover:scale-110"
                        >
                            <Star className={`h-7 w-7 ${n <= data.rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                        </button>
                    ))}
                    <span className="ml-2 text-xs text-muted-foreground">
                        {data.rating ? `${data.rating}/5` : "No rating yet"}
                    </span>
                </div>
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="feeling">Tell us what you feel about that</Label>
                <Textarea
                    id="feeling" rows={3} value={data.text} onChange={(e) => onChange({ text: e.target.value })}
                    placeholder="How was the meal, ride, or stay?"
                />
            </div>
            <PhotoUploader photos={data.photos} onChange={(p: Photo[]) => onChange({ photos: p })} label="Experience photos (public)" />
            <p className="text-[11px] text-muted-foreground">
                Published as a normal public post — separate from your receipt photos.
            </p>
        </div>
    );
}