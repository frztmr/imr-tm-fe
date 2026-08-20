
//react requirement
import { useState } from "react";
import { Link } from "react-router-dom";

//component 
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Settings } from "lucide-react";

import SendInvitationPinCard from "./admin/SendInvitationPinCard";
import GenerateAccountCard from "./admin/GenerateAccountCard";
import InvitationsListCard from "./admin/InvitationsListCard";
import AccountsListCard from "./admin/AccountsListCard";

//Redux
// import { useAppDispatch, useAppSelector } from "@/store";
// import { addAccount, addInvitation, deleteInvitation } from "@/store/authSlice";
 
export default function AdminPage() {

    // // Data dari redux, ini semua  ke global state
    // const dispatch = useAppDispatch();
    // const accounts = useAppSelector((s) => s.auth.accounts);
    // const invitations = useAppSelector((s) => s.auth.invitations); 

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

                    {/* Send Invitation Pin Card */}
                    <SendInvitationPinCard />

                    {/* Generate Account Card*/}
                    <GenerateAccountCard />

                </div>

                {/* Invitations List Card */}
                <InvitationsListCard />

                {/* Accounts List Card */}
                <AccountsListCard />

            </div>
        </>
    )

}