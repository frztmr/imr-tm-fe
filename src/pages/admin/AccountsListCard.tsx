//component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

//Typescript, Dummy data.
import { mockAccounts } from "@/data/mockData";

interface AccountsListCardProps {
  // You can pass these as props or use Redux directly
  accounts?: typeof mockAccounts;
}

export default function AccountsListCard({ accounts = mockAccounts }: AccountsListCardProps) {
  // // Data dari redux, ini semua ke global state
  // const accounts = useAppSelector((s) => s.auth.accounts);
  
  return (
    /* Accounts List Card */
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Accounts
          ({accounts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {accounts.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <div className="font-medium">{a.name}</div>
                <div className="text-xs text-muted-foreground">{a.email}</div>
              </div>
              <Badge variant={
                a.role === "admin" ? "default" : "secondary"
              }>
                {a.role}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}