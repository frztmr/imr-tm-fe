import { Link, useLocation, Outlet } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
    Plane, Plus, Globe2, Home,
    BookOpen, Shield,
    LogIn, LogOut,
    Search, User,
    Users as UsersIcon, MessageCircle,
    Bell, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import types and components
import type { NavItem } from "./navbar/types";
import CreateMenu from "./navbar/CreateMenu";
import TopBar from "./navbar/TopBar";
import { renderItem } from "./navbar/RenderItem";

//nav menu ini nanti didapat dari database
//ini semendara hardcode. 
const nav: NavItem[] = [
    { key: "/", to: "/", label: "Home", icon: Home, exact: true },
    { key: "/reports", to: "/reports", label: "Articles", icon: BookOpen },
    { key: "/messages", to: "/messages", label: "Messages", icon: MessageCircle },
    { key: "/notifications", to: "/notifications", label: "Notifications", icon: Bell },
    { key: "/profile", to: "/u/$userId", label: "Profile", icon: User },
];

const NavBar = (
    // { children }: { children: React.ReactNode }
) => {

    //function di bawah ini untuk membaca 
    // berapa yang sudah dibaca atau belum
    // const useUnreadCount = () => {
    //     const posts = useAppSelector((s) => s.posts.posts);
    //     const trips = useAppSelector((s) => s.trips.trips);
    //     const [seenAt, setSeenAt] = useState<string | null>(null);
    //     const [mounted, setMounted] = useState(false);

    //     useEffect(() => {
    //         setMounted(true);
    //         const read = () => setSeenAt(localStorage.getItem(SEEN_KEY));
    //         read();
    //         window.addEventListener("storage", read);
    //         window.addEventListener("imi:notifications-seen", read);
    //         return () => {
    //             window.removeEventListener("storage", read);
    //             window.removeEventListener("imi:notifications-seen", read);
    //         };
    //     }, []);

    //     return useMemo(() => {
    //         if (!mounted) return 0;
    //         const stamps = [
    //             ...posts.map((p) => p.createdAt),
    //             ...trips.map((t) => t.startDate || ""),
    //         ].filter(Boolean);
    //         if (!seenAt) return stamps.length;
    //         return stamps.filter((s) => s > seenAt).length;
    //     }, [posts, trips, seenAt, mounted]);
    // }

    // ini untuk notifikasi 
    // melihat berapa notifikasi yang belum terlihat
    // const unread = useUnreadCount(); 

    const location = useLocation();
    const pathname = location.pathname;

    //ini dapatkan data user id dari redux
    // const { accounts, currentUserId } = useAppSelector((s) => s.auth);
    // const current = accounts.find((a) => a.id === currentUserId) ?? null;
    const current = "tester";

    const isActive = (to: string, exact?: boolean) =>
        exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

    const activeFor = (n: NavItem) =>
        n.key === "/profile" ?
            pathname.startsWith("/u/") :
            isActive(n.key, n.exact);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <TopBar
                nav={nav}
                renderItem={renderItem}
                isActive={isActive}
                activeFor={activeFor}
                current={current}
            />

            <main
                className="mx-auto max-w-6xl px-4 pb-24 pt-6 md:pb-10">
                {<Outlet />}
            </main>

            {/* Mobile create button */}
            <div className="md:hidden">
                <CreateMenu
                    trigger={
                        <button
                            aria-label="Create"
                            className="fixed bottom-20 right-4 z-30 grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-background transition hover:opacity-90"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    }
                />
            </div>

            {/* Bottom nav (mobile) — icons only */}
            <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 backdrop-blur md:hidden">
                <div className="mx-auto grid max-w-6xl grid-cols-5">
                    {nav.map((n) => renderItem({ n, variant: "mobile", activeFor, current }))}
                </div>
            </nav>
        </div>
    )
}

export default NavBar;