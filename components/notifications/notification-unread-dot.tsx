import { cn } from "@/lib/utils";

interface NotificationUnreadDotProps {
  className?: string;
  label?: string;
}

/** Shared unread marker — matches notification center panel cards. */
export function NotificationUnreadDot({
  className,
  label = "Notifikasi baru",
}: NotificationUnreadDotProps) {
  return (
    <span
      role="img"
      aria-label={label}
      className={cn(
        "absolute -top-0.5 -right-0.5 size-2 rounded-full bg-red-500",
        className,
      )}
    />
  );
}
