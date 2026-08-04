"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { BroadcastCampaignTable } from "@/components/broadcast/broadcast-campaign-table";
import { BroadcastSummaryStrip } from "@/components/broadcast/broadcast-summary";
import { BroadcastToolbar } from "@/components/broadcast/broadcast-toolbar";
import { CampaignCalendarView } from "@/components/broadcast/campaign-calendar-view";
import { MobileAddFab } from "@/components/shared/mobile-add-fab";
import { Button } from "@/components/ui/button";
import { DASHBOARD_WIDGET_GAP } from "@/config/dashboard";
import { HEADER_TOOLBAR_BUTTON } from "@/config/header-toolbar";
import { MOBILE_ADD_FAB_SCROLL_PAD } from "@/config/mobile-floating";
import { getBroadcastSummary, listBroadcasts } from "@/lib/broadcast/data";
import {
  filterBroadcasts,
  parseBroadcastFilters,
} from "@/lib/broadcast/filters";
import { CalendarDays, ListBulletClipboardIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

function BroadcastViewContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") === "calendar" ? "calendar" : "list";
  const filters = useMemo(
    () => parseBroadcastFilters(searchParams),
    [searchParams],
  );
  const allCampaigns = useMemo(() => listBroadcasts(), []);
  const campaigns = useMemo(
    () => filterBroadcasts(allCampaigns, filters),
    [allCampaigns, filters],
  );
  const summary = useMemo(() => getBroadcastSummary(campaigns), [campaigns]);

  return (
    <div
      className={cn(
        "flex w-full flex-col",
        DASHBOARD_WIDGET_GAP,
        MOBILE_ADD_FAB_SCROLL_PAD,
      )}
    >
      <div className="flex flex-wrap items-center justify-end gap-1">
        <Button
          asChild
          variant={view === "list" ? "default" : "outline"}
          size="sm"
          className={HEADER_TOOLBAR_BUTTON}
        >
          <Link href="/broadcast">
            <ListBulletClipboardIcon data-icon="inline-start" />
            List
          </Link>
        </Button>
        <Button
          asChild
          variant={view === "calendar" ? "default" : "outline"}
          size="sm"
          className={HEADER_TOOLBAR_BUTTON}
        >
          <Link href="/broadcast?view=calendar">
            <CalendarDays data-icon="inline-start" />
            Calendar
          </Link>
        </Button>
      </div>

      {view === "calendar" ? (
        <CampaignCalendarView />
      ) : (
        <>
          <BroadcastSummaryStrip summary={summary} />
          <BroadcastToolbar filters={filters} />
          <BroadcastCampaignTable campaigns={campaigns} />
        </>
      )}
      <MobileAddFab href="/broadcast/new" label="Create broadcast" />
    </div>
  );
}

export function BroadcastView() {
  return (
    <Suspense fallback={null}>
      <BroadcastViewContent />
    </Suspense>
  );
}
