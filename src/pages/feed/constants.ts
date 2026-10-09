import { PenSquare, Eye, Users, Receipt, BarChart3 } from "lucide-react";
import type { Kind, Visibility } from "./types";
import type { ExpenseCategory } from "@/store/types";

export const KINDS: {
    id: Kind;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    hint: string;
}[] = [
    { id: "post", label: "Quick Note", icon: PenSquare, hint: "Share a quick note" },
    { id: "see", label: "I see something", icon: Eye, hint: "Product / competitor sighting" },
    { id: "meet", label: "I meet someone", icon: Users, hint: "Conversation or meeting" },
    { id: "expense", label: "Expenses and Receipts", icon: Receipt, hint: "Log a trip expense" },
    { id: "poll", label: "Polling", icon: BarChart3, hint: "Ask the team to vote" },
];

export const VISIBILITIES: { id: Visibility; label: string; hint: string }[] = [
    { id: "everyone", label: "Everyone", hint: "Visible to all users" },
    { id: "my_team", label: "My Team", hint: "Only your team members" },
    { id: "only_me", label: "Only Me", hint: "Private to you" },
    { id: "restricted", label: "Restricted", hint: "Only selected people" },
    { id: "draft", label: "Save as Draft", hint: "Not published yet" },
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
    "Accomodation", "Airport Tax", "Allowance", "Communication", "Meals",
    "Office", "Promotion", "Sample", "Ticket", "Transport", "Visa",
    "Laundry", "Entertainment", "Other",
];