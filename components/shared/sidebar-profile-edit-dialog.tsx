"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { UserEmailField } from "@/components/settings/users/user-email-field";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogFooter,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/shared/app-dialog";
import { SidebarProfileDialogBackButton } from "@/components/shared/sidebar-profile-dialog-back-button";
import { SidebarProfilePhotoField } from "@/components/shared/sidebar-profile-photo-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DIALOG_FORM_CLASS } from "@/config/dialog";
import { parseUserEmailLocalPart } from "@/lib/user/email";
import {
  type UpdateOwnProfileForm,
  updateOwnProfileSchema,
} from "@/lib/validations/user";
import { type AppUser, USER_ROLE_LABELS } from "@/types/user";

interface SidebarProfileEditDialogProps {
  user: AppUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
  onSave: (values: UpdateOwnProfileForm) => void;
}

export function SidebarProfileEditDialog({
  user,
  open,
  onOpenChange,
  onBack,
  onSave,
}: SidebarProfileEditDialogProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<UpdateOwnProfileForm>({
    resolver: zodResolver(updateOwnProfileSchema),
    defaultValues: {
      username: user.username,
      emailLocal: parseUserEmailLocalPart(user.email),
      avatarUrl: user.avatarUrl ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        username: user.username,
        emailLocal: parseUserEmailLocalPart(user.email),
        avatarUrl: user.avatarUrl ?? "",
      });
    }
  }, [open, reset, user.avatarUrl, user.email, user.username]);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      onBack();
      return;
    }
    onOpenChange(true);
  }

  function onSubmit(values: UpdateOwnProfileForm) {
    onSave(values);
    onBack();
  }

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppDialogContent showCloseButton size="sm" className="flex flex-col">
        <AppDialogHeader>
          <div className="flex items-start gap-2">
            <SidebarProfileDialogBackButton
              disabled={isSubmitting}
              onClick={onBack}
            />
            <div className="min-w-0 flex-1 space-y-1.5">
              <AppDialogTitle>Edit profile</AppDialogTitle>
              <AppDialogDescription>
                Update your photo, display name, and email address.
              </AppDialogDescription>
            </div>
          </div>
        </AppDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className={DIALOG_FORM_CLASS}>
          <AppDialogBody className="space-y-4">
            <SidebarProfilePhotoField
              control={control}
              nameFallback={user.username}
            />

            <div className="space-y-2">
              <Label htmlFor="profile-username">Name</Label>
              <Input
                id="profile-username"
                autoComplete="username"
                aria-invalid={Boolean(errors.username)}
                {...register("username")}
              />
              {errors.username ? (
                <p className="text-destructive text-xs">
                  {errors.username.message}
                </p>
              ) : null}
            </div>

            <UserEmailField
              id="profile-email"
              register={register("emailLocal")}
              error={errors.emailLocal?.message}
            />

            <div className="space-y-2">
              <Label htmlFor="profile-role">Role</Label>
              <Input
                id="profile-role"
                value={USER_ROLE_LABELS[user.role]}
                readOnly
                disabled
              />
            </div>
          </AppDialogBody>

          <AppDialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={onBack}
            >
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              Save changes
            </Button>
          </AppDialogFooter>
        </form>
      </AppDialogContent>
    </AppDialog>
  );
}
