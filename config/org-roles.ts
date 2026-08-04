export const ORG_ROLES = ["admin", "manager", "sales", "marketing"] as const;

export type OrgRole = (typeof ORG_ROLES)[number];

export const ORG_ROLE_LABELS: Record<OrgRole, string> = {
  admin: "Admin",
  manager: "Manager",
  sales: "Sales",
  marketing: "Marketing",
};

export const ORG_ROLE_DESCRIPTIONS: Record<OrgRole, string> = {
  admin: "Full workspace control — settings, users, billing, and audit.",
  manager: "Oversee departments, campaigns, and team performance.",
  sales: "Own leads, inbox replies, and assigned customers.",
  marketing: "Build audiences, templates, and broadcast campaigns.",
};

export type OrgPermission =
  | "manage_company"
  | "manage_users"
  | "manage_roles"
  | "manage_departments"
  | "manage_whatsapp"
  | "manage_broadcasts"
  | "manage_templates"
  | "view_reports"
  | "manage_leads"
  | "reply_inbox";

export const ORG_PERMISSION_LABELS: Record<OrgPermission, string> = {
  manage_company: "Company settings",
  manage_users: "User management",
  manage_roles: "Role permissions",
  manage_departments: "Departments",
  manage_whatsapp: "WhatsApp API",
  manage_broadcasts: "Broadcasts",
  manage_templates: "Templates",
  view_reports: "Reports & analytics",
  manage_leads: "Lead distribution",
  reply_inbox: "Inbox replies",
};

export const ORG_ROLE_PERMISSIONS: Record<OrgRole, OrgPermission[]> = {
  admin: [
    "manage_company",
    "manage_users",
    "manage_roles",
    "manage_departments",
    "manage_whatsapp",
    "manage_broadcasts",
    "manage_templates",
    "view_reports",
    "manage_leads",
    "reply_inbox",
  ],
  manager: [
    "manage_departments",
    "manage_broadcasts",
    "manage_templates",
    "view_reports",
    "manage_leads",
    "reply_inbox",
  ],
  sales: ["view_reports", "manage_leads", "reply_inbox"],
  marketing: [
    "manage_broadcasts",
    "manage_templates",
    "view_reports",
    "reply_inbox",
  ],
};
