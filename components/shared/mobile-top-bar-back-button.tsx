"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  getMobileTopBarBackHref,
  MOBILE_TOP_BAR_ORB_BUTTON,
} from "@/config/mobile-chrome";
import { CaretLeftIcon } from "@/lib/icons";

interface MobileTopBarBackButtonProps {
  href?: string;
  label?: string;
}

/** wang-style glass orb back control for nested mobile pages. */
export function MobileTopBarBackButton({
  href,
  label = "Kembali",
}: MobileTopBarBackButtonProps) {
  const pathname = usePathname();
  const router = useRouter();
  const fallbackHref = href ?? getMobileTopBarBackHref(pathname);

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  if (href) {
    return (
      <Link
        aria-label={label}
        className={MOBILE_TOP_BAR_ORB_BUTTON}
        href={href}
        scroll={false}
      >
        <CaretLeftIcon aria-hidden="true" />
      </Link>
    );
  }

  return (
    <button
      aria-label={label}
      className={MOBILE_TOP_BAR_ORB_BUTTON}
      onClick={handleBack}
      type="button"
    >
      <CaretLeftIcon aria-hidden="true" />
    </button>
  );
}
