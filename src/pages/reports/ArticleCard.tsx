

// React requirement
import { Link } from "react-router-dom";

//Component
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Clock, MapPin,
    BookOpen,
} from "lucide-react";
import { snippet, initialsOf, readMinutes } from './'

// Redux
// import { useAppSelector } from "@/store";

//typescriput
import type { Trip } from "@/types/tipes";


export default function ArticleCard({ trip }: { trip: Trip }) {
    const cover = trip.retailAudits.flatMap((a) => (a.photos ?? []).map((p) => p.url))[0];
    return (
        <Link
            to={`/trips/${trip.id}`}
            className="group block">
            <Card className="h-full overflow-hidden">
                {cover ? (
                    <img
                        src={cover}
                        alt={`${(trip.cities ?? []).join(", ")} cover`}
                        loading="lazy"
                        className="h-44 w-full object-cover transition group-hover:scale-[1.02]"
                    />
                ) : (
                    <div className="grid h-44 place-items-center bg-gradient-to-br from-secondary to-muted">
                        <BookOpen className="h-10 w-10 text-muted-foreground/60" />
                    </div>
                )}
                <CardContent className="space-y-2 p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="rounded-full">{trip.country}</Badge>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {(trip.cities ?? []).join(", ")}</span>
                    </div>
                    <h3 className="line-clamp-2 text-base font-semibold leading-snug group-hover:text-primary">
                        {trip.title}
                    </h3>
                    <p className="line-clamp-3 text-sm text-muted-foreground">{snippet(trip)}</p>
                    <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-primary text-[10px] text-primary-foreground">
                                    {initialsOf(trip.assignee)}
                                </AvatarFallback>
                            </Avatar>
                            <span>{trip.assignee}</span>
                        </div>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {readMinutes(trip)} min</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}