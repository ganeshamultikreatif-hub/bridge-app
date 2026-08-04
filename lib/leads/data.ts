import { getDivisionById, ORG_SALES } from "@/lib/customers/org";
import type { LeadCard, LeadId, LeadStatus } from "@/types/lead";

function lid(id: string): LeadId {
  return id as LeadId;
}

/** ponytail: demo lead board until distribution API exists. */
let leads: LeadCard[] = [
  {
    id: lid("lead_001"),
    customerId: "cus_001",
    customerName: "Budi Santoso",
    companyName: "PT Nusantara Logistik",
    whatsapp: "+62 812-3456-7890",
    departmentId: "sales",
    departmentName: "Sales",
    salesId: "rina",
    salesName: "Rina",
    status: "meeting",
    sourceLabel: "Reply · Promo April",
    timeLabel: "2m ago",
  },
  {
    id: lid("lead_002"),
    customerId: "cus_006",
    customerName: "Dr. Nina Putri",
    companyName: "Klinik Sehat Sentosa",
    whatsapp: "+62 878-5555-6677",
    departmentId: "marketing",
    departmentName: "Marketing",
    salesId: "sari",
    salesName: "Sari",
    status: "new",
    sourceLabel: "CTA · Soft Launch",
    timeLabel: "18m ago",
  },
  {
    id: lid("lead_003"),
    customerId: "cus_002",
    customerName: "Siti Aminah",
    companyName: "CV Maju Bersama",
    whatsapp: "+62 813-2211-0099",
    departmentId: "sales",
    departmentName: "Sales",
    salesId: "andi",
    salesName: "Andi",
    status: "contacted",
    sourceLabel: "Inbox",
    timeLabel: "1h ago",
  },
  {
    id: lid("lead_004"),
    customerId: "cus_003",
    customerName: "Agus Pratama",
    companyName: "Geo Logistics ID",
    whatsapp: "+62 821-7788-4455",
    departmentId: "cs",
    departmentName: "Customer Success",
    salesId: "maya",
    salesName: "Maya",
    status: "won",
    sourceLabel: "Renewal",
    timeLabel: "Yesterday",
  },
  {
    id: lid("lead_005"),
    customerId: "cus_004",
    customerName: "Dewi Lestari",
    companyName: "Toko Serba Ada",
    whatsapp: "+62 857-1002-3344",
    departmentId: "sales",
    departmentName: "Sales",
    salesId: "rina",
    salesName: "Rina",
    status: "quotation",
    sourceLabel: "Win-back",
    timeLabel: "2d ago",
  },
  {
    id: lid("lead_006"),
    customerId: "cus_005",
    customerName: "Raka Wijaya",
    companyName: "PT Samudra Digital",
    whatsapp: "+62 811-9000-1122",
    departmentId: "ops",
    departmentName: "Operations",
    salesId: "dimas",
    salesName: "Dimas",
    status: "new",
    sourceLabel: "Ops digest reply",
    timeLabel: "3d ago",
  },
  {
    id: lid("lead_007"),
    customerId: "cus_007",
    customerName: "Farah K.",
    companyName: "Mitra Sejahtera",
    whatsapp: "+62 819-5555-0101",
    departmentId: "marketing",
    departmentName: "Marketing",
    salesId: "sari",
    salesName: "Sari",
    status: "qualified",
    sourceLabel: "Import · Ads",
    timeLabel: "4h ago",
  },
  {
    id: lid("lead_008"),
    customerId: "cus_002b",
    customerName: "Hendra Wijaya",
    companyName: "Berka Furniture",
    whatsapp: "+62 812-9001-2233",
    departmentId: "sales",
    departmentName: "Sales",
    salesId: "andi",
    salesName: "Andi",
    status: "lost",
    sourceLabel: "Cold outreach",
    timeLabel: "1w ago",
  },
  {
    id: lid("lead_009"),
    customerId: "cus_008",
    customerName: "Lina Marlina",
    companyName: "EduPrime",
    whatsapp: "+62 821-3344-5566",
    departmentId: "cs",
    departmentName: "Customer Success",
    salesId: "tono",
    salesName: "Tono",
    status: "meeting",
    sourceLabel: "Onboarding",
    timeLabel: "5h ago",
  },
  {
    id: lid("lead_010"),
    customerId: "cus_009",
    customerName: "Yoga Pratama",
    companyName: "FastCargo ID",
    whatsapp: "+62 878-1122-3344",
    departmentId: "sales",
    departmentName: "Sales",
    salesId: "rina",
    salesName: "Rina",
    status: "new",
    sourceLabel: "Broadcast reply",
    timeLabel: "30m ago",
  },
  {
    id: lid("lead_011"),
    customerId: "cus_010",
    customerName: "Citra Anggraini",
    companyName: "Retail One",
    whatsapp: "+62 812-7788-9900",
    departmentId: "marketing",
    departmentName: "Marketing",
    salesId: "bima",
    salesName: "Bima",
    status: "contacted",
    sourceLabel: "Ads form",
    timeLabel: "45m ago",
  },
  {
    id: lid("lead_012"),
    customerId: "cus_011",
    customerName: "Eko Prasetyo",
    companyName: "Nusa Retail",
    whatsapp: "+62 813-4455-6677",
    departmentId: "sales",
    departmentName: "Sales",
    salesId: "andi",
    salesName: "Andi",
    status: "qualified",
    sourceLabel: "Referral",
    timeLabel: "3h ago",
  },
  {
    id: lid("lead_013"),
    customerId: "cus_012",
    customerName: "Maya Sari",
    companyName: "Klinik Prima",
    whatsapp: "+62 821-9900-1122",
    departmentId: "cs",
    departmentName: "Customer Success",
    salesId: "maya",
    salesName: "Maya",
    status: "quotation",
    sourceLabel: "Upsell",
    timeLabel: "6h ago",
  },
  {
    id: lid("lead_014"),
    customerId: "cus_013",
    customerName: "Andi Nugroho",
    companyName: "LogiFast",
    whatsapp: "+62 878-3344-5566",
    departmentId: "sales",
    departmentName: "Sales",
    salesId: "rina",
    salesName: "Rina",
    status: "contacted",
    sourceLabel: "Inbound WA",
    timeLabel: "8h ago",
  },
  {
    id: lid("lead_015"),
    customerId: "cus_014",
    customerName: "Putri Handayani",
    companyName: "FreshMart",
    whatsapp: "+62 857-2211-3344",
    departmentId: "marketing",
    departmentName: "Marketing",
    salesId: "bima",
    salesName: "Bima",
    status: "meeting",
    sourceLabel: "Event booth",
    timeLabel: "1d ago",
  },
];

