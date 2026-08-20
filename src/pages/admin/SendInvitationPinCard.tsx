//react requirement
import { useState } from "react";

//component
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

//Typescript, Dummy data.
import { mockInvitations } from "@/data/mockData";

interface SendInvitationPinCardProps {
  // You can pass these as props or use Redux directly
  onInvitationCreated?: (email: string) => void;
}

export default function SendInvitationPinCard({ onInvitationCreated }: SendInvitationPinCardProps) {
  // // Data dari redux, ini semua ke global state
  // const dispatch = useAppDispatch();
  // const invitations = useAppSelector((s) => s.auth.invitations); 
  const invitations = mockInvitations;

  const [invEmail, setInvEmail] = useState("");

  const createInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invEmail.trim()) { toast.error("Email is required"); return; }
    // dispatch(addInvitation({ email: invEmail.trim() }));
    if (onInvitationCreated) {
      onInvitationCreated(invEmail.trim());
    }
    setInvEmail("");
    toast.success("Invitation PIN generated");
  };

  return (
    /* Send Invitation Pin Card */
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
  );
}