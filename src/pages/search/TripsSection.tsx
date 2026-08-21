//React Requirement
import { Link } from "react-router-dom";
import { useMemo } from "react";

//Component
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, MapPin } from "lucide-react";


//Typescript, dummy data
import { mockTrips } from "@/data/mockData";

interface TripsSectionProps {
  query?: string;
  // You can pass these as props or use Redux directly
  trips?: typeof mockTrips;
}

export default function TripsSection({ 
  query = "", 
  trips = mockTrips 
}: TripsSectionProps) {
  //   const trips = useAppSelector((s) => s.trips.trips);

  const tripHits = useMemo(
    () => trips.filter((t) =>
      !query ||
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.country.toLowerCase().includes(query.toLowerCase()) ||
      (t.cities ?? []).some((c) => c.toLowerCase().includes(query.toLowerCase()))
    ),
    [trips, query],
  );

  return (
    /* TripsSection*/
    <section className="mb-6">
      <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <Plane className="h-4 w-4" /> Trips ({tripHits.length})
      </h2>
      <div className="space-y-2">
        {tripHits.slice(0, 8).map((t) => (
          <Link
            key={t.id} to={`/trips/${t.id}`} >
            <Card className="transition hover:bg-accent my-2">
              <CardContent className="flex items-center justify-between p-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{t.title}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {(t.cities ?? []).join(", ")},
                    {t.country}
                  </div>
                </div>
                <Badge variant="secondary" className="rounded-full">{t.status}</Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
        {tripHits.length === 0 &&
          <p className="text-sm text-muted-foreground">
            No trips match.
          </p>}
      </div>
    </section>
  );
}