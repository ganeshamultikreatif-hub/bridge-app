export type InboxConversationId = string & {
  readonly brand: "InboxConversationId";
};

export type InboxMessageStatus = "sent" | "delivered" | "read";

export interface InboxMessage {
  id: string;
  direction: "inbound" | "outbound";
  body: string;
  sentAt: string;
  sentLabel: string;
  status?: InboxMessageStatus;
  senderLabel?: string;
}

export interface InboxActivityItem {
  id: string;
  title: string;
  description: string;
  timeLabel: string;
  tone?: "default" | "success" | "warning";
}

export interface InboxConversation {
  id: InboxConversationId;
  customerId: string;
  customerName: string;
  companyName?: string;
  whatsapp: string;
  preview: string;
  timeLabel: string;
  unread: number;
  channel: "whatsapp";
  status: "open" | "pending" | "closed";
  assignedSalesId: string;
  assignedSalesName: string;
  divisionId: string;
  divisionName: string;
  productName?: string;
  jobTitle?: string;
  email?: string;
  tags: string[];
  messages: InboxMessage[];
  activity: InboxActivityItem[];
}

export interface InboxFiltersState {
  q: string;
  sales: string[];
  status: Array<"open" | "pending" | "closed">;
  unreadOnly: boolean;
}
