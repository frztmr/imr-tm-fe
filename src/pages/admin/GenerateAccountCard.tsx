//react requirement
import { useState } from "react";

//component
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserCog } from "lucide-react";

//Typescript, Dummy data.
import { mockAccounts } from "@/data/mockData";

interface GenerateAccountCardProps {
  // You can pass these as props or use Redux directly
  onAccountCreated?: (data: { name: string; email: string; password: string; role: "admin" | "user" }) => void;
}

export default function GenerateAccountCard({ onAccountCreated }: GenerateAccountCardProps) {
  // // Data dari redux, ini semua ke global state
  // const dispatch = useAppDispatch();
  // const accounts = useAppSelector((s) => s.auth.accounts);
  const accounts = mockAccounts;

  const [accName, setAccName] = useState("");
  const [accEmail, setAccEmail] = useState("");
  const [accPassword, setAccPassword] = useState("");
  const [accRole, setAccRole] = useState<"admin" | "user">("user");

  const createAccountDirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accName.trim() || !accEmail.trim() || accPassword.length < 6) {
      toast.error("Fill all fields (password ≥ 6 chars)"); return;
    }
    if (accounts.some((a) => a.email.toLowerCase() === accEmail.trim().toLowerCase())) {
      toast.error("Email already exists"); return;
    }
    // dispatch(addAccount({ name: accName.trim(), email: accEmail.trim(), password: accPassword, role: accRole }));
    if (onAccountCreated) {
      onAccountCreated({ name: accName.trim(), email: accEmail.trim(), password: accPassword, role: accRole });
    }
    setAccName(""); setAccEmail(""); setAccPassword(""); setAccRole("user");
    toast.success("Account created");
  };

  return (
    /* Generate Account Card*/
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
  );
}