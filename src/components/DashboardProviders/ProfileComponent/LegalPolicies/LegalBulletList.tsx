// components/legal/LegalBulletList.tsx
type Props = {
  items: string[];
};

export function LegalBulletList({ items }: Props) {
  return (
    <ul className="list-disc pl-6 space-y-2">
      {items.map((item, idx) => (
        <li key={idx} className="text-neutral-800 leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  );
}
