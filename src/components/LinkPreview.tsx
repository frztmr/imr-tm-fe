import { Fragment } from "react";
import { ExternalLink, Globe } from "lucide-react";

// http(s)://… or www.… — stops at whitespace and common closing brackets/quotes
const URL_RE = /\b(?:https?:\/\/|www\.)[^\s<>"'()[\]{}]+/gi;
// punctuation that usually ends a sentence, not the URL
const TRAILING_RE = /[.,;:!?]+$/;

type Found = { text: string; href: string; url: URL };

function toUrl(raw: string): Found | null {
    const text = raw.replace(TRAILING_RE, "");
    const href = /^https?:\/\//i.test(text) ? text : `https://${text}`;
    try {
        const url = new URL(href);
        if (url.protocol !== "http:" && url.protocol !== "https:") return null;
        if (!url.hostname.includes(".")) return null;
        return { text, href: url.href, url };
    } catch {
        return null;
    }
}

/** All valid http(s) links found in a text, in order. */
export function extractLinks(text: string): Found[] {
    const out: Found[] = [];
    for (const m of text.matchAll(URL_RE)) {
        const f = toUrl(m[0]);
        if (f) out.push(f);
    }
    return out;
}

const stop = (e: React.MouseEvent) => e.stopPropagation(); // don't open the post when clicking a link

/** Post text with URLs turned into clickable links. */
export function LinkifiedText({ text, className }: { text: string; className?: string }) {
    const parts: React.ReactNode[] = [];
    let last = 0;
    for (const m of text.matchAll(URL_RE)) {
        const f = toUrl(m[0]);
        if (!f) continue;
        const start = m.index ?? 0;
        parts.push(text.slice(last, start));
        parts.push(
            <a
                key={start}
                href={f.href}
                target="_blank"
                rel="noopener noreferrer nofollow"
                onClick={stop}
                className="break-all text-primary hover:underline"
            >
                {f.text}
            </a>
        );
        last = start + f.text.length; // trailing punctuation stays as plain text
    }
    parts.push(text.slice(last));

    return (
        <p className={className}>
            {parts.map((p, i) => <Fragment key={i}>{p}</Fragment>)}
        </p>
    );
}

/** Basic preview card for the first link in a text (domain + link, no fetching). */
export function LinkCard({ text }: { text: string }) {
    const first = extractLinks(text)[0];
    if (!first) return null;

    const { url, href } = first;
    const domain = url.hostname.replace(/^www\./, "");
    const path = `${url.pathname === "/" ? "" : url.pathname}${url.search}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            onClick={stop}
            className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3 py-2.5 transition hover:bg-muted/60"
        >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground">
                <Globe className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{domain}</div>
                {path && <div className="truncate text-xs text-muted-foreground">{path}</div>}
            </div>
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
        </a>
    );
}
