import type { SidebarAppIconTone } from "@/config/sidebar";
import {
  BarChart3,
  BellIcon,
  CalendarIcon,
  DocumentIcon,
  type Icon,
  Megaphone,
  MessageIcon,
  SparkleIcon,
  Target,
  Users,
} from "@/lib/icons";
import type { InboxNotification } from "@/types/notification";

interface InboxPresentation {
  icon: Icon;
  tone: SidebarAppIconTone;
}

export function getInboxNotificationPresentation(
  notification: InboxNotification,
): InboxPresentation {
  const type = notification.type;
  const entity = notification.entityType;

  if (type.startsWith("broadcast.") || entity === "broadcast") {
    return { icon: Megaphone, tone: "overview" };
  }

  if (type.startsWith("lead.") || entity === "lead") {
    return { icon: Target, tone: "appearance" };
  }

  if (type.startsWith("inbox.") || entity === "inbox") {
    return { icon: MessageIcon, tone: "media" };
  }

  if (type.startsWith("customer.") || entity === "customer") {
    return { icon: Users, tone: "profile" };
  }

  if (type.startsWith("analytics.") || entity === "analytics") {
    return { icon: BarChart3, tone: "reports" };
  }

  if (type.startsWith("comment.")) {
    return { icon: MessageIcon, tone: "notifications" };
  }

  if (type.startsWith("deliverable.") || type.includes("upload")) {
    return { icon: DocumentIcon, tone: "media" };
  }

  if (type.startsWith("schedule.") || entity === "schedule") {
    return { icon: CalendarIcon, tone: "scheduler" };
  }

  if (type.includes("posting") || type.includes("revision")) {
    return { icon: SparkleIcon, tone: "reports" };
  }

  return { icon: BellIcon, tone: "notifications" };
}

export function getNotificationHref(item: InboxNotification): string | null {
  switch (item.entityType) {
    case "broadcast":
      return item.entityId ? `/broadcast/${item.entityId}` : "/broadcast";
    case "lead":
      return "/leads";
    case "inbox":
      return "/inbox";
    case "customer":
      return item.entityId ? `/customers/${item.entityId}` : "/customers";
    case "analytics":
      return "/analytics";
    case "schedule":
      return item.entityId ? `/scheduler/${item.entityId}` : "/scheduler";
    default:
      return null;
  }
}
