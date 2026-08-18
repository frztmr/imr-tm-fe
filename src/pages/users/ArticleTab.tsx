import { Link } from "react-router-dom";
import { BookOpen, FileText, Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card"; // adjust import based on your setup
import { Badge } from "@/components/ui/badge"; // adjust import based on your setup

interface Trip {
  id: string;
  title: string;
  country: string;
  cities?: string[];
  moments?: any[];
  expenses?: Array<{ author: string }>;
}

interface Post {
  id: string;
  tripId: string;
}

interface ArticlesTabProps {
  trips: Trip[];
  posts: Post[];
  userName: string; // for filtering expenses by author
}

export function ArticlesTab({ trips, posts, userName }: ArticlesTabProps) {
  if (trips.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No articles or documents yet.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {/* Reports Section */}
      <div className="space-y-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <BookOpen className="h-4 w-4 text-primary" /> Reports
        </h2>
        {trips.map((trip) => {
          const count = (trip.moments?.length ?? 0) + posts.filter((p) => p.tripId === trip.id).length;
          return (
            <Link key={trip.id} to={`/trips/${trip.id}/article`}>
              <Card className="transition hover:bg-accent">
                <CardContent className="flex items-center justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{trip.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {(trip.cities ?? []).join(", ")}, {trip.country} · {count} entr{count === 1 ? "y" : "ies"}
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-full">
                    Report
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Documents Section */}
      <div className="space-y-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <FileText className="h-4 w-4 text-primary" /> Documents
        </h2>
        {trips.map((trip) => {
          const items = (trip.expenses ?? []).filter((e) => e.author === userName);
          return (
            <Link key={trip.id} to={`/trips/${trip.id}/expenses`}>
              <Card className="transition hover:bg-accent">
                <CardContent className="flex items-center justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Receipt className="h-4 w-4 text-primary" /> Travel Expense Statement
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {trip.title} · {items.length} line item{items.length === 1 ? "" : "s"}
                    </div>
                  </div>
                  <Badge variant="secondary" className="rounded-full">
                    Document
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}