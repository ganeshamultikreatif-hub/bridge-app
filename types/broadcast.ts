export type BroadcastId = string & { readonly brand: "BroadcastId" };

export type BroadcastStatus =
  | "draft"
  | "scheduled"
  | "running"
  | "completed"
  | "failed";

export type BroadcastSendMode = "now" | "schedule";

export interface BroadcastCampaign {
  id: BroadcastId;
  name: string;
  departmentId: string;
  departmentName: string;
  audienceId: string;
  audienceName: string;
  audienceCount: number;
  templateId: string;
  templateName: string;
  status: BroadcastStatus;
  sent: number;
  read: number;
  reply: number;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
}

export interface BroadcastAudienceOption {
  id: string;
  name: string;
  description: string;
  count: number;
  departmentId: string;
}

export interface BroadcastTemplateOption {
  id: string;
  name: string;
  category: string;
  body: string;
  departmentId?: string;
}

export interface BroadcastCtaOption {
  id: string;
  label: string;
  url: string;
}

export interface BroadcastSummary {
  total: number;
  running: number;
  scheduled: number;
  completed: number;
}

export interface BroadcastDraft {
  name: string;
  departmentId: string;
  audienceId: string;
  templateId: string;
  ctaId: string;
  sendMode: BroadcastSendMode;
  scheduleAt: string;
}
