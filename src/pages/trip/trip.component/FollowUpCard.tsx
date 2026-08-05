import { Link } from "react-router-dom";
import { useState } from "react";

// components and library
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
    FileText,
    TrendingUp, Mail, BookOpen, Sparkles,
} from "lucide-react";
import { Labeled } from "../trip.component";

//Typescript
import type { TripReport, Moment } from "@/types/tipes";


const KIND_LABELS: Record<Moment["kind"], string> = {
    observation: "Observation",
    meeting: "Meeting",
    retail: "Retail",
    competitor: "Competitor",
    sentiment: "Sentiment",
    sighting: "Sighting",
    other: "Other",
};
function kindLabel(k: Moment["kind"]) { return KIND_LABELS[k] ?? k; }


export function ArticleCTA({ tripId }: { tripId: string }) {
    return (
        <Card>
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><BookOpen className="h-4 w-4 text-primary" /> Publish as Article</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                    Turn this report into a long-form article — auto-composed from your logs.
                </p>
                <Link to={`/trips/$${tripId}/article`}
                    className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                    <BookOpen className="h-4 w-4" /> Open article
                </Link>
            </CardContent>
        </Card>
    );
}

export function ReportCard({ trip }: { trip: any }) {
    const generate = () => {
        const blob = new Blob([JSON.stringify(trip, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "MVR-" + trip.id + ".json"; a.click();
        URL.revokeObjectURL(url);
        toast.success("Report generated");
    };
    return (
        <Card>
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><FileText className="h-4 w-4 text-primary" /> Market Visit Report (MVR)</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                    {trip.retailAudits.length} audit(s), {trip.appointments.length} meeting(s), {trip.partnerLogs.length} partner log(s), {trip.sentiment.length} sentiment note(s).
                </div>
                <Button onClick={generate} variant="outline">Download JSON</Button>
            </CardContent>
        </Card>
    );
}

export function ForecastCard({ tripId, report }: { tripId: string; report: TripReport }) {
    // const dispatch = useAppDispatch();
    const [form, setForm] = useState({ forecastVolume: report.forecastVolume, adjustments: report.adjustments });
    // const moments = useAppSelector((s) => s.trips.trips.find((t) => t.id === tripId)?.moments ?? []);
    const moments = [{
        id: "string",
        createdAt: "string",      // ISO timestamp
        day: "string",               // YYYY-MM-DD — which trip day
        kind: [],
        title: "Title",
        note: "string",
        location: "string",
        photos: [],
        includeInReport: true,   // user decides later whether it goes into the report
        isDraft: false,
        // "I see something" — optional shelf-life / freshness window
        expiresAt: "string",         // YYYY-MM-DD
        // "I meet someone" — who you talked to + the impression they left
        contact: "string",
        impression: "string",
        isBusinessMeeting: true

    }];
    const included = moments.filter((m) => m.includeInReport && !m.isDraft);
    const compile = () => {
        if (included.length === 0) {
            toast.error("No field-log moments marked for the report");
            return;
        }
        const summary = included
            .map((m) => `• [${kindLabel(m.kind)}${m.day ? " · " + m.day : ""}${m.location ? " · " + m.location : ""}] ${m.title || m.note}`)
            .join("\n");
        const next = form.adjustments?.trim()
            ? form.adjustments.trim() + "\n\n--- Field log ---\n" + summary
            : summary;
        setForm({ ...form, adjustments: next });
        toast.success(`Compiled ${included.length} moment(s)`);
    };
    return (
        <Card>
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="h-4 w-4 text-primary" /> Strategy Pivot & Forecast</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                <Labeled label="Expected volume (units)">
                    <Input type="number" value={form.forecastVolume || ""} onChange={(e) => setForm({ ...form, forecastVolume: +e.target.value })} />
                </Labeled>
                <Labeled label="Required product adjustments">
                    <Textarea value={form.adjustments} onChange={(e) => setForm({ ...form, adjustments: e.target.value })} placeholder="e.g. label, sweetness…" />
                </Labeled>
                <div className="flex flex-wrap justify-end gap-2">
                    <Button variant="outline" onClick={compile}>
                        <Sparkles className="mr-1 h-4 w-4" /> Compile from field log ({included.length})
                    </Button>
                    <Button onClick={
                        () => {
                            // dispatch(updateReport({ tripId, report: { ...report, ...form } }));
                            console.log("this should be dispatch(updateReport({ tripId, report: { ...report, ...form } }));");
                            toast.success("Forecast updated");
                        }}>Save
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export function FollowUpCard({ tripId, report }: { tripId: string; report: TripReport }) {

    //   const dispatch = useAppDispatch();
    return (
        <Card>
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Mail className="h-4 w-4 text-primary" /> 48-Hour Follow-up</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                    {report.followUpSent ? "Thank-you emails sent." : "Send thank-you emails to all confirmed partners."}
                </p>
                <Button onClick={() => {
                    // dispatch(updateReport({ tripId, report: { ...report, followUpSent: true } })); toast.success("Follow-up emails queued");

                    toast.success("Follow-up emails queued");
                    console.log("this should be dispatch(updateReport({ tripId, report: { ...report, followUpSent: true } }));");
                }}
                    disabled={report.followUpSent} variant={report.followUpSent ? "outline" : "default"}>
                    {report.followUpSent ? "Sent" : "Send Follow-up"}
                </Button>
            </CardContent>
        </Card>
    );
}