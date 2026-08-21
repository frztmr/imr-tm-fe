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
import type { NavItem, NavKey } from "./navbar/types";
import CreateMenu from "./navbar/CreateMenu";

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
    const unread = 0;

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

    //ini untuk autoselect configurasi mana yang dirender di halaman
    const renderItem = (n: NavItem, variant: "desktop" | "mobile") => {
        const Icon = n.icon;
        const active = activeFor(n);
        // const badge = n.key === "/notifications" && unread > 0 ? unread : 0;
        const badge = 0

        const desktopCls = cn(
            "relative flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
            active && "bg-accent text-foreground",
        );
        const mobileCls = cn(
            "relative flex items-center justify-center py-3 text-muted-foreground",
            active && "text-primary",
        );

        const inner = (
            <>
                <span className="relative">
                    <Icon className={cn(variant === "mobile" ? "h-5 w-5" : "h-4 w-4")} />
                    {badge > 0 && (
                        <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground">
                            {badge > 9 ? "9+" : badge}
                        </span>
                    )}
                </span>
                {variant === "desktop" && n.label}
            </>
        );

        // Profile falls back to sign-in when logged out
        if (n.key === "/profile" && !current) {
            return (
                <Link
                    key={n.key}
                    to="/login"
                    aria-label="Sign in"
                    className={variant === "desktop" ? desktopCls : mobileCls}
                >
                    <LogIn className={variant === "mobile" ? "h-5 w-5" : "h-4 w-4"} />
                    {variant === "desktop" && "Sign in"}
                </Link>
            );
        }

        if (n.key === "/profile") {
            return (
                <Link
                    key={n.key}
                    to="/u/$userId"
                    // params={{ userId: encodeURIComponent(current!.name) }}
                    aria-label={n.label}
                    className={variant === "desktop" ? desktopCls : mobileCls}
                >
                    {inner}
                </Link>
            );
        }

        return (
            <Link
                key={n.key}
                to={n.key}
                aria-label={n.label}
                className={variant === "desktop" ? desktopCls : mobileCls}
            >
                {inner}
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Top bar */}
            <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
                            <Globe2 className="h-4 w-4" />
                        </span>
                        <div className="leading-tight">
                            <div className="text-sm font-semibold">IMI</div>
                            <div className="hidden text-xs text-muted-foreground sm:block">
                                International Market Insight
                            </div>
                        </div>
                    </Link>

                    <Link to="/settings" aria-label="Settings" className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground md:hidden">
                        <Settings className="h-5 w-5" />
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex">
                        {nav.map((n) => renderItem(n, "desktop"))}

                        <Link to="/search" aria-label="Search" className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                            isActive("/search") && "bg-accent text-foreground",
                        )}>
                            <Search className="h-4 w-4" /> Search
                        </Link>
                        <Link to="/trips" className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                            isActive("/trips") && "bg-accent text-foreground",
                        )}>
                            <Plane className="h-4 w-4" /> Trips
                        </Link>
                        <Link to="/people" className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                            isActive("/people") && "bg-accent text-foreground",
                        )}>
                            <UsersIcon className="h-4 w-4" /> People
                        </Link>

                        {/* {current?.role === "admin" && (
                            <Link to="/admin" className={cn(
                                "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                                isActive("/admin") && "bg-accent text-foreground",
                            )}>
                                <Shield className="h-4 w-4" /> Admin
                            </Link>
                        )} */}

                        <Link to="/settings" aria-label="Settings" className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                            isActive("/settings") && "bg-accent text-foreground",
                        )}>
                            <Settings className="h-4 w-4" /> Settings
                        </Link>

                        <CreateMenu
                            trigger={
                                <button className="ml-2 flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90">
                                    <Plus className="h-4 w-4" /> Create
                                </button>
                            }
                        />
                        {/* 
                        {current ? (
                            <button onClick={() => dispatch(setCurrentUser(null))}
                                aria-label="Sign out"
                                className="ml-1 flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
                                <LogOut className="h-4 w-4" />
                            </button>
                        ) : null} */}
                    </nav>
                </div>
            </header>

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
                    {nav.map((n) => renderItem(n, "mobile"))}
                </div>
            </nav>
        </div>
    )
}

export default NavBar;