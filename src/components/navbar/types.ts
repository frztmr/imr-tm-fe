import { Home } from "lucide-react";

export type NavKey = "/" | "/reports" | "/messages" | "/notifications" | "/profile";

export type NavItem = {
    key: NavKey;
    to: "/" | "/reports" | "/messages" | "/notifications" | "/user/$userId";
    label: string;
    icon: typeof Home;
    exact?: boolean;
};