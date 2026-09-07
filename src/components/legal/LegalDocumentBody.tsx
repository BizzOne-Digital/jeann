import type { LegalDocument, LegalListStyle, LegalSection } from "@/lib/content/legal/types";

function Paragraph({ children, className = "mt-3" }: { children: string; className?: string }) {
  return <p className={`${className} text-sm leading-[1.75]`}>{children}</p>;
}

function findBulletsInsertIndex(paragraphs: string[]) {
  if (paragraphs.length <= 1) return 0;
  for (let i = paragraphs.length - 1; i >= 0; i--) {
    if (paragraphs[i].trim().endsWith(":")) return i;
  }
  return 0;
}

function ItemList({
  items,
  className = "mt-3",
  listStyle = "unordered",
}: {
  items: string[];
  className?: string;
  listStyle?: LegalListStyle;
}) {
  const listClassName = `${className} space-y-1 pl-6 text-sm leading-[1.75] ${
    listStyle === "ordered" ? "list-decimal" : "list-disc"
  }`;

  if (listStyle === "ordered") {
    return (
      <ol className={listClassName}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    );
  }

  return (
    <ul className={listClassName}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function ParagraphsAndBullets({
  paragraphs = [],
  bullets = [],
  listStyle = "unordered",
  paragraphClassName = "mt-3",
  listClassName = "mt-3",
}: {
  paragraphs?: string[];
  bullets?: string[];
  listStyle?: LegalListStyle;
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
        <ItemList items={bullets} className={listClassName} listStyle={listStyle} />
      </>
    );
  }

  const insertAt = findBulletsInsertIndex(paragraphs);
  const before = paragraphs.slice(0, insertAt + 1);
  const after = paragraphs.slice(insertAt + 1);

  return (
    <>
      {before.map((paragraph) => (
        <Paragraph key={paragraph.slice(0, 48)} className={paragraphClassName}>
          {paragraph}
        </Paragraph>
      ))}
      <ItemList items={bullets} className={listClassName} listStyle={listStyle} />
      {after.map((paragraph) => (
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

      <ParagraphsAndBullets
        paragraphs={section.paragraphs}
        bullets={section.bullets}
        listStyle={section.listStyle}
      />

      {section.subsections?.map((sub) => (
        <div key={sub.title} className="mt-4">
          <h3 className="text-sm font-bold">{sub.title}</h3>
          <ParagraphsAndBullets
            paragraphs={sub.paragraphs}
            bullets={sub.bullets}
            listStyle={sub.listStyle}
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
