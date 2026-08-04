"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogFooter,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/shared/app-dialog";
import { PasswordInput } from "@/components/shared/password-input";
import { SidebarProfileDialogBackButton } from "@/components/shared/sidebar-profile-dialog-back-button";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DIALOG_FORM_CLASS } from "@/config/dialog";
import {
  type UpdateOwnPasswordForm,
  updateOwnPasswordSchema,
} from "@/lib/validations/user";

interface SidebarProfilePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
  onSave: (values: UpdateOwnPasswordForm) => void;
}

export function SidebarProfilePasswordDialog({
  open,
  onOpenChange,
  onBack,
  onSave,
}: SidebarProfilePasswordDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateOwnPasswordForm>({
    resolver: zodResolver(updateOwnPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [open, reset]);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      onBack();
      return;
    }
    onOpenChange(true);
  }

  function onSubmit(values: UpdateOwnPasswordForm) {
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
              <AppDialogTitle>Change password</AppDialogTitle>
              <AppDialogDescription>
                Choose a new password for your scheduler account.
              </AppDialogDescription>
            </div>
          </div>
        </AppDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className={DIALOG_FORM_CLASS}>
          <AppDialogBody className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <PasswordInput
                id="current-password"
                autoComplete="current-password"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.currentPassword)}
                {...register("currentPassword")}
              />
              {errors.currentPassword ? (
                <p className="text-destructive text-xs">
                  {errors.currentPassword.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <PasswordInput
                id="new-password"
                autoComplete="new-password"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.newPassword)}
                {...register("newPassword")}
              />
              {errors.newPassword ? (
                <p className="text-destructive text-xs">
                  {errors.newPassword.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <PasswordInput
                id="confirm-password"
                autoComplete="new-password"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.confirmPassword)}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword ? (
                <p className="text-destructive text-xs">
                  {errors.confirmPassword.message}
                </p>
              ) : null}
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
            <Button type="submit" disabled={isSubmitting}>
              Update password
            </Button>
          </AppDialogFooter>
        </form>
      </AppDialogContent>
    </AppDialog>
  );
}
