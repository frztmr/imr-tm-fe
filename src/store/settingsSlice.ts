import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";

export type SettingValue = string | boolean;
export type SettingValues = Record<string, SettingValue>;
export type ScopeKind = "country" | "group" | "user";

export interface CustomGroup {
  id: string;
  name: string;
  members: string[]; // account ids
}

export interface ScopeOverride {
  id: string;
  scope: ScopeKind;
  target: string;          // country name | group id | account id
  values: SettingValues;
  lockedKeys: string[];    // keys users cannot change
}

export interface SettingsState {
  /** per-user preferences, keyed by account id */
  user: Record<string, SettingValues>;
  /** admin org-wide defaults */
  globalDefaults: SettingValues;
  overrides: ScopeOverride[];
  groups: CustomGroup[];
}

const initialState: SettingsState = { user: {}, globalDefaults: {}, overrides: [], groups: [] };

const slice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    hydrateSettings(_s, a: PayloadAction<SettingsState>) {
      return { ...initialState, ...a.payload };
    },
    setUserSetting(s, a: PayloadAction<{ userId: string; key: string; value: SettingValue }>) {
      const { userId, key, value } = a.payload;
      s.user[userId] = { ...(s.user[userId] ?? {}), [key]: value };
    },
    resetUserCategory(s, a: PayloadAction<{ userId: string; keys: string[] }>) {
      const cur = { ...(s.user[a.payload.userId] ?? {}) };
      a.payload.keys.forEach((k) => delete cur[k]);
      s.user[a.payload.userId] = cur;
    },
    setGlobalDefault(s, a: PayloadAction<{ key: string; value: SettingValue }>) {
      s.globalDefaults[a.payload.key] = a.payload.value;
    },
    addGroup: {
      reducer(s, a: PayloadAction<CustomGroup>) { s.groups.push(a.payload); },
      prepare(name: string) { return { payload: { id: nanoid(), name, members: [] } as CustomGroup }; },
    },
    deleteGroup(s, a: PayloadAction<string>) {
      s.groups = s.groups.filter((g) => g.id !== a.payload);
      s.overrides = s.overrides.filter((o) => !(o.scope === "group" && o.target === a.payload));
    },
    toggleGroupMember(s, a: PayloadAction<{ groupId: string; accountId: string }>) {
      const g = s.groups.find((x) => x.id === a.payload.groupId);
      if (!g) return;
      g.members = g.members.includes(a.payload.accountId)
        ? g.members.filter((m) => m !== a.payload.accountId)
        : [...g.members, a.payload.accountId];
    },
    upsertOverride(s, a: PayloadAction<{ scope: ScopeKind; target: string; key: string; value: SettingValue }>) {
      const { scope, target, key, value } = a.payload;
      let o = s.overrides.find((x) => x.scope === scope && x.target === target);
      if (!o) {
        o = { id: nanoid(), scope, target, values: {}, lockedKeys: [] };
        s.overrides.push(o);
      }
      o.values[key] = value;
    },
    clearOverrideKey(s, a: PayloadAction<{ scope: ScopeKind; target: string; key: string }>) {
      const o = s.overrides.find((x) => x.scope === a.payload.scope && x.target === a.payload.target);
      if (!o) return;
      delete o.values[a.payload.key];
      o.lockedKeys = o.lockedKeys.filter((k) => k !== a.payload.key);
    },
    toggleOverrideLock(s, a: PayloadAction<{ scope: ScopeKind; target: string; key: string }>) {
      const { scope, target, key } = a.payload;
      let o = s.overrides.find((x) => x.scope === scope && x.target === target);
      if (!o) {
        o = { id: nanoid(), scope, target, values: {}, lockedKeys: [] };
        s.overrides.push(o);
      }
      o.lockedKeys = o.lockedKeys.includes(key)
        ? o.lockedKeys.filter((k) => k !== key)
        : [...o.lockedKeys, key];
    },
    deleteOverride(s, a: PayloadAction<string>) {
      s.overrides = s.overrides.filter((o) => o.id !== a.payload);
    },
  },
});

export const {
  hydrateSettings, setUserSetting, resetUserCategory, setGlobalDefault,
  addGroup, deleteGroup, toggleGroupMember,
  upsertOverride, clearOverrideKey, toggleOverrideLock, deleteOverride,
} = slice.actions;
export default slice.reducer;