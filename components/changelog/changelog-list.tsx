import { ChangelogItemRow } from "@/components/changelog/changelog-item-row";
import type { ChangelogItem } from "@/types/changelog";

interface ChangelogListProps {
  items: ChangelogItem[];
}

export function ChangelogList({ items }: ChangelogListProps) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <ChangelogItemRow item={item} key={`${item.kind}-${item.title}`} />
      ))}
    </ul>
  );
}
