"use client";

import Link from "next/link";
import { MOBILE_ADD_FAB, MOBILE_ADD_FAB_ICON } from "@/config/mobile-floating";
import { PlusIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface MobileAddFabProps {
  href: string;
  label: string;
  className?: string;
}

/** Mobile-only create FAB — mirrors scheduler-app add pattern. */
export function MobileAddFab({ href, label, className }: MobileAddFabProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(MOBILE_ADD_FAB, className)}
    >
      <PlusIcon className={MOBILE_ADD_FAB_ICON} aria-hidden />
    </Link>
  );
}
