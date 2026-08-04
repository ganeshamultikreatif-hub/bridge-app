import { CaretRightIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    label: "Customer",
    hint: "Lead / PIC masuk",
    detail: "WA · company · source",
  },
  {
    label: "Department",
    hint: "Divisi pemilik",
    detail: "Sales · Marketing · CS",
  },
  {
    label: "Sales",
    hint: "Assigned owner",
    detail: "Manual / round robin",
  },
  {
    label: "Status",
    hint: "Pipeline stage",
    detail: "New → Won / Lost",
  },
] as const;

interface LeadFlowLegendProps {
  className?: string;
}

/** Visual flowchart: Customer → Department → Sales → Status. */
export function LeadFlowLegend({ className }: LeadFlowLegendProps) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-2xl border border-border/70 bg-muted/20 p-3",
        className,
      )}
    >
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        Distribution flow
      </p>
      <div className="flex min-w-max items-stretch gap-1.5 sm:gap-2">
        {STEPS.map((step, index) => (
          <div key={step.label} className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-[9.5rem] rounded-xl border border-border/70 bg-card px-3 py-2.5 sm:w-40">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Step {index + 1}
              </p>
              <p className="mt-0.5 text-sm font-semibold">{step.label}</p>
              <p className="text-[11px] text-muted-foreground">{step.hint}</p>
              <p className="mt-1 truncate text-[10px] text-muted-foreground/80">
                {step.detail}
              </p>
            </div>
            {index < STEPS.length - 1 ? (
              <CaretRightIcon
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
