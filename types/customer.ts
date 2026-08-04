export type CustomerId = string & { readonly brand: "CustomerId" };
export type MembershipId = string & { readonly brand: "MembershipId" };

export type CustomerTag =
  | "enterprise"
  | "smb"
  | "hot-lead"
  | "vip"
  | "churn-risk"
  | "new"
  | "mining"
  | "prospect"
  | "tender"
  | "inactive";

export interface OrgDivision {
  id: string;
  name: string;
}

export interface OrgSales {
  id: string;
  name: string;
  divisionId: string;
}

export interface OrgProduct {
  id: string;
  name: string;
  salesId: string;
  divisionId: string;
}

export interface CustomerMembership {
  id: MembershipId;
  contactId: CustomerId;
  divisionId: string;
  divisionName: string;
  salesId: string;
  salesName: string;
  productId: string;
  productName: string;
  source?: string;
  createdAt: string;
}

/** Shared contact identity — WhatsApp is the match key. */
export interface Customer {
  id: CustomerId;
  whatsapp: string;
  whatsappNormalized: string;
  email?: string;
  companyName?: string;
  jobTitle?: string;
  picName?: string;
  tags: CustomerTag[];
  lastActivityAt: string;
  lastActivityLabel: string;
  notesCount: number;
  broadcastCount: number;
  createdAt: string;
  memberships: CustomerMembership[];
}

export interface CustomerTimelineItem {
  id: string;
  title: string;
  description: string;
  timeLabel: string;
  tone?: "default" | "success" | "warning" | "danger";
}

export interface CustomerBroadcastItem {
  id: string;
  name: string;
  status: "sent" | "scheduled" | "failed" | "sending";
  sentLabel: string;
  deliveryRate: number;
}

export interface CustomerNote {
  id: string;
  body: string;
  author: string;
  timeLabel: string;
}

export interface CustomerDetail extends Customer {
  timeline: CustomerTimelineItem[];
  broadcasts: CustomerBroadcastItem[];
  notes: CustomerNote[];
}

export interface CustomerSummary {
  total: number;
  withSales: number;
  hotLeads: number;
  activeThisWeek: number;
  multiProduct: number;
}

/** Draft from Add Customer / import before create-or-merge. */
export interface CustomerIncomingDraft {
  whatsapp: string;
  email?: string;
  companyName?: string;
  jobTitle?: string;
  picName?: string;
  divisionId: string;
  salesId: string;
  productId: string;
}

export type CustomerMergeField =
  | "picName"
  | "email"
  | "companyName"
  | "jobTitle";

export interface CustomerMergeConflict {
  field: CustomerMergeField;
  existing?: string;
  incoming?: string;
}

export type CustomerMatchKind = "whatsapp" | "email";

export interface CustomerMergeProposal {
  existing: Customer;
  incoming: CustomerIncomingDraft;
  conflicts: CustomerMergeConflict[];
  membershipPreview: Omit<CustomerMembership, "id" | "contactId" | "createdAt">;
  matchKind: CustomerMatchKind;
}

export type CreateCustomerResult =
  | { status: "created"; customer: Customer }
  | { status: "duplicate"; proposal: CustomerMergeProposal }
  | { status: "membership_exists"; customer: Customer };

/** Same WA or email from another division/product — awaiting user merge. */
export interface CustomerPendingMerge {
  id: string;
  existingContactId: CustomerId;
  whatsapp: string;
  matchKind: CustomerMatchKind;
  matchValue: string;
  detectedAtLabel: string;
  sourceLabel: string;
  incoming: CustomerIncomingDraft;
  /** Suggested field picks for the recommendation box. */
  recommended: Partial<Record<CustomerMergeField, "existing" | "incoming">>;
}
