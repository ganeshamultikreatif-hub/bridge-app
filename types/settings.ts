import type { OrgRole } from "@/config/org-roles";

export interface CompanySettings {
  name: string;
  legalName: string;
  website: string;
  timezone: string;
  supportEmail: string;
  country: string;
}

export interface WhatsAppApiSettings {
  phoneNumberId: string;
  wabaId: string;
  businessAccountName: string;
  accessTokenMasked: string;
  webhookVerifyToken: string;
  webhookUrl: string;
  connected: boolean;
}

export interface SettingsDepartment {
  id: string;
  name: string;
  code: string;
  memberCount: number;
  active: boolean;
}

export type OrgUserStatus = "active" | "invited" | "disabled";

export interface OrgUser {
  id: string;
  name: string;
  email: string;
  role: OrgRole;
  departmentId: string;
  status: OrgUserStatus;
}
