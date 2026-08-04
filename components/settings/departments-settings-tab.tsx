"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FormSectionHeading } from "@/components/shared/form-section-heading";
import { SolidSurface } from "@/components/shared/solid-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SETTINGS_CONTROL_STACK,
  SETTINGS_FIELD,
  SETTINGS_FIELD_LABEL,
  SETTINGS_GROUP,
  SETTINGS_ROW,
} from "@/config/settings-layout";
import { Building2Icon, Plus } from "@/lib/icons";
import {
  listSettingsDepartments,
  upsertSettingsDepartment,
} from "@/lib/settings/data";
import { cn } from "@/lib/utils";
import type { SettingsDepartment } from "@/types/settings";

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24);
}

export function DepartmentsSettingsTab() {
  const [items, setItems] = useState(() => listSettingsDepartments());
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const canAdd = useMemo(
    () => name.trim().length > 1 && code.trim().length > 0,
    [name, code],
  );

  function refresh() {
    setItems(listSettingsDepartments());
  }

  function handleAdd() {
    if (!canAdd) return;
    const id = slugify(name) || `dept-${Date.now()}`;
    upsertSettingsDepartment({
      id,
      name: name.trim(),
      code: code.trim().toUpperCase().slice(0, 6),
      active: true,
      memberCount: 0,
    });
    setName("");
    setCode("");
    refresh();
    toast.success("Department added");
  }

  function toggleActive(dept: SettingsDepartment) {
    upsertSettingsDepartment({
      ...dept,
      active: !dept.active,
    });
    refresh();
    toast.message(dept.active ? "Department paused" : "Department activated", {
      description: dept.name,
    });
  }

  return (
    <div className="space-y-4">
      <SolidSurface className="space-y-5 p-4 sm:p-5">
        <FormSectionHeading
          icon={<Building2Icon className="size-4" />}
          title="Department"
          description="Departments isolate campaigns and users; customer DB stays shared."
        />

        <div className={SETTINGS_CONTROL_STACK}>
          <div className="grid gap-3 sm:grid-cols-[1fr_8rem_auto]">
            <div className={SETTINGS_FIELD}>
              <Label className={SETTINGS_FIELD_LABEL} htmlFor="dept-name">
                Name
              </Label>
              <Input
                id="dept-name"
                placeholder="e.g. Partnerships"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className={SETTINGS_FIELD}>
              <Label className={SETTINGS_FIELD_LABEL} htmlFor="dept-code">
                Code
              </Label>
              <Input
                id="dept-code"
                placeholder="PTR"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                className="w-full sm:w-auto"
                disabled={!canAdd}
                onClick={handleAdd}
              >
                <Plus data-icon="inline-start" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </SolidSurface>

      <div className={cn(SETTINGS_GROUP)}>
        {items.map((dept) => (
          <div
            key={dept.id}
            className={cn(
              SETTINGS_ROW,
              "justify-between border-b border-border/40 last:border-0",
            )}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{dept.name}</p>
                <Badge variant="secondary">{dept.code}</Badge>
                <Badge variant={dept.active ? "default" : "outline"}>
                  {dept.active ? "Active" : "Paused"}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {dept.memberCount} members · id {dept.id}
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => toggleActive(dept)}
            >
              {dept.active ? "Pause" : "Activate"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
