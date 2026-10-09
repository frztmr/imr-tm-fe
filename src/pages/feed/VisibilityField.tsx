import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock } from "lucide-react";
import { VISIBILITIES } from "./constants";
import type { Visibility } from "./types";

type Props = {
    visibility: Visibility;
    onVisibility: (v: Visibility) => void;
    allowedViewers: string;
    onAllowedViewers: (v: string) => void;
    teamId: string;
    onTeamId: (v: string) => void;
};

export function VisibilityField({
    visibility, onVisibility,
    allowedViewers, onAllowedViewers,
    teamId, onTeamId,
}: Props) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor="visibility">Who can see this?</Label>
            <Select value={visibility} onValueChange={(v) => onVisibility(v as Visibility)}>
                <SelectTrigger id="visibility"><SelectValue /></SelectTrigger>
                <SelectContent>
                    {VISIBILITIES.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                            <div className="flex flex-col">
                                <span className="font-medium">{v.label}</span>
                                <span className="text-[10px] text-muted-foreground">{v.hint}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {visibility === "restricted" && (
                <div className="space-y-1.5 pt-1">
                    <Label htmlFor="allowedViewers">Who can see this (comma separated names)</Label>
                    <Input
                        id="allowedViewers"
                        value={allowedViewers}
                        onChange={(e) => onAllowedViewers(e.target.value)}
                        placeholder="Rina Putri, Finance Team"
                    />
                    <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Lock className="h-3 w-3" /> Only you and these people can see, reply, and like this post.
                    </p>
                </div>
            )}

            {visibility === "my_team" && (
                <div className="space-y-1.5 pt-1">
                    <Label htmlFor="teamId">Team</Label>
                    <Input id="teamId" value={teamId} onChange={(e) => onTeamId(e.target.value)} placeholder="e.g. Sales - Indonesia" />
                </div>
            )}

            {visibility === "draft" && (
                <p className="text-[11px] text-muted-foreground">
                    This will be saved as a draft and won&apos;t appear on the feed until published.
                </p>
            )}
        </div>
    );
}