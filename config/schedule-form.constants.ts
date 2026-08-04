import type {
  MeetingRoomType,
  SchedulePriority,
  ScheduleType,
  SosmedContentType,
} from "@/types/schedule";

export const SCHEDULE_TYPE_OPTIONS: {
  value: ScheduleType;
  label: string;
  description: string;
}[] = [
  {
    value: "sosmed_content",
    label: "Sosmed Content",
    description: "Brief, caption, dan jadwal publikasi.",
  },
  {
    value: "creative_request",
    label: "Creative Request",
    description: "Permintaan desain untuk tim kreatif.",
  },
  {
    value: "custom_schedule",
    label: "Custom Schedule",
    description: "Jadwal fleksibel dengan catatan bebas.",
  },
  {
    value: "meeting_room",
    label: "Meeting Room",
    description: "Booking ruang meeting dengan rentang jam.",
  },
];

export { MEETING_ROOM_TYPE_OPTIONS } from "@/config/meeting-room";
export type { MeetingRoomType };
export const SCHEDULE_PRIORITY_OPTIONS: {
  value: SchedulePriority;
  label: string;
  /** Text/icon color for the SF flag glyph. */
  flagClass: string;
  /** Soft chip background for selected/preview states. */
  chipClass: string;
}[] = [
  {
    value: "low",
    label: "Low",
    flagClass: "text-slate-500 dark:text-slate-400",
    chipClass:
      "bg-slate-500/10 text-slate-700 ring-slate-300/50 dark:text-slate-300",
  },
  {
    value: "medium",
    label: "Medium",
    flagClass: "text-sky-600 dark:text-sky-400",
    chipClass: "bg-sky-500/10 text-sky-700 ring-sky-300/50 dark:text-sky-300",
  },
  {
    value: "high",
    label: "High",
    flagClass: "text-amber-600 dark:text-amber-400",
    chipClass:
      "bg-amber-500/10 text-amber-800 ring-amber-300/50 dark:text-amber-300",
  },
  {
    value: "urgent",
    label: "Urgent",
    flagClass: "text-rose-600 dark:text-rose-400",
    chipClass:
      "bg-rose-500/10 text-rose-700 ring-rose-300/50 dark:text-rose-300",
  },
];

export function getSchedulePriorityOption(value: SchedulePriority | undefined) {
  if (!value) {
    return null;
  }

  return (
    SCHEDULE_PRIORITY_OPTIONS.find((option) => option.value === value) ?? null
  );
}
export const SOSMED_CONTENT_TYPE_OPTIONS: {
  value: SosmedContentType;
  label: string;
}[] = [
  { value: "image", label: "Image" },
  { value: "carousel_image", label: "Carousel Image" },
  { value: "video", label: "Video" },
  { value: "story", label: "Story" },
];

export const CONTENT_PILLAR_OPTIONS = [
  {
    value: "Education",
    label: "Education",
    description: "Konten edukatif: tips, how-to, dan insight bernilai.",
  },
  {
    value: "Soft Selling",
    label: "Soft Selling",
    description: "Promosi lembut lewat value, cerita, dan pendekatan natural.",
  },
  {
    value: "Promotion / Hard Selling",
    label: "Promotion / Hard Selling",
    description: "Promosi langsung: penawaran, CTA kuat, dan selling point.",
  },
  {
    value: "Entertainment",
    label: "Entertainment",
    description: "Konten hiburan, tren, dan format yang ringan diikuti.",
  },
  {
    value: "Social Proof",
    label: "Social Proof",
    description: "Testimoni, review, UGC, dan bukti kepercayaan audiens.",
  },
  {
    value: "News / Update",
    label: "News / Update",
    description: "Berita, update produk, dan informasi terkini brand.",
  },
  {
    value: "Brand Awareness",
    label: "Brand Awareness",
    description: "Perkenalkan brand, tone, dan nilai ke audiens baru.",
  },
  {
    value: "Community / Engagement",
    label: "Community / Engagement",
    description: "Dorong interaksi komunitas lewat diskusi, Q&A, dan UGC.",
  },
] as const;

export const SOCIAL_PLATFORM_OPTIONS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "x", label: "X (Twitter)" },
  { value: "youtube", label: "YouTube" },
] as const;

export const CREATIVE_REQUEST_TYPE_OPTIONS = [
  { value: "business_card", label: "Business Card" },
  { value: "company_profile", label: "Company Profile" },
  { value: "invoice_design", label: "Invoice Design" },
  { value: "letterhead", label: "Letterhead" },
  { value: "logo_design", label: "Logo Design" },
  { value: "banner", label: "Banner" },
  { value: "brochure", label: "Brochure" },
  { value: "presentation", label: "Presentation" },
  { value: "sales_kit", label: "Sales Kit" },
  { value: "social_media_asset", label: "Social Media Asset" },
  { value: "other", label: "Other" },
] as const;

export const BRANDING_PACKAGE_REQUEST_TYPES = [
  "logo_design",
  "business_card",
  "letterhead",
  "invoice_design",
  "company_profile",
] as const;
