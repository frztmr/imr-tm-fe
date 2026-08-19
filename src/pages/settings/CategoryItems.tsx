
//React Requirement
import { Link, useParams } from "react-router-dom";

//Component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Lock, RotateCcw } from "lucide-react";
import { SettingControl } from "@/components/SettingControl";
import { toast } from "sonner";

//Redux
// import { useAppDispatch, useAppSelector, type RootState } from "@/store";
// 

//Typescript, Util, Dummy datas
import {
    resolveSettings,
    sourceLabel,
    settingsCategories
} from "./index";
import { mockAccounts } from '../../data/mockData'
// import { settingsCategories } from './settingsSchema'

function CategoryNotFound() {
    return (
        <div className="mx-auto max-w-2xl py-16 text-center">
            <h1 className="text-lg font-semibold">Settings category not found</h1>
            <Link to="/settings" className="mt-3 inline-block text-sm text-primary underline">Back to settings</Link>
        </div>
    );
}

export default function CategoryItemsPage() {

    const { categoryId } = useParams();
    // const currentUserId = useAppSelector((s) => s.auth.currentUserId); 
    const currentUserId = mockAccounts[0]
    const current = mockAccounts[0].id;

    //mencari kategory    
    const cat = settingsCategories.find((c) => c.id === categoryId);

    const change = (key: string, value: string | boolean) => {
        if (!currentUserId) { toast.error("Sign in to save your preferences"); return; }
        // dispatch(setUserSetting({ userId: currentUserId, key, value }));
    };
    const Icon = cat.icon;

    return (
        <>
            <div className="mx-auto max-w-2xl space-y-5">
                <Link to="/settings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="h-4 w-4" /> Settings
                </Link>

                <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                    </span>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{cat.label}</h1>
                        <p className="text-sm text-muted-foreground">{cat.description}</p>
                    </div>
                </div>

                {cat.groups.map((g) => (
                    <Card key={g.id}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">{g.label}</CardTitle>
                            {g.description && <CardDescription>{g.description}</CardDescription>}
                        </CardHeader>
                        <CardContent className="divide-y p-0">
                            {g.fields.map((f) => {
                                // const r = resolved[f.key];
                                return (
                                    <div key={f.key} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-sm font-medium">{f.label}</span>
                                                {/* {r.locked && ( */}
                                                <Badge variant="secondary" className="gap-1 rounded-full text-[10px]">
                                                    <Lock className="h-3 w-3" /> Managed by admin
                                                </Badge>
                                                {/* )}
                                                {!r.locked && r.source !== "schema" && r.source !== "user" && (
                                                    <Badge variant="outline" className="rounded-full text-[10px]">{sourceLabel[r.source]}</Badge>
                                                )} */}
                                            </div>
                                            {f.description && <p className="mt-0.5 text-xs text-muted-foreground">{f.description}</p>}
                                        </div>
                                        <SettingControl
                                            field={"f"}
                                            value={"r.value"}
                                            // value={r.value}
                                            // disabled={r.locked}
                                            onChange={(v) => change(f.key, v)}
                                        />
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                ))}

                <Button
                    variant="outline"
                    onClick={() => {
                        if (!currentUserId) { toast.error("Sign in first"); return; }
                        // dispatch(resetUserCategory({ userId: currentUserId, keys }));
                        toast.success(`${cat.label} reset to defaults`);
                    }}
                >
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset this category
                </Button>
            </div>
        </>
    );
}