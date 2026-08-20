import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface CreateGroupFormProps {
    onGroupCreate?: (name: string) => void;
    // dispatch?: (action: any) => void; // uncomment when using Redux
}

export default function CreateGroupForm({ onGroupCreate }: CreateGroupFormProps) {
    const [groupName, setGroupName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!groupName.trim()) {
            toast.error("Group name is required");
            return;
        }
        // dispatch(addGroup(groupName.trim())); // uncomment for Redux
        if (onGroupCreate) {
            onGroupCreate(groupName.trim());
        }
        setGroupName("");
        toast.success("Group created");
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Create custom group</CardTitle>
                <CardDescription>
                    Bundle users together, then apply a policy to the whole group.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="flex gap-2" onSubmit={handleSubmit}>
                    <Input 
                        value={groupName} 
                        onChange={(e) => setGroupName(e.target.value)} 
                        placeholder="SEA field team" 
                    />
                    <Button type="submit">
                        <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}