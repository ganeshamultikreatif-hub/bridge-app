import {
  applyFieldResolutions,
  buildMembershipPreview,
  proposeMerge,
} from "@/lib/customers/merge";
import {
  formatWhatsappDisplay,
  isValidWhatsapp,
  normalizeWhatsapp,
} from "@/lib/customers/whatsapp";
import type {
  CreateCustomerResult,
  Customer,
  CustomerDetail,
  CustomerId,
  CustomerIncomingDraft,
  CustomerMembership,
  CustomerMergeField,
  CustomerMergeProposal,
  CustomerPendingMerge,
  CustomerSummary,
  CustomerTag,
  MembershipId,
} from "@/types/customer";

let membershipSeq = 20;

function mid(suffix: string): MembershipId {
  return `mem_${suffix}` as MembershipId;
}

function cid(suffix: string): CustomerId {
  return `cus_${suffix}` as CustomerId;
}

/**
 * Demo WA-match use cases (try on /customers/new):
 *
 * 1. Already merged across divisions — open /customers/cus_001
 *    WA +62 812-3456-7890 · Sales/Rina/Bridge Enterprise + Marketing/Bima/Campaign Suite
 *
 * 2. Trigger match from another division — Add Contact with:
 *    Division Customer Success → Maya → Onboarding Care
 *    WA 0819-5555-0101 (or +62 819-5555-0101)
 *    Name/company different from existing → merge dialog opens
 *    Existing seed: Marketing/Sari/Ads Accelerator (cus_007)
 *    Also listed as pending recommendation box on /customers
 *
 * 3. Alternate trigger — same flow with Budi’s number +62 812-3456-7890
 *    from CS/Tono/Renewal Guard → merge adds 3rd membership
 */
export const DEMO_WA_MATCH_CASES = [
  {
    id: "already-merged",
    whatsapp: "+62 812-3456-7890",
    whatsappNormalized: "6281234567890",
    contactId: "cus_001",
    description:
      "Orang yang sama sudah di Sales (produk Enterprise) dan Marketing (Campaign Suite) setelah merge.",
  },
  {
    id: "ready-to-match",
    whatsapp: "+62 819-5555-0101",
    whatsappNormalized: "6281955550101",
    contactId: "cus_007",
    description:
      "Baru ada di Marketing. Input nomor sama dari divisi lain → notif match + saran merge.",
    tryFrom: {
      divisionId: "cs",
      salesId: "maya",
      productId: "prod_onboard",
      picName: "Farah Kusuma",
      companyName: "PT Mitra Sejahtera",
      jobTitle: "Head of Growth",
      email: "farah.kusuma@mitrasejahtera.id",
    },
  },
] as const;

function normalizeEmail(raw?: string): string | null {
  const value = raw?.trim().toLowerCase();
  return value ? value : null;
}

