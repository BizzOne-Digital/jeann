import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { SEED_FAQS } from "@/lib/content/catalog";

export type PublicFaq = {
  question: string;
  answer: string;
};

export async function getPublishedFaqs(): Promise<PublicFaq[]> {
  if (!isMongoConfigured()) return SEED_FAQS;
  const conn = await tryConnectMongo();
  if (!conn) return SEED_FAQS;

  const { Faq } = await import("@/models");
  const docs = await Faq.find({ status: "published" })
    .sort({ displayOrder: 1, createdAt: 1 })
    .lean();

  if (docs.length === 0) return SEED_FAQS;

  return docs.map((doc) => ({
    question: doc.question,
    answer: doc.answer,
  }));
}
