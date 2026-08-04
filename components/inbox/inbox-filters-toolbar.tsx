"use client";

import { useMemo } from "react";
import { DashboardFilterSelect } from "@/components/dashboard/dashboard-filter-select";
import {
  HeaderActions,
  HeaderActionsBadge,
} from "@/components/shared/header-actions";
import { Button } from "@/components/ui/button";
import { HEADER_TOOLBAR_BUTTON } from "@/config/header-toolbar";
import { ORG_DIVISIONS, ORG_SALES } from "@/lib/customers/org";
import {
  CheckCircle2,
  CircleDashed,
  CircleDot,
  FunnelIcon,
  MessageIcon,
  Users,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { InboxFiltersState } from "@/types/inbox";

const MY_INBOX_SALES_ID = "rina";

const STATUS_OPTIONS = [
  {
    value: "open",
    label: "Open",
    description: "Aktif, perlu balasan",
    icon: CircleDot,
  },
  {
    value: "pending",
    label: "Pending",
    description: "Menunggu customer / internal",
    icon: CircleDashed,
  },
  {
    value: "closed",
    label: "Closed",
    description: "Selesai",
    icon: CheckCircle2,
  },
] as const;

interface InboxFiltersToolbarProps {
  filters: InboxFiltersState;
  onChange: (next: InboxFiltersState) => void;
}

export function InboxFiltersToolbar({
  filters,
  onChange,
}: InboxFiltersToolbarProps) {
  const salesOptions = useMemo(
    () =>
      ORG_SALES.map((sales) => ({
        value: sales.id,
        label: sales.name,
        description:
          ORG_DIVISIONS.find((d) => d.id === sales.divisionId)?.name ?? "",
        icon: Users,
      })),
    [],
  );

  const myInboxActive =
    filters.sales.length === 1 && filters.sales[0] === MY_INBOX_SALES_ID;

  const activeFilterCount =
    filters.sales.length + filters.status.length + (filters.unreadOnly ? 1 : 0);

  function patch(partial: Partial<InboxFiltersState>) {
    onChange({ ...filters, ...partial });
  }

  function toggleMyInbox() {
    if (myInboxActive) {
      patch({ sales: [] });
      return;
    }
    patch({ sales: [MY_INBOX_SALES_ID] });
  }

  const actions = (
    <>
      <DashboardFilterSelect
        allLabel="All sales"
        allowClear
        description="Filter by assigned sales"
        icon={Users}
        multiple
        onChange={(sales) => patch({ sales })}
        options={salesOptions}
        title="Sales"
        value={filters.sales}
      />
      <DashboardFilterSelect
        allLabel="All status"
        allowClear
        description="Open, pending, or closed"
        icon={FunnelIcon}
        multiple
        onChange={(status) =>
          patch({
            status: status as InboxFiltersState["status"],
          })
        }
        options={[...STATUS_OPTIONS]}
        title="Status"
        value={filters.status}
      />
      <Button
        type="button"
        variant={filters.unreadOnly ? "default" : "outline"}
        className={cn(HEADER_TOOLBAR_BUTTON, "h-10!")}
        onClick={() => patch({ unreadOnly: !filters.unreadOnly })}
      >
        <MessageIcon data-icon="inline-start" />
        Unread
      </Button>
      <Button
        type="button"
        variant={myInboxActive ? "default" : "outline"}
        className={cn(HEADER_TOOLBAR_BUTTON, "h-10!")}
        onClick={toggleMyInbox}
      >
        <Users data-icon="inline-start" />
        My inbox
      </Button>
    </>
  );

  return (
    <>
      <HeaderActionsBadge count={activeFilterCount} />
      <HeaderActions viewport="mobile">{actions}</HeaderActions>
      <HeaderActions>{actions}</HeaderActions>
    </>
  );
}
