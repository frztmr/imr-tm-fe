
// react requiremet
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// components and library
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Eye, Handshake, Plane, FileText } from "lucide-react";
import { useNotifications, SEEN_KEY } from "./notification/";

const iconFor = { post: FileText, see: Eye, meet: Handshake, trip: Plane } as const;

// Typescript 
function initialsOf(name: string) {
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}


export default function NotificationsPage() {
    // const notifs = useNotifications();
    const [seenAt, setSeenAt] = useState<string | null>(null);

    // ini untuk fetch data notifikasi
    // useEffect(() => {
    //     setSeenAt(localStorage.getItem(SEEN_KEY));
    //     const now = new Date().toISOString();
    //     localStorage.setItem(SEEN_KEY, now);
    //     window.dispatchEvent(new Event("imi:notifications-seen"));
    // }, [notifs.length]);

    const markAllRead = () => {
        const now = new Date().toISOString();
        // localStorage.setItem(SEEN_KEY, now); // ini variabel bermasalah yang sebabkan blank page
        setSeenAt(now);
        window.dispatchEvent(new Event("imi:notifications-seen"));
    };

    return (

        <div className="mx-auto max-w-2xl">
            notif
            <div className="mb-4 flex items-center justify-between">
                <h1 className="flex items-center gap-2 text-2xl font-bold">
                    <Bell className="h-6 w-6 text-primary" /> Notifications
                </h1>
                {/* <Button variant="outline" size="sm" onClick={markAllRead}>Mark all read</Button> */}
            </div>

            {
                // notifs.length === 0
                //     ? (
                        <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">
                            Nothing yet. Activity from trips and posts will show up here.
                        </CardContent></Card>
                    // ) : (
                    //     <div className="space-y-2">
                    //         {notifs.map((n) => {
                    //             const Icon = iconFor[n.kind];
                    //             const unread = !seenAt || n.createdAt > seenAt;
                    //             return (
                    //                 <Card key={n.id} className={unread ? "border-primary/40 bg-primary/5" : undefined}>
                    //                     <CardContent className="flex items-start gap-3 py-3">
                    //                         <Avatar className="h-9 w-9">
                    //                             <AvatarFallback className="text-xs">{initialsOf(n.actor || "?")}</AvatarFallback>
                    //                         </Avatar>
                    //                         <div className="min-w-0 flex-1">
                    //                             <p className="text-sm">
                    //                                 <Link
                    //                                     to={`/u/${n.actor}`} // ini url ke profile
                    //                                     className="font-semibold hover:underline">
                    //                                     {n.actor}
                    //                                 </Link>{" "}
                    //                                 <span className="text-muted-foreground">{n.text}</span>
                    //                             </p>
                    //                             <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    //                                 <Icon className="h-3.5 w-3.5" />
                    //                                 <span>{new Date(n.createdAt).toLocaleString()}</span>
                    //                                 {unread && <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">New</Badge>}
                    //                             </div>
                    //                         </div>
                    //                         {n.to && (
                    //                             <Link
                    //                                 to={`/trips/${n.to.tripId}/article `}
                    //                                 className="shrink-0 text-xs font-medium text-primary hover:underline"
                    //                             >
                    //                                 View
                    //                             </Link>
                    //                         )}
                    //                     </CardContent>
                    //                 </Card>
                    //             );
                    //         })}
                    //     </div>
                    // )
            }
        </div>

    );
}
