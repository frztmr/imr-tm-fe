

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight, Search, Bell, Eye, Globe2, Palette, Plane, Settings as SettingsIcon, Shield, ShieldCheck, User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"; // adjust import
import { LucideIcon } from "lucide-react";
import API_CONF from "../../config/axios";
import { settingsCategories, SettingCategory, SettingGroup } from "./settingsSchema";

interface SettingsCategory {
  id: string;
  link: string;
  label: string;
  description: string;
  icon: LucideIcon;
  groups: SettingGroup[];
}

// row shape returned by GET /ui/settings (ui.settings table)
interface SettingsMenuRow {
  link: string | null;
  logo: string | null;
  title: string | null;
  subtitle: string | null;
}

interface SettingsCategoriesProps {
  categories?: SettingCategory[]; // schema used to look up the fields (groups) of each menu
  resolvedSettings?: Record<string, { locked?: boolean }>;
  onCategoryClick?: (categoryId: string) => void;
  showSearch?: boolean;
  showManagedCount?: boolean;
}

// logo is stored as text in DB, map it to lucide icon (case insensitive)
const iconMap: Record<string, LucideIcon> = {
  user: User,
  bell: Bell,
  eye: Eye,
  plane: Plane,
  palette: Palette,
  shield: Shield,
  shieldcheck: ShieldCheck,
  globe2: Globe2,
  settings: SettingsIcon,
};

const toIcon = (logo: string | null): LucideIcon =>
  iconMap[(logo ?? "").toLowerCase().replace(/[-_\s]/g, "")] ?? SettingsIcon;

export function SettingsCategories({
  categories = settingsCategories,
  resolvedSettings,
  onCategoryClick,
  showSearch = false,
  showManagedCount = true
}: SettingsCategoriesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuList, setMenuList] = useState<SettingsCategory[]>([]);

  const filteredCategories = searchTerm
    ? menuList.filter(cat =>
      cat.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : menuList;

  useEffect(() => {
    API_CONF.get<SettingsMenuRow[]>('/ui/settings')
      .then((res) => {
        console.log("results at /ui/settings ", res.data)
        const rows = Array.isArray(res.data) ? res.data : [];
        const results: SettingsCategory[] = rows
          .filter((row) => row.link) // LEFT JOIN returns a null row when user has no allowed menu
          .map((row) => {
            const link = row.link!.startsWith("/") ? row.link! : `/settings/${row.link}`;
            const id = link.split("/").filter(Boolean).pop() ?? "";
            return {
              id,
              link,
              label: row.title ?? "",
              description: row.subtitle ?? "",
              icon: toIcon(row.logo),
              groups: categories.find((c) => c.id === id)?.groups ?? [],
            };
          });
        setMenuList(results)
      })
      .catch(
        (error) => {
          console.log("error at : SettingsCategories.tsx while get settings", error)
        })
      .finally(() => setLoading(false))

  }, []);

  if (loading) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Loading settings...</p>;
  }

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
            {searchTerm ? `No settings found matching "${searchTerm}"` : "No settings available"}
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
                  key={cat.link}
                  onClick={() => onCategoryClick(cat.id)}
                  className="w-full text-left"
                >
                  {content}
                </button>
              );
            }

            return (
              <Link key={cat.link} to={cat.link}>
                {content}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
