/**
 * Top-level page copy — name lives in the header; description in a tooltip.
 */

export const PAGE_META: Record<string, { description: string; title: string }> =
  {
    "/dashboard": {
      title: "Dashboard",
      description:
        "Ringkasan customer, department, sales, dan kesehatan broadcast.",
    },
    "/customers": {
      title: "Customer",
      description:
        "Shared contacts by WhatsApp · Division → Sales → Product memberships.",
    },
    "/customers/new": {
      title: "Add Contact",
      description: "Add under a product. Matching WA numbers suggest a merge.",
    },
    "/broadcast": {
      title: "Broadcast",
      description: "Buat, jadwalkan, dan pantau pengiriman WhatsApp.",
    },
    "/broadcast/new": {
      title: "Create Broadcast",
      description:
        "Department → Audience → Template → Preview → CTA → Schedule → Send.",
    },
    "/departments": {
      title: "Departments",
      description: "Isolasi data per department dengan shared customer DB.",
    },
    "/sales": {
      title: "Sales",
      description: "Performa sales dan lead assignment.",
    },
    "/inbox": {
      title: "Inbox",
      description:
        "Conversation → chat → customer detail · chat masuk ke assigned sales.",
    },
    "/leads": {
      title: "Lead Distribution",
      description:
        "Customer → Department → Sales → Status. Drag & drop assignment.",
    },
    "/analytics": {
      title: "Analytics",
      description: "Delivery, reply, conversion, dan tren bulanan.",
    },
    "/reports": {
      title: "Reports",
      description:
        "Export Excel & PDF dengan filter department, sales, dan tanggal.",
    },
    "/settings": {
      title: "Settings",
      description:
        "Company, WhatsApp API, Department, User management, dan Roles.",
    },
    "/profile": {
      title: "Profile",
      description: "Informasi akun dan pengaturan password.",
    },
    "/scheduler": {
      title: "Scheduler",
      description: "Buka Scheduler App untuk jadwal konten lintas channel.",
    },
    "/cms": {
      title: "CMS System",
      description: "Buka CMS System untuk kelola konten dan aset.",
    },
  };

export function getPageDescription(pathname: string): string | null {
  return PAGE_META[pathname]?.description ?? null;
}
