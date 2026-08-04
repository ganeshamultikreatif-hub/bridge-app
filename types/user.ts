export type UserRole = "user" | "guest" | "super_admin";

export type UserId = string & { readonly brand: "UserId" };

export interface AppUser {
  id: UserId;
  username: string;
  email: string;
  position: string;
  role: UserRole;
  avatarUrl?: string;
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  user: "User",
  guest: "Guest",
  super_admin: "Super Admin",
};

export const USER_ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  user: "Akses penuh untuk membuat dan mengelola jadwal.",
  guest: "Hanya melihat data — tidak bisa membuat atau mengubah.",
  super_admin: "Akses admin penuh termasuk pengaturan user dan brand.",
};
