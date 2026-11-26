import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paperclip, X } from "lucide-react";
import { ATTACHMENT_ACCEPT } from "@/config/post";

type Props = { files: File[]; onChange: (f: File[]) => void };

export function AttachmentsField({ files, onChange }: Props) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor="attachments">Attachments (optional) — PDF, Word, Excel, PowerPoint, TXT, CSV · max 25 MB each</Label>
            <Input
                id="attachments"
                type="file"
                multiple
                accept={ATTACHMENT_ACCEPT}
                onChange={(e) => {
                    onChange([...files, ...Array.from(e.target.files ?? [])]);
                    e.target.value = ""; // allow picking the same file again after removing it
                }}
                className="cursor-pointer"
            />
            {files.length > 0 && (
                <ul className="space-y-1">
                    {files.map((f, i) => (
                        <li key={i} className="flex items-center justify-between rounded-md border px-3 py-1.5 text-xs">
                            <span className="flex items-center gap-2 truncate">
                                <Paperclip className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{f.name}</span>
                            </span>
                            <button type="button" aria-label="Remove attachment" onClick={() => onChange(files.filter((_, j) => j !== i))}>
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}