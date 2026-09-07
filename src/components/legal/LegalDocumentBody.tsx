import type { LegalDocument, LegalSection } from "@/lib/content/legal/types";

function SectionBlock({ section }: { section: LegalSection }) {
  return (
    <section id={`section-${section.id}`} className="legal-section">
      <h2 className="mt-8 text-base font-bold">{section.title}</h2>

      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="mt-3 text-sm leading-[1.75]">
          {paragraph}
        </p>
      ))}

      {section.bullets && section.bullets.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1 pl-6 text-sm leading-[1.75]">
          {section.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}

      {section.subsections?.map((sub) => (
        <div key={sub.title} className="mt-4">
          <h3 className="text-sm font-bold">{sub.title}</h3>
          {sub.paragraphs?.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="mt-2 text-sm leading-[1.75]">
              {paragraph}
            </p>
          ))}
          {sub.bullets && sub.bullets.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1 pl-6 text-sm leading-[1.75]">
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
    <div className="legal-body">
      {document.intro.length > 0 ? (
        <div className="mb-6">
          {document.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="mt-3 text-sm leading-[1.75] first:mt-0">
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      {document.sections.map((section) => (
        <SectionBlock key={section.id} section={section} />
      ))}

      {document.closing?.map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="mt-6 text-sm leading-[1.75]">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
