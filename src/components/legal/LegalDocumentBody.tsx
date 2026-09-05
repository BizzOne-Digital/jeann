import type { LegalDocument, LegalSection } from "@/lib/content/legal/types";

function SectionBlock({ section }: { section: LegalSection }) {
  return (
    <section className="legal-section">
      <h2 className="text-sm font-bold uppercase tracking-wide text-[#111]">{section.title}</h2>

      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="mt-3 text-sm leading-[1.75] text-[#222]">
          {paragraph}
        </p>
      ))}

      {section.bullets && section.bullets.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-[1.75] text-[#222]">
          {section.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}

      {section.subsections?.map((sub) => (
        <div key={sub.title} className="mt-4">
          <h3 className="text-sm font-semibold text-[#111]">{sub.title}</h3>
          {sub.paragraphs?.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="mt-2 text-sm leading-[1.75] text-[#222]">
              {paragraph}
            </p>
          ))}
          {sub.bullets && sub.bullets.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-[1.75] text-[#222]">
              {sub.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </section>
  );
}

export function LegalDocumentBody({ document }: { document: LegalDocument }) {
  return (
    <div className="legal-body mt-8 space-y-8">
      {document.intro.map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="text-sm leading-[1.75] text-[#222]">
          {paragraph}
        </p>
      ))}

      {document.sections.map((section) => (
        <SectionBlock key={section.id} section={section} />
      ))}

      {document.closing?.map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="text-sm leading-[1.75] text-[#222]">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
