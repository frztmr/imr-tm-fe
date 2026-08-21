


/*

 INI KAYAKNYA GAK KEPAKE

*/
// import everything first here

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { inventoryItems, warehouses, products, transactions } from "@/data/mockData";
// import { Package, Warehouse, AlertTriangle, TrendingUp } from "lucide-react";

// test ini harusnya app shell
import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Plane, Plus, Globe2, Home, BookOpen, Shield, LogIn, LogOut, Search, User,
  Users as UsersIcon, MessageCircle, Bell, Eye, Handshake, PenSquare,
} from "lucide-react";
import { cn } from "../lib/utils";
// import { useAppDispatch, useAppSelector } from "@/store";
// import { setCurrentUser } from "@/store/authSlice";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

type NavKey = "/" | "/reports" | "/messages" | "/notifications" | "/profile";

type NavItem = {
  key: NavKey;
  to: "/" | "/reports" | "/messages" | "/notifications" | "/u/$userId";
  label: string;
  icon: typeof Home;
  exact?: boolean;
};

// Primary menu arrangement: [home, article, direct message, notification, profile]
const nav: NavItem[] = [
  { key: "/", to: "/", label: "Home", icon: Home, exact: true },
  { key: "/reports", to: "/reports", label: "Articles", icon: BookOpen },
  { key: "/messages", to: "/messages", label: "Messages", icon: MessageCircle },
  { key: "/notifications", to: "/notifications", label: "Notifications", icon: Bell },
  { key: "/profile", to: "/u/$userId", label: "Profile", icon: User },
];

const SEEN_KEY = "imrc.notifications.seenAt";

function useUnreadCount() {
  const posts = "useAppSelector((s) => s.posts.posts);"
  const trips = "useAppSelector((s) => s.trips.trips);"
  // const posts = useAppSelector((s) => s.posts.posts);
  // const trips = useAppSelector((s) => s.trips.trips);
  const [seenAt, setSeenAt] = useState<string | null>(null);

  useEffect(() => {
    const read = () => setSeenAt(localStorage.getItem(SEEN_KEY));
    read();
    window.addEventListener("storage", read);
    window.addEventListener("imi:notifications-seen", read);
    return () => {
      window.removeEventListener("storage", read);
      window.removeEventListener("imi:notifications-seen", read);
    };
  }, []);

  return useMemo(() => {
    const stamps = [
      // ...posts.map((p) => p.createdAt),
      // ...trips.map((t) => t.startDate || ""),
    ].filter(Boolean);
    if (!seenAt) return stamps.length;
    return stamps.filter((s) => s > seenAt).length;
  }, [posts, trips, seenAt]);
}

function CreateMenu({ trigger }: { trigger: React.ReactNode }) {
  const trips = useAppSelector((s) => s.trips.trips);
  const active = trips.find((t) => {
    const now = new Date().toISOString().slice(0, 10);
    return t.startDate <= now && now <= t.endDate;
  }) ?? trips[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Create</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/feed/new"><PenSquare className="mr-2 h-4 w-4" /> New post</Link>
        </DropdownMenuItem>
        {active && (
          <>
            <DropdownMenuItem asChild>
              <Link to={`/trips/${active.id}/capture`}>
                <Eye className="mr-2 h-4 w-4" /> I see something
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/trips/${active.id}/capture`}>
                <Handshake className="mr-2 h-4 w-4" /> I meet someone
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/trips/new"><Plane className="mr-2 h-4 w-4" /> New trip tag</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}



const Dashboard = () => {
 const pathname = useRouterState({ select: (s) => s.location.pathname });
  const dispatch = useAppDispatch();
  const { accounts, currentUserId } = useAppSelector((s) => s.auth);
  const current = accounts.find((a) => a.id === currentUserId) ?? null;
  const unread = useUnreadCount();

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  const activeFor = (n: NavItem) =>
    n.key === "/profile" ? pathname.startsWith("/u/") : isActive(n.key, n.exact);

  const renderItem = (n: NavItem, variant: "desktop" | "mobile") => {
    const Icon = n.icon;
    const active = activeFor(n);
    const badge = n.key === "/notifications" && unread > 0 ? unread : 0;

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
          params={{ userId: encodeURIComponent(current!.name) }}
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
    <div className="p-6 space-y-6">
      <h1>
        Miaw
      </h1>
    </div>
  );
};

export default Dashboard;