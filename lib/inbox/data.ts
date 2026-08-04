import type { InboxConversation, InboxConversationId } from "@/types/inbox";

function cid(id: string): InboxConversationId {
  return id as InboxConversationId;
}

/** ponytail: demo inbox until WhatsApp webhook / API exists. */
const conversations: InboxConversation[] = [
  {
    id: cid("conv_001"),
    customerId: "cus_001",
    customerName: "Budi Santoso",
    companyName: "PT Nusantara Logistik",
    whatsapp: "+62 812-3456-7890",
    preview: "Siap, boleh dijadwalkan demo Kamis pagi?",
    timeLabel: "2m",
    unread: 2,
    channel: "whatsapp",
    status: "open",
    assignedSalesId: "rina",
    assignedSalesName: "Rina",
    divisionId: "sales",
    divisionName: "Sales",
    productName: "Bridge Enterprise",
    jobTitle: "Procurement Head",
    email: "budi@nusantara.co.id",
    tags: ["enterprise", "hot-lead"],
    messages: [
      {
        id: "m1",
        direction: "outbound",
        body: "Halo Budi, terima kasih sudah balas Promo April. Apakah minggu ini ada slot untuk demo singkat Bridge Enterprise?",
        sentAt: "2026-08-04T08:40:00+07:00",
        sentLabel: "08:40",
        status: "read",
        senderLabel: "Rina",
      },
      {
        id: "m2",
        direction: "inbound",
        body: "Halo Rina, menarik. Kami sedang evaluasi vendor WA engagement.",
        sentAt: "2026-08-04T08:55:00+07:00",
        sentLabel: "08:55",
      },
      {
        id: "m3",
        direction: "outbound",
        body: "Baik — kami bisa sesuaikan dengan multi-department & assignment sales. Mau saya kirim ringkasan 1 halaman dulu?",
        sentAt: "2026-08-04T09:02:00+07:00",
        sentLabel: "09:02",
        status: "read",
        senderLabel: "Rina",
      },
      {
        id: "m4",
        direction: "inbound",
        body: "Siap, boleh dijadwalkan demo Kamis pagi?",
        sentAt: "2026-08-04T09:10:00+07:00",
        sentLabel: "09:10",
      },
    ],
    activity: [
      {
        id: "a1",
        title: "Assigned to Rina",
        description: "Lead dari reply broadcast · Sales",
        timeLabel: "Today · 08:42",
        tone: "success",
      },
      {
        id: "a2",
        title: "Reply to Promo April",
        description: "Inbound WhatsApp",
        timeLabel: "Today · 08:55",
      },
      {
        id: "a3",
        title: "Broadcast delivered",
        description: "Campaign Promo April",
        timeLabel: "Today · 09:12",
        tone: "success",
      },
    ],
  },
  {
    id: cid("conv_002"),
    customerId: "cus_006",
    customerName: "Dr. Nina Putri",
    companyName: "Klinik Sehat Sentosa",
    whatsapp: "+62 878-5555-6677",
    preview: "Bisa multi-branch inbox ya? Kami punya 4 cabang.",
    timeLabel: "18m",
    unread: 1,
    channel: "whatsapp",
    status: "open",
    assignedSalesId: "sari",
    assignedSalesName: "Sari",
    divisionId: "marketing",
    divisionName: "Marketing",
    productName: "Ads Accelerator",
    jobTitle: "Founder",
    tags: ["smb", "hot-lead", "new"],
    messages: [
      {
        id: "m1",
        direction: "outbound",
        body: "Halo Dokter Nina, terima kasih sudah klik CTA Clinic Soft Launch. Ada pertanyaan seputar setup?",
        sentAt: "2026-08-04T08:50:00+07:00",
        sentLabel: "08:50",
        status: "read",
        senderLabel: "Sari",
      },
      {
        id: "m2",
        direction: "inbound",
        body: "Bisa multi-branch inbox ya? Kami punya 4 cabang.",
        sentAt: "2026-08-04T08:58:00+07:00",
        sentLabel: "08:58",
      },
    ],
    activity: [
      {
        id: "a1",
        title: "Clicked booking CTA",
        description: "Campaign Clinic Soft Launch",
        timeLabel: "12m ago",
        tone: "success",
      },
      {
        id: "a2",
        title: "Assigned to Sari",
        description: "Marketing · Ads Accelerator",
        timeLabel: "20m ago",
      },
    ],
  },
  {
    id: cid("conv_003"),
    customerId: "cus_002",
    customerName: "Siti Aminah",
    companyName: "CV Maju Bersama",
    whatsapp: "+62 813-2211-0099",
    preview: "Boleh kirim pricing sheet Bahasa Indonesia?",
    timeLabel: "1h",
    unread: 0,
    channel: "whatsapp",
    status: "pending",
    assignedSalesId: "andi",
    assignedSalesName: "Andi",
    divisionId: "sales",
    divisionName: "Sales",
    productName: "Bridge SMB",
    jobTitle: "Owner",
    email: "siti@majubersama.id",
    tags: ["smb", "new"],
    messages: [
      {
        id: "m1",
        direction: "inbound",
        body: "Halo, saya lihat starter pack. Boleh kirim pricing sheet Bahasa Indonesia?",
        sentAt: "2026-08-04T07:40:00+07:00",
        sentLabel: "07:40",
      },
      {
        id: "m2",
        direction: "outbound",
        body: "Tentu Bu Siti. Saya kirim PDF pricing SMB + opsi annual. Ada preferensi jumlah seat?",
        sentAt: "2026-08-04T07:52:00+07:00",
        sentLabel: "07:52",
        status: "delivered",
        senderLabel: "Andi",
      },
    ],
    activity: [
      {
        id: "a1",
        title: "Lead created from Inbox",
        description: "Sales · Bridge SMB",
        timeLabel: "1h ago",
      },
      {
        id: "a2",
        title: "Assigned to Andi",
        description: "Manual assignment",
        timeLabel: "55m ago",
      },
    ],
  },
  {
    id: cid("conv_004"),
    customerId: "cus_003",
    customerName: "Agus Pratama",
    companyName: "Geo Logistics ID",
    whatsapp: "+62 821-7788-4455",
    preview: "QBR next week confirmed. Thanks Maya!",
    timeLabel: "Yest",
    unread: 0,
    channel: "whatsapp",
    status: "closed",
    assignedSalesId: "maya",
    assignedSalesName: "Maya",
    divisionId: "cs",
    divisionName: "Customer Success",
    productName: "Onboarding Care",
    jobTitle: "Operations Director",
    tags: ["vip", "enterprise"],
    messages: [
      {
        id: "m1",
        direction: "outbound",
        body: "Pak Agus, proposal QBR sudah saya share. Apakah Selasa 10:00 masih nyaman?",
        sentAt: "2026-08-03T15:00:00+07:00",
        sentLabel: "Yesterday · 15:00",
        status: "read",
        senderLabel: "Maya",
      },
      {
        id: "m2",
        direction: "inbound",
        body: "QBR next week confirmed. Thanks Maya!",
        sentAt: "2026-08-03T16:20:00+07:00",
        sentLabel: "Yesterday · 16:20",
      },
    ],
    activity: [
      {
        id: "a1",
        title: "QBR scheduled",
        description: "Customer Success · Maya",
        timeLabel: "Yesterday",
        tone: "success",
      },
    ],
  },
  {
    id: cid("conv_005"),
    customerId: "cus_004",
    customerName: "Dewi Lestari",
    companyName: "Toko Serba Ada",
    whatsapp: "+62 857-1002-3344",
    preview: "Maaf baru balas — nomor sempat bermasalah.",
    timeLabel: "2d",
    unread: 0,
    channel: "whatsapp",
    status: "open",
    assignedSalesId: "rina",
    assignedSalesName: "Rina",
    divisionId: "sales",
    divisionName: "Sales",
    productName: "Bridge SMB",
    jobTitle: "Purchasing",
    tags: ["smb", "churn-risk"],
    messages: [
      {
        id: "m1",
        direction: "outbound",
        body: "Halo Bu Dewi, follow-up singkat soal win-back July. Masih relevan untuk Toko Serba Ada?",
        sentAt: "2026-08-02T10:00:00+07:00",
        sentLabel: "2 days ago",
        status: "delivered",
        senderLabel: "Rina",
      },
      {
        id: "m2",
        direction: "inbound",
        body: "Maaf baru balas — nomor sempat bermasalah.",
        sentAt: "2026-08-02T18:30:00+07:00",
        sentLabel: "2 days ago",
      },
    ],
    activity: [
      {
        id: "a1",
        title: "Marked churn-risk",
        description: "Sales · re-engagement",
        timeLabel: "6 days ago",
        tone: "warning",
      },
    ],
  },
];

export function listInboxConversations(): InboxConversation[] {
  return conversations;
}

export function getInboxConversation(
  id: string,
): InboxConversation | undefined {
  return conversations.find((item) => item.id === id);
}

export function filterInboxConversations(
  items: InboxConversation[],
  filters: {
    q: string;
    sales: string[];
    status: string[];
    unreadOnly?: boolean;
  },
): InboxConversation[] {
  const query = filters.q.toLowerCase().trim();
  const salesSet = new Set(filters.sales);
  const statusSet = new Set(filters.status);

  return items.filter((item) => {
    if (salesSet.size > 0 && !salesSet.has(item.assignedSalesId)) {
      return false;
    }
    if (statusSet.size > 0 && !statusSet.has(item.status)) {
      return false;
    }
    if (filters.unreadOnly && item.unread <= 0) {
      return false;
    }
    if (!query) return true;
    const haystack = [
      item.customerName,
      item.companyName,
      item.whatsapp,
      item.preview,
      item.assignedSalesName,
      item.productName,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });
}
