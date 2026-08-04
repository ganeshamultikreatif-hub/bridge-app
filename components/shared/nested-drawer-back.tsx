"use client";

import { DrawerClose } from "@/components/ui/drawer";
import { DRAWER_ORB_BUTTON } from "@/config/app-dialog-drawer";
import { CaretLeftIcon } from "@/lib/icons";

interface NestedDrawerBackProps {
  /** Kept for call-site compat; used as aria-label only. */
  label?: string;
}

/** Glass orb — back one drawer level (wang / Base UI DrawerClose). */
export function NestedDrawerBack({ label = "Kembali" }: NestedDrawerBackProps) {
  return (
    <DrawerClose
      render={
        <button aria-label={label} className={DRAWER_ORB_BUTTON} type="button">
          <CaretLeftIcon aria-hidden />
        </button>
      }
    />
  );
}
