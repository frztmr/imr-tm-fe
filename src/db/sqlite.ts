// Browser SQLite store via sql.js. Persists the entire app state as a single
// row in `app_state(key TEXT PRIMARY KEY, value TEXT)`. The DB binary blob is
// itself persisted to localStorage (base64) so reloads survive.
import initSqlJs, { type Database } from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";
import { seedTrips } from "./seed";
import type { Trip, FeedPost, Account, Invitation } from "@/store/types";

const STORAGE_KEY = "imrc.sqlite.v1";
let db: Database | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function b64encode(bytes: Uint8Array) {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}
function b64decode(b64: string): Uint8Array {
  const s = atob(b64);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

export async function openDb(): Promise<Database> {
  if (db) return db;
  const SQL = await initSqlJs({ locateFile: () => wasmUrl });
  const stored = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  db = stored ? new SQL.Database(b64decode(stored)) : new SQL.Database();
  db.run(`CREATE TABLE IF NOT EXISTS app_state (key TEXT PRIMARY KEY, value TEXT NOT NULL);`);
  return db;
}

function persist() {
  if (!db || typeof localStorage === "undefined") return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    if (!db) return;
    const bin = db.export();
    localStorage.setItem(STORAGE_KEY, b64encode(bin));
  }, 150);
}

export async function loadTrips(): Promise<Trip[]> {
  const d = await openDb();
  const res = d.exec(`SELECT value FROM app_state WHERE key='trips' LIMIT 1;`);
  if (res.length === 0 || res[0].values.length === 0) {
    await saveTrips(seedTrips);
    return seedTrips;
  }
  try {
    return JSON.parse(String(res[0].values[0][0])) as Trip[];
  } catch {
    return seedTrips;
  }
}

export async function saveTrips(trips: Trip[]) {
  const d = await openDb();
  d.run(`INSERT INTO app_state(key,value) VALUES('trips', ?)
         ON CONFLICT(key) DO UPDATE SET value=excluded.value;`, [JSON.stringify(trips)]);
  persist();
}

export async function loadPosts(): Promise<FeedPost[]> {
  const d = await openDb();
  const res = d.exec(`SELECT value FROM app_state WHERE key='posts' LIMIT 1;`);
  if (res.length === 0 || res[0].values.length === 0) return [];
  try { return JSON.parse(String(res[0].values[0][0])) as FeedPost[]; }
  catch { return []; }
}

export async function savePosts(posts: FeedPost[]) {
  const d = await openDb();
  d.run(`INSERT INTO app_state(key,value) VALUES('posts', ?)
         ON CONFLICT(key) DO UPDATE SET value=excluded.value;`, [JSON.stringify(posts)]);
  persist();
}

async function loadKey<T>(key: string, fallback: T): Promise<T> {
  const d = await openDb();
  const res = d.exec(`SELECT value FROM app_state WHERE key='${key}' LIMIT 1;`);
  if (res.length === 0 || res[0].values.length === 0) return fallback;
  try { return JSON.parse(String(res[0].values[0][0])) as T; } catch { return fallback; }
}
async function saveKey(key: string, value: unknown) {
  const d = await openDb();
  d.run(`INSERT INTO app_state(key,value) VALUES(?, ?)
         ON CONFLICT(key) DO UPDATE SET value=excluded.value;`, [key, JSON.stringify(value)]);
  persist();
}

export async function loadAccounts(): Promise<Account[]> {
  const seeded = await loadKey<Account[]>("accounts", []);
  if (seeded.length === 0) {
    const seed: Account[] = [
      { id: "acc-admin", name: "Admin", email: "admin@imrc.example", password: "admin123", role: "admin", createdAt: new Date().toISOString() },
      { id: "acc-andre", name: "Andre Wijaya", email: "andre.wijaya@imrc.example", password: "user1234", role: "user", createdAt: new Date().toISOString() },
    ];
    await saveAccounts(seed);
    return seed;
  }
  return seeded;
}
export const saveAccounts = (a: Account[]) => saveKey("accounts", a);
export const loadInvitations = () => loadKey<Invitation[]>("invitations", []);
export const saveInvitations = (i: Invitation[]) => saveKey("invitations", i);

export async function resetDb() {
  if (typeof localStorage !== "undefined") localStorage.removeItem(STORAGE_KEY);
  db = null;
  await openDb();
  await saveTrips(seedTrips);
}
