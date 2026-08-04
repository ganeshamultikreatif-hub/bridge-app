"use client";

import { DrawerClose } from "@/components/ui/drawer";
import { DRAWER_ORB_BUTTON } from "@/config/app-dialog-drawer";
import { XIcon } from "@/lib/icons";

/** Glass orb — close the current drawer only, one level (wang). */
export function NestedDrawerClose() {
  return (
    <DrawerClose
      render={
        <button aria-label="Tutup" className={DRAWER_ORB_BUTTON} type="button">
          <XIcon aria-hidden />
        </button>
      }
    />
  );
}
