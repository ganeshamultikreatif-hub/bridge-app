"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, BellOff } from "@/lib/icons";
import { cn } from "@/lib/utils";

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(new ArrayBuffer(raw.length));

  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }

  return output;
}

interface PushSubscriptionButtonProps {
  appearance?: "button" | "icon" | "menuItem" | "menuToggle";
  className?: string;
  iconTileClassName?: string;
  onAfterToggle?: () => void;
}

export function PushSubscriptionButton({
  appearance = "button",
  className,
  iconTileClassName,
  onAfterToggle,
}: PushSubscriptionButtonProps) {
  const [supported, setSupported] = useState(true);
  const [iosNeedsInstall, setIosNeedsInstall] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const isSupported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    setSupported(isSupported);

    const userAgent = window.navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(userAgent);
    const isStandalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
        true;
    setIosNeedsInstall(isIOS && !isStandalone && !isSupported);

    if (!isSupported) {
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        const existing = await registration.pushManager.getSubscription();

        if (!cancelled) {
          setSubscribed(Boolean(existing));
        }
      } catch {
        // Service worker unavailable; leave as unsupported state.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const enable = useCallback(async () => {
    setBusy(true);

    try {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        toast.error("Izin notifikasi ditolak.");
        return;
      }

      const keyResponse = await fetch("/api/push/public-key");
      const { publicKey } = (await keyResponse.json()) as {
        publicKey: string | null;
      };

      if (!publicKey) {
        toast.error("Web push belum dikonfigurasi di server.");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });

      if (!response.ok) {
        toast.error("Gagal mengaktifkan notifikasi perangkat.");
        return;
      }

      setSubscribed(true);
      toast.success("Notifikasi perangkat aktif.");
    } catch {
      toast.error("Gagal mengaktifkan notifikasi perangkat.");
    } finally {
      setBusy(false);
    }
  }, []);

  const disable = useCallback(async () => {
    setBusy(true);

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      const subscription = await registration?.pushManager.getSubscription();

      if (subscription) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }

      setSubscribed(false);
      toast.success("Notifikasi perangkat dinonaktifkan.");
    } catch {
      toast.error("Gagal menonaktifkan notifikasi.");
    } finally {
      setBusy(false);
    }
  }, []);

  const showUnsupportedHint = useCallback(() => {
    if (iosNeedsInstall) {
      toast.info(
        "Di iPhone: buka menu Share → Add to Home Screen, lalu buka app dari ikon itu untuk mengaktifkan notifikasi.",
      );
      return;
    }

    toast.error("Browser ini belum mendukung notifikasi push.");
  }, [iosNeedsInstall]);

  const handleToggle = useCallback(
    (next: boolean) => {
      if (!supported) {
        showUnsupportedHint();
        return;
      }

      void (next ? enable() : disable()).finally(() => {
        onAfterToggle?.();
      });
    },
    [disable, enable, onAfterToggle, showUnsupportedHint, supported],
  );

  const handleClick = () => {
    handleToggle(!subscribed);
  };

  const label = subscribed
    ? "Disable Push Notifications"
    : "Enable Push Notifications";
  const Icon = subscribed ? BellOff : Bell;

  if (appearance === "icon") {
    return (
      <button
        aria-label={label}
        aria-pressed={subscribed}
        className={cn(
          "inline-flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground disabled:opacity-50 dark:hover:bg-white/10",
          subscribed && "text-foreground",
          className,
        )}
        disabled={busy}
        onClick={handleClick}
        type="button"
      >
        <Icon className="size-3.5" aria-hidden="true" />
      </button>
    );
  }

  if (appearance === "menuToggle") {
    return (
      <div className={cn("w-full", className)}>
        <SidebarAppIcon icon={Bell} size="dock" tone="notifications" />
        <span className="min-w-0 flex-1 text-left">{label}</span>
        <Switch
          aria-label={label}
          checked={subscribed}
          disabled={busy}
          onCheckedChange={handleToggle}
        />
      </div>
    );
  }

  if (appearance === "menuItem") {
    return (
      <Button
        className={cn(
          "h-9 w-full justify-start gap-2 rounded-md px-2 font-normal",
          className,
        )}
        disabled={busy}
        onClick={handleClick}
        type="button"
        variant="ghost"
      >
        {iconTileClassName ? (
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-[0.6rem] text-white [&_svg]:size-4.5",
              iconTileClassName,
            )}
          >
            <Icon aria-hidden="true" />
          </span>
        ) : (
          <Icon className="size-4 shrink-0" aria-hidden="true" />
        )}
        <span className="truncate">{label}</span>
      </Button>
    );
  }

  return (
    <Button
      className={cn("shrink-0 rounded-xl", className)}
      disabled={busy}
      onClick={handleClick}
      type="button"
      variant={subscribed ? "outline" : "default"}
    >
      <Icon className="mr-2 size-4" aria-hidden="true" />
      {label}
    </Button>
  );
}
