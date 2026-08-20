import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SettingControl } from "@/components/SettingControl";
import { Globe2, Users, Shield, Lock, LockOpen, Undo2 } from "lucide-react";
import type { ScopeKind } from "@/store/settingsSlice";

interface ScopedPolicyTreatmentProps {
    scope: ScopeKind;
    target: string;
    category: {
        id: string;
        label: string;
        groups: Array<{
            fields: Array<{
                key: string;
                label: string;
                // other field properties
            }>;
        }>;
    };
    // targetLabel: string;
    // values: Record<string, any>;
    // lockedKeys: string[];
    // hasOverride: (key: string) => boolean;
    // isLocked: (key: string) => boolean;
    onValueChange: (key: string, value: any) => void;
    onToggleLock: (key: string) => void;
    onClearOverride: (key: string) => void;
}

export default function ScopedPolicyTreatment({
    scope,
    target,
    category,
    // targetLabel,
    // values,
    // lockedKeys,
    // hasOverride,
    // isLocked,
    onValueChange,
    onToggleLock,
    onClearOverride,
}: ScopedPolicyTreatmentProps) {
    if (!target) {
        return (
            <p className="text-sm text-muted-foreground">
                Pick a target to customize its settings.
            </p>
        );
    }

    const getScopeIcon = () => {
        if (scope === "country") return <Globe2 className="h-4 w-4 text-primary" />;
        if (scope === "group") return <Users className="h-4 w-4 text-primary" />;
        return <Shield className="h-4 w-4 text-primary" />;
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                    {getScopeIcon()}
                    {"targetLabel"} · {category.label}
                </CardTitle>
                <CardDescription>
                    Only the values you set here override the org defaults.
                </CardDescription>
            </CardHeader>
            <CardContent className="divide-y p-0">
                {category.groups.flatMap((g) => g.fields).map((f) => {
                    // const has = hasOverride?.(f.key) ?? false;
                    // const value = has ? values[f.key] : schemaDefaults[f.key];
                    // const locked = isLocked?.(f.key) ?? false;
                    
                    // Dummy values for now - replace with actual logic
                    const has = false;
                    const value = "dummy value";
                    const locked = false;

                    return (
                        <div key={f.key} className="flex flex-wrap items-center justify-between gap-3 px-6 py-3">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{f.label}</span>
                                    {has && (
                                        <Badge variant="secondary" className="rounded-full text-[10px]">
                                            Overridden
                                        </Badge>
                                    )}
                                    {locked && (
                                        <Badge className="gap-1 rounded-full text-[10px]">
                                            <Lock className="h-3 w-3" /> Locked
                                        </Badge>
                                    )}
                                </div>
                                <div className="text-xs text-muted-foreground">{f.key}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <SettingControl
                                    field={f}
                                    value={value}
                                    onChange={(v) => onValueChange(f.key, v)}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    aria-label={locked ? "Unlock" : "Lock"}
                                    onClick={() => onToggleLock(f.key)}
                                >
                                    {locked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Clear override"
                                    onClick={() => onClearOverride(f.key)}
                                >
                                    <Undo2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}