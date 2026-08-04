import { MOBILE_SCROLL_TOP_BLUR } from "@/config/mobile-chrome";
import { cn } from "@/lib/utils";

interface MobileTopBlurScrimProps {
  visible?: boolean;
}

/** Soft top scrim — fades in after large title scrolls away (wang). */
export function MobileTopBlurScrim({
  visible = false,
}: MobileTopBlurScrimProps) {
  return (
    <div
      aria-hidden
      className={cn(MOBILE_SCROLL_TOP_BLUR, visible && "opacity-100")}
    />
  );
}
