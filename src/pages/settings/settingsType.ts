
type SettingValue = string | boolean;
type SettingValues = Record<string, SettingValue>;
type ScopeKind = "country" | "group" | "user";

interface CustomGroup {
    id: string;
    name: string;
    members: string[]; // account ids
}

interface ScopeOverride {
    id: string;
    scope: ScopeKind;
    target: string;          // country name | group id | account id
    values: SettingValues;
    lockedKeys: string[];    // keys users cannot change
}

interface SettingsState {
    /** per-user preferences, keyed by account id */
    user: Record<string, SettingValues>;
    /** admin org-wide defaults */
    globalDefaults: SettingValues;
    overrides: ScopeOverride[];
    groups: CustomGroup[];
}

export {
    type ScopeOverride,
    type CustomGroup,
    type ScopeKind,
    type SettingValues,
    type SettingValue,
};
export default SettingsState;