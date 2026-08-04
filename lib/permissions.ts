import type { UserRole } from "@/types/user";

export const GUEST_WRITE_DENIED_MESSAGE = "Akun guest hanya bisa melihat data.";

export function canWriteContent(role: UserRole): boolean {
  return role !== "guest";
}

export function canManageUsers(role: UserRole): boolean {
  return role === "super_admin";
}

export function canManageBrands(role: UserRole): boolean {
  return role === "super_admin";
}

export function canDeleteSchedule(role: UserRole): boolean {
  return role === "super_admin";
}

export function canRollbackScheduleStatus(role: UserRole): boolean {
  return role === "super_admin";
}

export function canManageKpiTargets(role: UserRole): boolean {
  return role === "super_admin";
}

export function canViewKpiMetrics(_role: UserRole): boolean {
  return true;
}

export function canManageContentPillars(role: UserRole): boolean {
  return role === "super_admin";
}
