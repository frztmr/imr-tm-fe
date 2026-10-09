import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = { expiresAt: string; onChange: (v: string) => void };

export function SeeFields({ expiresAt, onChange }: Props) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor="exp">Expires / valid until (optional)</Label>
            <Input id="exp" type="date" value={expiresAt} onChange={(e) => onChange(e.target.value)} />
        </div>
    );
}