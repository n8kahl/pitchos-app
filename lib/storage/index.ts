import { LocalStorage } from "./local";
import { env } from "@/lib/env";

export interface StorageProvider {
  put(key: string, body: Buffer, contentType: string): Promise<void>;
  get(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}

let cached: StorageProvider | null = null;

export function getStorage(): StorageProvider {
  if (cached) return cached;
  if (env.STORAGE_PROVIDER === "local") {
    cached = new LocalStorage(env.LOCAL_STORAGE_DIR);
  } else {
    throw new Error(
      `STORAGE_PROVIDER=${env.STORAGE_PROVIDER} not implemented in prototype`
    );
  }
  return cached;
}

// Single-tenant storage key. Multi-tenant prefix lives in `multitenant-snapshot`.
export function deckStorageKey(projectId: string, deckId: string): string {
  return `project/${projectId}/deck/${deckId}/original.pdf`;
}
