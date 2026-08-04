import { UserAppearanceProvider } from "@/components/providers/user-appearance-provider";
import { DashboardShell } from "@/components/shared/dashboard-shell";
import type { AppUser, UserId } from "@/types/user";

const DEMO_USER: AppUser = {
  id: "demo-user" as UserId,
  username: "Admin",
  email: "admin@example.com",
  position: "Administrator",
  role: "super_admin",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserAppearanceProvider userId={DEMO_USER.id}>
      <DashboardShell brands={[]} currentUser={DEMO_USER}>
        {children}
      </DashboardShell>
    </UserAppearanceProvider>
  );
}
