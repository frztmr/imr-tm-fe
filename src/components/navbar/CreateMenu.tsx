import { Link } from "react-router-dom";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plane, Eye, Handshake, PenSquare } from "lucide-react";

//Typescript, dummy data
// import { useAppSelector } from "@/store";
import { mockTrips } from "@/data/mockData";

interface CreateMenuProps {
    trigger: React.ReactNode;
}

export default function CreateMenu({ trigger }: CreateMenuProps) {

    // // ini untuk liat trip active
    //   const trips = useAppSelector((s) => s.trips.trips);
    //   const active = trips.find((t) => {
    //     const now = new Date().toISOString().slice(0, 10);
    //     return t.startDate <= now && now <= t.endDate;
    //   }) ?? trips[0];
    const trips = mockTrips
    const active = trips.find((t) => {
        const now = new Date().toISOString().slice(0, 10);
        return t.startDate <= now && now <= t.endDate;
    }) ?? trips[0];

    // const active = true;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Create</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link to="/feed/new"><PenSquare className="mr-2 h-4 w-4" /> New post</Link>
                </DropdownMenuItem>
                {/* {active && (
                    <>
                        <DropdownMenuItem asChild>
                            <Link to={`/trips/${active.id}/capture`}
                            // params={{ tripId: active.id }} //ambil data trip dari redux. nyalakan jika sudah aktif
                            // search={{ kind: "sighting" }} //ambil data trip dari redux. nyalakan jika sudah aktif
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                I see something
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                to={`/trips/${active.id}/capture`}
                            // params={{ tripId: active.id }} //ambil data trip dari redux. nyalakan jika sudah aktif
                            // search={{ kind: "meeting" }} //ambil data trip dari redux. nyalakan jika sudah aktif
                            >
                                <Handshake className="mr-2 h-4 w-4" />
                                I meet someone
                            </Link>
                        </DropdownMenuItem>
                    </>
                )} */}
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem asChild>
                    <Link to="/trips/new"><Plane className="mr-2 h-4 w-4" /> New trip tag</Link>
                </DropdownMenuItem> */}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}