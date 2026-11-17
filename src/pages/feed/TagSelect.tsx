import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";

type Trip = { id: string; title: string; country: string; startDate: string; endDate: string };

type Props = {
    trips: Trip[];
    value: string[];                 // selected trip ids
    onChange: (v: string[]) => void;
};

export function TagSelect({ trips, value, onChange }: Props) {
    const [open, setOpen] = useState(false);

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const inDate = (t: Trip) => t.startDate <= today && today <= t.endDate;

    const toggle = (id: string) =>
        onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);

    const selected = value
        .map((id) => trips.find((t) => t.id === id))
        .filter((t): t is Trip => Boolean(t));

    const renderItem = (t: Trip, showDate: boolean) => (
        <CommandItem
            key={t.id}
            value={`${t.title} ${t.country} ${t.id}`}
            onSelect={() => toggle(t.id)}
        >
            <Check className={`mr-2 h-4 w-4 ${value.includes(t.id) ? "opacity-100" : "opacity-0"}`} />
            {t.title} · {t.country}{showDate ? ` (${t.startDate})` : ""}
        </CommandItem>
    );

    const active = trips.filter(inDate);
    const others = trips.filter((t) => !inDate(t));

    return (
        <div className="space-y-1.5">
            <Label htmlFor="trip">Tags</Label>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="trip"
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between font-normal"
                    >
                        <span className={selected.length ? "" : "text-muted-foreground"}>
                            {selected.length ? `${selected.length} tag${selected.length > 1 ? "s" : ""} selected` : "Select tags (optional)…"}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search tags…" />
                        <CommandList>
                            <CommandEmpty>No tag found.</CommandEmpty>
                            {active.length > 0 && (
                                <CommandGroup heading="Currently in date">
                                    {active.map((t) => renderItem(t, false))}
                                </CommandGroup>
                            )}
                            {others.length > 0 && (
                                <CommandGroup heading="Other trips">
                                    {others.map((t) => renderItem(t, true))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {selected.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {selected.map((t) => (
                        <Badge key={t.id} variant="secondary" className="gap-1 rounded-full pr-1 font-normal">
                            {t.title}
                            <button
                                type="button"
                                aria-label={`Remove ${t.title}`}
                                onClick={() => toggle(t.id)}
                                className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            <p className="text-[11px] text-muted-foreground">Optional. You can add multiple tags, including trips that aren&apos;t active.</p>
        </div>
    );
}
