import { getEnv } from "@/lib/config/env";
import { LocalStorageProvider } from "@/lib/storage/local";
import type { StorageProvider } from "@/lib/storage/types";

let cached: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (cached) return cached;
  const env = getEnv();
  switch (env.STORAGE_PROVIDER) {
    case "local":
      cached = new LocalStorageProvider();
      return cached;
    case "s3":
      throw new Error(
        "S3 storage provider is not configured yet. Set STORAGE_PROVIDER=local or implement s3.ts.",
      );
    default:
      cached = new LocalStorageProvider();
      return cached;
  }
}

export type { StorageProvider } from "@/lib/storage/types";
