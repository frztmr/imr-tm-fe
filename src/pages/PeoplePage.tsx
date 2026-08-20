
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
import { mockAccounts, mockTrips, } from '../data/mockData'
import { dummyFeedPost } from "@/store/dummyData";

import { initialsOf } from "@/lib/feed";
type PersonEntry = {
    name: string;
    account?: Account;
    trips: Trip[];
    countries: string[];
};


export default function PeoplePage() {

    /*
    DATA AKUN, TRIP, DAN POSTINGGAN:
        Sementara ini data dari redux. dari lovable diambil dari redux. 
        nanti diambil adri database. semua ini diambil dari database. 
    */
    //   const accounts = useAppSelector((s) => s.auth.accounts);
    //   const trips = useAppSelector((s) => s.trips.trips);
    //   const posts = useAppSelector((s) => s.posts.posts);
    const accounts = mockAccounts;
    const trips = mockTrips;
    const posts = [dummyFeedPost];

    const grouped = useMemo(() => {
        // Collect every known person name across accounts, trips, and posts
        const names = new Set<string>();
        accounts.forEach((a) => names.add(a.name));
        trips.forEach((t) => t.assignee && names.add(t.assignee));
        posts.forEach((p) => p.author && names.add(p.author));

        const people: PersonEntry[] = Array.from(names).map((name) => {
            const account = accounts.find((a) => a.name === name);
            const personTrips = trips.filter((t) => t.assignee === name);
            const countries = Array.from(new Set(personTrips.map((t) => t.country).filter(Boolean)));
            return { name, account, trips: personTrips, countries };
        });

        // Cluster by country (a person can appear under multiple countries)
        const buckets = new Map<string, PersonEntry[]>();
        for (const p of people) {
            const keys = p.countries.length > 0 ? p.countries : ["Unassigned"];
            for (const k of keys) {
                if (!buckets.has(k)) buckets.set(k, []);
                buckets.get(k)!.push(p);
            }
        }

        return Array.from(buckets.entries())
            .sort((a, b) => {
                if (a[0] === "Unassigned") return 1;
                if (b[0] === "Unassigned") return -1;
                return a[0].localeCompare(b[0]);
            })
            .map(([country, list]) => ({
                country,
                people: list.sort((a, b) => a.name.localeCompare(b.name)),
            }));
    }, [accounts, trips, posts]);

    const totalPeople = useMemo(() => {
        const s = new Set<string>();
        grouped.forEach((g) => g.people.forEach((p) => s.add(p.name)));
        return s.size;
    }, [grouped]);

    return (
        <>
            <div className="mx-auto max-w-5xl">
                <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Globe2 className="h-3.5 w-3.5" />
                            People · clustered by country
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                            Find Country Teams!
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <UsersIcon className="h-4 w-4" />
                        {totalPeople} {totalPeople === 1 ? "person" : "people"} · {grouped.length} {grouped.length === 1 ? "country" : "countries"}
                    </div>
                </header>

                {grouped.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">No people yet.</p>
                ) : (
                    <div className="space-y-8">
                        {grouped.map(({ country, people }) => (
                            <section key={country}>
                                <div className="mb-3 flex items-baseline justify-between gap-2 border-b pb-2">
                                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                                        <MapPin className="h-4 w-4 text-primary" /> {country}
                                    </h2>
                                    <span className="text-xs text-muted-foreground">{people.length} {people.length === 1 ? "researcher" : "researchers"}</span>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {people.map((p) => (
                                        <Link
                                            to={`/u/${p.name}`}
                                        >
                                            <Card className="h-full transition hover:bg-accent">
                                                <CardContent className="flex items-center gap-3 p-4">
                                                    <Avatar className="h-12 w-12 ring-2 ring-primary/15">
                                                        <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
                                                            {initialsOf(p.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className="truncate text-sm font-semibold">{p.name}</div>
                                                            {p.account?.role === "admin" && (
                                                                <Badge variant="secondary" className="rounded-full text-[10px]">Admin</Badge>
                                                            )}
                                                        </div>
                                                        <div className="truncate text-xs text-muted-foreground">
                                                            {p.trips.length} {p.trips.length === 1 ? "trip" : "trips"}
                                                            {p.countries.length > 1 ? " · " + p.countries.join(" · ") : ""}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </>
    )

}