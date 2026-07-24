import { useState, useMemo } from "react";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import { PO_Number } from "@/types/inventory";

interface POComboboxProps {
  data: PO_Number[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function POCombobox({ data, value, onChange, disabled, }: POComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const filteredItems = data.filter((item) => {
      const text = `${item.po_number} - ${item.invoice_id} - ${item.cont_id}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
    return filteredItems.slice(0, 5); // tampilkan maksimal 5
  }, [data, search]);

  const selectedLabel = data.find(d => String(d.po_number) === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between border-sm border-black"
          disabled={disabled}
        >
          {selectedLabel
            ? `${selectedLabel.po_number} - ${selectedLabel.invoice_id} - ${selectedLabel.cont_id}`
            : "Select PO number"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search PO…" value={search} onValueChange={setSearch} disabled={disabled}/>
          <CommandList>
            {filtered.length === 0 ? (
              <p className="p-2 text-sm text-muted-foreground">No match</p>
            ) : (
              filtered.map((item) => (
                <CommandItem
                  key={item.po_number}
                  value={String(item.po_number)}
                  onSelect={() => {
                    onChange(String(item.po_number));
                    setOpen(false);
                  }}
                >
                  {`${item.po_number} - ${item.invoice_id} - ${item.cont_id}`}
                </CommandItem>
              ))
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}