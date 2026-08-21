
//React Requirement 
import {
    // useMemo,
    useState
} from "react";

//Component
import { Input } from "@/components/ui/input";
import {
    Search as SearchIcon,
    // MapPin, User, Plane, FileText
} from "lucide-react";

import PeopleSection from "./search/PeopleSection";
import TripsSection from "./search/TripsSection";
import PostsSection from "./search/PostsSection";

//Redux
// import { useAppSelector } from "@/store";


//Typescript, dummy data, and util 
function slug(name: string) { return encodeURIComponent(name); }

export default function SearchPage() {
    const [q, setQ] = useState("");

    return (
        <>
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-3 flex items-center gap-2 text-2xl font-semibold tracking-tight">
                    <SearchIcon className="h-5 w-5 text-primary" />
                    Search
                </h1>
                <div className="relative mb-6">
                    <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        autoFocus
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search people, trips, posts, #tags…"
                        className="pl-9"
                    />
                </div>

                <PeopleSection query={q} />
                <TripsSection query={q} />
                <PostsSection query={q} />
            </div>
        </>
    );
}
