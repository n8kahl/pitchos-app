"use client";

import { useSyncExternalStore } from "react";

// localStorage-backed watch history. Real implementation (Phase 6) writes
// to UserContentEngagement rows via /api/clips/progress. For the demo,
// localStorage gives us "feels real" continuity without server state.
//
// Hooks use useSyncExternalStore — the React-recommended pattern for
// subscribing to non-React state.

const STORAGE_KEY = "pitchos.watch.v1";

export interface WatchEntry {
  clipId: string;
  position: string; // "MM:SS"
  progressPct: number; // 0-100
  lastVisitedAt: number; // ms since epoch
}

type Store = Record<string, WatchEntry>;

function readRaw(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function parse(raw: string): Store {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Store;
  } catch {
    return {};
  }
}

function writeStore(store: Store): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent("watch:update"));
  } catch {
    /* quota / private mode · swallow */
  }
}

function timestampToSeconds(ts: string): number {
  const [m, s] = ts.split(":").map((n) => parseInt(n, 10) || 0);
  return m * 60 + s;
}

function secondsToTimestamp(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function recordVisit(
  clipId: string,
  durationMin: number,
  position?: string
): void {
  if (typeof window === "undefined") return;
  const store = parse(readRaw());
  const totalSec = durationMin * 60;
  const positionSec = position
    ? timestampToSeconds(position)
    : Math.floor(totalSec * 0.18);
  store[clipId] = {
    clipId,
    position: position ?? secondsToTimestamp(positionSec),
    progressPct: Math.min(100, Math.round((positionSec / totalSec) * 100)),
    lastVisitedAt: Date.now(),
  };
  writeStore(store);
}

// === useSyncExternalStore plumbing ===

function subscribe(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onUpdate = () => listener();
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) listener();
  };
  window.addEventListener("watch:update", onUpdate);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("watch:update", onUpdate);
    window.removeEventListener("storage", onStorage);
  };
}

// Cached snapshot · stable reference until the underlying raw string changes
let cachedRaw = "__init__";
let cachedHistory: WatchEntry[] = [];
let cachedEntries: Record<string, WatchEntry | null> = {};

function getHistorySnapshot(): WatchEntry[] {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedHistory = Object.values(parse(raw)).sort(
      (a, b) => b.lastVisitedAt - a.lastVisitedAt
    );
    cachedEntries = {};
  }
  return cachedHistory;
}

const EMPTY_HISTORY: WatchEntry[] = [];

export function useWatchHistory(): WatchEntry[] {
  return useSyncExternalStore(
    subscribe,
    getHistorySnapshot,
    () => EMPTY_HISTORY // SSR fallback
  );
}

export function useWatchEntry(clipId: string): WatchEntry | null {
  return useSyncExternalStore(
    subscribe,
    () => {
      const raw = readRaw();
      if (raw !== cachedRaw) {
        cachedRaw = raw;
        cachedHistory = Object.values(parse(raw)).sort(
          (a, b) => b.lastVisitedAt - a.lastVisitedAt
        );
        cachedEntries = {};
      }
      if (!(clipId in cachedEntries)) {
        const store = parse(cachedRaw);
        cachedEntries[clipId] = store[clipId] ?? null;
      }
      return cachedEntries[clipId];
    },
    () => null
  );
}
