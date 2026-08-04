import { z } from "zod";
import { buildUserEmail } from "@/lib/user/email";

const emailLocalSchema = z
  .string()
  .min(1, "Email wajib diisi")
  .max(64, "Email maksimal 64 karakter")
  .regex(
    /^[a-zA-Z0-9._-]+$/,
    "Email hanya huruf, angka, titik, underscore, dan strip",
  );

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(32, "Username maksimal 32 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya huruf, angka, dan underscore"),
  emailLocal: emailLocalSchema,
  position: z
    .string()
    .min(1, "Position wajib diisi")
    .max(100, "Position maksimal 100 karakter"),
  role: z.enum(["user", "guest", "super_admin"]),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(128, "Password maksimal 128 karakter"),
});

export type CreateUserForm = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema
  .omit({ password: true })
  .extend({
    password: z
      .string()
      .max(128, "Password maksimal 128 karakter")
      .refine(
        (value) => value.length === 0 || value.length >= 8,
        "Password minimal 8 karakter",
      ),
  });

export type UpdateUserForm = z.infer<typeof updateUserSchema>;

export const updateOwnPasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Password saat ini wajib diisi")
      .max(128, "Password maksimal 128 karakter"),
    newPassword: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .max(128, "Password maksimal 128 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  })
  .refine((value) => value.newPassword !== value.currentPassword, {
    message: "Password baru harus berbeda dari password saat ini",
    path: ["newPassword"],
  });

export type UpdateOwnPasswordForm = z.infer<typeof updateOwnPasswordSchema>;

export const updateOwnProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username minimal 3 karakter")
    .max(32, "Username maksimal 32 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya huruf, angka, dan underscore"),
  emailLocal: emailLocalSchema,
  avatarUrl: z.string(),
});

export type UpdateOwnProfileForm = z.infer<typeof updateOwnProfileSchema>;

export function toUserEmail(form: Pick<CreateUserForm, "emailLocal">): string {
  return buildUserEmail(form.emailLocal);
}
