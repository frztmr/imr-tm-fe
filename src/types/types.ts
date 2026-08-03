export type TripStatus = "planned" | "in_progress" | "completed";

export interface Photo {
  id: string;
  url: string;
  caption: string;
}

export interface MarketIntel {
  importDuty: string;
  vat: string;
  certifications: string;
}

export interface Competitor {
  id: string;
  brand: string;
  flavour: string;
  noodleType: string;
  price: string;
  presence: string;
  caption: string;
  photo?: Photo;
  isDraft?: boolean;
}

export interface Appointment {
  id: string;
  partner: string;
  date: string;
  status: "confirmed" | "pending" | "cancelled";
  location: string;
  contact: string;
  agenda: string;
  outcome: string;
  notes: string;
  isDraft?: boolean;
}

export interface ToolkitItem {
  id: string;
  label: string;
  checked: boolean;
  notes: string;
}
export interface Toolkit {
  items: ToolkitItem[];
}

export interface AuditDetail {
  id: string;
  label: string;
  value: string;
}

export interface RetailAudit {
  id: string;
  storeName: string;
  lat: number;
  lng: number;
  shelfPrice: string;
  promoPrice: string;
  category: string;
  contactPerson: string;
  notes: string;
  details: AuditDetail[];
  photos: Photo[];
  isDraft?: boolean;
}

export interface PartnerLog {
  id: string;
  partner: string;
  notes: string;
  painPoint: string;
  evidence: string;
  photos: Photo[];
  isDraft?: boolean;
}

export interface SentimentLog {
  id: string;
  note: string;
  competitor: string;
  photos: Photo[];
  isDraft?: boolean;
}

export interface TripReport {
  followUpSent: boolean;
  forecastVolume: number;
  adjustments: string;
}

export type ExpenditureCategory =
  | "Airticket"
  | "Visa"
  | "Hotel Accomodation"
  | "Meals"
  | "Simcard"
  | "Transport"
  | "Daily Allowance"
  | "Others";

export interface ExpenditureLine {
  category: ExpenditureCategory;
  idr: number;
  usd: number;
  local: number;
  note?: string;
}

export interface WorkPlanRow {
  id: string;
  date: string;
  city: string;
  activities: string;
  note: string;
}

export interface TripApproval {
  country: string;
  cities: string[];
  startDate: string;
  endDate: string;
  days: number;
  purposes: string;
  localCurrency: string;
  expenditures: ExpenditureLine[];
  cashInAdvance: { idr: number; usd: number; local: number };
  workPlan: WorkPlanRow[];
  submitted: boolean;
  updatedAt: string;
}

export type MomentKind =
  | "observation"
  | "meeting"
  | "retail"
  | "competitor"
  | "sentiment"
  | "sighting"
  | "other";

export interface Moment {
  id: string;
  createdAt: string;          // ISO timestamp
  day?: string;               // YYYY-MM-DD — which trip day
  kind: MomentKind;
  title: string;
  note: string;
  location: string;
  photos: Photo[];
  includeInReport: boolean;   // user decides later whether it goes into the report
  isDraft?: boolean;
  // "I see something" — optional shelf-life / freshness window
  expiresAt?: string;         // YYYY-MM-DD
  // "I meet someone" — who you talked to + the impression they left
  contact?: string;
  impression?: string;
  isBusinessMeeting?: boolean;
}

export interface ApprovalFile {
  name: string;
  dataUrl: string;
  uploadedAt: string;
}

export interface Trip {
  id: string;
  title: string;
  country: string;
  cities: string[];
  assignee: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  isDraft?: boolean;
  marketIntel: MarketIntel;
  competitors: Competitor[];
  appointments: Appointment[];
  toolkit: Toolkit;
  retailAudits: RetailAudit[];
  partnerLogs: PartnerLog[];
  sentiment: SentimentLog[];
  postVisitPhotos: Photo[];
  moments: Moment[];
  report: TripReport;
  approval?: TripApproval;
  /** Uploaded Business Trip Approval document (required for Instant Trip Tag) */
  approvalFile?: ApprovalFile;
}

export interface FeedPost {
  id: string;
  author: string;
  createdAt: string;
  text: string;
  location: string;
  tags: string[];
  photos: Photo[];
  kind?: "post" | "see" | "meet";
  tripId?: string;
  tripTitle?: string;
  contact?: string;
  impression?: string;
  expiresAt?: string;
  replies?: PostReply[];
}

export interface PostReply {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  parentId?: string; // another reply id when this is a reply-to-reply
  photos?: Photo[];
}

export interface Account {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  createdAt: string;
}

export interface Invitation {
  id: string;
  pin: string;
  email: string;
  createdAt: string;
  used: boolean;
}
