export const REPORT_TYPES = [
  "broadcast",
  "leads",
  "sales",
  "delivery",
] as const;

export type ReportType = (typeof REPORT_TYPES)[number];

export const DEFAULT_REPORT_TYPE: ReportType = "broadcast";

export const REPORT_TYPE_OPTIONS: {
  value: ReportType;
  label: string;
  shortLabel: string;
  description: string;
}[] = [
  {
    value: "broadcast",
    label: "Broadcast performance",
    shortLabel: "Broadcast",
    description: "Sent, delivered, read, and reply rates by campaign.",
  },
  {
    value: "leads",
    label: "Lead conversion",
    shortLabel: "Leads",
    description: "Pipeline movement from new lead to closed won.",
  },
  {
    value: "sales",
    label: "Sales performance",
    shortLabel: "Sales",
    description: "Assigned customers, replies, and closed deals per sales.",
  },
  {
    value: "delivery",
    label: "Delivery & reply",
    shortLabel: "Delivery",
    description: "Channel delivery health and response latency.",
  },
];

/** Kept for skeleton compatibility during loading UI. */
export const REPORTS_TABS = REPORT_TYPES;
export type ReportsTab = ReportType;
export const DEFAULT_REPORTS_TAB = DEFAULT_REPORT_TYPE;
export const REPORTS_TAB_OPTIONS = REPORT_TYPE_OPTIONS;
