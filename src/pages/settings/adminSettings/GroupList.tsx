import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Account {
    id: string;
    name: string;
    email?: string;
}

interface Group {
    id: string;
    name: string;
    members: string[];
}

interface GroupListProps {
    // groups: Group[];
    accounts: Account[];
    onDeleteGroup?: (groupId: string) => void;
    onToggleMember?: (groupId: string, accountId: string) => void;
    // dispatch?: (action: any) => void; // uncomment when using Redux
}

export default function GroupList({ 
    // groups, 
    accounts, 
    onDeleteGroup,
    onToggleMember 
}: GroupListProps) {
    // if (groups.length === 0) {
    //     return (
    //         <p className="text-sm text-muted-foreground">No custom groups yet.</p>
    //     );
    // }

    return (
        <>
            {/* {groups.map((group) => ( */}
                <Card key={"group.id"}>
                    <CardHeader className="flex-row items-center justify-between gap-2 pb-2">
                        <div>
                            <CardTitle className="text-base">{"group.name"}</CardTitle>
                            <CardDescription>{"group.members.length"} member(s)</CardDescription>
                        </div>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            aria-label="Delete group" 
                            onClick={() => {
                                // dispatch(deleteGroup(group.id)); // uncomment for Redux
                                if (onDeleteGroup) {
                                    onDeleteGroup("group.id");
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {accounts.map((account) => {
                            // const inGroup = group.members.includes(account.id);
                            const inGroup = true
                            return (
                                <button
                                    key={account.id}
                                    type="button"
                                    onClick={() => {
                                        // dispatch(toggleGroupMember({ groupId: group.id, accountId: account.id })); // uncomment for Redux
                                        if (onToggleMember) {
                                            // onToggleMember(group.id, account.id);
                                        }
                                    }}
                                    className={`rounded-full border px-3 py-1 text-xs transition ${
                                        inGroup 
                                            ? "border-primary bg-primary text-primary-foreground" 
                                            : "text-muted-foreground hover:bg-accent"
                                    }`}
                                >
                                    {account.name}
                                </button>
                            );
                        })}
                    </CardContent>
                </Card>
            {/* ))} */}
        </>
    );
}