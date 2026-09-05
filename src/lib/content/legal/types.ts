export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  subsections?: {
    title: string;
    bullets?: string[];
    paragraphs?: string[];
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
