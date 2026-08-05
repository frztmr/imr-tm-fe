
import { Button } from "@/components/ui/button";
import {
    Pencil, Trash2,
} from "lucide-react";

export function RowActions({ onEdit, onDelete, onToggleDraft, isDraft }: {
    onEdit: () => void; onDelete: () => void; onToggleDraft: () => void; isDraft?: boolean;
}) {
    return (
        <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" onClick={onToggleDraft}>
                {isDraft ? "Mark final" : "Mark draft"}
            </Button>
            <Button size="icon" variant="outline" onClick={onEdit} aria-label="Edit"><Pencil className="h-3.5 w-3.5" /></Button>
            <Button size="icon" variant="outline" onClick={onDelete} aria-label="Delete">
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
        </div>
    );
}