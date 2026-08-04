"use client";

import type { Control } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import { SidebarProfilePhotoControl } from "@/components/shared/sidebar-profile-photo-control";
import type { UpdateOwnProfileForm } from "@/lib/validations/user";

interface SidebarProfilePhotoFieldProps {
  control: Control<UpdateOwnProfileForm>;
  nameFallback: string;
}

export function SidebarProfilePhotoField({
  control,
  nameFallback,
}: SidebarProfilePhotoFieldProps) {
  const watchedName = useWatch({ control, name: "username" });
  const displayName = watchedName.trim() || nameFallback;

  return (
    <Controller
      control={control}
      name="avatarUrl"
      render={({ field }) => (
        <SidebarProfilePhotoControl
          value={field.value}
          displayName={displayName}
          onChange={field.onChange}
        />
      )}
    />
  );
}
