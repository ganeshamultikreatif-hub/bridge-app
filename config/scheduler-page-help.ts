import { STATUS_STEP_THEME } from "@/config/schedule-detail-theme";
import { SCHEDULE_TYPE_STRIPE_CLASSES } from "@/lib/scheduler/schedule-tile-presenter";
import type { ScheduleStatus, ScheduleType } from "@/types/schedule";

export const SCHEDULER_HELP_INTRO =
  "Kelola jadwal sosmed, creative request, custom schedule, dan meeting room dalam satu kalender. Tile menampilkan ringkasan; hover untuk preview; klik hari atau Lihat detail untuk membuka jadwal.";

export const SCHEDULER_TYPE_COLOR_LEGEND: Array<{
  className: string;
  description: string;
  label: string;
  type: ScheduleType;
}> = [
  {
    type: "sosmed_content",
    label: "Sosmed Content",
    description: "Garis kiri ungu — konten sosial media.",
    className: SCHEDULE_TYPE_STRIPE_CLASSES.sosmed_content,
  },
  {
    type: "creative_request",
    label: "Creative Request",
    description: "Garis kiri indigo — permintaan desain/kreatif.",
    className: SCHEDULE_TYPE_STRIPE_CLASSES.creative_request,
  },
  {
    type: "custom_schedule",
    label: "Custom Schedule",
    description: "Garis kiri biru langit — jadwal kustom.",
    className: SCHEDULE_TYPE_STRIPE_CLASSES.custom_schedule,
  },
  {
    type: "meeting_room",
    label: "Meeting Room",
    description: "Garis kiri teal — booking ruang meeting.",
    className: SCHEDULE_TYPE_STRIPE_CLASSES.meeting_room,
  },
];

export const SCHEDULER_STATE_COLOR_LEGEND: Array<{
  className: string;
  description: string;
  label: string;
}> = [
  {
    label: "Terlambat",
    description: "Garis & background merah — deadline lewat dan belum selesai.",
    className: "bg-red-400 dark:bg-red-500",
  },
  {
    label: "On Process",
    description: "Background biru tipis — status sedang dikerjakan.",
    className: "bg-blue-500 dark:bg-blue-400",
  },
  {
    label: "Segera publish",
    description: "Ring pink — sosmed yang publish dalam ±1 jam ke depan.",
    className: "bg-pink-500 dark:bg-pink-400",
  },
];

const STATUS_ORDER: ScheduleStatus[] = [
  "todo",
  "in_progress",
  "ready_for_review",
  "ready_to_publish",
  "published",
  "done",
  "complete",
];

export const SCHEDULER_STATUS_DOT_LEGEND = STATUS_ORDER.map((status) => ({
  status,
  label: STATUS_STEP_THEME[status].label,
  className: STATUS_STEP_THEME[status].dot,
}));

export const SCHEDULER_USAGE_STEPS: Array<{
  body: string;
  title: string;
}> = [
  {
    title: "Filter di header",
    body: "Cari judul, filter brand / tipe / status lewat tombol Filter, lalu opsional Terlambat atau Arsip. Tombol Reset muncul bila ada filter aktif.",
  },
  {
    title: "Navigasi bulan",
    body: "Ganti bulan/tahun dari toolbar di atas kalender, atau panah Previous/Next. Today kembali ke hari ini.",
  },
  {
    title: "Baca tile",
    body: "Tiap event: judul, logo platform/tipe, logo brand, avatar assignee, dan jam. Garis kiri = tipe jadwal (atau merah jika terlambat).",
  },
  {
    title: "Hover & detail",
    body: "Hover tile untuk preview (owner, assignee, reviewer, status). Klik hari untuk daftar hari itu, lalu Lihat detail untuk halaman penuh.",
  },
  {
    title: "My Mine",
    body: "Tombol mengambang memfilter jadwal yang terkait ke kamu. Aktifkan lagi untuk kembali ke semua jadwal.",
  },
  {
    title: "Tambah jadwal",
    body: "Tombol Tambah di header (atau dari dialog hari) membuka form. Pilih tipe, brand, assignee, reviewer, lalu simpan.",
  },
];
