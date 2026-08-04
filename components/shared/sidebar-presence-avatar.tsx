import { SidebarProfileAvatar } from "@/components/shared/sidebar-profile-avatar";

interface SidebarPresenceAvatarProps {
  name: string;
  size?: "sm" | "md";
  className?: string;
}

export function SidebarPresenceAvatar({
  name,
  size = "sm",
  className,
}: SidebarPresenceAvatarProps) {
  return (
    <SidebarProfileAvatar
      name={name}
      size={size}
      {...(className ? { className } : {})}
    />
  );
}
