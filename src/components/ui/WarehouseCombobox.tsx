import { useState, useMemo } from "react";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";

interface Warehouse {
  id: number;
  name: string;
  location_id: number;
}

interface WarehouseComboboxProps {
  data: Warehouse[];
  value: string;
  onChange: (value: Warehouse) => void;
}

export default function WarehouseCombobox({ data, value, onChange }: WarehouseComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return data
      .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 5);
  }, [search, data]);

  const selectedLabel = data.find(d => d.name === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between border-sm border-black">
          {selectedLabel ? selectedLabel.name : "Select warehouse"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search warehouse..." value={search} onValueChange={setSearch} />
          <CommandList>
            {filtered.length === 0 ? (
              <p className="p-2 text-sm text-muted-foreground">No warehouse found</p>
            ) : (
              filtered.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={() => {
                    onChange(item); // kirim object lengkap
                    setOpen(false);
                  }}
                >
                  {item.name}
                </CommandItem>
              ))
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
