"use client";

import type { ReactNode } from "react";
import {
  EnsureDrawerStack,
  isOutsideDrawerDismiss,
  useDrawerStack,
  useRegisterDrawerCloser,
} from "@/components/shared/drawer-stack-context";
import { PICKER_NESTED_DRAWER_SURFACE } from "@/components/shared/nested-drawer";
import { NestedDrawerHeader } from "@/components/shared/nested-drawer-header";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface FormNestedDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  backLabel: string;
  children: ReactNode;
  className?: string;
}

function FormNestedDrawerRoot({
  open,
  onOpenChange,
  title,
  backLabel,
  children,
  className,
}: FormNestedDrawerProps) {
  const stack = useDrawerStack();
  useRegisterDrawerCloser(() => onOpenChange(false), open);

  return (
    <Drawer
      open={open}
      showSwipeHandle
      swipeDirection="down"
      onOpenChange={(next, details) => {
        onOpenChange(next);
        if (!next && isOutsideDrawerDismiss(details.reason)) {
          stack?.closeAll();
        }
      }}
    >
      <DrawerContent className={cn(className ?? PICKER_NESTED_DRAWER_SURFACE)}>
        <DrawerTitle className="sr-only">{title}</DrawerTitle>
        <NestedDrawerHeader backLabel={backLabel} title={title} />
        {children}
      </DrawerContent>
    </Drawer>
  );
}

/** Controlled nested drawer for forms opened inside another mobile drawer. */
export function FormNestedDrawer(props: FormNestedDrawerProps) {
  return (
    <EnsureDrawerStack>
      <FormNestedDrawerRoot {...props} />
    </EnsureDrawerStack>
  );
}
