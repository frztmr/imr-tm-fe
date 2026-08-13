
// React Requirement 
import { useEffect, useMemo, useRef, useState } from "react";


// component 
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageCircle, Send, ArrowLeft } from "lucide-react";

//Redux
// import { useAppSelector } from "@/store";


const DM_KEY = "imrc.dm.v1";
type Msg = { id: string; from: string; text: string; at: string };
type Threads = Record<string, Msg[]>;

function initialsOf(name: string) {
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}
function loadThreads(): Threads {
    if (typeof localStorage === "undefined") return {};
    try {
        return JSON.parse(localStorage.getItem(DM_KEY) || "{}") as Threads;
    }
    catch { return {}; }
}

export default function MessagesPage() {

    // ini proses dapat data messages. 
    // Terlalu berat jika menggunakan redux
    // const accounts = useAppSelector((s) => s.auth.accounts);
    // const currentUserId = useAppSelector((s) => s.auth.currentUserId);
    // const posts = useAppSelector((s) => s.posts.posts);
    // const trips = useAppSelector((s) => s.trips.trips);
    const accounts = [{}];
    const currentUserId = [{}];
    const posts = [{}];
    const trips = [{}];


    // const me = accounts.find((a) => a.id === currentUserId)?.name ?? "You";
    const me = "You";

    const people = useMemo(() => {
        const names = new Set<string>();
        // accounts.forEach((a) => names.add(a.name));
        // posts.forEach((p) => names.add(p.author));
        // trips.forEach((t) => names.add(t.assignee)); 
        names.delete(me);
        return [...names].filter(Boolean).sort();
    }, [accounts, posts, trips, me]);

    const [threads, setThreads] = useState<Threads>({});
    const [active, setActive] = useState<string | null>(null);
    const [draft, setDraft] = useState("");
    const [q, setQ] = useState("");
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setThreads(loadThreads()); }, []);
    useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [active, threads]);

    const persist = (next: Threads) => {
        setThreads(next);
        if (typeof localStorage !== "undefined") localStorage.setItem(DM_KEY, JSON.stringify(next));
    };

    const send = () => {
        if (!active || !draft.trim()) return;
        const msg: Msg = { id: `${Date.now()}`, from: me, text: draft.trim(), at: new Date().toISOString() };
        persist({ ...threads, [active]: [...(threads[active] ?? []), msg] });
        setDraft("");
    };

    const filtered = people.filter((p) => p.toLowerCase().includes(q.toLowerCase()));
    const lastOf = (n: string) => threads[n]?.[threads[n].length - 1];

    return (
        <div className="mx-auto max-w-5xl">
            <h1 className="mb-4 flex items-center gap-2 text-2xl font-bold">
                <MessageCircle className="h-6 w-6 text-primary" /> Direct Messages
            </h1>

            <div className="grid gap-4 md:grid-cols-[280px_1fr]">
                {/* Conversation list */}
                <Card className={cn(active && "hidden md:block")}>
                    <CardContent className="p-3">
                        <Input placeholder="Search people…" value={q} onChange={(e) => setQ(e.target.value)} className="mb-3" />
                        <div className="max-h-[60vh] space-y-1 overflow-y-auto">
                            {filtered.length === 0 && (
                                <p className="px-2 py-6 text-center text-sm text-muted-foreground">No people found.</p>
                            )}
                            {filtered.map((p) => {
                                const last = lastOf(p);
                                return (
                                    <button
                                        key={p}
                                        onClick={() => setActive(p)}
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-accent",
                                            active === p && "bg-accent",
                                        )}
                                    >
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback className="text-xs">{initialsOf(p)}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-sm font-medium">{p}</div>
                                            <div className="truncate text-xs text-muted-foreground">
                                                {last ? `${last.from === me ? "You: " : ""}${last.text}` : "Start a conversation"}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Thread */}
                <Card className={cn(!active && "hidden md:block")}>
                    {!active ? (
                        <CardContent className="grid h-[60vh] place-items-center text-sm text-muted-foreground">
                            Select a conversation to start messaging.
                        </CardContent>
                    ) : (
                        <CardContent className="flex h-[60vh] flex-col p-0">
                            <div className="flex items-center gap-3 border-b px-4 py-3">
                                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setActive(null)} aria-label="Back">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{initialsOf(active)}</AvatarFallback></Avatar>
                                <div className="text-sm font-semibold">{active}</div>
                            </div>
                            <div className="flex-1 space-y-2 overflow-y-auto p-4">
                                {(threads[active] ?? []).length === 0 && (
                                    <p className="py-10 text-center text-sm text-muted-foreground">No messages yet — say hello.</p>
                                )}
                                {(threads[active] ?? []).map((m) => (
                                    <div key={m.id} className={cn("flex", m.from === me ? "justify-end" : "justify-start")}>
                                        <div
                                            className={cn(
                                                "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                                                m.from === me ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                                            )}
                                        >
                                            {m.text}
                                            <div className={cn("mt-1 text-[10px] opacity-70")}>
                                                {new Date(m.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={endRef} />
                            </div>
                            <form
                                onSubmit={(e) => { e.preventDefault(); send(); }}
                                className="flex items-center gap-2 border-t p-3"
                            >
                                <Input placeholder={`Message ${active}…`} value={draft} onChange={(e) => setDraft(e.target.value)} />
                                <Button type="submit" size="icon" aria-label="Send"><Send className="h-4 w-4" /></Button>
                            </form>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    );
}
