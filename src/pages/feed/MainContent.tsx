import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import type { Kind } from "./types";

type Props = {
    kind: Kind;
    text: string;
    onChange: (v: string) => void;
    userName: string;
};

export function MainContent({ kind, text, onChange, userName }: Props) {
    const placeholder =
        kind === "see" ? "Describe the product, shelf, or competitor signal…"
        : kind === "meet" ? "Quick recap of the conversation or meeting…"
        : "Quick note, observation, or thought from the field…";

    return (
        <div className="flex gap-3 rounded-xl border bg-background p-3">
            <Avatar className="mt-0.5 h-10 w-10 shrink-0">
                <AvatarFallback className="bg-primary text-[11px] font-semibold text-primary-foreground">
                    {userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">
                    {userName}{" "}
                    <span className="font-normal text-muted-foreground">
                        @{userName.toLowerCase().replace(/[^a-z0-9]+/g, "")}
                    </span>
                </div>
                <Textarea
                    rows={4}
                    value={text}
                    onChange={(e) => onChange(e.target.value)}
                    className="resize-none border-0 bg-transparent p-0 text-[15px] leading-relaxed shadow-none focus-visible:ring-0"
                    placeholder={placeholder}
                />
                <div className="mt-1 text-right text-[11px] text-muted-foreground">{text.length}/500</div>
            </div>
        </div>
    );
}