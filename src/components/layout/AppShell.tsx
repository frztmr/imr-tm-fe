import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Plane, Plus, Globe2, Sparkles, BookOpen, Shield, LogIn, LogOut, Search, User, Users as UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { setCurrentUser } from "@/store/authSlice";

type NavItem = {
  to: "/" | "/search" | "/dashboard" | "/trips" | "/reports" | "/people" | "/trips/new" | "/profile";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const nav: NavItem[] = [
  { to: "/", label: "Feed", icon: Sparkles, exact: true },
  { to: "/search", label: "Search", icon: Search },
  { to: "/trips", label: "Trips", icon: Plane },
  { to: "/people", label: "People", icon: UsersIcon },
  { to: "/reports", label: "Articles", icon: BookOpen },
  { to: "/profile", label: "Profile", icon: User },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const dispatch = useAppDispatch();
  const { accounts, currentUserId } = useAppSelector((s) => s.auth);
  const current = accounts.find((a) => a.id === currentUserId) ?? null;
  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

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
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => {
              const Icon = n.icon;
              if (n.to === "/profile") {
                if (!current) return null;
                const active = pathname.startsWith("/u/");
                return (
                  <Link
                    key={n.to}
                    to="/u/$userId"
                    params={{ userId: encodeURIComponent(current.name) }}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                      active && "bg-accent text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {n.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                    isActive(n.to, n.exact) && "bg-accent text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
            {current?.role === "admin" && (
              <Link to="/admin" className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                isActive("/admin") && "bg-accent text-foreground",
              )}>
                <Shield className="h-4 w-4" /> Admin
              </Link>
            )}
            <Link
              to="/trips/new"
              className="ml-2 flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              New Trip
            </Link>
            {current ? (
              <>
                <Link
                  to="/u/$userId"
                  params={{ userId: encodeURIComponent(current.name) }}
                  className="ml-1 flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <User className="h-4 w-4" /> {current.name.split(" ")[0]}
                </Link>
                <button onClick={() => dispatch(setCurrentUser(null))}
                  aria-label="Sign out"
                  className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Link to="/login" className="ml-1 flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 md:pb-10">{children}</main>

      {/* Mobile floating new-trip button */}
      <Link
        to="/trips/new"
        aria-label="New Trip"
        className="fixed bottom-20 right-4 z-30 grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-background transition hover:opacity-90 md:hidden"
      >
        <Plus className="h-5 w-5" />
      </Link>

      {/* Bottom nav (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-6">
          {nav.map((n) => {
            if (n.to === "/profile") {
              if (current) {
                const active = pathname.startsWith("/u/");
                const Icon = n.icon;
                return (
                  <Link
                    key={n.to}
                    to="/u/$userId"
                    params={{ userId: encodeURIComponent(current.name) }}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium text-muted-foreground",
                      active && "text-primary",
                    )}
                  >
                    <Icon className={cn("h-5 w-5", active && "text-primary")} />
                    {n.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={n.to}
                  to="/login"
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium text-muted-foreground",
                    isActive("/login") && "text-primary",
                  )}
                >
                  <LogIn className="h-5 w-5" />
                  Sign in
                </Link>
              );
            }
            const Icon = n.icon;
            const active = isActive(n.to, n.exact);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium text-muted-foreground",
                  active && "text-primary",
                )}
              >
                <Icon className={cn("h-5 w-5", active && "text-primary")} />
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}