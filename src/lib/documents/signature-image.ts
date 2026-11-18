import { Types } from "mongoose";
import sharp from "sharp";
import { tryConnectMongo } from "@/lib/db/mongoose";

export const FINEKARTS_SIGNATURE_KEY = "finekarts-authorized-signatory";
export const FINEKARTS_SEAL_KEY = "finekarts-company-seal";

export type CompanyImageKind = "signature" | "seal";
const KEYS: Record<CompanyImageKind, string> = { signature: FINEKARTS_SIGNATURE_KEY, seal: FINEKARTS_SEAL_KEY };
const MAX_WIDTH = 600;

/**
 * Turns an uploaded signature (a picture on a white background) into a PNG with a transparent
 * background: dark ink stays, white becomes see-through, so the signature sits on the signature line.
 */
export async function prepareSignaturePng(input: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(input)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    // the darker the pixel, the more opaque it is; near-white is fully transparent
    const alpha = luminance > 245 ? 0 : Math.min(255, Math.round(((245 - luminance) / 245) * 255 * 1.25));
    out[i] = 20;
    out[i + 1] = 20;
    out[i + 2] = 50;
    out[i + 3] = alpha;
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
    .png()
    .toBuffer();
}

export async function loadFinekartsSignature(): Promise<Buffer | null> {
  try {
    if (!(await tryConnectMongo())) return null;
    const { CompanySignature } = await import("@/models");
    const doc = await CompanySignature.findOne({ key: FINEKARTS_SIGNATURE_KEY }).lean();
    return doc?.dataBase64 ? Buffer.from(doc.dataBase64, "base64") : null;
  } catch {
    return null;
  }
}

export async function saveFinekartsSignature(png: Buffer, userId?: string) {
  await tryConnectMongo();
  const { CompanySignature } = await import("@/models");
  await CompanySignature.findOneAndUpdate(
    { key: FINEKARTS_SIGNATURE_KEY },
    {
      $set: {
        mimeType: "image/png",
        dataBase64: png.toString("base64"),
        updatedByUserId: userId && Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : undefined,
      },
    },
    { upsert: true },
  );
}

export async function deleteFinekartsSignature() {
  await tryConnectMongo();
  const { CompanySignature } = await import("@/models");
  await CompanySignature.deleteOne({ key: FINEKARTS_SIGNATURE_KEY });
}

/**
 * Turns an uploaded company seal (a picture on a white background) into a PNG with a transparent
 * background. Unlike the signature, the colours are kept (the blue ring, the orange leaves). Each pixel
 * becomes its pure colour with as much see-through as it was light, so a pale tint stays pale on the
 * page and white disappears completely.
 */
export async function prepareSealPng(input: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(input)
    .rotate()
    .resize({ width: 700, withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = Math.max(255 - r, 255 - g, 255 - b);
    if (a < 6) continue; // white (and scanning noise) stays fully transparent
    const un = (c: number) => Math.max(0, Math.min(255, Math.round(255 - ((255 - c) * 255) / a)));
    out[i] = un(r);
    out[i + 1] = un(g);
    out[i + 2] = un(b);
    out[i + 3] = a;
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
    .png()
    .toBuffer();
}

export async function loadCompanyImage(kind: CompanyImageKind): Promise<Buffer | null> {
  try {
    if (!(await tryConnectMongo())) return null;
    const { CompanySignature } = await import("@/models");
    const doc = await CompanySignature.findOne({ key: KEYS[kind] }).lean();
    return doc?.dataBase64 ? Buffer.from(doc.dataBase64, "base64") : null;
  } catch {
    return null;
  }
}

export async function saveCompanyImage(kind: CompanyImageKind, png: Buffer, userId?: string) {
  await tryConnectMongo();
  const { CompanySignature } = await import("@/models");
  await CompanySignature.findOneAndUpdate(
    { key: KEYS[kind] },
    {
      $set: {
        mimeType: "image/png",
        dataBase64: png.toString("base64"),
        updatedByUserId: userId && Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : undefined,
      },
    },
    { upsert: true },
  );
}

export async function deleteCompanyImage(kind: CompanyImageKind) {
  await tryConnectMongo();
  const { CompanySignature } = await import("@/models");
  await CompanySignature.deleteOne({ key: KEYS[kind] });
}

/** Prepares an upload for its kind (signature keeps one ink colour, the seal keeps its colours). */
export function prepareCompanyImage(kind: CompanyImageKind, input: Buffer): Promise<Buffer> {
  return kind === "seal" ? prepareSealPng(input) : prepareSignaturePng(input);
}
