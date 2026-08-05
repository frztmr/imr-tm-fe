
// react requiremet
import { Link, useParams } from "react-router-dom";

// components and library 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    ArrowLeft, MapPin, Calendar, Users,
    BookOpen,
    FileEdit, Sparkles,
} from "lucide-react";

// == generic component
import {
    MarketIntelCard,
    AppointmentCard,
    ToolkitCard,
    FieldLogCard,
    CompetitorCard,
    AuditCard,
    PartnerCard,
    SentimentCard,
    PostVisitPhotosCard,
    FollowUpCard,
    ArticleCTA,
    ReportCard,
    ForecastCard
} from './trip.component'


//Redux
/*
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addAppointment, deleteAppointment, updateAppointment,
  addAudit, deleteAudit, updateAudit,
  addCompetitor, deleteCompetitor, updateCompetitor,
  addPartnerLog, deletePartnerLog, updatePartnerLog,
  addPostVisitPhotos, deletePostVisitPhoto, updatePostVisitPhoto,
  addSentiment, deleteSentiment, updateSentiment,
  addToolkitItem, setStatus, setTripDraft,
  updateMarketIntel, updateReport, updateToolkit,
  deleteMoment, toggleMomentInclude,
} from "@/store/tripsSlice";
*/
// Typescript
import type { Photo } from "@/types/tipes";
import NotFound from "../NotFound";

const tones: Record<string, string> = {
    planned: "bg-info/10 text-info border-info/20",
    in_progress: "bg-warning/15 text-warning-foreground border-warning/30",
    completed: "bg-success/10 text-success border-success/20",
};

const TripDetail = () => {

    // // Data trip ambil dari redux
    // const trip = useAppSelector((s) => s.trips.trips.find((t) => t.id === tripId));
    // const dispatch = useAppDispatch();

    const { tripId } = useParams();
    // const trip = [];
    // const citiesLabel = (trip.cities ?? []).join(", "); join nama kotanya
    const citiesLabel = "Jakarta, Bandung";

    const trip = {
        id: "string",
        title: "Dummy trip",
        country: "Malaysia",
        cities: ["Ipoh"],
        assignee: "Jonathan",
        startDate: "27 June 2026",
        endDate: "27 July 2026",
        status: '',
        isDraft: false,
        marketIntel: "",
        competitors: [],
        appointments: [],
        toolkit: [],
        retailAudits: [],
        partnerLogs: [],
        sentiment: [],
        postVisitPhotos: [],
        moments: [],
        report: '',
    };
    if (!trip) throw NotFound; // ini buat lempar kalau trip ID gk ada


    return (
        <>
            <Link to="/trips" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> All trips
            </Link>

            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-semibold tracking-tight">{trip.title}</h1>
                        {trip.isDraft && <Badge variant="outline" className="border-warning/40 bg-warning/10 text-warning-foreground"><FileEdit className="mr-1 h-3 w-3" />Draft</Badge>}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{citiesLabel}, {trip.country}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{trip.startDate} → {trip.endDate}</span>
                        <span>·</span>
                        <span>{trip.assignee}</span>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={tones[trip.status]}>{trip.status.replace("_", " ")}</Badge>
                    <Select
                        value={trip.status}
                        onValueChange={
                            // (v) => dispatch(setStatus({ tripId: trip.id, status: v as never }))
                            () => console.log("it should be: dispatch(setStatus({ tripId: trip.id, status: v as never })")
                        }
                    >
                        <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant={trip.isDraft ? "default" : "outline"}
                        size="sm"
                        onClick={
                            // () => dispatch(setTripDraft({ tripId: trip.id, isDraft: !trip.isDraft }))
                            () => console.log("it should be: dispatch(setTripDraft({ tripId: trip.id, isDraft: !trip.isDraft }))")
                        }
                    >
                        {trip.isDraft ? "Mark as final" : "Save as draft"}
                    </Button>
                    <Link
                        to={`/trips/${trip.id}/approval`}
                        className="inline-flex items-center gap-1 rounded-md border-2 border-border bg-card px-3 py-2 text-sm font-medium hover:border-primary/50 hover:text-primary"
                    >
                        <BookOpen className="h-4 w-4" /> Approval form
                    </Link>
                    <Link
                        to={`/trips/${trip.id}/article`}
                        className="inline-flex items-center gap-1 rounded-md border-2 border-border bg-card px-3 py-2 text-sm font-medium hover:border-primary/50 hover:text-primary"
                    >
                        <BookOpen className="h-4 w-4" /> Article
                    </Link>
                </div>
            </div >

            {/* Trip-as-tag: the two primary capture flows */}
            < div className="mb-4 grid gap-3 sm:grid-cols-2" >
                <Link
                    to={`/trips/${trip.id}/capture`}
                    state={{ kind: "sighting" }}
                    className="group rounded-lg border-2 border-border bg-card p-4 transition hover:border-primary/60 hover:bg-accent"
                >
                    <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                            <Sparkles className="h-5 w-5" />
                        </span>
                        <div>
                            <div className="font-semibold">I see something</div>
                            <div className="text-xs text-muted-foreground">Spotted our product or a competitor — add expiry & notes.</div>
                        </div>
                    </div>
                </Link>
                <Link
                    to={`/trips/${trip.id}/capture`}
                    state={{ kind: "meeting" }}
                    className="group rounded-lg border-2 border-border bg-card p-4 transition hover:border-primary/60 hover:bg-accent"
                >
                    <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                            <Users className="h-5 w-5" />
                        </span>
                        <div>
                            <div className="font-semibold">I meet someone</div>
                            <div className="text-xs text-muted-foreground">Conversation, impression about our brand, or a business meeting.</div>
                        </div>
                    </div>
                </Link>
            </div >

            <Tabs defaultValue="pre" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pre">Pre-Visit</TabsTrigger>
                    <TabsTrigger value="exec">Execution</TabsTrigger>
                    <TabsTrigger value="post">Post-Visit</TabsTrigger>
                </TabsList>

                <TabsContent value="pre" className="mt-4 space-y-4">
                    <MarketIntelCard tripId={trip.id} intel={trip.marketIntel} />
                    <AppointmentCard tripId={trip.id} appointments={trip.appointments} />
                    <ToolkitCard tripId={trip.id} toolkit={trip.toolkit} />
                </TabsContent>

                <TabsContent value="exec" className="mt-4 space-y-4">
                    <FieldLogCard trip={trip} />
                    <CompetitorCard tripId={trip.id} competitors={trip.competitors} />
                    <AuditCard tripId={trip.id} audits={trip.retailAudits} />
                    <PartnerCard tripId={trip.id} logs={trip.partnerLogs} />
                    <SentimentCard tripId={trip.id} logs={trip.sentiment} />
                </TabsContent>

                <TabsContent value="post" className="mt-4 space-y-4">
                    <PostVisitPhotosCard tripId={trip.id} photos={trip.postVisitPhotos} />
                    <FollowUpCard tripId={trip.id} report={trip.report} />
                    <ArticleCTA tripId={trip.id} />
                    <ReportCard trip={trip} />
                    <ForecastCard tripId={trip.id} report={trip.report} />
                </TabsContent>
            </Tabs>
        </>
    )

}

export default TripDetail