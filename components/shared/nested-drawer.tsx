"use client";

import { type ReactElement, type ReactNode, useState } from "react";
import {
  EnsureDrawerStack,
  isOutsideDrawerDismiss,
  useDrawerStack,
  useRegisterDrawerCloser,
} from "@/components/shared/drawer-stack-context";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { APP_DIALOG_DRAWER_SURFACE_TALL } from "@/config/app-dialog-drawer";
import { cn } from "@/lib/utils";

/** Default tall nested-drawer surface — mirrors wang picker nested sheets. */
export const PICKER_NESTED_DRAWER_SURFACE = APP_DIALOG_DRAWER_SURFACE_TALL;

interface NestedDrawerProps {
  trigger: ReactElement;
  /** Accessible name — mirror visible title. */
  title: string;
  children: ReactNode;
  className?: string;
  swipeDirection?: "down" | "up" | "left" | "right";
  showSwipeHandle?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function NestedDrawerRoot({
  trigger,
  title,
  children,
  className,
  swipeDirection = "down",
  showSwipeHandle = true,
  open: openProp,
  onOpenChange,
}: NestedDrawerProps) {
  const stack = useDrawerStack();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  function setOpen(next: boolean) {
    if (!isControlled) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  }

  useRegisterDrawerCloser(() => setOpen(false), open);

  return (
    <Drawer
      open={open}
      showSwipeHandle={showSwipeHandle}
      swipeDirection={swipeDirection}
      onOpenChange={(next, details) => {
        setOpen(next);
        if (!next && isOutsideDrawerDismiss(details.reason)) {
          stack?.closeAll();
        }
      }}
    >
      <DrawerTrigger render={trigger} />
      <DrawerContent className={cn(className ?? PICKER_NESTED_DRAWER_SURFACE)}>
        <DrawerTitle className="sr-only">{title}</DrawerTitle>
        {children}
      </DrawerContent>
    </Drawer>
  );
}

/** Nested mobile drawer — stack inside an open parent drawer (Base UI / wang). */
export function NestedDrawer(props: NestedDrawerProps) {
  return (
    <EnsureDrawerStack>
      <NestedDrawerRoot {...props} />
    </EnsureDrawerStack>
  );
}