/** Pending same-WA / email entries not yet merged (demo recommendation boxes). */
let pendingMerges: CustomerPendingMerge[] = [
  {
    id: "pend_001",
    existingContactId: cid("007"),
    whatsapp: "+62 819-5555-0101",
    matchKind: "whatsapp",
    matchValue: "+62 819-5555-0101",
    detectedAtLabel: "12m ago",
    sourceLabel: "Sales owner Maya (CS) menambah customer dengan WA sama",
    incoming: {
      whatsapp: "+62 819-5555-0101",
      divisionId: "cs",
      salesId: "maya",
      productId: "prod_onboard",
      picName: "Farah Kusuma",
      companyName: "PT Mitra Sejahtera",
      jobTitle: "Head of Growth",
      email: "farah.kusuma@mitrasejahtera.id",
    },
    recommended: {
      picName: "incoming",
      companyName: "incoming",
      jobTitle: "incoming",
      email: "incoming",
    },
  },
  {
    id: "pend_002",
    existingContactId: cid("004"),
    whatsapp: "+62 857-1002-3344",
    matchKind: "whatsapp",
    matchValue: "+62 857-1002-3344",
    detectedAtLabel: "1h ago",
    sourceLabel: "Sales owner Bima (Marketing) import Excel — WA sama",
    incoming: {
      whatsapp: "0857-1002-3344",
      divisionId: "marketing",
      salesId: "bima",
      productId: "prod_campaign",
      picName: "Dewi L.",
      companyName: "Toko Serba Ada Indonesia",
      jobTitle: "Owner",
      email: "dewi@tokoserbaada.id",
    },
    recommended: {
      picName: "existing",
      companyName: "incoming",
      jobTitle: "incoming",
      email: "incoming",
    },
  },
  {
    id: "pend_003",
    existingContactId: cid("001"),
    whatsapp: "+62 878-1111-2222",
    matchKind: "email",
    matchValue: "budi@nusantara.co.id",
    detectedAtLabel: "3h ago",
    sourceLabel:
      "Sales owner Tono (CS) menambah customer — email sama, WA berbeda",
    incoming: {
      whatsapp: "+62 878-1111-2222",
      divisionId: "cs",
      salesId: "tono",
      productId: "prod_renew",
      picName: "Budi S.",
      companyName: "Nusantara Logistics",
      jobTitle: "Procurement",
      email: "budi@nusantara.co.id",
    },
    recommended: {
      picName: "existing",
      companyName: "existing",
      jobTitle: "incoming",
      email: "existing",
    },
  },
];

