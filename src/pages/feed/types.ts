import type { ExpenseCategory, ExpenseCurrency, Photo } from "@/store/types";

export type Kind = "post" | "see" | "meet" | "expense" | "poll";
export type Visibility = "everyone" | "my_team" | "only_me" | "restricted" | "draft";

export type PollData = {
    question: string;
    options: { id: string; label: string; votes: string[] }[];
};

export type ExpenseData = {
    date: string;
    desc: string;
    category: ExpenseCategory;
    currency: ExpenseCurrency;
    amount: string;
    receipt: boolean;
    notes: string;
};

export type FeelingData = {
    rating: number;
    text: string;
    photos: Photo[];
};