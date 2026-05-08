import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { StorageProvider } from "./index";

export class LocalStorage implements StorageProvider {
  constructor(private readonly rootDir: string) {}

  private resolve(key: string): string {
    const fullPath = path.resolve(this.rootDir, key);
    const root = path.resolve(this.rootDir);
    if (!fullPath.startsWith(root + path.sep) && fullPath !== root) {
      throw new Error("Storage key escapes root directory");
    }
    return fullPath;
  }

  async put(key: string, body: Buffer): Promise<void> {
    const fullPath = this.resolve(key);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, body);
  }

  async get(key: string): Promise<Buffer> {
    return fs.readFile(this.resolve(key));
  }

  async delete(key: string): Promise<void> {
    try {
      await fs.unlink(this.resolve(key));
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      await fs.access(this.resolve(key));
      return true;
    } catch {
      return false;
    }
  }
}