/** ponytail: in-memory shared contact DB until CEP API exists. */
const customers: CustomerDetail[] = [
  {
    id: cid("001"),
    whatsapp: "+62 812-3456-7890",
    whatsappNormalized: "6281234567890",
    email: "budi@nusantara.co.id",
    companyName: "PT Nusantara Logistik",
    jobTitle: "Procurement Head",
    picName: "Budi Santoso",
    tags: ["enterprise", "hot-lead", "vip", "mining"],
    lastActivityAt: "2026-08-03T10:20:00+07:00",
    lastActivityLabel: "Replied to broadcast · 18m ago",
    notesCount: 3,
    broadcastCount: 5,
    createdAt: "2026-03-12T09:00:00+07:00",
    memberships: [
      {
        id: mid("001a"),
        contactId: cid("001"),
        divisionId: "sales",
        divisionName: "Sales",
        salesId: "rina",
        salesName: "Rina",
        productId: "prod_enterprise",
        productName: "Bridge Enterprise",
        source: "import",
        createdAt: "2026-03-12T09:00:00+07:00",
      },
      {
        id: mid("001b"),
        contactId: cid("001"),
        divisionId: "marketing",
        divisionName: "Marketing",
        salesId: "bima",
        salesName: "Bima",
        productId: "prod_campaign",
        productName: "Campaign Suite",
        source: "merge",
        createdAt: "2026-06-01T10:00:00+07:00",
      },
    ],
    timeline: [
      {
        id: "t1",
        title: "Replied to “Promo April”",
        description: "WhatsApp reply · interested in enterprise plan",
        timeLabel: "18m ago",
        tone: "success",
      },
      {
        id: "t2",
        title: "Membership added · Campaign Suite",
        description: "Marketing · Bima · merged from duplicate WA",
        timeLabel: "2 mo ago",
      },
      {
        id: "t3",
        title: "Assigned to Rina · Bridge Enterprise",
        description: "Sales · product membership",
        timeLabel: "12 Mar 2026",
      },
    ],
    broadcasts: [
      {
        id: "b1",
        name: "Promo April",
        status: "sent",
        sentLabel: "Today · 09:12",
        deliveryRate: 100,
      },
      {
        id: "b2",
        name: "Reactivation Q2",
        status: "sent",
        sentLabel: "2 days ago",
        deliveryRate: 98.4,
      },
    ],
    notes: [
      {
        id: "n1",
        body: "Interested in annual contract. Follow up after board meeting next week.",
        author: "Rina",
        timeLabel: "1h ago",
      },
    ],
  },
  {
    id: cid("002"),
    whatsapp: "+62 813-2211-0099",
    whatsappNormalized: "6281322110099",
    email: "siti@majubersama.id",
    companyName: "CV Maju Bersama",
    jobTitle: "Owner",
    picName: "Siti Aminah",
    tags: ["smb", "new", "prospect"],
    lastActivityAt: "2026-08-03T08:00:00+07:00",
    lastActivityLabel: "Lead created · 1h ago",
    notesCount: 1,
    broadcastCount: 2,
    createdAt: "2026-08-03T08:00:00+07:00",
    memberships: [
      {
        id: mid("002a"),
        contactId: cid("002"),
        divisionId: "sales",
        divisionName: "Sales",
        salesId: "andi",
        salesName: "Andi",
        productId: "prod_smb",
        productName: "Bridge SMB",
        source: "manual",
        createdAt: "2026-08-03T08:00:00+07:00",
      },
    ],
    timeline: [
      {
        id: "t1",
        title: "Lead created from Inbox",
        description: "Sales · Product “Bridge SMB”",
        timeLabel: "1h ago",
      },
    ],
    broadcasts: [
      {
        id: "b1",
        name: "Starter Pack",
        status: "sent",
        sentLabel: "Today · 07:30",
        deliveryRate: 100,
      },
    ],
    notes: [
      {
        id: "n1",
        body: "Asked for pricing sheet in Bahasa Indonesia.",
        author: "Andi",
        timeLabel: "40m ago",
      },
    ],
  },
  {
    id: cid("003"),
    whatsapp: "+62 821-7788-4455",
    whatsappNormalized: "6282177884455",
    companyName: "Geo Logistics ID",
    jobTitle: "Operations Director",
    picName: "Agus Pratama",
    tags: ["vip", "enterprise", "tender"],
    lastActivityAt: "2026-08-02T16:40:00+07:00",
    lastActivityLabel: "Note added · Yesterday",
    notesCount: 4,
    broadcastCount: 12,
    createdAt: "2025-11-02T10:00:00+07:00",
    memberships: [
      {
        id: mid("003a"),
        contactId: cid("003"),
        divisionId: "cs",
        divisionName: "Customer Success",
        salesId: "maya",
        salesName: "Maya",
        productId: "prod_onboard",
        productName: "Onboarding Care",
        source: "manual",
        createdAt: "2025-11-02T10:00:00+07:00",
      },
      {
        id: mid("003b"),
        contactId: cid("003"),
        divisionId: "cs",
        divisionName: "Customer Success",
        salesId: "tono",
        salesName: "Tono",
        productId: "prod_renew",
        productName: "Renewal Guard",
        source: "manual",
        createdAt: "2026-02-10T09:00:00+07:00",
      },
    ],
    timeline: [
      {
        id: "t1",
        title: "QBR scheduled",
        description: "Customer Success · Maya",
        timeLabel: "Yesterday",
      },
    ],
    broadcasts: [
      {
        id: "b1",
        name: "Feature Update",
        status: "sent",
        sentLabel: "2 days ago",
        deliveryRate: 100,
      },
    ],
    notes: [
      {
        id: "n1",
        body: "VIP account. Escalate any delivery issues within 1 hour.",
        author: "Maya",
        timeLabel: "Yesterday",
      },
    ],
  },
  {
    id: cid("004"),
    whatsapp: "+62 857-1002-3344",
    whatsappNormalized: "6285710023344",
    companyName: "Toko Serba Ada",
    jobTitle: "Purchasing",
    picName: "Dewi Lestari",
    tags: ["smb", "churn-risk", "inactive"],
    lastActivityAt: "2026-07-28T11:00:00+07:00",
    lastActivityLabel: "No reply · 6 days ago",
    notesCount: 2,
    broadcastCount: 8,
    createdAt: "2026-01-18T09:00:00+07:00",
    memberships: [
      {
        id: mid("004a"),
        contactId: cid("004"),
        divisionId: "sales",
        divisionName: "Sales",
        salesId: "rina",
        salesName: "Rina",
        productId: "prod_smb",
        productName: "Bridge SMB",
        source: "manual",
        createdAt: "2026-01-18T09:00:00+07:00",
      },
    ],
    timeline: [
      {
        id: "t1",
        title: "No reply after follow-up",
        description: "Sales · marked for re-engagement",
        timeLabel: "6 days ago",
        tone: "warning",
      },
    ],
    broadcasts: [
      {
        id: "b1",
        name: "Follow-up batch",
        status: "failed",
        sentLabel: "8 days ago",
        deliveryRate: 0,
      },
    ],
    notes: [
      {
        id: "n1",
        body: "Consider moving to churn-risk nurture sequence.",
        author: "Rina",
        timeLabel: "5 days ago",
      },
    ],
  },
  {
    id: cid("005"),
    whatsapp: "+62 811-9000-1122",
    whatsappNormalized: "6281190001122",
    email: "raka@samudra.digital",
    companyName: "PT Samudra Digital",
    jobTitle: "IT Manager",
    picName: "Raka Wijaya",
    tags: ["enterprise"],
    lastActivityAt: "2026-08-01T14:15:00+07:00",
    lastActivityLabel: "Broadcast sent · 2 days ago",
    notesCount: 0,
    broadcastCount: 3,
    createdAt: "2026-05-04T09:00:00+07:00",
    memberships: [
      {
        id: mid("005a"),
        contactId: cid("005"),
        divisionId: "ops",
        divisionName: "Operations",
        salesId: "dimas",
        salesName: "Dimas",
        productId: "prod_ops",
        productName: "Ops Digest",
        source: "manual",
        createdAt: "2026-05-04T09:00:00+07:00",
      },
    ],
    timeline: [
      {
        id: "t1",
        title: "Ops checklist completed",
        description: "Department · Operations",
        timeLabel: "2 days ago",
        tone: "success",
      },
    ],
    broadcasts: [
      {
        id: "b1",
        name: "Ops Digest",
        status: "sent",
        sentLabel: "2 days ago",
        deliveryRate: 99.1,
      },
    ],
    notes: [],
  },
  {
    id: cid("006"),
    whatsapp: "+62 878-5555-6677",
    whatsappNormalized: "6287855556677",
    companyName: "Klinik Sehat Sentosa",
    jobTitle: "Founder",
    picName: "Dr. Nina Putri",
    tags: ["smb", "hot-lead", "new"],
    lastActivityAt: "2026-08-03T11:05:00+07:00",
    lastActivityLabel: "Clicked CTA · 12m ago",
    notesCount: 1,
    broadcastCount: 1,
    createdAt: "2026-08-02T15:00:00+07:00",
    memberships: [
      {
        id: mid("006a"),
        contactId: cid("006"),
        divisionId: "marketing",
        divisionName: "Marketing",
        salesId: "sari",
        salesName: "Sari",
        productId: "prod_ads",
        productName: "Ads Accelerator",
        source: "manual",
        createdAt: "2026-08-02T15:00:00+07:00",
      },
    ],
    timeline: [
      {
        id: "t1",
        title: "Clicked booking CTA",
        description: "Campaign “Clinic Soft Launch”",
        timeLabel: "12m ago",
        tone: "success",
      },
    ],
    broadcasts: [
      {
        id: "b1",
        name: "Clinic Soft Launch",
        status: "sending",
        sentLabel: "Today · 10:50",
        deliveryRate: 64.2,
      },
    ],
    notes: [
      {
        id: "n1",
        body: "Wants demo for multi-branch WhatsApp inbox.",
        author: "Maya",
        timeLabel: "20m ago",
      },
    ],
  },
  {
    id: cid("007"),
    whatsapp: "+62 819-5555-0101",
    whatsappNormalized: "6281955550101",
    email: "farah@mitra.id",
    companyName: "Mitra Sejahtera",
    jobTitle: "Marketing Manager",
    picName: "Farah K.",
    tags: ["smb", "new"],
    lastActivityAt: "2026-08-03T09:30:00+07:00",
    lastActivityLabel: "Imported · Marketing Ads · 4h ago",
    notesCount: 1,
    broadcastCount: 0,
    createdAt: "2026-08-03T09:30:00+07:00",
    memberships: [
      {
        id: mid("007a"),
        contactId: cid("007"),
        divisionId: "marketing",
        divisionName: "Marketing",
        salesId: "sari",
        salesName: "Sari",
        productId: "prod_ads",
        productName: "Ads Accelerator",
        source: "import",
        createdAt: "2026-08-03T09:30:00+07:00",
      },
    ],
    timeline: [
      {
        id: "t1",
        title: "Contact imported · Ads Accelerator",
        description: "Marketing · Sari · product contact DB",
        timeLabel: "4h ago",
      },
    ],
    broadcasts: [],
    notes: [
      {
        id: "n1",
        body: "Demo case: nomor ini belum ada di divisi lain. Coba Add Contact dari CS dengan WA yang sama untuk trigger merge.",
        author: "Sari",
        timeLabel: "4h ago",
      },
    ],
  },
];

