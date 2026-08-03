import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { SettingField } from "@/lib/settingsSchema";
import type { SettingValue } from "@/store/settingsSlice";

export function SettingControl({
  field, value, disabled, onChange,
}: {
  field: SettingField;
  value: SettingValue;
  disabled?: boolean;
  onChange: (v: SettingValue) => void;
}) {
  if (field.type === "toggle") {
    return (
      <Switch
        checked={Boolean(value)}
        disabled={disabled}
        onCheckedChange={(v) => onChange(v)}
        aria-label={field.label}
      />
    );
  }
  if (field.type === "select") {
    return (
      <Select value={String(value)} disabled={disabled} onValueChange={onChange}>
        <SelectTrigger className="w-[190px]" aria-label={field.label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(field.options ?? []).map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  return (
    <Input
      className="w-[220px]"
      value={String(value)}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      aria-label={field.label}
    />
  );
}