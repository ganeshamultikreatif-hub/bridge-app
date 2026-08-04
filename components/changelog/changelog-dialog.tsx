"use client";

import { useEffect, useState } from "react";
import { ChangelogList } from "@/components/changelog/changelog-list";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogFooter,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/shared/app-dialog";
import { Button } from "@/components/ui/button";
import { CHANGELOG, CHANGELOG_VERSION } from "@/config/changelog";
import { useCurrentUser } from "@/contexts/current-user-context";
import {
  shouldShowChangelog,
  writeChangelogSeenVersion,
} from "@/lib/changelog/storage";

function formatPublishedAt(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Auto-opens once per user after CHANGELOG_VERSION is bumped. */
export function ChangelogDialog() {
  const { currentUser } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOpen(shouldShowChangelog(currentUser.id));
    setReady(true);
  }, [currentUser.id]);

  function dismiss() {
    writeChangelogSeenVersion(currentUser.id, CHANGELOG_VERSION);
    setOpen(false);
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      dismiss();
      return;
    }

    setOpen(true);
  }

  if (!ready || CHANGELOG.items.length === 0) {
    return null;
  }

  return (
    <AppDialog onOpenChange={handleOpenChange} open={open}>
      <AppDialogContent className="flex flex-col" showCloseButton size="lg">
        <AppDialogHeader>
          <AppDialogTitle>{CHANGELOG.title}</AppDialogTitle>
          <AppDialogDescription>
            {CHANGELOG.summary} · {formatPublishedAt(CHANGELOG.publishedAt)}
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Versi {CHANGELOG.version}
          </p>
          <ChangelogList items={CHANGELOG.items} />
        </AppDialogBody>

        <AppDialogFooter>
          <Button onClick={dismiss} type="button">
            Mengerti
          </Button>
        </AppDialogFooter>
      </AppDialogContent>
    </AppDialog>
  );
}
