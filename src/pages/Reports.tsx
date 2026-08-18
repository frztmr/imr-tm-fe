
// React requirement
import { Link } from "react-router-dom";

//Component
import {
    Card,
    CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
    TrendingUp,
    Receipt, FileText,
} from "lucide-react";
import { Hero, ArticleCard } from './reports/index'
// import {ArticleCard} from './reports/ArticleCard'
// import {Hero} from './reports/Hero'

// Redux
// import { useAppSelector } from "@/store";

//typescriput
import type { Trip } from "@/types/tipes";

//datas and mockdata
import { mockTrips } from '@/data/mockData'

export default function Reports() {


    //   const trips = useAppSelector((s) => s.trips.trips);
    // const totalForecast = trips.reduce((s, t) => s + (t.report?.forecastVolume ?? 0), 0);
    const trips = mockTrips; // ambil data dari mock up
    const totalForecast = trips.reduce((s, t) => s + (t.report?.forecastVolume ?? 0), 0);
    const [featured, ...rest] = trips;

    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Reports and Documents</h1>
                <p className="text-sm text-muted-foreground">
                    Long-form market visit reports and trip documents — written from the field, ready to share.
                </p>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border bg-card p-4 text-sm">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Aggregate forecast across all reports:</span>
                <span className="font-semibold">{totalForecast.toLocaleString()} units</span>
            </div>

            {/* Ini untuk membuat hero card */}
            {featured && <Hero trip={featured} />}


            {/* Ini untuk membuat article card */}
            {/* 
            
            check di loop di bawah. ini bikin error
            Kelihatannya datanya bermasalah
            kita matikan dulu fungsi untuk menampilkan article card
            coba kita sederhanakan


            */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((t) => (
                    <ArticleCard
                        key={t.id}
                        trip={t}
                    />
                ))}
            </div>

            <div className="mt-10">
                <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                    <FileText className="h-5 w-5 text-primary" /> Documents
                </h2>
                <p className="mb-4 text-sm text-muted-foreground">
                    Travel Expense Statements consolidated per trip from your Expenses and Receipts entries.
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {trips.map((t) => {
                        const items = t.expenses ?? [];
                        return (
                            <Link
                                key={t.id}
                                to={`/trips/${t.id}/expenses`}
                                className="group block">
                                <Card className="h-full">
                                    <CardContent className="space-y-2 p-4">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Receipt className="h-4 w-4 text-primary" />
                                            <Badge variant="outline" className="rounded-full">{t.country}</Badge>
                                        </div>
                                        <h3 className="text-base font-semibold leading-snug group-hover:text-primary">
                                            Travel Expense Statement
                                        </h3>
                                        <p className="line-clamp-1 text-sm text-muted-foreground">{t.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {items.length} line item{items.length === 1 ? "" : "s"}
                                            {items.filter((e) => e.receipt).length > 0 && ` · ${items.filter((e) => e.receipt).length} with receipt`}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}