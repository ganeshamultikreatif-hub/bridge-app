/**
 * Settings tab copy — title is the header sub-page name;
 * description shows in the last breadcrumb tooltip.
 */

export const SETTINGS_TABS = [
  "company",
  "whatsapp",
  "departments",
  "users",
  "roles",
] as const;

export type SettingsTabId = (typeof SETTINGS_TABS)[number];

export const DEFAULT_SETTINGS_TAB: SettingsTabId = "company";

export const SETTINGS_TAB_META: Record<
  SettingsTabId,
  { description: string; title: string; shortLabel: string }
> = {
  company: {
    title: "Company",
    shortLabel: "Company",
    description: "Organization profile, timezone, and workspace defaults.",
  },
  whatsapp: {
    title: "WhatsApp API",
    shortLabel: "WhatsApp",
    description: "Meta Cloud API credentials and webhook configuration.",
  },
  departments: {
    title: "Department",
    shortLabel: "Dept",
    description: "Create and isolate departments that share the customer DB.",
  },
  users: {
    title: "User",
    shortLabel: "Users",
    description:
      "Invite and manage accounts across Admin, Manager, Sales, Marketing.",
  },
  roles: {
    title: "Roles",
    shortLabel: "Roles",
    description: "Permission matrix for Admin, Manager, Sales, and Marketing.",
  },
};

export const SETTINGS_TAB_OPTIONS = SETTINGS_TABS.map((id) => ({
  value: id,
  ...SETTINGS_TAB_META[id],
}));
