//React Requirement
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

//Component
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Settings as SettingsIcon, Shield, LogOut } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner"; // or your preferred toast library

// import { resolveSettings } from "./settings/effectiveSettings";
import { settingsCategories } from "./settings/settingsSchema";
import { SettingsCategories } from "./settings/index";

//Redux
// import { useAppSelector, type RootState } from "@/store";
// import { useAppDispatch } from "@/store";
// import { logout } from "@/store/authSlice";

//Typescript and Util
import { mockAccounts } from '../data/mockData'
import Axios from "../config/axios";

export default function Settings() {
    // const currentUserId = useAppSelector((s) => s.auth.currentUserId);
    // const current = useAppSelector((s) => s.auth.accounts.find((a) => a.id === s.auth.currentUserId) ?? null);
    // const resolved = useAppSelector((s: RootState) => resolveSettings(s, currentUserId));
    // const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const currentUserId = mockAccounts[0]
    const current = mockAccounts[0]; // NOTE: you had `mockAccounts[0].id` — that's a bug, should be the account object
    // const resolved = useAppSelector((s: RootState) => resolveSettings(s, currentUserId));
    const [categoryId, setCategoryId] = useState<Number>(0);

    const handleLogout = async () => {
        // TODO: replace with your real logout logic
        // dispatch(logout());

        // Clear any local storage / tokens if needed
        // localStorage.removeItem("token");
        try {
            const response = await Axios.get("/auth/log_out");

            if (response.status = 500) {

                toast.success("Whoops!", {
                    description: "See you again soon!",
                    duration: 3000,
                });
            } else {
                toast.success("You've been signed out", {
                    description: "See you again soon!",
                    duration: 3000,
                }); 
                // Redirect after toast
                navigate("/login");
            }
        } catch (error) {
            toast.error("Whoops!", {
                description: "Something Wrong but its not your fault!",
                duration: 3000,
            });

        } finally {
            toast.success("You've been signed out", {
                description: "See you again soon!",
                duration: 3000,
            });
            // Redirect after toast
            navigate("/login");

        }


    };

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

                {/* ===== Logout Button ===== */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button
                            type="button"
                            className="flex w-full items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-left transition hover:bg-destructive/10"
                        >
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-destructive text-destructive-foreground">
                                <LogOut className="h-5 w-5" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="font-medium text-destructive">Log out</div>
                                <p className="truncate text-xs text-muted-foreground">
                                    Sign out from this device.
                                </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Log out of your account?</AlertDialogTitle>
                            <AlertDialogDescription>
                                You'll need to sign in again to access your trips, moments, and settings.
                                Any unsaved changes will be lost.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleLogout}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Yes, log out
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    );
}