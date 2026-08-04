"use client";

import { useMemo } from "react";
import { ListEmptyState } from "@/components/shared/list-empty-state";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { HEADER_TOOLBAR_SEARCH_INPUT } from "@/config/header-toolbar";
import { MessageIcon, Search } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { InboxConversation } from "@/types/inbox";

interface InboxConversationListProps {
  conversations: InboxConversation[];
  selectedId: string | null;
  query: string;
  onQueryChange: (value: string) => void;
  onSelect: (id: string) => void;
  className?: string;
}

const STATUS_LABEL = {
  open: "Open",
  pending: "Pending",
  closed: "Closed",
} as const;

export function InboxConversationList({
  conversations,
  selectedId,
  query,
  onQueryChange,
  onSelect,
  className,
}: InboxConversationListProps) {
  const unreadTotal = useMemo(
    () => conversations.reduce((sum, item) => sum + item.unread, 0),
    [conversations],
  );

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div className="shrink-0 space-y-3 border-b border-border/70 p-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-semibold text-sm">Conversations</p>
            <p className="text-xs text-muted-foreground">
              {conversations.length} chat
              {unreadTotal > 0 ? ` · ${unreadTotal} unread` : ""}
            </p>
          </div>
        </div>
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Cari customer, WA, sales…"
            className={cn(
              HEADER_TOOLBAR_SEARCH_INPUT,
              "h-9 w-full rounded-full!",
            )}
            aria-label="Search conversations"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <ListEmptyState
            compact
            icon={<MessageIcon className="size-5" aria-hidden />}
            title="Tidak ada conversation"
            description="Balasan broadcast dan chat masuk akan muncul di sini."
            actionHref="/broadcast/new"
            actionLabel="Buat broadcast"
          />
        ) : (
          <ul className="divide-y divide-border/60">
            {conversations.map((item) => {
              const active = item.id === selectedId;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(item.id)}
                    className={cn(
                      "flex w-full gap-3 px-3 py-3 text-left transition-colors",
                      active
                        ? "bg-primary/8"
                        : "hover:bg-black/[0.02] dark:hover:bg-white/[0.03]",
                    )}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-semibold text-primary">
                      {item.customerName.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className="truncate font-medium text-sm">
                          {item.customerName}
                        </span>
                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {item.timeLabel}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {item.companyName || item.whatsapp}
                      </span>
                      <span className="mt-1 flex items-center gap-1.5">
                        <span
                          className={cn(
                            "min-w-0 flex-1 truncate text-xs",
                            item.unread > 0
                              ? "font-medium text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {item.preview}
                        </span>
                        {item.unread > 0 ? (
                          <Badge className="h-5 min-w-5 justify-center rounded-full px-1.5 text-[10px]">
                            {item.unread}
                          </Badge>
                        ) : null}
                      </span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <Badge
                          variant="secondary"
                          className="border-0 text-[10px] font-medium"
                        >
                          Sales · {item.assignedSalesName}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-[10px] font-medium"
                        >
                          {STATUS_LABEL[item.status]}
                        </Badge>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
