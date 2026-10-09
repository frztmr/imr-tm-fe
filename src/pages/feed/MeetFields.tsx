import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
    contact: string;
    impression: string;
    onContact: (v: string) => void;
    onImpression: (v: string) => void;
};

export function MeetFields({ contact, impression, onContact, onImpression }: Props) {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
                <Label htmlFor="contact">Contact / person</Label>
                <Input id="contact" value={contact} onChange={(e) => onContact(e.target.value)} placeholder="Name, role, company" />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="impression">Impression</Label>
                <Input id="impression" value={impression} onChange={(e) => onImpression(e.target.value)} placeholder="What stuck with you?" />
            </div>
        </div>
    );
}