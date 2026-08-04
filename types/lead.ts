export type LeadId = string & { readonly brand: "LeadId" };

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "meeting"
  | "quotation"
  | "won"
  | "lost";

export type LeadDistributionMode = "manual" | "round-robin" | "department";

export type LeadBoardGroupBy = "status" | "sales" | "department";

export interface LeadCard {
  id: LeadId;
  customerId: string;
  customerName: string;
  companyName?: string;
  whatsapp: string;
  departmentId: string;
  departmentName: string;
  salesId: string;
  salesName: string;
  status: LeadStatus;
  sourceLabel: string;
  timeLabel: string;
}

export interface LeadColumnMeta {
  id: string;
  label: string;
  description?: string;
}
