"use client";

import { useState } from "react";
import { DrawerStackProvider } from "@/components/shared/drawer-stack-context";
import { FadeScrollBody } from "@/components/shared/fade-scroll-body";
import {
  useHasMobileHeaderActions,
  useHeaderActionsBadgeCount,
  useHeaderActionsNode,
} from "@/components/shared/header-actions";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { APP_DIALOG_DRAWER_SURFACE_TALL } from "@/config/app-dialog-drawer";
import {
  MOBILE_HEADER_TOOLS_DRAWER_BODY,
  MOBILE_TOP_BAR_ORB_BUTTON,
} from "@/config/mobile-chrome";
import { useIsMobile } from "@/hooks/use-mobile";
import { FunnelIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface MobileHeaderToolsOrbProps {
  title: string;
}

/**
 * Collapses page tools into a funnel orb → bottom drawer on mobile.
 * Prefers a mobile-native HeaderActions tree when registered.
 */
export function MobileHeaderToolsOrb({ title }: MobileHeaderToolsOrbProps) {
  const isMobile = useIsMobile();
  const actions = useHeaderActionsNode();
  const hasMobileNative = useHasMobileHeaderActions();
  const badgeCount = useHeaderActionsBadgeCount();
  const [open, setOpen] = useState(false);

  if (!isMobile || !actions) {
    return null;
  }

  return (
    <DrawerStackProvider>
      <Drawer
        onOpenChange={setOpen}
        open={open}
        showSwipeHandle
        swipeDirection="down"
      >
        <DrawerTrigger
          render={
            <button
              aria-label="Filter dan aksi"
              className={cn(MOBILE_TOP_BAR_ORB_BUTTON, "relative")}
              type="button"
            >
              <FunnelIcon aria-hidden className="size-[1.35rem]" />
              {badgeCount > 0 ? (
                <span className="pointer-events-none absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
                  {badgeCount > 9 ? "9+" : badgeCount}
                </span>
              ) : null}
            </button>
          }
        />
        <DrawerContent className={cn(APP_DIALOG_DRAWER_SURFACE_TALL, "px-4")}>
          <DrawerHeader className="shrink-0 px-0 pb-3 pt-1 text-left">
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <FadeScrollBody
            className={cn(!hasMobileNative && MOBILE_HEADER_TOOLS_DRAWER_BODY)}
            data-slot="mobile-tools-body"
            resetKey={open}
          >
            {actions}
          </FadeScrollBody>
        </DrawerContent>
      </Drawer>
    </DrawerStackProvider>
  );
}
