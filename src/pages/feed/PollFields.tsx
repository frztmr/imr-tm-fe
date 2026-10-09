import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

type Props = {
    question: string;
    options: string[];
    onQuestion: (v: string) => void;
    onOptions: (v: string[]) => void;
};

export function PollFields({ question, options, onQuestion, onOptions }: Props) {
    const setOpt = (i: number, v: string) => onOptions(options.map((o, j) => (j === i ? v : o)));
    const removeOpt = (i: number) => onOptions(options.filter((_, j) => j !== i));

    return (
        <div className="space-y-3 rounded-xl border bg-background p-4">
            <div className="space-y-1.5">
                <Label htmlFor="pollQ">Poll question</Label>
                <Input id="pollQ" value={question} onChange={(e) => onQuestion(e.target.value)} placeholder="Which flavour should we push next quarter?" />
            </div>
            <div className="space-y-2">
                <Label>Options</Label>
                {options.map((o, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <Input value={o} onChange={(e) => setOpt(i, e.target.value)} placeholder={`Option ${i + 1}`} />
                        {options.length > 2 && (
                            <Button type="button" size="icon" variant="ghost" aria-label="Remove option" onClick={() => removeOpt(i)}>
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
                {options.length < 6 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => onOptions([...options, ""])}>
                        <Plus className="mr-1 h-3.5 w-3.5" /> Add option
                    </Button>
                )}
            </div>
        </div>
    );
}