function toListCustomer(detail: CustomerDetail): Customer {
  const { timeline: _t, broadcasts: _b, notes: _n, ...customer } = detail;
  return customer;
}

export function listCustomers(): Customer[] {
  return customers.map(toListCustomer);
}

export function getCustomerById(id: string): CustomerDetail | null {
  return customers.find((customer) => customer.id === id) ?? null;
}

export function findContactByWhatsapp(raw: string): Customer | null {
  const normalized = normalizeWhatsapp(raw);
  if (!normalized) return null;
  const found = customers.find(
    (customer) => customer.whatsappNormalized === normalized,
  );
  return found ? toListCustomer(found) : null;
}

export function findContactByEmail(raw?: string): Customer | null {
  const normalized = normalizeEmail(raw);
  if (!normalized) return null;
  const found = customers.find(
    (customer) => normalizeEmail(customer.email) === normalized,
  );
  return found ? toListCustomer(found) : null;
}

function membershipAlreadyExists(
  existing: Customer,
  draft: CustomerIncomingDraft,
): boolean {
  return existing.memberships.some(
    (item) =>
      item.productId === draft.productId &&
      item.salesId === draft.salesId &&
      item.divisionId === draft.divisionId,
  );
}

export function getCustomerSummary(items: Customer[]): CustomerSummary {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return {
    total: items.length,
    withSales: items.filter((item) => item.memberships.length > 0).length,
    hotLeads: items.filter((item) => item.tags.includes("hot-lead")).length,
    activeThisWeek: items.filter(
      (item) => new Date(item.lastActivityAt).getTime() >= weekAgo,
    ).length,
    multiProduct: items.filter((item) => item.memberships.length > 1).length,
  };
}

