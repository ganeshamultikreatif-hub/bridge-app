import { DASHBOARD_DEPARTMENT_OPTIONS } from "@/config/dashboard-filters";
import type {
  BroadcastAudienceOption,
  BroadcastCampaign,
  BroadcastCtaOption,
  BroadcastId,
  BroadcastSummary,
  BroadcastTemplateOption,
} from "@/types/broadcast";

function deptLabel(id: string): string {
  return (
    DASHBOARD_DEPARTMENT_OPTIONS.find((option) => option.value === id)?.label ??
    id
  );
}

/** ponytail: demo campaigns until broadcast API exists. */
const campaigns: BroadcastCampaign[] = [
  {
    id: "b1" as BroadcastId,
    name: "Promo April",
    departmentId: "marketing",
    departmentName: deptLabel("marketing"),
    audienceId: "aud_hot",
    audienceName: "Hot leads · Marketing",
    audienceCount: 1240,
    templateId: "tpl_promo",
    templateName: "Promo flash sale",
    status: "completed",
    sent: 1240,
    read: 986,
    reply: 214,
    sentAt: "2026-08-04T09:12:00+07:00",
    createdAt: "2026-08-03T16:00:00+07:00",
  },
  {
    id: "b2" as BroadcastId,
    name: "Reactivation Q2",
    departmentId: "sales",
    departmentName: deptLabel("sales"),
    audienceId: "aud_inactive",
    audienceName: "Inactive 30d · Sales",
    audienceCount: 500,
    templateId: "tpl_reactivate",
    templateName: "We miss you",
    status: "running",
    sent: 480,
    read: 312,
    reply: 64,
    sentAt: "2026-08-04T08:40:00+07:00",
    createdAt: "2026-08-04T08:00:00+07:00",
  },
  {
    id: "b3" as BroadcastId,
    name: "Welcome Series",
    departmentId: "cs",
    departmentName: deptLabel("cs"),
    audienceId: "aud_new",
    audienceName: "New customers · CS",
    audienceCount: 320,
    templateId: "tpl_welcome",
    templateName: "Welcome onboard",
    status: "scheduled",
    sent: 0,
    read: 0,
    reply: 0,
    scheduledAt: "2026-08-05T10:00:00+07:00",
    createdAt: "2026-08-03T11:20:00+07:00",
  },
  {
    id: "b4" as BroadcastId,
    name: "Follow-up batch",
    departmentId: "sales",
    departmentName: deptLabel("sales"),
    audienceId: "aud_pipeline",
    audienceName: "Pipeline · contacted",
    audienceCount: 540,
    templateId: "tpl_followup",
    templateName: "Soft follow-up",
    status: "failed",
    sent: 390,
    read: 210,
    reply: 41,
    sentAt: "2026-08-03T16:22:00+07:00",
    createdAt: "2026-08-03T15:00:00+07:00",
  },
  {
    id: "b5" as BroadcastId,
    name: "Ops digests weekly",
    departmentId: "ops",
    departmentName: deptLabel("ops"),
    audienceId: "aud_ops",
    audienceName: "Ops stakeholders",
    audienceCount: 96,
    templateId: "tpl_digest",
    templateName: "Weekly digest",
    status: "draft",
    sent: 0,
    read: 0,
    reply: 0,
    createdAt: "2026-08-02T09:00:00+07:00",
  },
  {
    id: "b6" as BroadcastId,
    name: "Enterprise nurture",
    departmentId: "marketing",
    departmentName: deptLabel("marketing"),
    audienceId: "aud_enterprise",
    audienceName: "Enterprise accounts",
    audienceCount: 210,
    templateId: "tpl_nurture",
    templateName: "Nurture sequence A",
    status: "completed",
    sent: 210,
    read: 178,
    reply: 52,
    sentAt: "2026-07-28T14:00:00+07:00",
    createdAt: "2026-07-27T10:00:00+07:00",
  },
];

