"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DashboardScrollableBody } from "@/components/dashboard/dashboard-scrollable-body";
import { DashboardWidget } from "@/components/dashboard/dashboard-widget";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DASHBOARD_RECENT_LIST_MAX_HEIGHT,
  DASHBOARD_RECENT_WIDGET_HEIGHT,
} from "@/config/dashboard";
import { FileTextIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { CustomerNote } from "@/types/customer";

interface CustomerNotesProps {
  items: CustomerNote[];
  className?: string;
  /** Flatten chrome when nested inside Attio-style tabs. */
  embedded?: boolean;
}

export function CustomerNotes({
  items,
  className,
  embedded = false,
}: CustomerNotesProps) {
  const [draft, setDraft] = useState("");
  const [notes, setNotes] = useState(items);
  const isEmpty = notes.length === 0;

  function handleAdd() {
    const body = draft.trim();
    if (!body) return;

    setNotes((current) => [
      {
        id: `local_${Date.now()}`,
        body,
        author: "Admin",
        timeLabel: "Just now",
      },
      ...current,
    ]);
    setDraft("");
    toast.success("Note added");
  }

  const body = (
    <>
      {!embedded ? (
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-sm">Notes</p>
            <p className="text-xs text-muted-foreground">Internal team notes</p>
          </div>
          <FileTextIcon className="size-4 text-foreground/50" aria-hidden />
        </div>
      ) : null}

      <div className={cn("space-y-2", embedded ? "" : "mt-3")}>
        <Textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add a note…"
          className="min-h-20 resize-none rounded-xl"
        />
        <Button
          type="button"
          size="sm"
          className="w-full"
          disabled={!draft.trim()}
          onClick={handleAdd}
        >
          Save note
        </Button>
      </div>

      <DashboardScrollableBody
        className={cn(
          "mt-3 pr-1",
          embedded ? "max-h-[20rem]" : DASHBOARD_RECENT_LIST_MAX_HEIGHT,
        )}
        empty={isEmpty}
      >
        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
            <p className="font-medium text-sm">No notes yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Capture context for sales and department handoffs.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {notes.map((note) => (
              <li
                key={note.id}
                className="rounded-xl bg-black/[0.03] px-3 py-2.5 dark:bg-white/[0.04]"
              >
                <p className="text-sm leading-relaxed">{note.body}</p>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  {note.author} · {note.timeLabel}
                </p>
              </li>
            ))}
          </ul>
        )}
      </DashboardScrollableBody>
    </>
  );

  if (embedded) {
    return <div className={cn("min-h-[12rem]", className)}>{body}</div>;
  }

  return (
    <DashboardWidget
      variant="glass"
      className={cn(
        "min-h-[15.5rem] p-3.5",
        DASHBOARD_RECENT_WIDGET_HEIGHT,
        className,
      )}
    >
      {body}
    </DashboardWidget>
  );
}
