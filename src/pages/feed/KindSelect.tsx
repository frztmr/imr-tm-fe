import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KINDS } from "./constants";
import type { Kind } from "./types";

type Props = { value: Kind; onChange: (v: Kind) => void };

export function KindSelect({ value, onChange }: Props) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor="kind">What are you posting?</Label>
            <Select value={value} onValueChange={(v) => onChange(v as Kind)}>
                <SelectTrigger id="kind"><SelectValue /></SelectTrigger>
                <SelectContent>
                    {KINDS.map((k) => {
                        const Icon = k.icon;
                        return (
                            <SelectItem key={k.id} value={k.id}>
                                <span className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    {k.label}
                                </span>
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
}