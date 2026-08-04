"use client";

import { usePathname } from "next/navigation";
import { PushSubscriptionButton } from "@/components/notifications/push-subscription-button";
import { useHeaderActionsNode } from "@/components/shared/header-actions";
import {
  HeaderLeadingSlot,
  useHeaderLeadingNode,
} from "@/components/shared/header-leading";
import {
  HeaderTrailingSlot,
  useHeaderTrailingNode,
} from "@/components/shared/header-trailing";
import { MobileHeaderToolsOrb } from "@/components/shared/mobile-header-tools-orb";
import { useMobileScrollChromeSnapshot } from "@/components/shared/mobile-scroll-chrome-provider";
import { MobileTopBarBackButton } from "@/components/shared/mobile-top-bar-back-button";
import { MobileTopBlurScrim } from "@/components/shared/mobile-top-blur-scrim";
import {
  MOBILE_COMPACT_TITLE,
  MOBILE_COMPACT_TITLE_HIDDEN,
  MOBILE_COMPACT_TITLE_VISIBLE,
  MOBILE_TOP_BAR_ACTIONS,
  MOBILE_TOP_BAR_ORB_BUTTON,
  MOBILE_TOP_BAR_ROOT,
  MOBILE_TOP_BAR_ROW,
  shouldShowMobileTopBarBack,
} from "@/config/mobile-chrome";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

/**
 * Fixed mobile top bar (wang): large-title compact name + back orb + tools orb.
 * Desktop page name / filters stay in AppHeader.
 */
export function MobileScrollChrome() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const snapshot = useMobileScrollChromeSnapshot();
  const leading = useHeaderLeadingNode();
  const trailing = useHeaderTrailingNode();
  const actions = useHeaderActionsNode();
  const showCompactTitle = snapshot?.showCompactTitle ?? false;
  const showBlur = snapshot?.showBlur ?? false;
  const title = snapshot?.title ?? "";
  const isNotifications = pathname.startsWith("/notifications");
  const showRegisteredLeading = Boolean(leading) && isMobile;
  const showFallbackBack =
    !showRegisteredLeading && shouldShowMobileTopBarBack(pathname);
  const showBack = showRegisteredLeading || showFallbackBack;
  const showTools = Boolean(actions) && isMobile;
  const showPushToggle = isNotifications && isMobile;
  const showTrailing = Boolean(trailing) && isMobile;
  const showRightCluster =
    showTools || showBack || showPushToggle || showTrailing;

  return (
    <>
      <MobileTopBlurScrim visible={showBlur} />
      <header className={MOBILE_TOP_BAR_ROOT}>
        <div className={cn(MOBILE_TOP_BAR_ROW, showBack && "justify-between")}>
          {showRegisteredLeading ? (
            <HeaderLeadingSlot
              className="pointer-events-auto"
              viewport="mobile"
            />
          ) : showFallbackBack ? (
            <MobileTopBarBackButton />
          ) : null}

          {title ? (
            <p
              aria-hidden={!showCompactTitle}
              className={cn(
                MOBILE_COMPACT_TITLE,
                showCompactTitle
                  ? MOBILE_COMPACT_TITLE_VISIBLE
                  : MOBILE_COMPACT_TITLE_HIDDEN,
              )}
            >
              {title}
            </p>
          ) : null}

          {showRightCluster ? (
            <div className={MOBILE_TOP_BAR_ACTIONS}>
              {showPushToggle ? (
                <PushSubscriptionButton
                  appearance="icon"
                  className={cn(
                    MOBILE_TOP_BAR_ORB_BUTTON,
                    "text-foreground [&_svg]:size-[1.15rem]",
                  )}
                />
              ) : null}
              {showTrailing ? <HeaderTrailingSlot viewport="mobile" /> : null}
              <MobileHeaderToolsOrb
                title={
                  pathname.startsWith("/scheduler") ||
                  pathname.startsWith("/metrics") ||
                  pathname.startsWith("/dashboard") ||
                  pathname.startsWith("/media")
                    ? "Filter"
                    : title || "Filter"
                }
              />
              {showBack && !showTools && !showPushToggle && !showTrailing ? (
                <span aria-hidden className="size-11 shrink-0" />
              ) : null}
            </div>
          ) : null}
        </div>
      </header>
    </>
  );
}
