"use client";

import { NestedDrawerBack } from "@/components/shared/nested-drawer-back";
import { NestedDrawerClose } from "@/components/shared/nested-drawer-close";
import {
  NESTED_DRAWER_HEADER,
  NESTED_DRAWER_TITLE,
} from "@/config/app-dialog-drawer";

interface NestedDrawerHeaderProps {
  title: string;
  /** aria-label for the back orb */
  backLabel?: string;
}

/** Shared nested-drawer chrome: orb back · title · orb close (wang). */
export function NestedDrawerHeader({
  title,
  backLabel,
}: NestedDrawerHeaderProps) {
  return (
    <header className={NESTED_DRAWER_HEADER}>
      <div className="absolute inset-y-0 left-3 z-10 flex items-center">
        <NestedDrawerBack {...(backLabel ? { label: backLabel } : {})} />
      </div>
      <h2 className={NESTED_DRAWER_TITLE}>{title}</h2>
      <div className="absolute inset-y-0 right-3 z-10 flex items-center">
        <NestedDrawerClose />
      </div>
    </header>
  );
}
