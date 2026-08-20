
//react requirement
import { useState } from "react";
import { Link } from "react-router-dom";

//component
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield, Copy, Trash2, KeyRound, UserCog, Settings } from "lucide-react";

//Redux
// import { useAppDispatch, useAppSelector } from "@/store";
// import { addAccount, addInvitation, deleteInvitation } from "@/store/authSlice";

//Typescript, Dummy data.
import { mockAccounts, mockInvitations } from "@/data/mockData";

export default function AdminPage() {

    // // Data dari redux, ini semua  ke global state
    // const dispatch = useAppDispatch();
    // const accounts = useAppSelector((s) => s.auth.accounts);
    // const invitations = useAppSelector((s) => s.auth.invitations); 
    const accounts = mockAccounts;
    const invitations = mockInvitations;

    const [invEmail, setInvEmail] = useState("");
    const [accName, setAccName] = useState("");
    const [accEmail, setAccEmail] = useState("");
    const [accPassword, setAccPassword] = useState("");
    const [accRole, setAccRole] = useState<"admin" | "user">("user");

    const [clickMonitor, setClickMonitor] = useState(false);

    const createInvitation = (e: React.FormEvent) => {
        e.preventDefault();
        if (!invEmail.trim()) { toast.error("Email is required"); return; }
        // dispatch(addInvitation({ email: invEmail.trim() }));
        setInvEmail("");
        toast.success("Invitation PIN generated");
    };

    const createAccountDirect = (e: React.FormEvent) => {
        e.preventDefault();
        if (!accName.trim() || !accEmail.trim() || accPassword.length < 6) {
            toast.error("Fill all fields (password ≥ 6 chars)"); return;
        }
        if (accounts.some((a) => a.email.toLowerCase() === accEmail.trim().toLowerCase())) {
            toast.error("Email already exists"); return;
        }
        // dispatch(addAccount({ name: accName.trim(), email: accEmail.trim(), password: accPassword, role: accRole }));
        setAccName(""); setAccEmail(""); setAccPassword(""); setAccRole("user");
        toast.success("Account created");
    };

    const copyPin = async (pin: string) => {
        try { await navigator.clipboard.writeText(pin); toast.success("PIN copied"); }
        catch { toast.error("Copy failed"); }
    };

    return (
        <>
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Admin
                    </h1>
                    <Badge variant="outline" className="ml-2">
                        Dev unlocked

                    </Badge>
                    <Button asChild variant="outline" size="sm" className="ml-auto">
                        <Link to="/admin/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            Global settings
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base"><KeyRound className="h-4 w-4 text-primary" /> Generate invitation PIN</CardTitle>
                            <CardDescription>Creates a 6-digit PIN that lets someone create an account.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={createInvitation} className="space-y-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="invEmail">Invitee email</Label>
                                    <Input id="invEmail" type="email" value={invEmail} onChange={(e) => setInvEmail(e.target.value)} placeholder="newhire@imrc.example" />
                                </div>
                                <Button type="submit" className="w-full">Generate PIN</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <UserCog className="h-4 w-4 text-primary" />
                                Create account (no PIN)
                            </CardTitle>
                            <CardDescription>
                                Admin shortcut to provision accounts directly.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={createAccountDirect} className="space-y-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="accName">Name</Label>
                                    <Input
                                        id="accName"
                                        value={accName}
                                        onChange={(e) => setAccName(e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="accEmail"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        id="accEmail"
                                        type="email"
                                        value={accEmail}
                                        onChange={
                                            (e) => setAccEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="accPassword">
                                        Password
                                    </Label>
                                    <Input
                                        id="accPassword"
                                        type="password"
                                        value={accPassword}
                                        onChange={
                                            (e) => setAccPassword(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="accRole">Role</Label>
                                    <select
                                        id="accRole"
                                        value={accRole}
                                        onChange={
                                            (e) => setAccRole(e.target.value as "admin" | "user")
                                        }
                                        className={`
                                        flex h-9 w-full rounded-md 
                                        border border-input bg-transparent
                                         px-3 py-1 text-sm shadow-sm`}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <Button type="submit" className="w-full">Create account</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Invitations Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Invitations</CardTitle>
                        <CardDescription>Share the PIN with the invitee — they enter it on the create account page.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {invitations.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No invitations yet.</p>
                        ) : (
                            <ul className="divide-y">
                                {invitations.map((i) => (
                                    <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                                        <div>
                                            <div className="font-medium">{i.email}</div>
                                            <div className="text-xs text-muted-foreground">{new Date(i.createdAt).toLocaleString()}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <code className="rounded-md border bg-muted/40 px-3 py-1 text-lg tracking-[0.4em]">{i.pin}</code>
                                            {i.used ? <Badge variant="secondary">Used</Badge> : <Badge>Active</Badge>}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={
                                                    () => copyPin(i.pin)
                                                }
                                                aria-label="Copy PIN"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={
                                                    // () => dispatch(deleteInvitation(i.id))
                                                    () => setClickMonitor(i.id)
                                                }
                                                aria-label="Delete">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                {/* Accounts Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Accounts ({accounts.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="divide-y">
                            {accounts.map((a) => (
                                <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                                    <div>
                                        <div className="font-medium">{a.name}</div>
                                        <div className="text-xs text-muted-foreground">{a.email}</div>
                                    </div>
                                    <Badge variant={a.role === "admin" ? "default" : "secondary"}>{a.role}</Badge>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </>
    )

}