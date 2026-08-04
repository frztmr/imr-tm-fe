
// react requiremet
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

// components and library
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/SearchableSelect";
import { toast } from "sonner";
import { Tag, Upload, FileCheck2, X } from "lucide-react";
import countriesCities from "@/data/countriesCities.json";
import { useCurrentUser } from "@/lib/currentUser";

// Typescript
import type { Photo } from "@/types/tipes";

const NewTrip = () => {

    // Redux. Activate when ready
    // const dispatch = useAppDispatch(); 

    const user = useCurrentUser();
    const navigate = useNavigate();
    const data = countriesCities as Record<string, string[]>;
    const countries = useMemo(() => Object.keys(data).sort(), [data]);

    const [title, setTitle] = useState("");
    const [country, setCountry] = useState("");
    const [purpose, setPurpose] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [mode, setMode] = useState<"approval" | "instant">("approval");
    const [file, setFile] = useState<{ name: string; dataUrl: string } | null>(null);


    const pickFile = (f: File | undefined) => {
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => setFile({ name: f.name, dataUrl: String(reader.result) });
        reader.readAsDataURL(f);
    };
    const [city, setCity] = useState("");
    const [attachment, setAttachment] = useState<File | null>(null);
    const [attachmentError, setAttachmentError] = useState("");


    // Get cities for selected country
    const cities = useMemo(() => {
        if (!country) return [];
        return data[country] || [];
    }, [country, data]);

    const validateFile = (file: File): boolean => {
        const validTypes = [
            'application/pdf',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        const validExtensions = ['.pdf', '.xls', '.xlsx'];
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

        if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
            setAttachmentError("Only PDF, XLS, and XLSX files are allowed");
            return false;
        }

        setAttachmentError("");
        return true;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (validateFile(file)) {
                setAttachment(file);
            } else {
                e.target.value = '';
                setAttachment(null);
            }
        }
    };

    const clearFile = () => {
        setAttachment(null);
        setAttachmentError("");
        const input = document.getElementById('file-attachment') as HTMLInputElement;
        if (input) input.value = '';
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Give your trip a short name");
            return;
        }
        if (mode === "instant" && !file) {
            toast.error("Upload the signed Business Trip Approval file");
            return;
        }

        if (!attachment) {
            setAttachmentError("Please attach a file (PDF, XLS, or XLSX)");
            toast.error("File attachment is required");
            return;
        }

        // Here you would typically upload the file to your server/storage
        // For now, we'll just log it
        console.log("Attachment:", attachment.name, attachment.type, attachment.size);

        // // perhatian, ini redux untuk add data ke redux. 
        // harusnya ke database juga.  
        // const action = dispatch(addTrip({
        //     title: title.trim(),
        //     country: country || "—",
        //     cities: city ? [city] : [],
        //     purpose: purpose.trim() || undefined,
        //     assignee: user.name,
        //     startDate,
        //     endDate,
        //     approvalFile: mode === "instant" && file
        //         ? { name: file.name, dataUrl: file.dataUrl, uploadedAt: new Date().toISOString() }
        //         : undefined,
        // }));

        toast.success("Trip tag created");
        if (mode === "approval") {
            // // aktifkan di bawah jika Redux sudah aktif
            // // karena ini perlu trip ID
            // // aktifkan di bawah jika Redux sudah aktif
            // // karena ini perlu trip ID
            // navigate( `/trips/${action.payload.id}/approval` );
            navigate(`/trips/001/approval`);
        } else {
            // // aktifkan di bawah jika Redux sudah aktif
            // // karena ini perlu trip ID
            // navigate(`/trips/${action.payload.id}`);
            navigate("/trips/001");
        }
    };
    return (
        <div className="mx-auto max-w-xl">
            <div className="mb-4">
                <h1 className="flex items-center gap-2 text-2xl font-semibold">
                    <Tag className="h-5 w-5 text-primary" /> New Trip Tag
                </h1>
                <p className="text-sm text-muted-foreground">
                    Choose how you want to start: fill the full approval form, or tag instantly and upload the approval file.
                </p>
            </div>

            <div className="mb-4 grid grid-cols-2 rounded-full bg-muted p-1 text-sm font-medium">
                {([
                    { k: "approval", label: "Business Trip Approval" },
                    { k: "instant", label: "Instant Trip Tag" },
                ] as const).map((o) => (
                    <button
                        key={o.k}
                        type="button"
                        onClick={() => setMode(o.k)}
                        className={`rounded-full px-4 py-1.5 transition ${mode === o.k ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                            }`}
                    >
                        {o.label}
                    </button>
                ))}
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Tag this trip</CardTitle>
                    <CardDescription>
                        {mode === "approval"
                            ? "Name the trip, then continue to the Business Trip Approval form."
                            : "Name the trip and attach your signed Business Trip Approval file."}
                    </CardDescription>
                    <CardDescription>Name and file attachment are required.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-4">
                        <div className="grid gap-1.5">
                            <Label htmlFor="title">Trip name</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Seoul May Sweep" autoFocus />
                        </div>
                        <div className="grid gap-1.5">
                            <Label>Country (optional)</Label>
                            <SearchableSelect
                                value={country}
                                onChange={setCountry}
                                options={countries}
                                placeholder="Pick a country"
                                searchPlaceholder="Search country..."
                            />
                        </div>

                        {/* City dropdown - appears after country is selected */}
                        {country && cities.length > 0 && (
                            <div className="grid gap-1.5">
                                <Label>City (optional)</Label>
                                <SearchableSelect
                                    value={city}
                                    onChange={setCity}
                                    options={cities}
                                    placeholder="Pick a city"
                                    searchPlaceholder="Search city..."
                                />
                            </div>
                        )}

                        {/* Purpose or Goal of Trip */}
                        <div className="grid gap-1.5">
                            <Label htmlFor="purpose">Purpose or goal of trip (optional)</Label>
                            <Input
                                id="purpose"
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                placeholder="e.g. Market research, Client meetings, Site inspection"
                            />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="start">Start (optional)</Label>
                                <Input id="start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="end">End (optional)</Label>
                                <Input id="end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </div>
                        </div>

                        {mode === "instant" && (
                            <div className="grid gap-1.5">
                                <Label htmlFor="approval-file">
                                    Business Trip Approval file <span className="text-destructive">*</span>
                                </Label>
                                {file ? (
                                    <div className="flex items-center justify-between gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
                                        <span className="flex min-w-0 items-center gap-2">
                                            <FileCheck2 className="h-4 w-4 shrink-0 text-primary" />
                                            <span className="truncate">{file.name}</span>
                                        </span>
                                        <button type="button" onClick={() => setFile(null)} aria-label="Remove file">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="approval-file"
                                        className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed px-3 py-6 text-sm text-muted-foreground hover:bg-accent"
                                    >
                                        <Upload className="h-4 w-4" /> Upload PDF, image, or document
                                    </label>
                                )}
                                <input
                                    id="approval-file"
                                    type="file"
                                    accept=".pdf,image/*,.doc,.docx,.xls,.xlsx"
                                    className="hidden"
                                    onChange={(e) => pickFile(e.target.files?.[0])}
                                />
                            </div>
                        )}


                        {/* File Attachment Section - Now Mandatory */}
                        <div className="grid gap-1.5">
                            <Label htmlFor="file-attachment" className="flex items-center gap-1">
                                Attachment <span className="text-destructive">*</span>
                            </Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="file-attachment"
                                    type="file"
                                    onChange={handleFileChange}
                                    className={`flex-1 ${attachmentError ? 'border-destructive' : ''}`}
                                    accept=".pdf,.xls,.xlsx,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    required
                                />
                                {attachment && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
                                        <span className="truncate max-w-[100px]">{attachment.name}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                            onClick={clearFile}
                                        >
                                            ✕
                                        </Button>
                                    </div>
                                )}
                                {!attachment && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={clearFile}
                                        disabled
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                            {attachmentError && (
                                <p className="text-xs text-destructive">{attachmentError}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                <span className="text-destructive font-medium">* Required.</span> Only PDF, XLS, and XLSX files are allowed. Max file size: 10MB.
                            </p>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => navigate({ to: "/trips" })}>Cancel</Button>
                            <Button type="submit">{mode === "approval" ? "Continue to approval" : "Create trip tag"}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )

}

export default NewTrip