let roundRobinIndex = 0;

export function listLeads(): LeadCard[] {
  return leads.map((item) => ({ ...item }));
}

export function peekNextRoundRobinSales() {
  const sales = ORG_SALES[roundRobinIndex % ORG_SALES.length]!;
  const division = getDivisionById(sales.divisionId);
  return {
    salesId: sales.id,
    salesName: sales.name,
    departmentId: sales.divisionId,
    departmentName: division?.name ?? sales.divisionId,
  };
}

export function simulateRoundRobinLead(): LeadCard {
  const assignee = peekNextRoundRobinSales();
  roundRobinIndex = (roundRobinIndex + 1) % ORG_SALES.length;
  const seq = leads.length + 1;
  const lead: LeadCard = {
    id: lid(`lead_sim_${Date.now()}`),
    customerId: `cus_sim_${seq}`,
    customerName: `Lead Demo ${seq}`,
    companyName: `Prospect ${seq}`,
    whatsapp: `+62 81${String(10000000 + seq).slice(0, 8)}`,
    departmentId: assignee.departmentId,
    departmentName: assignee.departmentName,
    salesId: assignee.salesId,
    salesName: assignee.salesName,
    status: "new",
    sourceLabel: "Simulate · Round robin",
    timeLabel: "Just now",
  };
  leads = [lead, ...leads];
  return lead;
}

export function updateLeadStatus(
  id: string,
  status: LeadStatus,
): LeadCard | null {
  const index = leads.findIndex((item) => item.id === id);
  if (index < 0) return null;
  const current = leads[index]!;
  const updated = { ...current, status, timeLabel: "Just now" };
  leads = [...leads.slice(0, index), updated, ...leads.slice(index + 1)];
  return updated;
}

export function updateLeadSales(
  id: string,
  salesId: string,
  salesName: string,
  departmentId: string,
  departmentName: string,
): LeadCard | null {
  const index = leads.findIndex((item) => item.id === id);
  if (index < 0) return null;
  const current = leads[index]!;
  const updated = {
    ...current,
    salesId,
    salesName,
    departmentId,
    departmentName,
    timeLabel: "Just now",
  };
  leads = [...leads.slice(0, index), updated, ...leads.slice(index + 1)];
  return updated;
}

export function updateLeadDepartment(
  id: string,
  departmentId: string,
  departmentName: string,
  salesId: string,
  salesName: string,
): LeadCard | null {
  return updateLeadSales(id, salesId, salesName, departmentId, departmentName);
}

export function getLeadSummary(items: LeadCard[]) {
  return {
    total: items.length,
    newCount: items.filter((item) => item.status === "new").length,
    unassignedHint: 0,
    won: items.filter((item) => item.status === "won").length,
  };
}
