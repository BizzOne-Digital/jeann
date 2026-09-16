/** Normalize MongoDB / Mongoose binary fields to a Node Buffer. */
export function toUploadBuffer(value: unknown): Buffer | null {
  if (!value) return null;
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof Uint8Array) return Buffer.from(value);
  if (value instanceof ArrayBuffer) return Buffer.from(value);

  if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;
    if (record.type === "Buffer" && Array.isArray(record.data)) {
      return Buffer.from(record.data as number[]);
    }
    if (record._bsontype === "Binary" && record.buffer) {
      return toUploadBuffer(record.buffer);
    }
    if (record.buffer instanceof ArrayBuffer) {
      return Buffer.from(record.buffer);
    }
    if (Buffer.isBuffer(record.buffer)) {
      return record.buffer as Buffer;
    }
  }

  try {
    return Buffer.from(value as Uint8Array);
  } catch {
    return null;
  }
}
