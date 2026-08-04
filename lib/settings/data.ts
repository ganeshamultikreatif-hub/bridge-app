import type {
  CompanySettings,
  OrgUser,
  SettingsDepartment,
  WhatsAppApiSettings,
} from "@/types/settings";

let company: CompanySettings = {
  name: "Bridge",
  legalName: "Bridge Customer Engagement Platform",
  website: "https://bridge.example",
  timezone: "Asia/Jakarta",
  supportEmail: "support@bridge.example",
  country: "Indonesia",
};

let whatsapp: WhatsAppApiSettings = {
  phoneNumberId: "109876543210",
  wabaId: "102938475610",
  businessAccountName: "Bridge WhatsApp Business",
  accessTokenMasked: "EAAG••••••••••••••••9ZAw",
  webhookVerifyToken: "bridge_verify_token",
  webhookUrl: "https://app.bridge.example/api/webhooks/whatsapp",
  connected: true,
};

let departments: SettingsDepartment[] = [
  {
    id: "marketing",
    name: "Marketing",
    code: "MKT",
    memberCount: 4,
    active: true,
  },
  { id: "sales", name: "Sales", code: "SLS", memberCount: 6, active: true },
  {
    id: "cs",
    name: "Customer Success",
    code: "CS",
    memberCount: 3,
    active: true,
  },
  { id: "ops", name: "Operations", code: "OPS", memberCount: 2, active: true },
];

let users: OrgUser[] = [
  {
    id: "u_admin",
    name: "Admin",
    email: "admin@bridge.local",
    role: "admin",
    departmentId: "ops",
    status: "active",
  },
  {
    id: "u_manager",
    name: "Dewi Manager",
    email: "dewi@bridge.local",
    role: "manager",
    departmentId: "sales",
    status: "active",
  },
  {
    id: "u_rina",
    name: "Rina",
    email: "rina@bridge.local",
    role: "sales",
    departmentId: "sales",
    status: "active",
  },
  {
    id: "u_andi",
    name: "Andi",
    email: "andi@bridge.local",
    role: "sales",
    departmentId: "sales",
    status: "active",
  },
  {
    id: "u_bima",
    name: "Bima",
    email: "bima@bridge.local",
    role: "marketing",
    departmentId: "marketing",
    status: "active",
  },
  {
    id: "u_sari",
    name: "Sari",
    email: "sari@bridge.local",
    role: "marketing",
    departmentId: "marketing",
    status: "invited",
  },
];

export function getCompanySettings(): CompanySettings {
  return { ...company };
}

export function saveCompanySettings(next: CompanySettings): CompanySettings {
  company = { ...next };
  return getCompanySettings();
}

export function getWhatsAppSettings(): WhatsAppApiSettings {
  return { ...whatsapp };
}

export function saveWhatsAppSettings(
  next: WhatsAppApiSettings,
): WhatsAppApiSettings {
  whatsapp = { ...next };
  return getWhatsAppSettings();
}

export function listSettingsDepartments(): SettingsDepartment[] {
  return departments.map((d) => ({ ...d }));
}

export function upsertSettingsDepartment(
  input: Omit<SettingsDepartment, "memberCount"> & { memberCount?: number },
): SettingsDepartment {
  const existing = departments.find((d) => d.id === input.id);
  if (existing) {
    Object.assign(existing, {
      name: input.name,
      code: input.code,
      active: input.active,
    });
    return { ...existing };
  }

  const created: SettingsDepartment = {
    id: input.id,
    name: input.name,
    code: input.code,
    active: input.active,
    memberCount: input.memberCount ?? 0,
  };
  departments = [...departments, created];
  return { ...created };
}

export function listOrgUsers(): OrgUser[] {
  return users.map((u) => ({ ...u }));
}

export function upsertOrgUser(input: OrgUser): OrgUser {
  const index = users.findIndex((u) => u.id === input.id);
  if (index >= 0) {
    users[index] = { ...input };
    return { ...users[index] };
  }
  users = [...users, { ...input }];
  return { ...input };
}

export function removeOrgUser(id: string): void {
  users = users.filter((u) => u.id !== id);
}
