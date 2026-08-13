
// react requiremet
import { useEffect, useState } from "react";

// components and library 
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