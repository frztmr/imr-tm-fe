
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingControl } from "@/components/SettingControl";
import { settingsCategories, schemaDefaults } from "../settingsSchema";
import { setGlobalDefault } from "@/store/settingsSlice";
// import { useAppDispatch } from "@/store";

interface SettingsDefaultsProps {
  categories?: typeof settingsCategories; // optional to allow passing custom categories
  values?: Record<string, any>; // optional to override schema defaults
  onValueChange?: (key: string, value: any) => void; // optional custom change handler
}

export default function OrgDefaults({ 
  categories = settingsCategories,
  values,
  onValueChange
}: SettingsDefaultsProps) {
//   const dispatch = useAppDispatch();

  const handleChange = (key: string, value: any) => {
    if (onValueChange) {
      onValueChange(key, value);
    } else {
    //   dispatch(setGlobalDefault({ key, value }));
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Applies to everyone unless a country, group or user policy overrides it.
      </p>
      
      {categories.map((cat) => (
        <Card key={cat.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{cat.label}</CardTitle>
            <CardDescription>{cat.description}</CardDescription>
          </CardHeader>
          <CardContent className="divide-y p-0">
            {cat.groups.flatMap((g) => g.fields).map((f) => {
              // Use provided values or fallback to schema defaults
              const value = values?.[f.key] ?? schemaDefaults[f.key];
              
              return (
                <div 
                  key={f.key} 
                  className="flex flex-wrap items-center justify-between gap-3 px-6 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{f.label}</div>
                    <div className="text-xs text-muted-foreground">{f.key}</div>
                  </div>
                  <SettingControl
                    field={f}
                    value={value}
                    onChange={(v) => handleChange(f.key, v)}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}