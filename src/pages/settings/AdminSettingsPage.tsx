
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
import ScopedPolicySelector from './adminSettings/ScopedPolicySelector';
import ScopedPolicyTreatment from './adminSettings/ScopedPolicyTreatment';
import ActivePoliciesList from './adminSettings/ActivePoliciesList';
import CreateGroupForm from './adminSettings/CreateGroupForm';
import GroupList from './adminSettings/GroupList';

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

    // console.log("category", category)
    // console.log("settingsCategories", settingsCategories)
    // console.log("dummyValueCapture", dummyValueCapture)

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


                            <ScopedPolicySelector
                                scope={scope}
                                target={target}
                                categoryId={categoryId}
                                // targetOptions={targetOptions}
                                onScopeChange={setScope}
                                onTargetChange={setTarget}
                                onCategoryChange={setCategoryId}
                            />

                            <ScopedPolicyTreatment
                                scope={scope}
                                target={target}
                                category={category}
                                // targetLabel={targetLabel}
                                onValueChange={(key, value) => {
                                    // dispatch(upsertOverride({ scope, target, key, value }));
                                    console.log('Value changed:', key, value);
                                }}
                                onToggleLock={(key) => {
                                    // dispatch(toggleOverrideLock({ scope, target, key }));
                                    console.log('Toggle lock:', key);
                                }}
                                onClearOverride={(key) => {
                                    // dispatch(clearOverrideKey({ scope, target, key }));
                                    console.log('Clear override:', key);
                                }}
                            />

                            <ActivePoliciesList
                                policies={[]} // settings.overrides
                                accounts={accounts}
                                groups={[]} // settings.groups
                                onDeletePolicy={(policyId) => {
                                    // dispatch(deleteOverride(policyId));
                                    console.log('Delete policy:', policyId);
                                }}
                            />

                        </>
                    </TabsContent>

                    {/* Custom groups */}
                    <TabsContent value="groups" className="mt-4 space-y-4">
                        <>
                            <CreateGroupForm
                                onGroupCreate={(name) => {
                                    // dispatch(addGroup(name));
                                    console.log('Create group:', name);
                                }}
                            />
                            <GroupList
                                // groups={settings.groups || []}
                                accounts={accounts}
                                onDeleteGroup={(groupId) => {
                                    // dispatch(deleteGroup(groupId));
                                    console.log('Delete group:', groupId);
                                }}
                                onToggleMember={(groupId, accountId) => {
                                    // dispatch(toggleGroupMember({ groupId, accountId }));
                                    console.log('Toggle member:', groupId, accountId);
                                }}
                            />

                        </>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}