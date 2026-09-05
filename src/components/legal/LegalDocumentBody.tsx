import type { LegalDocument, LegalSection } from "@/lib/content/legal/types";

function SectionBlock({ section }: { section: LegalSection }) {
  return (
    <section id={`section-${section.id}`} className="legal-section scroll-mt-28">
      <h2 className="border-l-4 border-[#c88e4a] pl-4 text-base font-bold tracking-wide text-[#001a3d] sm:text-[1.05rem]">
        {section.title}
      </h2>

      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="mt-3 text-sm leading-[1.8] text-[#333] sm:text-[0.9375rem]">
          {paragraph}
        </p>
      ))}

      {section.bullets && section.bullets.length > 0 ? (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-[1.8] text-[#333] marker:text-[#c88e4a] sm:text-[0.9375rem]">
          {section.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}

      {section.subsections?.map((sub) => (
        <div key={sub.title} className="mt-5 rounded-lg border border-[#ebe8e2] bg-[#faf9f7] p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-[#001a3d]">{sub.title}</h3>
          {sub.paragraphs?.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="mt-2 text-sm leading-[1.8] text-[#333] sm:text-[0.9375rem]">
              {paragraph}
            </p>
          ))}
          {sub.bullets && sub.bullets.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-[1.8] text-[#333] marker:text-[#c88e4a] sm:text-[0.9375rem]">
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
    <div className="legal-body space-y-10">
      {document.intro.length > 0 ? (
        <div className="rounded-xl border border-[#e8e4dc] bg-gradient-to-br from-[#faf9f6] to-white p-5 sm:p-6">
          {document.intro.map((paragraph, index) => (
            <p
              key={paragraph.slice(0, 48)}
              className={
                index === 0
                  ? "text-base font-semibold leading-relaxed text-[#001a3d]"
                  : "mt-3 text-sm leading-[1.8] text-[#333] sm:text-[0.9375rem]"
              }
            >
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      {document.sections.map((section, index) => (
        <div key={section.id}>
          {index > 0 ? <hr className="mb-10 border-[#ebe8e2]" /> : null}
          <SectionBlock section={section} />
        </div>
      ))}

      {document.closing?.map((paragraph) => (
        <p
          key={paragraph.slice(0, 48)}
          className="rounded-lg border border-[#e8e4dc] bg-[#faf9f6] p-4 text-sm leading-[1.8] text-[#333] sm:text-[0.9375rem]"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
