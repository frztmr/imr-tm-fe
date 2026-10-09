import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PhotoUploader } from "@/components/PhotoUploader";
import { Lock } from "lucide-react";
import { EXPENSE_CATEGORIES } from "./constants";
import type { ExpenseData } from "./types";
import type { ExpenseCategory, ExpenseCurrency, Photo } from "@/store/types";

type Props = {
    data: ExpenseData;
    onChange: (patch: Partial<ExpenseData>) => void;
    photos: Photo[];
    onPhotos: (p: Photo[]) => void;
    sharedWith: string;
    onSharedWith: (v: string) => void;
    localCode?: string;
};

export function ExpenseFields({ data, onChange, photos, onPhotos, sharedWith, onSharedWith, localCode }: Props) {
    return (
        <div className="space-y-4 rounded-xl border bg-background p-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <Label htmlFor="expDate">Date of transaction</Label>
                    <Input id="expDate" type="date" value={data.date} onChange={(e) => onChange({ date: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="expCat">Category</Label>
                    <Select value={data.category} onValueChange={(v) => onChange({ category: v as ExpenseCategory })}>
                        <SelectTrigger id="expCat"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {EXPENSE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="expDesc">Description</Label>
                <Input id="expDesc" value={data.desc} onChange={(e) => onChange({ desc: e.target.value })} placeholder="Taxi from airport to hotel" />
            </div>

            <div className="space-y-1.5">
                <Label>Currency (pick one)</Label>
                <div className="grid grid-cols-3 gap-2">
                    {([
                        { id: "IDR" as const, label: "IDR" },
                        { id: "USD" as const, label: "USD" },
                        { id: "LOCAL" as const, label: localCode ? `Local (${localCode})` : "Local currency" },
                    ]).map((c) => (
                        <button
                            type="button"
                            key={c.id}
                            onClick={() => onChange({ currency: c.id as ExpenseCurrency })}
                            className={`rounded-md border-2 px-3 py-2 text-xs font-medium transition ${data.currency === c.id ? "border-primary bg-primary/10" : "border-border text-muted-foreground hover:border-primary/50"}`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
                {data.currency === "LOCAL" && !localCode && (
                    <p className="text-[11px] text-muted-foreground">
                        No local currency set — it will be recorded as &lsquo;Local&rsquo;.
                    </p>
                )}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="expAmount">
                    Value ({data.currency === "LOCAL" ? (localCode || "Local") : data.currency})
                </Label>
                <Input
                    id="expAmount" type="number" min="0" step="any" inputMode="decimal"
                    value={data.amount} onChange={(e) => onChange({ amount: e.target.value })} placeholder="0"
                />
            </div>

            <div className="space-y-3 rounded-md border p-3">
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="expReceipt">Receipt available</Label>
                        <p className="text-[11px] text-muted-foreground">Toggle on if you have the physical/digital receipt.</p>
                    </div>
                    <Switch id="expReceipt" checked={data.receipt} onCheckedChange={(v) => onChange({ receipt: v })} />
                </div>
                {data.receipt && (
                    <>
                        <PhotoUploader photos={photos} onChange={onPhotos} label="Receipt photos (required)" />
                        {photos.length === 0 && (
                            <p className="text-[11px] text-destructive">At least one receipt photo is required.</p>
                        )}
                    </>
                )}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="expNotes">Notes</Label>
                <Textarea id="expNotes" rows={3} value={data.notes} onChange={(e) => onChange({ notes: e.target.value })} placeholder="Details of the expense…" />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="expShare">Who else can see this (comma separated names)</Label>
                <Input id="expShare" value={sharedWith} onChange={(e) => onSharedWith(e.target.value)} placeholder="Finance Team, Rina Putri" />
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Lock className="h-3 w-3" /> This expense is a hidden post — only you and these people can see it.
                </p>
            </div>
        </div>
    );
}