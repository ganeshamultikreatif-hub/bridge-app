import type {
  DashboardSummary,
  DashboardSummaryMetric,
  DashboardWidgetsData,
} from "@/types/dashboard";

/** ponytail: demo numbers until CEP dashboard API exists. */
export function getDashboardSummary(): DashboardSummary {
  return {
    totalCustomers: 12840,
    totalDepartments: 8,
    totalSales: 42,
    broadcastsThisMonth: 156,
    broadcastsToday: 12,
    deliveryRate: 97.4,
    replyRate: 18.6,
  };
}

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/** Priority KPIs for the HubSpot-style dashboard strip/cards. */
export function toDashboardSummaryMetrics(
  summary: DashboardSummary,
): DashboardSummaryMetric[] {
  return [
    {
      id: "broadcasts",
      label: "Broadcast Today",
      value: formatCount(summary.broadcastsToday),
      hint: `${formatCount(summary.broadcastsThisMonth)} this month`,
      delta: "+3",
      deltaTone: "up",
    },
    {
      id: "delivery",
      label: "Delivery Rate",
      value: formatPercent(summary.deliveryRate),
      hint: "Successfully delivered",
      delta: "+0.8%",
      deltaTone: "up",
    },
    {
      id: "reply",
      label: "Reply Rate",
      value: formatPercent(summary.replyRate),
      hint: "Customer replies",
      delta: "-1.1%",
      deltaTone: "down",
    },
  ];
}

/** ponytail: demo widget series until analytics API exists. */
export function getDashboardWidgets(): DashboardWidgetsData {
  return {
    broadcastTrend: [
      { label: "W1", value: 28 },
      { label: "W2", value: 34 },
      { label: "W3", value: 22 },
      { label: "W4", value: 41 },
      { label: "W5", value: 36 },
      { label: "W6", value: 48 },
    ],
    leadTrend: [
      { label: "W1", value: 14 },
      { label: "W2", value: 19 },
      { label: "W3", value: 16 },
      { label: "W4", value: 27 },
      { label: "W5", value: 23 },
      { label: "W6", value: 31 },
    ],
    departments: [
      {
        id: "marketing",
        name: "Marketing",
        broadcasts: 48,
        leads: 62,
        conversionRate: 24,
      },
      {
        id: "sales",
        name: "Sales",
        broadcasts: 36,
        leads: 81,
        conversionRate: 31,
      },
      {
        id: "cs",
        name: "Customer Success",
        broadcasts: 22,
        leads: 18,
        conversionRate: 19,
      },
      {
        id: "ops",
        name: "Operations",
        broadcasts: 14,
        leads: 9,
        conversionRate: 12,
      },
    ],
    activity: [
      {
        id: "a1",
        title: "Broadcast Finished",
        description: "Promo April · Marketing · 2,480 recipients",
        timeLabel: "09:12",
        tone: "success",
      },
      {
        id: "a2",
        title: "New Lead Assigned",
        description: "Budi Santoso → Rina · Sales",
        timeLabel: "08:48",
        tone: "default",
      },
      {
        id: "a3",
        title: "Customer Replied",
        description: "Siti Aminah · Inbox · interested in SMB plan",
        timeLabel: "08:21",
        tone: "success",
      },
      {
        id: "a4",
        title: "Delivery dipped below 95%",
        description: "Campaign Reactivation Q2 · Sales",
        timeLabel: "07:55",
        tone: "warning",
      },
      {
        id: "a5",
        title: "Broadcast Failed",
        description: "Follow-up batch · 18 undelivered numbers",
        timeLabel: "Yesterday",
        tone: "danger",
      },
      {
        id: "a6",
        title: "Campaign Scheduled",
        description: "Welcome Series · Customer Success · tomorrow 10:00",
        timeLabel: "Yesterday",
        tone: "default",
      },
    ],
    recentBroadcasts: [
      {
        id: "b1",
        name: "Promo April",
        department: "Marketing",
        status: "sent",
        sentLabel: "Today · 09:12",
        deliveryRate: 98.2,
      },
      {
        id: "b2",
        name: "Reactivation Q2",
        department: "Sales",
        status: "sending",
        sentLabel: "Today · 08:40",
        deliveryRate: 91.4,
      },
      {
        id: "b3",
        name: "Welcome Series",
        department: "Customer Success",
        status: "scheduled",
        sentLabel: "Tomorrow · 10:00",
        deliveryRate: 0,
      },
      {
        id: "b4",
        name: "Follow-up batch",
        department: "Sales",
        status: "failed",
        sentLabel: "Yesterday · 16:22",
        deliveryRate: 72.1,
      },
    ],
    recentLeads: [
      {
        id: "l1",
        name: "Budi Santoso",
        company: "PT Nusantara",
        department: "Sales",
        sales: "Rina",
        status: "new",
        timeLabel: "18m ago",
      },
      {
        id: "l2",
        name: "Siti Aminah",
        company: "CV Maju",
        department: "Marketing",
        sales: "Andi",
        status: "contacted",
        timeLabel: "1h ago",
      },
      {
        id: "l3",
        name: "Dewi Lestari",
        department: "Sales",
        sales: "Rina",
        status: "qualified",
        timeLabel: "3h ago",
      },
      {
        id: "l4",
        name: "Agus Pratama",
        company: "Geo Logistics",
        department: "Customer Success",
        sales: "Maya",
        status: "won",
        timeLabel: "Yesterday",
      },
    ],
  };
}
