import type { ChangelogRelease } from "@/types/changelog";

/**
 * Bump `version` whenever you ship a release that should show What's New.
 * Users who already dismissed this version will not see it again.
 */
export const CHANGELOG_VERSION = "2026.08.03";

export const CHANGELOG_STORAGE_PREFIX = "scheduler:changelog-seen";

export const CHANGELOG: ChangelogRelease = {
  version: CHANGELOG_VERSION,
  title: "What's New",
  summary: "Update terbaru untuk alur mobile, form jadwal, dan navigasi.",
  publishedAt: "2026-08-03",
  items: [
    {
      kind: "feature",
      title: "Content pillar di drawer",
      description:
        "Di mobile, pilih content pillar lewat drawer ringkas — daftar panjang tidak memenuhi form lagi.",
    },
    {
      kind: "improvement",
      title: "Bottom nav hanya di menu utama",
      description:
        "Navigasi bawah disembunyikan di halaman nested (detail jadwal, edit, dll.) supaya fokus ke konten dan aksi.",
    },
    {
      kind: "improvement",
      title: "Dock aksi jadwal lebih rapi",
      description:
        "FAB detail jadwal dengan 3 aksi stretch full width; checklist form selaras ukurannya dengan Batal & Simpan.",
    },
    {
      kind: "feature",
      title: "Checklist simpan di dock mobile",
      description:
        "Save checklist terbuka dari tombol di action dock, dengan skor singkat di samping label.",
    },
  ],
};
