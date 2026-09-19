import type { CmsSectionMap } from "@/lib/content/cms-field";
import type { EditablePage } from "@/lib/content/page-registry";
import { getEffectiveSectionFields } from "@/lib/content/page-content";

export function collectCmsSections(
  page: EditablePage | null,
  sectionIds: string[],
): CmsSectionMap {
  const out: CmsSectionMap = {};
  for (const id of sectionIds) {
    out[id] = getEffectiveSectionFields(page, id);
  }
  return out;
}
