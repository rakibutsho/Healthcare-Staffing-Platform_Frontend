// components/legal/LegalSection.tsx
import { LegalSectionData } from "./LegalContent";
import { LegalBulletList } from "./LegalBulletList";

type Props = {
  section: LegalSectionData;
};

export function LegalSection({ section }: Props) {
  return (
    <section
      id={`section-${section.id}`}
      className="py-6 border-b border-neutral-200"
    >
      <h2 className="text-xl font-semibold">
        {section.id}. {section.title}
      </h2>

      {section.paragraphs?.map((p, i) => (
        <p key={i} className="mt-3 text-neutral-800 leading-relaxed">
          {p}
        </p>
      ))}

      {section.bullets?.length ? (
        <div className="mt-3">
          <LegalBulletList items={section.bullets} />
        </div>
      ) : null}

      {section.subsections?.length ? (
        <div className="mt-5 space-y-5">
          {section.subsections.map((sub) => (
            <div
              key={sub.id}
              id={`section-${sub.id}`}
              className="pl-4 border-l border-neutral-200"
            >
              <h3 className="text-base font-semibold">{sub.title}</h3>

              {sub.paragraphs?.map((p, i) => (
                <p key={i} className="mt-2 text-neutral-800 leading-relaxed">
                  {p}
                </p>
              ))}

              {sub.bullets?.length ? (
                <div className="mt-2">
                  <LegalBulletList items={sub.bullets} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
