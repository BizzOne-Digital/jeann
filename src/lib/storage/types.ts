export interface PutObjectInput {
  key: string;
  body: Buffer | Uint8Array;
  mimeType: string;
  filename?: string;
}

export interface PutObjectResult {
  key: string;
  size: number;
  mimeType: string;
}

export interface SignedUrlOptions {
  expiresInSeconds?: number;
  disposition?: "inline" | "attachment";
  filename?: string;
}

export interface StorageProvider {
  /** Store a private object (not web-accessible). */
  putPrivate(input: PutObjectInput): Promise<PutObjectResult>;
  /** Store a public object under uploads. */
  putPublic(input: PutObjectInput): Promise<PutObjectResult & { publicUrl: string }>;
  /** Time-limited signed URL for private objects. */
  getSignedUrl(key: string, options?: SignedUrlOptions): Promise<string>;
  /** Remove object by storage key. */
  delete(key: string): Promise<void>;
}

export type StorageScope = "private" | "public";
