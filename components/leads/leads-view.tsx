"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { LeadFlowLegend } from "@/components/leads/lead-flow-legend";
import { LeadKanbanBoard } from "@/components/leads/lead-kanban-board";
import { HeaderActions } from "@/components/shared/header-actions";
import { SolidSurface } from "@/components/shared/solid-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HEADER_TOOLBAR_BUTTON } from "@/config/header-toolbar";
import {
  LEAD_DISTRIBUTION_MODES,
  LEAD_STATUS_LABEL,
  LEAD_STATUS_ORDER,
} from "@/config/leads";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import { PlusIcon, Target, UserRound } from "@/lib/icons";
import {
  defaultSalesForDepartment,
  getDepartmentColumns,
  getSalesColumns,
  getStatusColumns,
  groupLeadsByColumn,
  salesMeta,
} from "@/lib/leads/board";
import {
  getLeadSummary,
  listLeads,
  peekNextRoundRobinSales,
  simulateRoundRobinLead,
  updateLeadDepartment,
  updateLeadSales,
  updateLeadStatus,
} from "@/lib/leads/data";
import { cn } from "@/lib/utils";
import type {
  LeadBoardGroupBy,
  LeadCard,
  LeadDistributionMode,
  LeadStatus,
} from "@/types/lead";

export function LeadsView() {
  const [leads, setLeads] = useState<LeadCard[]>(() => listLeads());
  const [groupBy, setGroupBy] = useState<LeadBoardGroupBy>("status");
  const [mode, setMode] = useState<LeadDistributionMode>("manual");
  const [rrTick, setRrTick] = useState(0);

  const summary = useMemo(() => getLeadSummary(leads), [leads]);
  const columns = useMemo(() => {
    if (groupBy === "sales") return getSalesColumns();
    if (groupBy === "department") return getDepartmentColumns();
    return getStatusColumns();
  }, [groupBy]);
  const grouped = useMemo(
    () => groupLeadsByColumn(leads, groupBy),
    [leads, groupBy],
  );
  const nextAssignee = useMemo(() => {
    void rrTick;
    return peekNextRoundRobinSales();
  }, [rrTick]);

  const activeMode = LEAD_DISTRIBUTION_MODES.find((item) => item.id === mode);

  function refresh() {
    setLeads(listLeads());
  }

  function handleSimulate() {
    const lead = simulateRoundRobinLead();
    setRrTick((n) => n + 1);
    refresh();
    toast.success(`Lead assigned to ${lead.salesName}`, {
      description: `${lead.customerName} · ${lead.departmentName}`,
    });
  }

  function handleDropLead(leadId: string, columnId: string) {
    if (mode === "round-robin") {
      toast.message("Round robin aktif", {
        description:
          "Drag manual dinonaktifkan. Gunakan Simulate new lead untuk assign bergilir.",
      });
      return;
    }

    const lead = leads.find((item) => item.id === leadId);
    if (!lead) return;

    if (groupBy === "status") {
      if (!LEAD_STATUS_ORDER.includes(columnId as LeadStatus)) return;
      if (lead.status === columnId) return;
      updateLeadStatus(leadId, columnId as LeadStatus);
      toast.success(`Status → ${LEAD_STATUS_LABEL[columnId as LeadStatus]}`, {
        description: `${lead.customerName} · Sales ${lead.salesName}`,
      });
      refresh();
      return;
    }

    if (groupBy === "sales") {
      const meta = salesMeta(columnId);
      if (!meta || lead.salesId === columnId) return;
      updateLeadSales(
        leadId,
        meta.salesId,
        meta.salesName,
        meta.departmentId,
        meta.departmentName,
      );
      toast.success(`Assigned ke ${meta.salesName}`, {
        description: `${lead.customerName} · ${meta.departmentName}`,
      });
      refresh();
      return;
    }

    const meta = defaultSalesForDepartment(columnId);
    if (!meta || lead.departmentId === columnId) return;
    updateLeadDepartment(
      leadId,
      meta.departmentId,
      meta.departmentName,
      meta.salesId,
      meta.salesName,
    );
    toast.success(`Department → ${meta.departmentName}`, {
      description: `${lead.customerName} · default sales ${meta.salesName}`,
    });
    refresh();
  }

  return (
    <>
      <HeaderActions>
        {mode === "round-robin" ? (
          <Button
            type="button"
            className={cn(HEADER_TOOLBAR_BUTTON, "h-10!")}
            onClick={handleSimulate}
          >
            <PlusIcon data-icon="inline-start" />
            Simulate new lead
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            className={cn(HEADER_TOOLBAR_BUTTON, "h-10!")}
            onClick={() => {
              setMode("round-robin");
              toast.message("Round robin mode", {
                description: "Simulate new lead untuk melihat assign bergilir.",
              });
            }}
          >
            <Target data-icon="inline-start" />
            Auto distribute
          </Button>
        )}
      </HeaderActions>

      <div className="flex w-full flex-col gap-3">
        <SolidSurface className="space-y-4 p-4 md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="hidden text-xl font-semibold tracking-tight md:block">
                Lead distribution
              </h1>
              <p className="text-sm text-muted-foreground md:mt-1">
                Customer → Department → Sales → Status. Mode menentukan cara
                assign owner.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="tabular-nums">
                {summary.total} leads
              </Badge>
              <Badge variant="secondary" className="tabular-nums">
                {summary.newCount} new
              </Badge>
              <Badge variant="secondary" className="tabular-nums">
                {summary.won} won
              </Badge>
            </div>
          </div>

          <LeadFlowLegend />

          <div className="space-y-3">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Distribution mode
              </span>
              <div className="grid gap-2 sm:grid-cols-3">
                {LEAD_DISTRIBUTION_MODES.map((item) => {
                  const active = mode === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMode(item.id)}
                      className={cn(
                        "rounded-2xl border px-3.5 py-3 text-left transition-colors",
                        active
                          ? "border-primary/40 bg-primary/5"
                          : "border-border/70 hover:bg-muted/40",
                      )}
                    >
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {mode === "round-robin" ? (
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/70 bg-muted/30 px-3 py-2.5">
                <span className="text-xs text-muted-foreground">
                  Next assignee
                </span>
                <Badge
                  variant="secondary"
                  className="gap-1.5 border-0 font-medium"
                >
                  <UserRound className="size-3.5" aria-hidden />
                  {nextAssignee.salesName}
                  <span className="text-muted-foreground">
                    · {nextAssignee.departmentName}
                  </span>
                </Badge>
                <Button
                  type="button"
                  size="sm"
                  className="ml-auto rounded-full"
                  onClick={handleSimulate}
                >
                  <PlusIcon data-icon="inline-start" />
                  Simulate new lead
                </Button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                {activeMode?.description}
                {mode === "manual" ? " · Drag kartu antar kolom." : null}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            <span className="mr-1 self-center text-xs font-medium text-muted-foreground">
              Board
            </span>
            {(
              [
                ["status", "By status"],
                ["sales", "By sales"],
                ["department", "By department"],
              ] as const
            ).map(([id, label]) => (
              <Button
                key={id}
                type="button"
                size="sm"
                variant={groupBy === id ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setGroupBy(id)}
              >
                {label}
              </Button>
            ))}
          </div>
        </SolidSurface>

        <div
          className={cn(APP_PANEL_SURFACE, "overflow-hidden rounded-2xl p-3")}
        >
          <LeadKanbanBoard
            columns={columns}
            leadsByColumn={grouped}
            disabled={mode === "round-robin"}
            onMoveLead={handleDropLead}
          />
        </div>
      </div>
    </>
  );
}
