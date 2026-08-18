import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card"; // adjust import based on your setup
import { Badge } from "@/components/ui/badge"; // adjust import based on your setup

interface Trip {
  id: string;
  title: string;
  country: string;
  cities?: string[];
  startDate: string;
  status: string;
}

interface TripsTabProps {
  trips: Trip[];
  onTripClick?: (tripId: string) => void; // optional for custom click handling
}

export function TripsTab({ trips, onTripClick }: TripsTabProps) {
  if (trips.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No trips yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {trips.map((trip) => {
        const content = (
          <Card className="transition hover:bg-accent">
            <CardContent className="flex items-center justify-between p-3">
              <div>
                <div className="text-sm font-medium">{trip.title}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {(trip.cities ?? []).join(", ")}, {trip.country} · {trip.startDate}
                </div>
              </div>
              <Badge variant="secondary" className="rounded-full">
                {trip.status}
              </Badge>
            </CardContent>
          </Card>
        );

        // If custom click handler is provided, use button instead of Link
        return onTripClick ? (
          <button
            key={trip.id}
            onClick={() => onTripClick(trip.id)}
            className="w-full text-left"
          >
            {content}
          </button>
        ) : (
          <Link key={trip.id} to={`/trips/${trip.id}`}>
            {content}
          </Link>
        );
      })}
    </div>
  );
}