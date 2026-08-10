export const SEEN_KEY = "imrc.notifications.seenAt";



export type Notif = {
    id: string;
    actor: string;
    createdAt: string;
    kind: "post" | "see" | "meet" | "trip";
    text: string;
    to?: { tripId: string };
};