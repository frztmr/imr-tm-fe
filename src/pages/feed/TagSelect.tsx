import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Trip = { id: string; title: string; country: string; startDate: string; endDate: string };

type Props = {
    trips: Trip[];
    value: string;
    onChange: (v: string) => void;
};

export function TagSelect({ trips, value, onChange }: Props) {
    const today = new Date().toISOString().slice(0, 10);
    const inDate = (t: Trip) => t.startDate <= today && today <= t.endDate;

    return (
        <div className="space-y-1.5">
            <Label htmlFor="trip">Tag</Label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger id="trip">
                    <SelectValue placeholder="Select a tag (optional)…" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="__none">No tag</SelectItem>
                    {trips.filter(inDate).length > 0 && (
                        <>
                            <div className="px-2 py-1 text-[10px] font-semibold uppercase text-muted-foreground">Currently in date</div>
                            {trips.filter(inDate).map((t) => (
                                <SelectItem key={t.id} value={t.id}>{t.title} · {t.country}</SelectItem>
                            ))}
                        </>
                    )}
                    {trips.filter((t) => !inDate(t)).length > 0 && (
                        <>
                            <div className="px-2 py-1 text-[10px] font-semibold uppercase text-muted-foreground">Other trips</div>
                            {trips.filter((t) => !inDate(t)).map((t) => (
                                <SelectItem key={t.id} value={t.id}>{t.title} · {t.country} ({t.startDate})</SelectItem>
                            ))}
                        </>
                    )}
                </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">Optional. You can tag any trip even if it&apos;s not active.</p>
        </div>
    );
}