export function createCustomer(
  draft: CustomerIncomingDraft,
): CreateCustomerResult {
  if (!isValidWhatsapp(draft.whatsapp)) {
    throw new Error("Invalid WhatsApp number");
  }

  const byWhatsapp = findContactByWhatsapp(draft.whatsapp);
  if (byWhatsapp) {
    if (membershipAlreadyExists(byWhatsapp, draft)) {
      return { status: "membership_exists", customer: byWhatsapp };
    }
    return {
      status: "duplicate",
      proposal: proposeMerge(byWhatsapp, draft, "whatsapp"),
    };
  }

  const byEmail = findContactByEmail(draft.email);
  if (byEmail) {
    if (membershipAlreadyExists(byEmail, draft)) {
      return { status: "membership_exists", customer: byEmail };
    }
    return {
      status: "duplicate",
      proposal: proposeMerge(byEmail, draft, "email"),
    };
  }

  const normalized = normalizeWhatsapp(draft.whatsapp);
  const id = cid(String(Date.now()).slice(-6));
  const preview = buildMembershipPreview(draft);
  const membership: CustomerMembership = {
    id: mid(String(++membershipSeq)),
    contactId: id,
    ...preview,
    createdAt: new Date().toISOString(),
  };

  const detail: CustomerDetail = {
    id,
    whatsapp: formatWhatsappDisplay(normalized),
    whatsappNormalized: normalized,
    email: draft.email?.trim() || undefined,
    companyName: draft.companyName?.trim() || undefined,
    jobTitle: draft.jobTitle?.trim() || undefined,
    picName: draft.picName?.trim() || undefined,
    tags: ["new"],
    lastActivityAt: new Date().toISOString(),
    lastActivityLabel: "Just created",
    notesCount: 0,
    broadcastCount: 0,
    createdAt: new Date().toISOString(),
    memberships: [membership],
    timeline: [
      {
        id: "t_created",
        title: "Contact created",
        description: `${preview.divisionName} · ${preview.productName}`,
        timeLabel: "Just now",
      },
    ],
    broadcasts: [],
    notes: [],
  };

  customers.unshift(detail);
  return { status: "created", customer: toListCustomer(detail) };
}

