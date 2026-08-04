export interface DashboardSummaryMetric {
  id: string;
  label: string;
  value: string;
  hint?: string;
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
}

export interface DashboardSummary {
  totalCustomers: number;
  totalDepartments: number;
  totalSales: number;
  broadcastsThisMonth: number;
  /** Campaigns sent or in progress today. */
  broadcastsToday: number;
  deliveryRate: number;
  replyRate: number;
}

export interface DashboardTrendPoint {
  label: string;
  value: number;
}

export interface DashboardDepartmentStat {
  id: string;
  name: string;
  broadcasts: number;
  leads: number;
  conversionRate: number;
}

export interface DashboardActivityItem {
  id: string;
  title: string;
  description: string;
  timeLabel: string;
  tone?: "default" | "success" | "warning" | "danger";
}

export interface DashboardRecentBroadcast {
  id: string;
  name: string;
  department: string;
  status: "sent" | "scheduled" | "failed" | "sending";
  sentLabel: string;
  deliveryRate: number;
}

export interface DashboardRecentLead {
  id: string;
  name: string;
  company?: string;
  department: string;
  sales: string;
  status: "new" | "contacted" | "qualified" | "won" | "lost";
  timeLabel: string;
}

export interface DashboardWidgetsData {
  broadcastTrend: DashboardTrendPoint[];
  leadTrend: DashboardTrendPoint[];
  departments: DashboardDepartmentStat[];
  activity: DashboardActivityItem[];
  recentBroadcasts: DashboardRecentBroadcast[];
  recentLeads: DashboardRecentLead[];
}
