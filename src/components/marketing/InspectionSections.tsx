import { InspectionOperationalPage } from "@/components/marketing/InspectionOperationalPage";
import type { InspectionContent } from "@/lib/marketing/inspection-cms";

export function InspectionPageSections({ content }: { content: InspectionContent }) {
  return <InspectionOperationalPage content={content} />;
}