export function mergeCustomer(
  existingId: string,
  draft: CustomerIncomingDraft,
  resolutions: Partial<Record<CustomerMergeField, "existing" | "incoming">>,
): CustomerDetail | null {
  const index = customers.findIndex((item) => item.id === existingId);
  if (index < 0) return null;

  const existing = customers[index]!;
  const fields = applyFieldResolutions(existing, draft, resolutions);
  const preview = buildMembershipPreview(draft);

  const duplicateMembership = existing.memberships.some(
    (item) =>
      item.productId === draft.productId &&
      item.salesId === draft.salesId &&
      item.divisionId === draft.divisionId,
  );

  const memberships = duplicateMembership
    ? existing.memberships
    : [
        ...existing.memberships,
        {
          id: mid(String(++membershipSeq)),
          contactId: existing.id,
          ...preview,
          createdAt: new Date().toISOString(),
        },
      ];

  const updated: CustomerDetail = {
    ...existing,
    ...fields,
    memberships,
    lastActivityAt: new Date().toISOString(),
    lastActivityLabel: "Merged duplicate · just now",
    timeline: [
      {
        id: `t_merge_${Date.now()}`,
        title: "Contact merged",
        description: `Added ${preview.productName} · ${preview.divisionName} / ${preview.salesName}`,
        timeLabel: "Just now",
        tone: "success",
      },
      ...existing.timeline,
    ],
  };

  customers[index] = updated;

  pendingMerges = pendingMerges.filter((item) => {
    if (item.existingContactId !== existingId) return true;
    if (item.incoming.productId !== draft.productId) return true;
    if (item.matchKind === "email") {
      return (
        normalizeEmail(item.matchValue) !==
        normalizeEmail(updated.email ?? draft.email)
      );
    }
    return normalizeWhatsapp(item.whatsapp) !== updated.whatsappNormalized;
  });

  return updated;
}

export function listPendingMerges(): CustomerPendingMerge[] {
  return pendingMerges;
}

export function dismissPendingMerge(id: string): void {
  pendingMerges = pendingMerges.filter((item) => item.id !== id);
}

export function getPendingMergeProposal(
  pendingId: string,
): CustomerMergeProposal | null {
  const pending = pendingMerges.find((item) => item.id === pendingId);
  if (!pending) return null;
  const existing =
    pending.matchKind === "email"
      ? (getCustomerById(pending.existingContactId) ??
        findContactByEmail(pending.matchValue))
      : (findContactByWhatsapp(pending.whatsapp) ??
        getCustomerById(pending.existingContactId));
  if (!existing) return null;
  return proposeMerge(existing, pending.incoming, pending.matchKind);
}

export const CUSTOMER_TAG_LABELS: Record<CustomerTag, string> = {
  enterprise: "Enterprise",
  smb: "SMB",
  "hot-lead": "Hot Lead",
  vip: "VIP",
  "churn-risk": "Churn Risk",
  new: "New",
  mining: "Mining",
  prospect: "Prospect",
  tender: "Tender",
  inactive: "Inactive",
};
