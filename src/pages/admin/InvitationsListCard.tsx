//react requirement
import { useState } from "react";

//component
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Copy, Trash2 } from "lucide-react";

//Typescript, Dummy data.
import { mockInvitations } from "@/data/mockData";

interface InvitationsListCardProps {
  // You can pass these as props or use Redux directly
  onInvitationDeleted?: (id: string) => void;
}

export default function InvitationsListCard({ onInvitationDeleted }: InvitationsListCardProps) {
  // // Data dari redux, ini semua ke global state
  // const dispatch = useAppDispatch();
  // const invitations = useAppSelector((s) => s.auth.invitations); 
  const invitations = mockInvitations;

  const [clickMonitor, setClickMonitor] = useState(false);

  const copyPin = async (pin: string) => {
    try { await navigator.clipboard.writeText(pin); toast.success("PIN copied"); }
    catch { toast.error("Copy failed"); }
  };

  return (
    /* Invitations List Card */
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
                      () => {
                        setClickMonitor(i.id);
                        if (onInvitationDeleted) {
                          onInvitationDeleted(i.id);
                        }
                      }
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
  );
}