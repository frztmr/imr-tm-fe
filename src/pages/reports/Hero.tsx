
// React requirement
import { Link } from "react-router-dom";

//Component
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, MapPin, TrendingUp, ArrowRight, BookOpen, Receipt, FileText } from "lucide-react";
import { 
    initialsOf, 
} from './util' // sepaket ini bermasalah

// Redux
// import { useAppSelector } from "@/store";

//typescriput
import type { Trip } from "@/types/tipes";

export function Hero({ trip }: { trip: Trip }) {

    // ini cover photo. manupulate di sini
    const cover = trip.retailAudits.flatMap((a) => (a.photos ?? []).map((p) => p.url))[0];
    

    return (
        <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2">
                {cover ? (
                    <img
                        src={cover}
                        alt={`${(trip.cities ?? []).join(", ")} field cover`}
                        className="h-56 w-full object-cover md:h-full"
                        loading="lazy"
                    />
                ) : (
                    <div className="grid h-56 place-items-center bg-gradient-to-br from-primary/20 to-accent md:h-full">
                        <BookOpen className="h-12 w-12 text-primary/70" />
                    </div>
                )}
                <CardContent className="flex flex-col justify-center gap-3 p-6">
                    <Badge variant="outline" className="w-fit">Featured Report</Badge>
                    <h2 className="text-2xl font-semibold leading-tight md:text-3xl">{trip.title}</h2>
                    {/* <p className="text-sm text-muted-foreground">{snippet(trip)}</p> */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Avatar className="h-7 w-7">
                            <AvatarFallback className="bg-primary text-[10px] text-primary-foreground">
                                {/* OH INI YANG BERMASALAH */}
                                {initialsOf(trip.assignee)}
                            </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{trip.assignee}</span>
                        <span>·</span>
                        {/* <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {readMinutes(trip)} min read</span> */}
                    </div>
                    {/* <Link
                        to={`/trips/${trip.id}`} 
                        className="inline-flex w-fit items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                        Read report <ArrowRight className="h-4 w-4" />
                    </Link> */}
                </CardContent>
            </div>
        </Card>
    );
}