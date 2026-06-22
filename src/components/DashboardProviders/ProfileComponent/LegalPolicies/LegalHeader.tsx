// components/legal/LegalHeader.tsx
type Props = {
  title: string;
  lastUpdated: string;
};

export function LegalHeader({ title, lastUpdated }: Props) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Last updated: {lastUpdated}
      </p>
    </header>
  );
}
