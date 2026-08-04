"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { logoutAction } from "@/actions/auth.actions";
import {
  resolveProfileAvatarAction,
  updateOwnPasswordAction,
  updateOwnProfileAction,
} from "@/actions/user.actions";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/shared/app-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { SidebarProfileAction } from "@/components/shared/sidebar-profile-action";
import { SidebarProfileAvatar } from "@/components/shared/sidebar-profile-avatar";
import { SidebarProfileEditDialog } from "@/components/shared/sidebar-profile-edit-dialog";
import { SidebarProfilePasswordDialog } from "@/components/shared/sidebar-profile-password-dialog";
import { RADIUS_INNER } from "@/config/shape";
import { KeyIcon, LogoutIcon, PencilSimpleIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type {
  UpdateOwnPasswordForm,
  UpdateOwnProfileForm,
} from "@/lib/validations/user";
import { type AppUser, USER_ROLE_LABELS } from "@/types/user";

interface SidebarProfileDialogProps {
  user: AppUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdate: (user: AppUser) => void;
}

export function SidebarProfileDialog({
  user,
  open,
  onOpenChange,
  onUserUpdate,
}: SidebarProfileDialogProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isLoggingOut, startLogout] = useTransition();
  const [, startSaving] = useTransition();
  const [notice, setNotice] = useState<{
    title: string;
    description: string;
  } | null>(null);

  function openEdit() {
    onOpenChange(false);
    setEditOpen(true);
  }

  function openPassword() {
    onOpenChange(false);
    setPasswordOpen(true);
  }

  function backToProfile() {
    setEditOpen(false);
    setPasswordOpen(false);
    onOpenChange(true);
  }

  function handleProfileSave(values: UpdateOwnProfileForm) {
    startSaving(async () => {
      setNotice(null);

      let avatarUrl = values.avatarUrl.trim();
      if (avatarUrl.startsWith("data:")) {
        const resolved = await resolveProfileAvatarAction(avatarUrl);
        if (!resolved.ok) {
          toast.error(resolved.error);
          setNotice({
            title: "Could not update profile",
            description: resolved.error,
          });
          return;
        }
        avatarUrl = resolved.url;
      }

      const result = await updateOwnProfileAction({
        ...values,
        avatarUrl,
      });

      if (!result.ok) {
        toast.error(result.error);
        setNotice({
          title: "Could not update profile",
          description: result.error,
        });
        return;
      }

      onUserUpdate(result.data);
      toast.success("Profile updated.");
      setNotice({
        title: "Profile updated",
        description: "Your profile details have been saved.",
      });
      router.refresh();
    });
  }

  function handlePasswordSave(values: UpdateOwnPasswordForm) {
    startSaving(async () => {
      setNotice(null);
      const result = await updateOwnPasswordAction(values);

      if (!result.ok) {
        toast.error(result.error);
        setNotice({
          title: "Could not update password",
          description: result.error,
        });
        return;
      }

      toast.success("Password updated.");
      setNotice({
        title: "Password updated",
        description: "Your sign-in password has been updated.",
      });
      router.refresh();
    });
  }

  function handleLogoutConfirm() {
    startLogout(async () => {
      toast.success("Berhasil logout");
      setLogoutOpen(false);
      onOpenChange(false);
      await logoutAction();
    });
  }

  return (
    <>
      <AppDialog open={open} onOpenChange={onOpenChange}>
        <AppDialogContent showCloseButton size="sm" className="flex flex-col">
          <AppDialogHeader className="space-y-4 py-5">
            <div className="flex items-center gap-3">
              <SidebarProfileAvatar
                name={user.username}
                avatarUrl={user.avatarUrl}
                size="lg"
              />
              <div className="min-w-0 flex-1">
                <AppDialogTitle className="truncate text-base">
                  {user.username}
                </AppDialogTitle>
                <AppDialogDescription className="mt-1 truncate">
                  {user.email}
                </AppDialogDescription>
              </div>
            </div>

            <dl
              className={cn(
                RADIUS_INNER,
                "grid grid-cols-2 gap-3 bg-muted/50 px-3 py-3 text-xs",
              )}
            >
              <div className="space-y-1">
                <dt className="text-muted-foreground">Role</dt>
                <dd className="font-medium text-foreground">
                  {USER_ROLE_LABELS[user.role]}
                </dd>
              </div>
              <div className="min-w-0 space-y-1">
                <dt className="text-muted-foreground">Organization</dt>
                <dd className="truncate font-medium text-foreground">
                  {user.position}
                </dd>
              </div>
            </dl>
          </AppDialogHeader>

          <AppDialogBody className="space-y-1 p-2">
            <SidebarProfileAction
              icon={PencilSimpleIcon}
              label="Edit profile"
              description="Update your name and contact details"
              onClick={openEdit}
            />
            <SidebarProfileAction
              icon={KeyIcon}
              label="Change password"
              description="Update your sign-in password"
              onClick={openPassword}
            />

            <div className="my-1 border-(--separator) border-t" />

            <SidebarProfileAction
              icon={LogoutIcon}
              label="Log out"
              description="Sign out of this scheduler session"
              destructive
              onClick={() => setLogoutOpen(true)}
            />
          </AppDialogBody>
        </AppDialogContent>
      </AppDialog>

      <SidebarProfileEditDialog
        user={user}
        open={editOpen}
        onOpenChange={setEditOpen}
        onBack={backToProfile}
        onSave={handleProfileSave}
      />

      <SidebarProfilePasswordDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        onBack={backToProfile}
        onSave={handlePasswordSave}
      />

      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Log out?"
        description="You will need to sign in again to use the scheduler."
        confirmLabel="Log out"
        variant="destructive"
        isPending={isLoggingOut}
        onConfirm={handleLogoutConfirm}
      />

      <ConfirmDialog
        open={Boolean(notice)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setNotice(null);
          }
        }}
        title={notice?.title ?? ""}
        description={notice?.description ?? ""}
        confirmLabel="OK"
        cancelLabel="Close"
        onConfirm={() => setNotice(null)}
      />
    </>
  );
}
