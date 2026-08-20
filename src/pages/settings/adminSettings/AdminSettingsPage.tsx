
//React Requirement
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

//Component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SettingControl } from "@/components/SettingControl";
import { ChevronLeft, Globe2, Lock, LockOpen, Plus, Shield, Trash2, Undo2, Users } from "lucide-react";
import { toast } from "sonner";

import OrgDefaults from "./adminSettings/OrgDefault";
import {
    ScopedPolicySelector,
    ScopedPolicyTreatment,
    ActivePoliciesList
} from './adminSettings';

//Redux
/*
import { useAppDispatch, useAppSelector } from "@/store";
*/
import {
    addGroup, clearOverrideKey, deleteGroup, deleteOverride, setGlobalDefault,
    toggleGroupMember, toggleOverrideLock, upsertOverride, type ScopeKind,
} from "@/store/settingsSlice";


//Typescript, dummy data, and util
import { settingsCategories, schemaDefaults } from "./settingsSchema";
import type { Account, Trip } from "@/store/types";
import { mockAccounts, mockTrips, } from '../../data/mockData'
import { dummyFeedPost } from "@/store/dummyData";

export default function AdminSettingsPage() {

    // const dispatch = useAppDispatch();

    // dari mock up dari redux. tapi gak gini harusnya. 
    // const accounts = useAppSelector((s) => s.auth.accounts);
    // const trips = useAppSelector((s) => s.trips.trips);
    // const settings = useAppSelector((s) => s.settings);
    const accounts = mockAccounts;
    const trips = mockTrips;
    // const settings = dummy

    const countries = useMemo(
        () => Array.from(new Set(trips.map((t) => t.country).filter(Boolean))).sort(),
        [trips],
    );

    const [scope, setScope] = useState<ScopeKind>("country");
    const [target, setTarget] = useState<string>("");
    const [groupName, setGroupName] = useState("");
    const [categoryId, setCategoryId] = useState(settingsCategories[0].id);

    const category = settingsCategories.find((c) => c.id === categoryId)!;
    // const override = settings.overrides.find((o) => o.scope === scope && o.target === target);

    const [dummyValueCapture, setDummyValueCapture] = useState()

    console.log("category", category)
    console.log("settingsCategories", settingsCategories)
    console.log("dummyValueCapture", dummyValueCapture)

    const targetOptions =
        scope === "country"
            ? countries.map((country) => ({ value: country, label: country }))
            : scope === "group"
    // ? settings.groups.map((groups) => ({ value: groups.id, label: groups.name }))
    // : accounts.map((accounts) => ({ value: accounts.id, label: `${accounts.name} · ${accounts.email}` }));
    accounts.map((accounts) => ({ value: accounts.id, label: `${accounts.name} · ${accounts.email}` }));


    // const targetLabel = targetOptions.find((o) => o.value === target)?.label ?? "";

    return (
        <>
            <div className="mx-auto max-w-4xl space-y-6">
                <Link
                    to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="h-4 w-4" /> Admin
                </Link>

                <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-semibold tracking-tight">Global settings</h1>
                    <Badge variant="outline" className="ml-1">Admin</Badge>
                </div>

                <Tabs defaultValue="defaults">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="defaults">Org defaults</TabsTrigger>
                        <TabsTrigger value="scoped">Scoped policies</TabsTrigger>
                        <TabsTrigger value="groups">Groups</TabsTrigger>
                    </TabsList>

                    {/* Org-wide defaults */}
                    <TabsContent value="defaults" className="mt-4 space-y-4">
                        <OrgDefaults />
                    </TabsContent>

                    {/* Scoped Policies */}
                    <TabsContent value="scoped" className="mt-4 space-y-4">
                        <>

                            {/* Country Grouped */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base">Choose a scope</CardTitle>
                                    <CardDescription>Country group, custom group, or a specific user. Locked keys can't be changed by the user.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-3 sm:grid-cols-3">
                                    <div className="space-y-1.5">
                                        <Label>Scope</Label>
                                        <Select value={scope} onValueChange={(v) => { setScope(v as ScopeKind); setTarget(""); }}>
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
                                        <Select value={target} onValueChange={setTarget}>
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
                                        <Select value={categoryId} onValueChange={setCategoryId}>
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

                            {/* Treatment */}
                            {!target ? (
                                <p className="text-sm text-muted-foreground">Pick a target to customize its settings.</p>
                            ) : (
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            {scope === "country" ? <Globe2 className="h-4 w-4 text-primary" /> : scope === "group" ? <Users className="h-4 w-4 text-primary" /> : <Shield className="h-4 w-4 text-primary" />}
                                            {/* {targetLabel} · {category.label} */}
                                            {category.label}
                                        </CardTitle>
                                        <CardDescription>Only the values you set here override the org defaults.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="divide-y p-0">
                                        {category.groups.flatMap((g) => g.fields).map((f) => {
                                            // const has = override ? f.key in override.values : false;
                                            // const value = has ? override!.values[f.key]
                                            //     : (f.key in settings.globalDefaults ? settings.globalDefaults[f.key] : schemaDefaults[f.key]);
                                            // const locked = override?.lockedKeys.includes(f.key) ?? false;
                                            return (
                                                <div key={f.key} className="flex flex-wrap items-center justify-between gap-3 px-6 py-3">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium">{f.label}</span>
                                                            {/* {has && */}
                                                            <Badge variant="secondary" className="rounded-full text-[10px]">Overridden</Badge>
                                                            {/* } */}
                                                            {/* {locked && */}
                                                            <Badge className="gap-1 rounded-full text-[10px]"><Lock className="h-3 w-3" /> Locked</Badge>
                                                            {/* } */}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">{f.key}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <SettingControl
                                                            field={f}
                                                            value={"value"}
                                                            onChange={(value) => setDummyValueCapture(value)}
                                                        />
                                                        <Button
                                                            type="button" variant="outline" size="icon"
                                                            // aria-label={locked ? "Unlock" : "Lock"}
                                                            aria-label={"Unlock"}
                                                            onClick={() => setDummyValueCapture}
                                                        >
                                                            {/* {locked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />} */}
                                                            {<Lock className="h-4 w-4" />}
                                                        </Button>
                                                        <Button
                                                            type="button" variant="ghost" size="icon" aria-label="Clear override"
                                                        // onClick={() => dispatch(clearOverrideKey({ scope, target, key: f.key }))}
                                                        >
                                                            <Undo2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Active Policies */}
                            <Card>
                                <CardHeader className="pb-2">
                                    {/* <CardTitle className="text-base">Active policies ({settings.overrides.length})</CardTitle> */}
                                    <CardTitle className="text-base">Active policies 0</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* {settings.overrides.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No scoped policies yet.</p>
                                ) : ( */}
                                    <ul className="divide-y">
                                        {/* {settings.overrides.map((o) => {
                                            const label = o.scope === "country" ? o.target
                                                : o.scope === "group" ? (settings.groups.find((g) => g.id === o.target)?.name ?? "Deleted group")
                                                    : (accounts.find((a) => a.id === o.target)?.name ?? "Unknown user");
                                            return ( */}
                                        {/* <li key={o.id} className="flex items-center justify-between gap-3 py-3"> */}
                                        <li className="flex items-center justify-between gap-3 py-3">
                                            <div>
                                                {/* <div className="text-sm font-medium">{label}</div> */}
                                                <div className="text-sm font-medium"> label </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {/* {o.scope} · {Object.keys(o.values).length} values · {o.lockedKeys.length} locked */}
                                                    {"o.scope"} · {"Object.keys(o.values).length"} values · {"o.lockedKeys.length"} locked
                                                </div>
                                            </div>
                                            <Button variant="outline" size="icon" aria-label="Delete policy"
                                                onClick={() => setDummyValueCapture}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </li>
                                        {/* );
                                        })} */}
                                    </ul>
                                    {/* )} */}
                                </CardContent>
                            </Card>
                        </>
                    </TabsContent>

                </Tabs>
            </div>
        </>
    )
}