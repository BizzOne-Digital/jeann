import mongoose from "mongoose";
import { getEnv } from "@/lib/config/env";

declare global {
  var __finekartsMongo:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const globalCache = global.__finekartsMongo ?? { conn: null, promise: null };
global.__finekartsMongo = globalCache;

export function isMongoConfigured(): boolean {
  return Boolean(getEnv().MONGODB_URI);
}

export async function connectMongo(): Promise<typeof mongoose> {
  const env = getEnv();
  if (!env.MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not configured. Set it in .env.local to enable database features.",
    );
  }

  if (globalCache.conn) return globalCache.conn;

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DB_NAME,
      bufferCommands: false,
    });
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}

export async function tryConnectMongo(): Promise<typeof mongoose | null> {
  if (!isMongoConfigured()) return null;
  try {
    return await connectMongo();
  } catch {
    return null;
  }
}
