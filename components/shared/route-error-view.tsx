"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface RouteErrorViewProps {
  description?: string;
  digest?: string | undefined;
  onRetry?: () => void;
  showHomeLink?: boolean;
  title?: string;
}

export function RouteErrorView({
  description = "Terjadi kesalahan saat memuat halaman. Coba muat ulang atau kembali ke halaman aman.",
  digest,
  onRetry,
  showHomeLink = true,
  title = "Terjadi kesalahan",
}: RouteErrorViewProps) {
  const router = useRouter();

  function handleRetry() {
    if (onRetry) {
      onRetry();
      return;
    }

    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-12 text-center">
      <div className="w-full max-w-md space-y-4 rounded-[1.75rem] border border-border bg-card p-8 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {digest ? (
          <p className="rounded-xl bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
            Error ID: {digest}
          </p>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button className="rounded-xl" onClick={handleRetry} type="button">
            Muat ulang
          </Button>
          {showHomeLink ? (
            <Button
              asChild
              className="rounded-xl"
              type="button"
              variant="secondary"
            >
              <Link href="/dashboard">Ke Dashboard</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
