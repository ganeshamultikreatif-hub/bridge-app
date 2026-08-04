"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HEADER_TOOLBAR_BUTTON,
  HEADER_TOOLBAR_GLYPH,
} from "@/config/header-toolbar";
import { useDivisionScope } from "@/contexts/division-scope-context";
import { ORG_DIVISIONS } from "@/lib/customers/org";
import { Building2Icon, Check } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function DivisionScopeSwitcher({ className }: { className?: string }) {
  const { divisionId, setDivisionId, divisionLabel, closedChip } =
    useDivisionScope();

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(HEADER_TOOLBAR_BUTTON, "h-10! max-w-[12rem]")}
          >
            <Building2Icon
              data-icon="inline-start"
              className={HEADER_TOOLBAR_GLYPH}
            />
            <span className="truncate">{divisionLabel}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56 p-1">
          <button
            type="button"
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm",
              !divisionId ? "bg-muted" : "hover:bg-muted/60",
            )}
            onClick={() => setDivisionId("")}
          >
            All divisions
            {!divisionId ? <Check className="size-4" /> : null}
          </button>
          {ORG_DIVISIONS.map((dept) => {
            const active = divisionId === dept.id;
            return (
              <button
                key={dept.id}
                type="button"
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm",
                  active ? "bg-muted" : "hover:bg-muted/60",
                )}
                onClick={() => setDivisionId(dept.id)}
              >
                {dept.name}
                {active ? <Check className="size-4" /> : null}
              </button>
            );
          })}
        </PopoverContent>
      </Popover>

      {closedChip ? (
        <Badge
          variant="secondary"
          className="hidden tabular-nums sm:inline-flex"
        >
          Closed {closedChip.closed}/{closedChip.target}
        </Badge>
      ) : null}
    </div>
  );
}
