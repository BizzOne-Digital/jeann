import type { FaqLean } from "@/models";

export type AdminFaqItem = {
  _id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  status: "published" | "unpublished";
};

export function serializeFaq(doc: FaqLean): AdminFaqItem {
  return {
    _id: String(doc._id),
    question: doc.question,
    answer: doc.answer,
    category: doc.category ?? "General",
    displayOrder: doc.displayOrder ?? 0,
    status: doc.status,
  };
}
