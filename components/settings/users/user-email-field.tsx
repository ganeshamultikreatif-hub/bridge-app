"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { USER_EMAIL_DOMAIN } from "@/lib/user/email";

interface UserEmailFieldProps {
  error?: string | undefined;
  id: string;
  register: UseFormRegisterReturn;
}

export function UserEmailField({ error, id, register }: UserEmailFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Email</Label>
      <div className="flex">
        <Input
          className="rounded-r-none"
          id={id}
          placeholder="johndoe"
          {...register}
        />
        <span className="inline-flex shrink-0 items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm text-muted-foreground">
          @{USER_EMAIL_DOMAIN}
        </span>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
