

import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"; // adjust import
import { LucideIcon } from "lucide-react";

interface SettingsCategory {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  groups: SettingsGroup[];
}

interface SettingsCategoriesProps {
  categories: SettingsCategory[];
  resolvedSettings?: Record<string, { locked?: boolean }>;
  onCategoryClick?: (categoryId: string) => void;
  showSearch?: boolean;
  showManagedCount?: boolean;
}

export function SettingsCategories({ 
  categories, 
  resolvedSettings,
  onCategoryClick,
  showSearch = false,
  showManagedCount = true
}: SettingsCategoriesProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = searchTerm 
    ? categories.filter(cat => 
        cat.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : categories;

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search settings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      <div className="space-y-2">
        {filteredCategories.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No settings found matching "{searchTerm}"
          </p>
        ) : (
          filteredCategories.map((cat) => {
            const keys = cat.groups.flatMap((g) => g.fields.map((f) => f.key));
            const managed = resolvedSettings 
              ? keys.filter((k) => resolvedSettings[k]?.locked).length 
              : 0;
            const Icon = cat.icon;

            const content = (
              <Card className="transition hover:bg-accent my-3">
                <CardContent className="flex items-center gap-3 p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{cat.label}</span>
                      {showManagedCount && managed > 0 && (
                        <Badge variant="secondary" className="rounded-full text-[10px]">
                          {managed} managed
                        </Badge>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{cat.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            );

            if (onCategoryClick) {
              return (
                <button
                  key={cat.id}
                  onClick={() => onCategoryClick(cat.id)}
                  className="w-full text-left"
                >
                  {content}
                </button>
              );
            }

            return (
              <Link key={cat.id} to={`/settings/${cat.id}`}>
                {content}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}