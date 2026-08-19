
//React Requirement
import { Link } from "react-router-dom";
import { useMemo } from "react";

//Component
import { Globe2, MapPin, Users as UsersIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

//Redux
// import { useAppSelector } from "@/store";

//Typescript, Dummy Data, and Utilities
// import type { Account, Trip } from "@/store/types";
import type { Account, Trip } from "@/store/types";
import { initialsOf } from "@/lib/feed";
type PersonEntry = {
    name: string;
    account?: Account;
    trips: Trip[];
    countries: string[];
};


export default function PeoplePage() {

    //     const accounts = useAppSelector((s) => s.auth.accounts);
    //   const trips = useAppSelector((s) => s.trips.trips);
    //   const posts = useAppSelector((s) => s.posts.posts);
    return (
        <>
            <div className="mx-auto max-w-5xl">
                <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Globe2 className="h-3.5 w-3.5" /> People · clustered by country
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Researchers around the world</h1>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <UsersIcon className="h-4 w-4" />
                        {/* {totalPeople} {totalPeople === 1 ? "person" : "people"} · {grouped.length} {grouped.length === 1 ? "country" : "countries"} */}
                    </div>
                </header>
            </div>
        </>
    )

}