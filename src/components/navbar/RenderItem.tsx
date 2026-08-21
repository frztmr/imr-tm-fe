import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LogIn } from "lucide-react";
import type { NavItem } from "./types";

interface RenderItemProps {
  n: NavItem;
  variant: "desktop" | "mobile";
  activeFor: (n: NavItem) => boolean;
  current: string | null;
}

export function renderItem({ n, variant, activeFor, current }: RenderItemProps) {
  const Icon = n.icon;
  const active = activeFor(n);
  // const badge = n.key === "/notifications" && unread > 0 ? unread : 0;
  const badge = 0;

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
}