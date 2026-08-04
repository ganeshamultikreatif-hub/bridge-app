"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useProfileDialog } from "@/components/shared/profile-dialog-provider";

export function ProfilePageOpener() {
  const router = useRouter();
  const { openProfile } = useProfileDialog();

  useEffect(() => {
    openProfile();
    router.replace("/dashboard");
  }, [openProfile, router]);

  return null;
}
