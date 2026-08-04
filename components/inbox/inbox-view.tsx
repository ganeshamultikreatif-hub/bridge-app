"use client";

import { useMemo, useState } from "react";
import { InboxChatPane } from "@/components/inbox/inbox-chat-pane";
import { InboxConversationList } from "@/components/inbox/inbox-conversation-list";
import { InboxCustomerPane } from "@/components/inbox/inbox-customer-pane";
import { InboxFiltersToolbar } from "@/components/inbox/inbox-filters-toolbar";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  filterInboxConversations,
  listInboxConversations,
} from "@/lib/inbox/data";
import { cn } from "@/lib/utils";
import type { InboxConversation, InboxFiltersState } from "@/types/inbox";

type MobilePane = "list" | "chat" | "customer";

const EMPTY_FILTERS: InboxFiltersState = {
  q: "",
  sales: [],
  status: [],
  unreadOnly: false,
};

export function InboxView() {
  const isMobile = useIsMobile();
  const [all, setAll] = useState<InboxConversation[]>(() =>
    listInboxConversations(),
  );
  const [filters, setFilters] = useState<InboxFiltersState>(EMPTY_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(
    all[0]?.id ?? null,
  );
  const [mobilePane, setMobilePane] = useState<MobilePane>("list");

  const conversations = useMemo(
    () =>
      filterInboxConversations(all, {
        q: filters.q,
        sales: filters.sales,
        status: filters.status,
        unreadOnly: filters.unreadOnly,
      }),
    [all, filters],
  );

  const selected =
    conversations.find((item) => item.id === selectedId) ??
    conversations[0] ??
    null;

  function handleSelect(id: string) {
    setSelectedId(id);
    if (isMobile) setMobilePane("chat");
  }

  function handleStatusChange(
    conversationId: string,
    status: InboxConversation["status"],
  ) {
    setAll((current) =>
      current.map((item) =>
        item.id === conversationId ? { ...item, status } : item,
      ),
    );
  }

  return (
    <>
      <InboxFiltersToolbar filters={filters} onChange={setFilters} />

      <div
        className={cn(
          APP_PANEL_SURFACE,
          "flex h-[calc(100svh-9rem)] min-h-[28rem] overflow-hidden md:h-[calc(100svh-8rem)]",
        )}
      >
        <InboxConversationList
          conversations={conversations}
          selectedId={selected?.id ?? null}
          query={filters.q}
          onQueryChange={(q) => setFilters((prev) => ({ ...prev, q }))}
          onSelect={handleSelect}
          className={cn(
            "w-full border-border/70 lg:w-[20rem] lg:shrink-0 lg:border-r",
            isMobile && mobilePane !== "list" && "hidden",
            !isMobile && "flex",
          )}
        />

        <InboxChatPane
          conversation={selected}
          onBack={() => setMobilePane("list")}
          onOpenCustomer={() => {
            if (isMobile) setMobilePane("customer");
          }}
          onStatusChange={handleStatusChange}
          className={cn(
            "min-w-0 flex-1 border-border/70 lg:border-r",
            isMobile && mobilePane !== "chat" && "hidden",
            !isMobile && "flex",
          )}
        />

        <InboxCustomerPane
          conversation={selected}
          onBack={() => setMobilePane("chat")}
          className={cn(
            "w-full lg:w-[18rem] lg:shrink-0",
            isMobile ? mobilePane !== "customer" && "hidden" : "hidden lg:flex",
          )}
        />
      </div>
    </>
  );
}
