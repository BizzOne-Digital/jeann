import { mkdir, writeFile, readFile, unlink, stat } from "fs/promises";
import path from "path";
import { getEnv } from "@/lib/config/env";
import type {
  PutObjectInput,
  PutObjectResult,
  SignedUrlOptions,
  StorageProvider,
} from "@/lib/storage/types";

const PRIVATE_ROOT = path.join(process.cwd(), ".data", "private");
const PUBLIC_ROOT = path.join(process.cwd(), "public", "uploads");

function resolvePrivatePath(key: string): string {
  const normalized = key.replace(/^\/+/, "").replace(/\.\./g, "");
  return path.join(PRIVATE_ROOT, normalized);
}

function resolvePublicPath(key: string): string {
  const normalized = key.replace(/^\/+/, "").replace(/\.\./g, "");
  return path.join(PUBLIC_ROOT, normalized);
}

async function ensureDir(filePath: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
}

export class LocalStorageProvider implements StorageProvider {
  async putPrivate(input: PutObjectInput): Promise<PutObjectResult> {
    const filePath = resolvePrivatePath(input.key);
    await ensureDir(filePath);
    const body = Buffer.from(input.body);
    await writeFile(filePath, body);
    return { key: input.key, size: body.length, mimeType: input.mimeType };
  }

  async putPublic(
    input: PutObjectInput,
  ): Promise<PutObjectResult & { publicUrl: string }> {
    const filePath = resolvePublicPath(input.key);
    await ensureDir(filePath);
    const body = Buffer.from(input.body);
    await writeFile(filePath, body);
    const env = getEnv();
    const publicUrl = new URL(`/uploads/${input.key}`, env.APP_URL).toString();
    return { key: input.key, size: body.length, mimeType: input.mimeType, publicUrl };
  }

  async getSignedUrl(key: string, options?: SignedUrlOptions): Promise<string> {
    const filePath = resolvePrivatePath(key);
    await stat(filePath);
    const env = getEnv();
    const expires = Math.floor(Date.now() / 1000) + (options?.expiresInSeconds ?? 300);
    const params = new URLSearchParams({
      key,
      exp: String(expires),
      disposition: options?.disposition ?? "attachment",
    });
    if (options?.filename) params.set("filename", options.filename);
    return `${env.APP_URL}/api/storage/local?${params.toString()}`;
  }

  async delete(key: string): Promise<void> {
    const privatePath = resolvePrivatePath(key);
    try {
      await unlink(privatePath);
      return;
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code !== "ENOENT") throw err;
    }
    const publicPath = resolvePublicPath(key);
    try {
      await unlink(publicPath);
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code !== "ENOENT") throw err;
    }
  }
}

/** Read private object bytes (for signed URL route handlers). */
export async function readPrivateObject(key: string): Promise<Buffer> {
  return readFile(resolvePrivatePath(key));
}

export { PRIVATE_ROOT, PUBLIC_ROOT };
