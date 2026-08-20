import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Policy {
    id: string;
    scope: string;
    target: string;
    values: Record<string, any>;
    lockedKeys: string[];
}

interface ActivePoliciesListProps {
    policies: Policy[];
    accounts?: Array<{ id: string; name: string }>;
    groups?: Array<{ id: string; name: string }>;
    onDeletePolicy: (policyId: string) => void;
}

export default function ActivePoliciesList({
    policies,
    accounts = [],
    groups = [],
    onDeletePolicy,
}: ActivePoliciesListProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">
                    Active policies ({policies.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                {policies.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No scoped policies yet.</p>
                ) : (
                    <ul className="divide-y">
                        {policies.map((policy) => {
                            // Get label based on scope type
                            let label = policy.target;
                            if (policy.scope === "group") {
                                const group = groups.find((g) => g.id === policy.target);
                                label = group?.name ?? "Deleted group";
                            } else if (policy.scope === "user") {
                                const account = accounts.find((a) => a.id === policy.target);
                                label = account?.name ?? "Unknown user";
                            }

                            return (
                                <li key={policy.id} className="flex items-center justify-between gap-3 py-3">
                                    <div>
                                        <div className="text-sm font-medium">{label}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {policy.scope} · {Object.keys(policy.values).length} values · {policy.lockedKeys.length} locked
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        aria-label="Delete policy"
                                        onClick={() => onDeletePolicy(policy.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}