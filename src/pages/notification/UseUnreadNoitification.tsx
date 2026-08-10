
// react requiremet
import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// components and library
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Eye, Handshake, Plane, FileText } from "lucide-react";
import { useNotifications } from "../notification";

// Typescript 
import { SEEN_KEY } from "./type";


export function useUnreadCount() {

    const notifs = useNotifications();

    const [seenAt, setSeenAt] = useState<string | null>(null);
    useEffect(() => {
        setSeenAt(typeof localStorage !== "undefined" ? localStorage.getItem(SEEN_KEY) : null);
        const onStorage = () => setSeenAt(localStorage.getItem(SEEN_KEY));
        window.addEventListener("storage", onStorage);
        window.addEventListener("imi:notifications-seen", onStorage);
        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("imi:notifications-seen", onStorage);
        };
    }, []);
    if (!seenAt) return notifs.length;
    return notifs.filter((n) => n.createdAt > seenAt).length;
}