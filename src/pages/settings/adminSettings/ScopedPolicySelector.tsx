import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { settingsCategories } from "../index";
import type { ScopeKind } from "@/store/settingsSlice";

interface ScopedPolicySelectorProps {
    scope: ScopeKind;
    target: string;
    categoryId: string;
    // targetOptions: Array<{ value: string; label: string }>;
    onScopeChange: (value: ScopeKind) => void;
    onTargetChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
}

export default function ScopedPolicySelector({
    scope,
    target,
    categoryId,
    // targetOptions,
    onScopeChange,
    onTargetChange,
    onCategoryChange,
}: ScopedPolicySelectorProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Choose a scope</CardTitle>
                <CardDescription>Country group, custom group, or a specific user. Locked keys can't be changed by the user.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1.5">
                    <Label>Scope</Label>
                    <Select value={scope} onValueChange={
                        (v) => {
                            // setScope(v as ScopeKind);
                            // setTarget("");
                        }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="country">Country group</SelectItem>
                            <SelectItem value="group">Custom group</SelectItem>
                            <SelectItem value="user">Specific user</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label>Target</Label>
                    <Select
                        value={target}
                    // onValueChange={setTarget}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={
                                // targetOptions.length ? "Select…" : "None available"
                                "Select…"
                            } />
                        </SelectTrigger>
                        <SelectContent>
                            {/* {targetOptions.map((o) => ( */}
                            {/* <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem> */}
                            <SelectItem key={"o.value"} value={"o.value"}>{"o.label"}</SelectItem>
                            {/* ))} */}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select
                        value={categoryId}
                    // onValueChange={setCategoryId}
                    >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {settingsCategories.map((c) => (
                                <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}