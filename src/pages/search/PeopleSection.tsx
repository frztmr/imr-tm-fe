//React Requirement
import { Link } from "react-router-dom";
import { useMemo } from "react";

//Component
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

//Typescript, dummy data, and util
import { initialsOf } from "@/lib/feed";
import { mockAccounts } from "@/data/mockData";
import { mockTrips } from "@/data/mockData";
import { mockFeedPosts } from "@/data/mockData";

function slug(name: string) { return encodeURIComponent(name); }

interface PeopleSectionProps {
  query?: string;
  // You can pass these as props or use Redux directly
  trips?: typeof mockTrips;
  posts?: typeof mockFeedPosts;
  accounts?: typeof mockAccounts;
}

export default function PeopleSection({ 
  query = "", 
  trips = mockTrips,
  posts = mockFeedPosts,
  accounts = mockAccounts 
}: PeopleSectionProps) {
  //   const trips = useAppSelector((s) => s.trips.trips);
  //   const posts = useAppSelector((s) => s.posts.posts);
  //   const accounts = useAppSelector((s) => s.auth.accounts);

  const people = useMemo(() => {
    const names = new Set<string>();
    trips.forEach((t) => names.add(t.assignee));
    posts.forEach((p) => names.add(p.author));
    accounts.forEach((a) => names.add(a.name));
    return Array.from(names)
      .filter((n) => !query || n.toLowerCase().includes(query.toLowerCase()))
      .sort();
  }, [trips, posts, accounts, query]);

  return (
    /* PeopleSection */
    <section className="mb-6">
      <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <User className="h-4 w-4" /> People ({people.length})
      </h2>
      {people.length === 0 ? (
        <p className="text-sm text-muted-foreground">No people match.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {people.slice(0, 12).map((name) => (
            <Link
              key={name}
              to={`/u/${slug(name)}`}
              className="flex items-center gap-3 rounded-lg border bg-card p-3 transition hover:bg-accent"
            >
              <Avatar className="h-10 w-10 ring-2 ring-primary/30">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {initialsOf(name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">
                  {name}
                </div>
                <div className="text-xs text-muted-foreground">
                  @{name.toLowerCase().replace(/\s+/g, "")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}