export type LegalListStyle = "ordered" | "unordered";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  listStyle?: LegalListStyle;
  subsections?: {
    title: string;
    bullets?: string[];
    paragraphs?: string[];
    listStyle?: LegalListStyle;
  }[];
};

export type LegalDocument = {
  company: string;
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  intro: string[];
  sections: LegalSection[];
  closing?: string[];
};