export const BROADCAST_AUDIENCES: BroadcastAudienceOption[] = [
  {
    id: "aud_hot",
    name: "Hot leads",
    description: "Tagged hot-lead in the last 14 days",
    count: 1240,
    departmentId: "marketing",
  },
  {
    id: "aud_enterprise",
    name: "Enterprise accounts",
    description: "Enterprise tag · Marketing scope",
    count: 210,
    departmentId: "marketing",
  },
  {
    id: "aud_inactive",
    name: "Inactive 30 days",
    description: "No reply or open in 30 days",
    count: 860,
    departmentId: "sales",
  },
  {
    id: "aud_pipeline",
    name: "Pipeline · contacted",
    description: "Contacted but not qualified",
    count: 540,
    departmentId: "sales",
  },
  {
    id: "aud_new",
    name: "New customers",
    description: "Created in the last 7 days",
    count: 320,
    departmentId: "cs",
  },
  {
    id: "aud_vip",
    name: "VIP renewals",
    description: "VIP tag · renewal window",
    count: 148,
    departmentId: "cs",
  },
  {
    id: "aud_ops",
    name: "Ops stakeholders",
    description: "Internal ops contacts",
    count: 96,
    departmentId: "ops",
  },
];

export const BROADCAST_TEMPLATES: BroadcastTemplateOption[] = [
  {
    id: "tpl_promo",
    name: "Promo flash sale",
    category: "Marketing",
    body: "Halo {{name}} 👋\n\nPromo April khusus untuk {{company}} — diskon hingga 25% untuk paket enterprise.\n\nBalas *YA* untuk detail.",
    departmentId: "marketing",
  },
  {
    id: "tpl_nurture",
    name: "Nurture sequence A",
    category: "Marketing",
    body: "Hai {{name}},\n\nKami siapkan ringkasan value Bridge untuk {{company}}. Siap diskusikan minggu ini?",
    departmentId: "marketing",
  },
  {
    id: "tpl_reactivate",
    name: "We miss you",
    category: "Sales",
    body: "Halo {{name}}, sudah lama tidak chat.\n\nAda update fitur baru yang cocok untuk {{company}}. Mau aku jadwalkan demo singkat?",
    departmentId: "sales",
  },
  {
    id: "tpl_followup",
    name: "Soft follow-up",
    category: "Sales",
    body: "Hi {{name}}, follow-up singkat soal percakapan kita sebelumnya. Masih relevan untuk {{company}}?",
    departmentId: "sales",
  },
  {
    id: "tpl_welcome",
    name: "Welcome onboard",
    category: "Customer Success",
    body: "Selamat datang di Bridge, {{name}}!\n\nTim CS siap bantu onboarding {{company}}. Klik CTA untuk mulai checklist.",
    departmentId: "cs",
  },
  {
    id: "tpl_digest",
    name: "Weekly digest",
    category: "Operations",
    body: "Digest mingguan ops siap. Ringkasan delivery & SLA ada di tautan berikut.",
    departmentId: "ops",
  },
];

export const BROADCAST_CTAS: BroadcastCtaOption[] = [
  {
    id: "cta_demo",
    label: "Book a demo",
    url: "https://cep.app/demo",
  },
  {
    id: "cta_pricing",
    label: "See pricing",
    url: "https://cep.app/pricing",
  },
  {
    id: "cta_wa",
    label: "Chat sales",
    url: "https://wa.me/6281234567890",
  },
  {
    id: "cta_none",
    label: "No CTA",
    url: "",
  },
];

export function listBroadcasts(): BroadcastCampaign[] {
  return campaigns;
}

export function getBroadcastById(id: string): BroadcastCampaign | undefined {
  return campaigns.find((item) => item.id === id);
}

export function getBroadcastSummary(
  items: BroadcastCampaign[],
): BroadcastSummary {
  return {
    total: items.length,
    running: items.filter((item) => item.status === "running").length,
    scheduled: items.filter((item) => item.status === "scheduled").length,
    completed: items.filter((item) => item.status === "completed").length,
  };
}

export function listAudiencesForDepartment(
  departmentId: string,
): BroadcastAudienceOption[] {
  return BROADCAST_AUDIENCES.filter(
    (item) => item.departmentId === departmentId,
  );
}

export function listTemplatesForDepartment(
  departmentId: string,
): BroadcastTemplateOption[] {
  return BROADCAST_TEMPLATES.filter(
    (item) => !item.departmentId || item.departmentId === departmentId,
  );
}

export function getAudienceById(
  id: string,
): BroadcastAudienceOption | undefined {
  return BROADCAST_AUDIENCES.find((item) => item.id === id);
}

export function getTemplateById(
  id: string,
): BroadcastTemplateOption | undefined {
  return BROADCAST_TEMPLATES.find((item) => item.id === id);
}

export function getCtaById(id: string): BroadcastCtaOption | undefined {
  return BROADCAST_CTAS.find((item) => item.id === id);
}
