"use client";

import { FormSectionHeading } from "@/components/shared/form-section-heading";
import { SolidSurface } from "@/components/shared/solid-surface";
import { Badge } from "@/components/ui/badge";
import {
  ORG_PERMISSION_LABELS,
  ORG_ROLE_DESCRIPTIONS,
  ORG_ROLE_LABELS,
  ORG_ROLE_PERMISSIONS,
  ORG_ROLES,
  type OrgPermission,
} from "@/config/org-roles";
import { SETTINGS_GROUP, SETTINGS_ROW } from "@/config/settings-layout";
import { KeyIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const PERMISSION_ORDER = Object.keys(ORG_PERMISSION_LABELS) as OrgPermission[];

export function RolesSettingsTab() {
  return (
    <div className="space-y-4">
      <SolidSurface className="space-y-4 p-4 sm:p-5">
        <FormSectionHeading
          icon={<KeyIcon className="size-4" />}
          title="Roles"
          description="Fixed Bridge roles — Admin, Manager, Sales, Marketing."
        />

        <div className="grid gap-3 sm:grid-cols-2">
          {ORG_ROLES.map((role) => (
            <div
              key={role}
              className="rounded-[var(--radius-inner)] border border-border/50 bg-muted/20 p-3"
            >
              <div className="flex items-center gap-2">
                <p className="font-semibold">{ORG_ROLE_LABELS[role]}</p>
                <Badge variant="secondary">
                  {ORG_ROLE_PERMISSIONS[role].length} permissions
                </Badge>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {ORG_ROLE_DESCRIPTIONS[role]}
              </p>
            </div>
          ))}
        </div>
      </SolidSurface>

      <div className={cn(SETTINGS_GROUP, "overflow-x-auto")}>
        <div className="min-w-[640px]">
          <div
            className={cn(
              SETTINGS_ROW,
              "border-b border-border/50 bg-muted/30 text-xs font-medium uppercase tracking-wide text-muted-foreground",
            )}
          >
            <div className="min-w-0 flex-1">Permission</div>
            {ORG_ROLES.map((role) => (
              <div key={role} className="w-24 shrink-0 text-center">
                {ORG_ROLE_LABELS[role]}
              </div>
            ))}
          </div>

          {PERMISSION_ORDER.map((permission) => (
            <div
              key={permission}
              className={cn(
                SETTINGS_ROW,
                "border-b border-border/40 last:border-0",
              )}
            >
              <div className="min-w-0 flex-1 text-sm">
                {ORG_PERMISSION_LABELS[permission]}
              </div>
              {ORG_ROLES.map((role) => {
                const allowed = ORG_ROLE_PERMISSIONS[role].includes(permission);
                return (
                  <div key={role} className="flex w-24 shrink-0 justify-center">
                    <span
                      role="img"
                      className={cn(
                        "inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold",
                        allowed
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground",
                      )}
                      aria-label={
                        allowed
                          ? `${ORG_ROLE_LABELS[role]} can ${ORG_PERMISSION_LABELS[permission]}`
                          : `${ORG_ROLE_LABELS[role]} cannot ${ORG_PERMISSION_LABELS[permission]}`
                      }
                    >
                      {allowed ? "✓" : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
