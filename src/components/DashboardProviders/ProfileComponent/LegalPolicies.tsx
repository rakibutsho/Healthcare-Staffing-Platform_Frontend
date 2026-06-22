import { anestheLinkLegalPolicies } from "./LegalPolicies/LegalContent";
import { LegalHeader } from "./LegalPolicies/LegalHeader";
import { LegalSection } from "./LegalPolicies/LegalSection";

function LegalPolicies() {
  const doc = anestheLinkLegalPolicies;
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <LegalHeader title={doc.title} lastUpdated={doc.lastUpdated} />

      <div className="space-y-3">
        {doc.intro.map((p, i) => (
          <p key={i} className="text-neutral-800 leading-relaxed">
            {p}
          </p>
        ))}
      </div>

      <div className="mt-8">
        {doc.sections.map((section) => (
          <LegalSection key={section.id} section={section} />
        ))}
      </div>

      <div className="mt-8 space-y-3">
        {doc.closing.map((p, i) => (
          <p key={i} className="text-neutral-800 leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    </main>
  );
}

export default LegalPolicies;
