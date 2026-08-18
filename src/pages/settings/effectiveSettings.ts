import type { RootState } from "@/store";
import type { ScopeOverride, SettingValue, SettingValues } from "@/store/settingsSlice";
import { schemaDefaults } from "./settingsSchema";

export interface ResolvedSetting {
  value: SettingValue;
  source: "schema" | "global" | "country" | "group" | "user-scope" | "user";
  locked: boolean;
}

/** Country a user is associated with — derived from their most recent trip. */
export function countryOfUser(state: RootState, accountName: string): string | null {
  const trips = state.trips.trips
    .filter((t) => t.assignee === accountName)
    .sort((a, b) => (b.startDate || "").localeCompare(a.startDate || ""));
  return trips[0]?.country ?? null;
}

function pick(overrides: ScopeOverride[], scope: ScopeOverride["scope"], target: string | null) {
  if (!target) return undefined;
  return overrides.find((o) => o.scope === scope && o.target === target);
}

export function resolveSettings(state: RootState, accountId: string | null): Record<string, ResolvedSetting> {
  const s = state.settings;
  const account = state.auth.accounts.find((a) => a.id === accountId) ?? null;
  const country = account ? countryOfUser(state, account.name) : null;
  const groupIds = s.groups.filter((g) => accountId && g.members.includes(accountId)).map((g) => g.id);

  const layers: { values: SettingValues; locked: string[]; source: ResolvedSetting["source"] }[] = [
    { values: schemaDefaults, locked: [], source: "schema" },
    { values: s.globalDefaults, locked: [], source: "global" },
  ];

  const countryOv = pick(s.overrides, "country", country);
  if (countryOv) layers.push({ values: countryOv.values, locked: countryOv.lockedKeys, source: "country" });

  groupIds.forEach((gid) => {
    const ov = pick(s.overrides, "group", gid);
    if (ov) layers.push({ values: ov.values, locked: ov.lockedKeys, source: "group" });
  });

  const userOv = pick(s.overrides, "user", accountId);
  if (userOv) layers.push({ values: userOv.values, locked: userOv.lockedKeys, source: "user-scope" });

  const out: Record<string, ResolvedSetting> = {};
  for (const key of Object.keys(schemaDefaults)) {
    let value = schemaDefaults[key];
    let source: ResolvedSetting["source"] = "schema";
    let locked = false;
    for (const layer of layers) {
      if (key in layer.values) { value = layer.values[key]; source = layer.source; }
      if (layer.locked.includes(key)) locked = true;
    }
    const personal = accountId ? s.user[accountId] : undefined;
    if (!locked && personal && key in personal) { value = personal[key]; source = "user"; }
    out[key] = { value, source, locked };
  }
  return out;
}

export const sourceLabel: Record<ResolvedSetting["source"], string> = {
  schema: "Default",
  global: "Org default",
  country: "Country policy",
  group: "Group policy",
  "user-scope": "Assigned to you",
  user: "Your choice",
};