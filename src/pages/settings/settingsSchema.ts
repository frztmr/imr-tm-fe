import {
  Bell, Eye, Globe2, Palette, Plane, ShieldCheck, User,
} from "lucide-react";

export type FieldType = "toggle" | "select" | "text";

export interface SettingField {
  key: string;
  label: string;
  description?: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  default: string | boolean;
}

export interface SettingGroup {
  id: string;
  label: string;
  description?: string;
  fields: SettingField[];
}

export interface SettingCategory {
  id: string;
  label: string;
  description: string;
  icon: typeof User;
  groups: SettingGroup[];
}

export const settingsCategories: SettingCategory[] = [
  {
    id: "account",
    label: "Account",
    description: "Identity, handle and how your profile appears to the team.",
    icon: User,
    groups: [
      {
        id: "profile",
        label: "Profile",
        description: "What other researchers see on your profile.",
        fields: [
          { key: "account.displayRole", label: "Show role badge", description: "Display Admin / Field Researcher on your profile.", type: "toggle", default: true },
          { key: "account.bio", label: "Short bio", description: "One line shown under your name.", type: "text", default: "" },
          {
            key: "account.homeTab", label: "Default home tab", type: "select", default: "foryou",
            options: [{ value: "foryou", label: "For You" }, { value: "following", label: "Following" }],
          },
        ],
      },
      {
        id: "security",
        label: "Security",
        fields: [
          { key: "account.twoStep", label: "Require PIN on new device", type: "toggle", default: false },
          {
            key: "account.session", label: "Auto sign-out", type: "select", default: "30d",
            options: [{ value: "1d", label: "After 1 day" }, { value: "7d", label: "After 7 days" }, { value: "30d", label: "After 30 days" }, { value: "never", label: "Never" }],
          },
        ],
      },
    ],
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Choose what reaches you, and how loudly.",
    icon: Bell,
    groups: [
      {
        id: "activity",
        label: "Activity",
        fields: [
          { key: "notif.replies", label: "Replies to my posts", type: "toggle", default: true },
          { key: "notif.mentions", label: "Mentions", type: "toggle", default: true },
          { key: "notif.tripUpdates", label: "Trip tag updates", type: "toggle", default: true },
        ],
      },
      {
        id: "delivery",
        label: "Delivery",
        fields: [
          {
            key: "notif.digest", label: "Email digest", type: "select", default: "weekly",
            options: [{ value: "off", label: "Off" }, { value: "daily", label: "Daily" }, { value: "weekly", label: "Weekly" }],
          },
          { key: "notif.quietHours", label: "Quiet hours (22:00–07:00)", type: "toggle", default: false },
        ],
      },
    ],
  },
  {
    id: "privacy",
    label: "Privacy",
    description: "Who can see your field notes, moments and trips.",
    icon: Eye,
    groups: [
      {
        id: "visibility",
        label: "Visibility",
        fields: [
          {
            key: "privacy.profile", label: "Profile visibility", type: "select", default: "team",
            options: [{ value: "team", label: "Everyone at IMI" }, { value: "country", label: "My country group" }, { value: "private", label: "Only me" }],
          },
          { key: "privacy.showTrips", label: "Show my trips on profile", type: "toggle", default: true },
          { key: "privacy.showLocation", label: "Attach location to posts", type: "toggle", default: true },
        ],
      },
    ],
  },
  {
    id: "capture",
    label: "Field capture",
    description: "Defaults for moments, photos and trip tags.",
    icon: Plane,
    groups: [
      {
        id: "moments",
        label: "Moments",
        fields: [
          { key: "capture.autoDraft", label: "Save new moments as draft", type: "toggle", default: true },
          { key: "capture.requireCaption", label: "Require photo captions", type: "toggle", default: true },
          {
            key: "capture.defaultKind", label: "Default capture type", type: "select", default: "sighting",
            options: [{ value: "sighting", label: "I see something" }, { value: "meeting", label: "I meet someone" }, { value: "post", label: "Plain post" }],
          },
        ],
      },
      {
        id: "approval",
        label: "Trip approval",
        fields: [
          { key: "capture.requireApprovalFile", label: "Require approval file on Instant Trip Tag", type: "toggle", default: true },
          {
            key: "capture.currency", label: "Preferred currency", type: "select", default: "IDR",
            options: [{ value: "IDR", label: "IDR" }, { value: "USD", label: "USD" }, { value: "LOCAL", label: "Local" }],
          },
        ],
      },
    ],
  },
  {
    id: "appearance",
    label: "Appearance",
    description: "Density, language and reading preferences.",
    icon: Palette,
    groups: [
      {
        id: "display",
        label: "Display",
        fields: [
          {
            key: "appearance.density", label: "Feed density", type: "select", default: "comfortable",
            options: [{ value: "comfortable", label: "Comfortable" }, { value: "compact", label: "Compact" }],
          },
          { key: "appearance.autoplay", label: "Autoplay photo carousels", type: "toggle", default: false },
          {
            key: "appearance.language", label: "Language", type: "select", default: "en",
            options: [{ value: "en", label: "English" }, { value: "id", label: "Bahasa Indonesia" }],
          },
        ],
      },
    ],
  },
];

export const adminScopeIcons = { country: Globe2, group: ShieldCheck, user: User };

export const allFields: SettingField[] = settingsCategories.flatMap((c) =>
  c.groups.flatMap((g) => g.fields),
);

export function fieldByKey(key: string) {
  return allFields.find((f) => f.key === key);
}

export const schemaDefaults: Record<string, string | boolean> = Object.fromEntries(
  allFields.map((f) => [f.key, f.default]),
);