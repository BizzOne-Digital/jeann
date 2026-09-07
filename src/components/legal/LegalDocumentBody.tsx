import type { LegalDocument, LegalSection } from "@/lib/content/legal/types";

function Paragraph({ children, className = "mt-3" }: { children: string; className?: string }) {
  return <p className={`${className} text-sm leading-[1.75]`}>{children}</p>;
}

function BulletList({ items, className = "mt-3" }: { items: string[]; className?: string }) {
  return (
    <ul className={`${className} list-disc space-y-1 pl-6 text-sm leading-[1.75]`}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function ParagraphsAndBullets({
  paragraphs = [],
  bullets = [],
  paragraphClassName = "mt-3",
  listClassName = "mt-3",
}: {
  paragraphs?: string[];
  bullets?: string[];
  paragraphClassName?: string;
  listClassName?: string;
}) {
  if (bullets.length === 0) {
    return paragraphs.map((paragraph) => (
      <Paragraph key={paragraph.slice(0, 48)} className={paragraphClassName}>
        {paragraph}
      </Paragraph>
    ));
  }

  if (paragraphs.length <= 1) {
    return (
      <>
        {paragraphs.map((paragraph) => (
          <Paragraph key={paragraph.slice(0, 48)} className={paragraphClassName}>
            {paragraph}
          </Paragraph>
        ))}
        <BulletList items={bullets} className={listClassName} />
      </>
    );
  }

  const [first, ...rest] = paragraphs;
  return (
    <>
      <Paragraph className={paragraphClassName}>{first}</Paragraph>
      <BulletList items={bullets} className={listClassName} />
      {rest.map((paragraph) => (
        <Paragraph key={paragraph.slice(0, 48)} className={paragraphClassName}>
          {paragraph}
        </Paragraph>
      ))}
    </>
  );
}

function SectionBlock({ section }: { section: LegalSection }) {
  return (
    <section id={`section-${section.id}`} className="legal-section">
      <h2 className="mt-8 text-base font-bold">{section.title}</h2>

      <ParagraphsAndBullets paragraphs={section.paragraphs} bullets={section.bullets} />

      {section.subsections?.map((sub) => (
        <div key={sub.title} className="mt-4">
          <h3 className="text-sm font-bold">{sub.title}</h3>
          <ParagraphsAndBullets
            paragraphs={sub.paragraphs}
            bullets={sub.bullets}
            paragraphClassName="mt-2"
            listClassName="mt-2"
          />
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
