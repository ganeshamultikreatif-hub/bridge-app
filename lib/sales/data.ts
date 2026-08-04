import { ORG_DIVISIONS, ORG_SALES } from "@/lib/customers/org";

export interface SalesLeaderboardRow {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  lead: number;
  reply: number;
  meeting: number;
  closed: number;
}

export interface SalesKpi {
  id: string;
  label: string;
  value: string;
  hint: string;
}

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function seeded(seed: string, min: number, max: number): number {
  return min + (hashSeed(seed) % (max - min + 1));
}

export function listSalesLeaderboard(departmentId = ""): SalesLeaderboardRow[] {
  const pool = departmentId
    ? ORG_SALES.filter((s) => s.divisionId === departmentId)
    : ORG_SALES;

  return pool
    .map((sales) => {
      const departmentName =
        ORG_DIVISIONS.find((d) => d.id === sales.divisionId)?.name ?? "—";
      const lead = seeded(`${sales.id}:lead`, 18, 64);
      const reply = seeded(`${sales.id}:reply`, 8, lead);
      const meeting = seeded(`${sales.id}:meeting`, 3, reply);
      const closed = seeded(`${sales.id}:closed`, 1, meeting);
      return {
        id: sales.id,
        name: sales.name,
        departmentId: sales.divisionId,
        departmentName,
        lead,
        reply,
        meeting,
        closed,
      };
    })
    .sort((a, b) => b.closed - a.closed || b.meeting - a.meeting);
}

export function getSalesKpis(rows: SalesLeaderboardRow[]): SalesKpi[] {
  const lead = rows.reduce((sum, row) => sum + row.lead, 0);
  const reply = rows.reduce((sum, row) => sum + row.reply, 0);
  const meeting = rows.reduce((sum, row) => sum + row.meeting, 0);
  const closed = rows.reduce((sum, row) => sum + row.closed, 0);
  const replyRate = lead > 0 ? Math.round((reply / lead) * 1000) / 10 : 0;
  const closeRate =
    meeting > 0 ? Math.round((closed / meeting) * 1000) / 10 : 0;

  return [
    {
      id: "leads",
      label: "Leads",
      value: lead.toLocaleString(),
      hint: "Assigned this period",
    },
    {
      id: "reply",
      label: "Replies",
      value: reply.toLocaleString(),
      hint: `${replyRate}% reply rate`,
    },
    {
      id: "meeting",
      label: "Meetings",
      value: meeting.toLocaleString(),
      hint: "Booked from replies",
    },
    {
      id: "closed",
      label: "Closed",
      value: closed.toLocaleString(),
      hint: `${closeRate}% close rate`,
    },
  ];
}
