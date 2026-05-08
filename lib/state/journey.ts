"use client";

import { useSyncExternalStore } from "react";
import type { JourneyStageNumber } from "@/lib/content/journey-stages";
import type { AssessmentResult, ReadinessDim } from "@/lib/content/assessment";

// localStorage-backed founder-journey state. Once the user completes
// /assessment, the result is persisted here so the FounderJourneyStrip
// and any other surface that wants to derive the user's stage reads
// from one place. No assessment yet · components default to stage 3
// for chrome consistency with the prior hardcoded value.
//
// useSyncExternalStore is the React-recommended pattern; matches the
// shape we already use for watch-history and the coach.activeExchangeId
// store.

const STORAGE_KEY = "pitchos.journey.v1";
const STORE_EVENT = "journey:storage";

export interface PersistedJourney {
  // Mirrors AssessmentResult but flattened for storage shape.
  stage: JourneyStageNumber;
  stageName: string;
  overall: number;
  weakestDim: ReadinessDim;
  scores: Record<ReadinessDim, number>;
  takenAt: string; // ISO date · most recent assessment
}

function readRaw(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function parse(raw: string): PersistedJourney | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as PersistedJourney;
    if (typeof v?.stage !== "number" || v.stage < 1 || v.stage > 5) return null;
    return v;
  } catch {
    return null;
  }
}

export function readJourney(): PersistedJourney | null {
  return parse(readRaw());
}

export function saveJourney(result: AssessmentResult): void {
  if (typeof window === "undefined") return;
  const payload: PersistedJourney = {
    stage: result.stage,
    stageName: result.stageName,
    overall: result.overall,
    weakestDim: result.weakestDim,
    scores: result.scores,
    takenAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent(STORE_EVENT));
  } catch {
    // private mode / quota · swallow
  }
}

export function clearJourney(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(STORE_EVENT));
  } catch {
    // ignore
  }
}

function subscribeJourney(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(STORE_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(STORE_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot(): string {
  return readRaw();
}

function getServerSnapshot(): string {
  return "";
}

// Returns the parsed PersistedJourney (or null when the user hasn't
// taken the assessment yet). Re-derives on every change · cheap.
export function useJourney(): PersistedJourney | null {
  const raw = useSyncExternalStore(
    subscribeJourney,
    getSnapshot,
    getServerSnapshot
  );
  return parse(raw);
}

// Convenience hook · just the stage with a sensible fallback.
export function useJourneyStage(): JourneyStageNumber {
  const journey = useJourney();
  return journey?.stage ?? 3;
}

// Convenience hook · whether the user has ever taken the assessment.
// Used by the empty-state Home + journey strip to nudge the user.
export function useHasAssessment(): boolean {
  return useJourney() !== null;
}
