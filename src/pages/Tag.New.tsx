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

const NewTag = () => {

    // Redux. Activate when ready
    // const dispatch = useAppDispatch();
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
}
