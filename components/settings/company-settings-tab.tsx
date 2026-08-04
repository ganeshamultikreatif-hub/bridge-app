"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FormSectionHeading } from "@/components/shared/form-section-heading";
import { SolidSurface } from "@/components/shared/solid-surface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SETTINGS_CONTROL_STACK,
  SETTINGS_FIELD,
  SETTINGS_FIELD_HINT,
  SETTINGS_FIELD_LABEL,
} from "@/config/settings-layout";
import { Building2Icon } from "@/lib/icons";
import { saveCompanySettings } from "@/lib/settings/data";
import type { CompanySettings } from "@/types/settings";

interface CompanySettingsTabProps {
  initial: CompanySettings;
}

export function CompanySettingsTab({ initial }: CompanySettingsTabProps) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof CompanySettings>(
    key: K,
    value: CompanySettings[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSave() {
    setSaving(true);
    saveCompanySettings(form);
    setSaving(false);
    toast.success("Company settings saved");
  }

  return (
    <SolidSurface className="space-y-5 p-4 sm:p-5">
      <FormSectionHeading
        icon={<Building2Icon className="size-4" />}
        title="Company"
        description="Workspace identity used across broadcasts and reports."
      />

      <div className={SETTINGS_CONTROL_STACK}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={SETTINGS_FIELD}>
            <Label className={SETTINGS_FIELD_LABEL} htmlFor="company-name">
              Company name
            </Label>
            <Input
              id="company-name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>
          <div className={SETTINGS_FIELD}>
            <Label className={SETTINGS_FIELD_LABEL} htmlFor="legal-name">
              Legal name
            </Label>
            <Input
              id="legal-name"
              value={form.legalName}
              onChange={(e) => update("legalName", e.target.value)}
            />
          </div>
          <div className={SETTINGS_FIELD}>
            <Label className={SETTINGS_FIELD_LABEL} htmlFor="website">
              Website
            </Label>
            <Input
              id="website"
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </div>
          <div className={SETTINGS_FIELD}>
            <Label className={SETTINGS_FIELD_LABEL} htmlFor="support-email">
              Support email
            </Label>
            <Input
              id="support-email"
              type="email"
              value={form.supportEmail}
              onChange={(e) => update("supportEmail", e.target.value)}
            />
          </div>
          <div className={SETTINGS_FIELD}>
            <Label className={SETTINGS_FIELD_LABEL} htmlFor="timezone">
              Timezone
            </Label>
            <Input
              id="timezone"
              value={form.timezone}
              onChange={(e) => update("timezone", e.target.value)}
            />
            <p className={SETTINGS_FIELD_HINT}>
              Schedules and reports use this timezone.
            </p>
          </div>
          <div className={SETTINGS_FIELD}>
            <Label className={SETTINGS_FIELD_LABEL} htmlFor="country">
              Country
            </Label>
            <Input
              id="country"
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="button" disabled={saving} onClick={handleSave}>
            Save company
          </Button>
        </div>
      </div>
    </SolidSurface>
  );
}
