
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
    PeoplePage
    </>
)

}