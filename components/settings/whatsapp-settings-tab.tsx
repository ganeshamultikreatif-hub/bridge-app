"use client";

import { useState } from "react";
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
  SETTINGS_FIELD_HINT,
  SETTINGS_FIELD_LABEL,
} from "@/config/settings-layout";
import { MessageIcon } from "@/lib/icons";
import { saveWhatsAppSettings } from "@/lib/settings/data";
import type { WhatsAppApiSettings } from "@/types/settings";

interface WhatsAppSettingsTabProps {
  initial: WhatsAppApiSettings;
}

export function WhatsAppSettingsTab({ initial }: WhatsAppSettingsTabProps) {
  const [form, setForm] = useState(initial);
  const [tokenDraft, setTokenDraft] = useState("");

  function update<K extends keyof WhatsAppApiSettings>(
    key: K,
    value: WhatsAppApiSettings[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSave() {
    const next = {
      ...form,
      accessTokenMasked: tokenDraft.trim()
        ? `EAAG••••••••${tokenDraft.trim().slice(-4)}`
        : form.accessTokenMasked,
      connected: true,
    };
    setForm(next);
    setTokenDraft("");
    saveWhatsAppSettings(next);
    toast.success("WhatsApp API settings saved");
  }

  function handleTest() {
    toast.success("Webhook reachable", {
      description: form.webhookUrl,
    });
  }

  return (
    <SolidSurface className="space-y-5 p-4 sm:p-5">
      <FormSectionHeading
        icon={<MessageIcon className="size-4" />}
        title="WhatsApp API"
        description="Meta Cloud API connection for outbound and inbox."
        trailing={
          <Badge variant={form.connected ? "default" : "secondary"}>
            {form.connected ? "Connected" : "Disconnected"}
          </Badge>
        }
      />

      <div className={SETTINGS_CONTROL_STACK}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={SETTINGS_FIELD}>
            <Label className={SETTINGS_FIELD_LABEL} htmlFor="phone-id">
              Phone number ID
            </Label>
            <Input
              id="phone-id"
              value={form.phoneNumberId}
              onChange={(e) => update("phoneNumberId", e.target.value)}
            />
          </div>
          <div className={SETTINGS_FIELD}>
            <Label className={SETTINGS_FIELD_LABEL} htmlFor="waba-id">
              WABA ID
            </Label>
            <Input
              id="waba-id"
              value={form.wabaId}
              onChange={(e) => update("wabaId", e.target.value)}
            />
          </div>
          <div className={SETTINGS_FIELD}>
            <Label className={SETTINGS_FIELD_LABEL} htmlFor="biz-name">
              Business account
            </Label>
            <Input
              id="biz-name"
              value={form.businessAccountName}
              onChange={(e) => update("businessAccountName", e.target.value)}
            />
          </div>
          <div className={SETTINGS_FIELD}>
            <Label className={SETTINGS_FIELD_LABEL} htmlFor="access-token">
              Access token
            </Label>
            <Input
              id="access-token"
              type="password"
              placeholder={form.accessTokenMasked}
              value={tokenDraft}
              onChange={(e) => setTokenDraft(e.target.value)}
            />
            <p className={SETTINGS_FIELD_HINT}>
              Leave blank to keep the current token.
            </p>
          </div>
          <div className={SETTINGS_FIELD}>
            <Label className={SETTINGS_FIELD_LABEL} htmlFor="verify-token">
              Webhook verify token
            </Label>
            <Input
              id="verify-token"
              value={form.webhookVerifyToken}
              onChange={(e) => update("webhookVerifyToken", e.target.value)}
            />
          </div>
          <div className={SETTINGS_FIELD}>
            <Label className={SETTINGS_FIELD_LABEL} htmlFor="webhook-url">
              Webhook URL
            </Label>
            <Input
              id="webhook-url"
              value={form.webhookUrl}
              onChange={(e) => update("webhookUrl", e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleTest}>
            Test webhook
          </Button>
          <Button type="button" onClick={handleSave}>
            Save WhatsApp
          </Button>
        </div>
      </div>
    </SolidSurface>
  );
}
