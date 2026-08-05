
import { Badge } from "@/components/ui/badge";
import { FileEdit } from "lucide-react";


export function DraftBadge({ isDraft }: { isDraft?: boolean }) {
    if (!isDraft) return null;
    return (
        <Badge variant="outline" className="border-warning/40 bg-warning/10 text-[10px] text-warning-foreground">
            <FileEdit className="mr-1 h-3 w-3" />Draft
        </Badge>
    );
}