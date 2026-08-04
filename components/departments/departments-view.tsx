"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { HeaderActions } from "@/components/shared/header-actions";
import { SolidSurface } from "@/components/shared/solid-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  HEADER_TOOLBAR_BUTTON,
  HEADER_TOOLBAR_GLYPH,
  HEADER_TOOLBAR_SEARCH_INPUT,
} from "@/config/header-toolbar";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import {
  filterDepartmentCards,
  listDepartmentCards,
} from "@/lib/departments/data";
import {
  Building2Icon,
  CalendarDays,
  GearSixIcon,
  Megaphone,
  Search,
  Users,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

export function DepartmentsView() {
  const all = useMemo(() => listDepartmentCards(), []);
  const [query, setQuery] = useState("");
  const cards = useMemo(() => filterDepartmentCards(all, query), [all, query]);

  return (
    <>
      <HeaderActions>
        <Button
          type="button"
          variant="outline"
          className={cn(HEADER_TOOLBAR_BUTTON, "h-10!")}
          asChild
        >
          <Link href="/settings">
            <GearSixIcon
              data-icon="inline-start"
              className={HEADER_TOOLBAR_GLYPH}
            />
            Manage
          </Link>
        </Button>
      </HeaderActions>

      <div className="flex w-full flex-col gap-3">
        <SolidSurface className="space-y-4 p-4 md:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="hidden text-xl font-semibold tracking-tight md:block">
                Departments
              </h1>
              <p className="text-sm text-muted-foreground md:mt-1">
                Isolasi data per division · shared customer DB · campaigns per
                team.
              </p>
            </div>
            <Badge variant="secondary" className="w-fit tabular-nums">
              {cards.length} departments
            </Badge>
          </div>

          <div className="relative max-w-md">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search department or campaign…"
              className={cn(HEADER_TOOLBAR_SEARCH_INPUT, "h-10!")}
              aria-label="Search departments"
            />
          </div>
        </SolidSurface>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <article
              key={card.id}
              className={cn(
                APP_PANEL_SURFACE,
                "flex flex-col gap-4 p-4 md:p-5",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Building2Icon className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <h2 className="truncate font-semibold tracking-tight">
                        {card.name}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {card.active ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                </div>
                <Badge variant={card.active ? "secondary" : "outline"}>
                  {card.active ? "Live" : "Off"}
                </Badge>
              </div>

              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-muted/40 px-3 py-2">
                  <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="size-3.5" aria-hidden />
                    Members
                  </dt>
                  <dd className="mt-0.5 font-semibold tabular-nums">
                    {card.memberCount}
                  </dd>
                </div>
                <div className="rounded-xl bg-muted/40 px-3 py-2">
                  <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Megaphone className="size-3.5" aria-hidden />
                    Campaigns
                  </dt>
                  <dd className="mt-0.5 font-semibold tabular-nums">
                    {card.campaignCount}
                  </dd>
                </div>
              </dl>

              <div className="rounded-xl border border-border/50 px-3 py-2.5">
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" aria-hidden />
                  Last broadcast
                </p>
                <p className="mt-1 truncate text-sm font-medium">
                  {card.lastBroadcast}
                </p>
                <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                  {card.lastBroadcastAt}
                </p>
              </div>

              <div className="mt-auto flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  asChild
                >
                  <Link href={`/customers?divisions=${card.id}`}>
                    Customers
                  </Link>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="rounded-full"
                  asChild
                >
                  <Link href="/settings">Settings</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        {cards.length === 0 ? (
          <SolidSurface className="px-4 py-12 text-center">
            <p className="font-medium">No departments match</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try another search, or manage departments in Settings.
            </p>
          </SolidSurface>
        ) : null}
      </div>
    </>
  );
}
