import { listSalesForDivision, ORG_DIVISIONS } from "@/lib/customers/org";

export interface DepartmentCard {
  id: string;
  name: string;
  memberCount: number;
  campaignCount: number;
  lastBroadcast: string;
  lastBroadcastAt: string;
  active: boolean;
}

const MOCK_STATS: Record<string, Omit<DepartmentCard, "id" | "name">> = {
  marketing: {
    memberCount: 4,
    campaignCount: 12,
    lastBroadcast: "Promo Q2 Awareness",
    lastBroadcastAt: "2026-07-28",
    active: true,
  },
  sales: {
    memberCount: 6,
    campaignCount: 18,
    lastBroadcast: "Demo Follow-up Wave",
    lastBroadcastAt: "2026-08-01",
    active: true,
  },
  cs: {
    memberCount: 3,
    campaignCount: 7,
    lastBroadcast: "Onboarding Checklist",
    lastBroadcastAt: "2026-07-30",
    active: true,
  },
  ops: {
    memberCount: 2,
    campaignCount: 4,
    lastBroadcast: "Ops Digest Weekly",
    lastBroadcastAt: "2026-07-25",
    active: true,
  },
};

export function listDepartmentCards(): DepartmentCard[] {
  return ORG_DIVISIONS.map((division) => {
    const stats = MOCK_STATS[division.id];
    const members = listSalesForDivision(division.id).length;
    return {
      id: division.id,
      name: division.name,
      memberCount: stats?.memberCount ?? members,
      campaignCount: stats?.campaignCount ?? 0,
      lastBroadcast: stats?.lastBroadcast ?? "—",
      lastBroadcastAt: stats?.lastBroadcastAt ?? "—",
      active: stats?.active ?? true,
    };
  });
}

export function filterDepartmentCards(
  cards: DepartmentCard[],
  query: string,
): DepartmentCard[] {
  const q = query.trim().toLowerCase();
  if (!q) return cards;
  return cards.filter(
    (card) =>
      card.name.toLowerCase().includes(q) ||
      card.lastBroadcast.toLowerCase().includes(q),
  );
}
