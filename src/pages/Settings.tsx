
//React Requirement
import { Link } from "react-router-dom";
import { useState } from "react";

//Component
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Settings as SettingsIcon, Shield } from "lucide-react";

// import { resolveSettings } from "./settings/effectiveSettings";
import { settingsCategories } from "./settings/settingsSchema";
import { SettingsCategories } from "./settings/index";


//Redux
// import { useAppSelector, type RootState } from "@/store";

//Typescript and Util
import { mockAccounts } from '../data/mockData'


export default function Settings() {


    // const currentUserId = useAppSelector((s) => s.auth.currentUserId);
    // const current = useAppSelector((s) => s.auth.accounts.find((a) => a.id === s.auth.currentUserId) ?? null);
    // const resolved = useAppSelector((s: RootState) => resolveSettings(s, currentUserId));
    const currentUserId = mockAccounts[0]
    const current = mockAccounts[0].id;
    // const resolved = useAppSelector((s: RootState) => resolveSettings(s, currentUserId));
    const [categoryId, setCategoryId] = useState<Number>(0);

    return (
        <>
            <div className="mx-auto max-w-2xl space-y-5">
                <div className="flex items-center gap-2">
                    <SettingsIcon className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Settings
                    </h1>
                </div>
                <p className="text-sm text-muted-foreground">
                    {current ?
                        `Signed in as ${current.name}` :
                        "You are browsing signed out — changes are saved to this device."
                    }
                </p>

                <div className="space-y-2 ">
                    <SettingsCategories
                        categories={settingsCategories}
                        showSearch={true}
                    // resolvedSettings={resolved}
                    />
                </div>

                {/* {current?.role === "admin" && ( */}
                {/* ini validasi di level redux */}
                <Link to="/admin/settings">
                    <Card className="border-primary/40 transition hover:bg-accent">
                        <CardContent className="flex items-center gap-3 p-4">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                                <Shield className="h-5 w-5" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="font-medium">Global settings (Admin)</div>
                                <p className="truncate text-xs text-muted-foreground">
                                    Org defaults and policies per country, custom group or specific user.
                                </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </CardContent>
                    </Card>
                </Link>
                {/* )} */}
            </div>
        </>
    );
}