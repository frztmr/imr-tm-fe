import { Link } from "react-router-dom";
import {
  Plane, Plus, Globe2,
  Search, Users as UsersIcon,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "./types";
import CreateMenu from "./CreateMenu";
import { renderItem } from "./RenderItem";

interface TopBarProps {
  nav: NavItem[];
  renderItem: typeof renderItem;
  isActive: (to: string, exact?: boolean) => boolean;
  activeFor: (n: NavItem) => boolean;
  current: string | null;
}

export default function TopBar({ 
  nav, 
  renderItem, 
  isActive, 
  activeFor, 
  current 
}: TopBarProps) {
  return (
    /* Top bar */
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
          {nav.map((n) => renderItem({ n, variant: "desktop", activeFor, current }))}

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
  );
}