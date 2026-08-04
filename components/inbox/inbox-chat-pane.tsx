"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CaretLeftIcon, Check, CheckCircle2, MessageIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type {
  InboxConversation,
  InboxMessage,
  InboxMessageStatus,
} from "@/types/inbox";

const QUICK_REPLIES = [
  "Baik, saya cek dulu.",
  "Boleh kita jadwalkan demo?",
  "Saya kirim ringkasan via WA.",
];

const STATUS_OPTIONS: Array<{
  value: InboxConversation["status"];
  label: string;
}> = [
  { value: "open", label: "Open" },
  { value: "pending", label: "Pending" },
  { value: "closed", label: "Closed" },
];

interface InboxChatPaneProps {
  conversation: InboxConversation | null;
  onBack?: () => void;
  onOpenCustomer?: () => void;
  onStatusChange?: (
    conversationId: string,
    status: InboxConversation["status"],
  ) => void;
  className?: string;
}

export function InboxChatPane({
  conversation,
  onBack,
  onOpenCustomer,
  onStatusChange,
  className,
}: InboxChatPaneProps) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<InboxMessage[]>(
    conversation?.messages ?? [],
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(conversation?.messages ?? []);
    setDraft("");
  }, [conversation?.messages]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll when message count changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const timeline = useMemo(() => buildTimeline(messages), [messages]);

  function handleSend(bodyOverride?: string) {
    const body = (bodyOverride ?? draft).trim();
    if (!body || !conversation) return;

    const next: InboxMessage = {
      id: `local_${Date.now()}`,
      direction: "outbound",
      body,
      sentAt: new Date().toISOString(),
      sentLabel: "Just now",
      status: "sent",
      senderLabel: conversation.assignedSalesName,
    };
    setMessages((current) => [...current, next]);
    setDraft("");
    toast.success("Pesan terkirim (demo)");

    window.setTimeout(() => {
      setMessages((current) =>
        current.map((item) =>
          item.id === next.id ? { ...item, status: "delivered" } : item,
        ),
      );
    }, 600);
  }

  if (!conversation) {
    return (
      <div
        className={cn(
          "flex min-h-0 flex-col items-center justify-center gap-3 px-6 text-center",
          className,
        )}
      >
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MessageIcon className="size-5" aria-hidden />
        </span>
        <div>
          <p className="font-semibold">Pilih conversation</p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Chat masuk ke sales owner. Pilih thread di kiri untuk membalas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b border-border/70 bg-background/95 px-3 py-2.5 backdrop-blur supports-backdrop-filter:bg-background/80">
        {onBack ? (
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="lg:hidden"
            onClick={onBack}
            aria-label="Back to conversations"
          >
            <CaretLeftIcon className="size-4" />
          </Button>
        ) : null}
        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={onOpenCustomer}
        >
          <p className="truncate font-semibold text-sm">
            {conversation.customerName}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {conversation.whatsapp}
            {conversation.companyName ? ` · ${conversation.companyName}` : ""}
          </p>
        </button>
        <label className="shrink-0">
          <span className="sr-only">Status</span>
          <select
            value={conversation.status}
            onChange={(event) =>
              onStatusChange?.(
                conversation.id,
                event.target.value as InboxConversation["status"],
              )
            }
            className="h-8 rounded-lg border border-border/70 bg-background px-2 text-xs font-medium"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#efeae2]/40 px-3 py-4 dark:bg-emerald-950/20">
        {timeline.map((entry) => {
          if (entry.kind === "day") {
            return (
              <div key={entry.id} className="flex justify-center py-1">
                <span className="rounded-full bg-background/80 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-sm">
                  {entry.label}
                </span>
              </div>
            );
          }

          const message = entry.message;
          const outbound = message.direction === "outbound";
          return (
            <div
              key={message.id}
              className={cn("flex", outbound ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[min(100%,28rem)] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm",
                  outbound
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md bg-card text-card-foreground",
                )}
              >
                {outbound && message.senderLabel ? (
                  <p className="mb-1 text-[10px] font-medium opacity-80">
                    {message.senderLabel} · sales
                  </p>
                ) : null}
                <p className="whitespace-pre-wrap leading-relaxed">
                  {message.body}
                </p>
                <p
                  className={cn(
                    "mt-1 flex items-center justify-end gap-1 text-[10px]",
                    outbound
                      ? "text-primary-foreground/75"
                      : "text-muted-foreground",
                  )}
                >
                  <span>{message.sentLabel}</span>
                  {outbound ? (
                    <DeliveryReceipt status={message.status} />
                  ) : null}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 border-t border-border/70 p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {QUICK_REPLIES.map((reply) => (
            <button
              key={reply}
              type="button"
              className="rounded-full border border-border/70 bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              onClick={() => handleSend(reply)}
            >
              {reply}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-2">
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={`Balas sebagai ${conversation.assignedSalesName}…`}
            rows={2}
            className="min-h-18 flex-1 resize-none rounded-2xl"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            type="button"
            className="h-10 shrink-0 rounded-xl"
            onClick={() => handleSend()}
            disabled={!draft.trim()}
          >
            <Check data-icon="inline-start" />
            Kirim
          </Button>
        </div>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          Enter kirim · Shift+Enter baris baru
        </p>
      </div>
    </div>
  );
}

function DeliveryReceipt({ status }: { status?: InboxMessageStatus }) {
  if (!status) return null;
  if (status === "read") {
    return (
      <span className="inline-flex items-center gap-0.5" title="Read">
        <CheckCircle2 className="size-3 opacity-90" aria-hidden />
      </span>
    );
  }
  if (status === "delivered") {
    return (
      <span className="inline-flex items-center -space-x-1" title="Delivered">
        <Check className="size-3 opacity-80" aria-hidden />
        <Check className="size-3 opacity-80" aria-hidden />
      </span>
    );
  }
  return (
    <span title="Sent">
      <Check className="size-3 opacity-70" aria-hidden />
    </span>
  );
}

type TimelineEntry =
  | { kind: "day"; id: string; label: string }
  | { kind: "message"; message: InboxMessage };

function buildTimeline(messages: InboxMessage[]): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  let lastDay = "";

  for (const message of messages) {
    const day = dayKey(message.sentAt);
    if (day !== lastDay) {
      entries.push({ kind: "day", id: `day_${day}`, label: dayLabel(day) });
      lastDay = day;
    }
    entries.push({ kind: "message", message });
  }

  return entries;
}

function dayKey(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "unknown";
  return date.toISOString().slice(0, 10);
}

function dayLabel(key: string): string {
  if (key === "unknown") return "Earlier";
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000)
    .toISOString()
    .slice(0, 10);
  if (key === today) return "Today";
  if (key === yesterday) return "Yesterday";
  return new Date(`${key}T12:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
