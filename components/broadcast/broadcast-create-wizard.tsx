"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FormInfoPanel } from "@/components/shared/form-info-panel";
import { FormSectionHeading } from "@/components/shared/form-section-heading";
import { HeaderActions } from "@/components/shared/header-actions";
import { HeaderBackButton } from "@/components/shared/header-leading";
import {
  MobileActionDock,
  MobileActionPill,
} from "@/components/shared/mobile-action-dock";
import { SolidSurface } from "@/components/shared/solid-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  BROADCAST_WIZARD_STEPS,
  type BroadcastWizardStepId,
} from "@/config/broadcast";
import { DASHBOARD_DEPARTMENT_OPTIONS } from "@/config/dashboard-filters";
import { HEADER_TOOLBAR_BUTTON } from "@/config/header-toolbar";
import {
  MOBILE_ACTION_BUTTON_PRIMARY,
  MOBILE_ACTION_BUTTON_STRETCH,
  MOBILE_ACTION_DOCK_SCROLL_PAD,
  MOBILE_ACTION_LABEL,
  MOBILE_ACTION_LABEL_PRIMARY,
} from "@/config/mobile-floating";
import {
  BROADCAST_CTAS,
  getAudienceById,
  getCtaById,
  getTemplateById,
  listAudiencesForDepartment,
  listTemplatesForDepartment,
} from "@/lib/broadcast/data";
import { formatMetric } from "@/lib/broadcast/filters";
import {
  CaretLeftIcon,
  CaretRightIcon,
  Check,
  CheckCircle2,
  Clock,
  Megaphone,
  MessageIcon,
  Monitor,
  Users,
  X,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { BroadcastDraft } from "@/types/broadcast";

const INITIAL_DRAFT: BroadcastDraft = {
  name: "",
  departmentId: "",
  audienceId: "",
  templateId: "",
  ctaId: "cta_demo",
  sendMode: "now",
  scheduleAt: "",
};

function stepIndex(id: BroadcastWizardStepId): number {
  return BROADCAST_WIZARD_STEPS.findIndex((step) => step.id === id);
}

export function BroadcastCreateWizard() {
  const router = useRouter();
  const [step, setStep] = useState<BroadcastWizardStepId>("department");
  const [draft, setDraft] = useState<BroadcastDraft>(INITIAL_DRAFT);
  const [sending, setSending] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<
    "android" | "iphone" | "desktop"
  >("android");

  const currentIndex = stepIndex(step);
  const department = DASHBOARD_DEPARTMENT_OPTIONS.find(
    (option) => option.value === draft.departmentId,
  );
  const audiences = useMemo(
    () =>
      draft.departmentId ? listAudiencesForDepartment(draft.departmentId) : [],
    [draft.departmentId],
  );
  const templates = useMemo(
    () =>
      draft.departmentId ? listTemplatesForDepartment(draft.departmentId) : [],
    [draft.departmentId],
  );
  const audience = getAudienceById(draft.audienceId);
  const template = getTemplateById(draft.templateId);
  const cta = getCtaById(draft.ctaId);
  const currentStepMeta = BROADCAST_WIZARD_STEPS[currentIndex]!;

  function patch(partial: Partial<BroadcastDraft>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  function canContinue(): boolean {
    switch (step) {
      case "department":
        return Boolean(draft.departmentId);
      case "audience":
        return Boolean(draft.audienceId);
      case "template":
        return Boolean(draft.templateId && draft.name.trim());
      case "preview":
        return Boolean(template);
      case "cta":
        return Boolean(draft.ctaId);
      case "schedule":
        return (
          draft.sendMode === "now" ||
          (draft.sendMode === "schedule" && Boolean(draft.scheduleAt))
        );
      case "send":
        return true;
      default:
        return false;
    }
  }

  function goNext() {
    if (!canContinue()) {
      toast.error("Lengkapi langkah ini dulu");
      return;
    }
    const next = BROADCAST_WIZARD_STEPS[currentIndex + 1];
    if (next) setStep(next.id);
  }

  function goBack() {
    const prev = BROADCAST_WIZARD_STEPS[currentIndex - 1];
    if (prev) setStep(prev.id);
  }

  function handleCancel() {
    router.push("/broadcast");
  }

  function handleSend() {
    if (!canContinue()) return;
    setSending(true);
    window.setTimeout(() => {
      const mode =
        draft.sendMode === "now"
          ? "dikirim sekarang"
          : `dijadwalkan ${draft.scheduleAt}`;
      toast.success(`Broadcast ${mode}`, {
        description: draft.name || template?.name,
      });
      setSending(false);
      router.push("/broadcast");
    }, 550);
  }

  function handlePrimary() {
    if (step === "send") {
      handleSend();
      return;
    }
    goNext();
  }

  const primaryLabel =
    step === "send"
      ? sending
        ? "Mengirim…"
        : draft.sendMode === "now"
          ? "Konfirmasi & kirim"
          : "Konfirmasi & jadwalkan"
      : "Lanjut";

  return (
    <>
      <HeaderBackButton href="/broadcast" label="Kembali ke broadcast" />

      <HeaderActions disableMobileFallback>
        <Button
          className={cn(HEADER_TOOLBAR_BUTTON, "shrink-0")}
          disabled={sending}
          onClick={handleCancel}
          type="button"
          variant="outline"
        >
          Batal
        </Button>
        {currentIndex > 0 ? (
          <Button
            className={cn(HEADER_TOOLBAR_BUTTON, "shrink-0")}
            disabled={sending}
            onClick={goBack}
            type="button"
            variant="outline"
          >
            Kembali
          </Button>
        ) : null}
        <Button
          className={cn(
            HEADER_TOOLBAR_BUTTON,
            "shrink-0 border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
          )}
          disabled={sending || !canContinue()}
          onClick={handlePrimary}
          type="button"
        >
          {primaryLabel}
        </Button>
      </HeaderActions>

      <div className="md:hidden">
        <MobileActionDock>
          <MobileActionPill>
            <Button
              aria-label="Batal"
              className={cn(
                MOBILE_ACTION_BUTTON_STRETCH,
                "bg-red-500/12 text-red-700 hover:bg-red-500/18",
                "dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/28",
              )}
              disabled={sending}
              onClick={handleCancel}
              type="button"
              variant="ghost"
            >
              <X aria-hidden className="size-3.5!" />
              <span className={MOBILE_ACTION_LABEL}>Batal</span>
            </Button>
            {currentIndex > 0 ? (
              <Button
                aria-label="Kembali"
                className={MOBILE_ACTION_BUTTON_STRETCH}
                disabled={sending}
                onClick={goBack}
                type="button"
                variant="ghost"
              >
                <CaretLeftIcon aria-hidden className="size-3.5!" />
                <span className={MOBILE_ACTION_LABEL}>Kembali</span>
              </Button>
            ) : null}
            <Button
              aria-label={primaryLabel}
              className={MOBILE_ACTION_BUTTON_PRIMARY}
              disabled={sending || !canContinue()}
              onClick={handlePrimary}
              type="button"
            >
              {step === "send" ? (
                <Check aria-hidden className="size-3.5!" />
              ) : (
                <CaretRightIcon aria-hidden className="size-3.5!" />
              )}
              <span className={MOBILE_ACTION_LABEL_PRIMARY}>
                {primaryLabel}
              </span>
            </Button>
          </MobileActionPill>
        </MobileActionDock>
      </div>

      <div
        className={cn(
          "w-full space-y-3 pb-10 md:pb-16",
          MOBILE_ACTION_DOCK_SCROLL_PAD,
        )}
      >
        <div className="min-w-0">
          <h1 className="hidden text-xl font-semibold tracking-tight text-foreground md:block">
            Buat broadcast
          </h1>
          <p className="text-sm text-muted-foreground md:mt-1">
            Langkah {currentIndex + 1} dari {BROADCAST_WIZARD_STEPS.length}
            {" · "}
            {currentStepMeta.label}
          </p>
        </div>

        <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="flex min-w-0 flex-col gap-3">
            <SolidSurface className="p-3 md:p-4 xl:hidden">
              <WizardStepRail
                currentIndex={currentIndex}
                step={step}
                onSelect={setStep}
              />
            </SolidSurface>

            <SolidSurface className="space-y-6 p-4 md:p-5">
              {step === "department" ? (
                <>
                  <FormSectionHeading
                    title="Department"
                    description="Pilih department pemilik broadcast. Audience & template mengikuti scope ini."
                    icon={<Megaphone className="size-4" aria-hidden />}
                  />
                  <RadioGroup
                    value={draft.departmentId}
                    onValueChange={(value) =>
                      patch({
                        departmentId: value,
                        audienceId: "",
                        templateId: "",
                      })
                    }
                    className="grid gap-2 sm:grid-cols-2"
                  >
                    {DASHBOARD_DEPARTMENT_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      const selected = draft.departmentId === option.value;
                      return (
                        <label
                          key={option.value}
                          className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors",
                            selected
                              ? "border-primary/40 bg-primary/5"
                              : "border-border hover:bg-muted/50",
                          )}
                        >
                          <RadioGroupItem
                            value={option.value}
                            className="mt-1"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-2 font-medium">
                              <Icon
                                className="size-4 text-muted-foreground"
                                aria-hidden
                              />
                              {option.label}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                              {option.description}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </RadioGroup>
                </>
              ) : null}

              {step === "audience" ? (
                <>
                  <FormSectionHeading
                    title="Audience"
                    description={`Pilih penerima pesan${department ? ` · ${department.label}` : ""}.`}
                    icon={<Users className="size-4" aria-hidden />}
                  />
                  {audience ? (
                    <div className="rounded-2xl border border-border/70 bg-muted/30 px-4 py-5 text-center">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Estimated reach
                      </p>
                      <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums">
                        {formatMetric(audience.count)}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {audience.name}
                      </p>
                    </div>
                  ) : null}
                  {audiences.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Belum ada audience untuk department ini.
                    </p>
                  ) : (
                    <RadioGroup
                      value={draft.audienceId}
                      onValueChange={(value) => patch({ audienceId: value })}
                      className="grid gap-2"
                    >
                      {audiences.map((option) => {
                        const selected = draft.audienceId === option.id;
                        return (
                          <label
                            key={option.id}
                            className={cn(
                              "flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors",
                              selected
                                ? "border-primary/40 bg-primary/5"
                                : "border-border hover:bg-muted/50",
                            )}
                          >
                            <RadioGroupItem
                              value={option.id}
                              className="mt-1"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center justify-between gap-2">
                                <span className="font-medium">
                                  {option.name}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="tabular-nums"
                                >
                                  {formatMetric(option.count)}
                                </Badge>
                              </span>
                              <span className="mt-0.5 block text-xs text-muted-foreground">
                                {option.description}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </RadioGroup>
                  )}
                </>
              ) : null}

              {step === "template" ? (
                <>
                  <FormSectionHeading
                    title="Template"
                    description="Pilih template WhatsApp dan beri nama campaign."
                    icon={<Megaphone className="size-4" aria-hidden />}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="campaignName">Nama campaign</Label>
                    <Input
                      id="campaignName"
                      value={draft.name}
                      onChange={(event) => patch({ name: event.target.value })}
                      placeholder="e.g. Promo April"
                    />
                  </div>
                  <RadioGroup
                    value={draft.templateId}
                    onValueChange={(value) => patch({ templateId: value })}
                    className="grid gap-2"
                  >
                    {templates.map((option) => {
                      const selected = draft.templateId === option.id;
                      return (
                        <label
                          key={option.id}
                          className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors",
                            selected
                              ? "border-primary/40 bg-primary/5"
                              : "border-border hover:bg-muted/50",
                          )}
                        >
                          <RadioGroupItem value={option.id} className="mt-1" />
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-2">
                              <span className="font-medium">{option.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {option.category}
                              </span>
                            </span>
                            <span className="mt-1 line-clamp-2 whitespace-pre-line text-xs text-muted-foreground">
                              {option.body}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </RadioGroup>
                </>
              ) : null}

              {step === "preview" ? (
                <>
                  <FormSectionHeading
                    title="Preview"
                    description="Tampilan pesan untuk sample customer."
                    icon={<Megaphone className="size-4" aria-hidden />}
                  />
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {(
                      [
                        ["android", "Android", MessageIcon],
                        ["iphone", "iPhone", MessageIcon],
                        ["desktop", "Desktop", Monitor],
                      ] as const
                    ).map(([id, label, Icon]) => (
                      <Button
                        key={id}
                        type="button"
                        size="sm"
                        variant={previewDevice === id ? "default" : "outline"}
                        className="rounded-full"
                        onClick={() => setPreviewDevice(id)}
                      >
                        <Icon data-icon="inline-start" className="size-3.5" />
                        {label}
                      </Button>
                    ))}
                  </div>
                  <div
                    className={cn(
                      "mx-auto border border-border bg-[#e5ddd5] p-3 dark:bg-emerald-950/40",
                      previewDevice === "desktop" &&
                        "max-w-md rounded-xl shadow-sm",
                      previewDevice === "iphone" &&
                        "max-w-[17rem] rounded-[2rem] border-[3px] border-foreground/20 px-2.5 pb-4 pt-5 shadow-md",
                      previewDevice === "android" &&
                        "max-w-sm rounded-[1.75rem]",
                    )}
                  >
                    {previewDevice === "iphone" ? (
                      <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-foreground/25" />
                    ) : null}
                    {previewDevice === "desktop" ? (
                      <div className="mb-2 flex items-center gap-1.5 border-b border-border/50 pb-2">
                        <span className="size-2 rounded-full bg-red-400/80" />
                        <span className="size-2 rounded-full bg-amber-400/80" />
                        <span className="size-2 rounded-full bg-emerald-400/80" />
                        <span className="ml-2 truncate text-[10px] text-muted-foreground">
                          WhatsApp Web · Bridge
                        </span>
                      </div>
                    ) : null}
                    <div
                      className={cn(
                        "rounded-2xl rounded-tl-sm bg-white px-3.5 py-3 text-sm shadow-sm dark:bg-emerald-900/60 dark:text-emerald-50",
                        previewDevice === "desktop" && "rounded-xl",
                      )}
                    >
                      <p className="whitespace-pre-line leading-relaxed">
                        {(template?.body ?? "")
                          .replaceAll("{{name}}", "Budi")
                          .replaceAll("{{company}}", "PT Nusantara")}
                      </p>
                      {cta && cta.url ? (
                        <p className="mt-3 text-xs font-medium text-sky-700 dark:text-sky-300">
                          → {cta.label}
                        </p>
                      ) : null}
                    </div>
                    <p className="mt-3 text-center text-[11px] text-muted-foreground">
                      Sample · {audience?.name ?? "Audience"} ·{" "}
                      {formatMetric(audience?.count ?? 0)} recipients
                    </p>
                  </div>
                </>
              ) : null}

              {step === "cta" ? (
                <>
                  <FormSectionHeading
                    title="CTA"
                    description="Call-to-action opsional pada pesan."
                    icon={<Megaphone className="size-4" aria-hidden />}
                  />
                  <RadioGroup
                    value={draft.ctaId}
                    onValueChange={(value) => patch({ ctaId: value })}
                    className="grid gap-2 sm:grid-cols-2"
                  >
                    {BROADCAST_CTAS.map((option) => {
                      const selected = draft.ctaId === option.id;
                      return (
                        <label
                          key={option.id}
                          className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors",
                            selected
                              ? "border-primary/40 bg-primary/5"
                              : "border-border hover:bg-muted/50",
                          )}
                        >
                          <RadioGroupItem value={option.id} className="mt-1" />
                          <span className="min-w-0 flex-1">
                            <span className="font-medium">{option.label}</span>
                            <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                              {option.url || "Tanpa tombol / link"}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </RadioGroup>
                </>
              ) : null}

              {step === "schedule" ? (
                <>
                  <FormSectionHeading
                    title="Schedule"
                    description="Kirim sekarang atau pilih waktu."
                    icon={<Clock className="size-4" aria-hidden />}
                  />
                  <RadioGroup
                    value={draft.sendMode}
                    onValueChange={(value) =>
                      patch({
                        sendMode: value as BroadcastDraft["sendMode"],
                      })
                    }
                    className="grid gap-2 sm:grid-cols-2"
                  >
                    <label
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors",
                        draft.sendMode === "now"
                          ? "border-primary/40 bg-primary/5"
                          : "border-border hover:bg-muted/50",
                      )}
                    >
                      <RadioGroupItem value="now" className="mt-1" />
                      <span>
                        <span className="font-medium">Kirim sekarang</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          Mulai delivery setelah konfirmasi
                        </span>
                      </span>
                    </label>
                    <label
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors",
                        draft.sendMode === "schedule"
                          ? "border-primary/40 bg-primary/5"
                          : "border-border hover:bg-muted/50",
                      )}
                    >
                      <RadioGroupItem value="schedule" className="mt-1" />
                      <span>
                        <span className="font-medium">Jadwalkan</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          Antri di tanggal & jam tertentu
                        </span>
                      </span>
                    </label>
                  </RadioGroup>

                  {draft.sendMode === "schedule" ? (
                    <div className="space-y-2">
                      <Label htmlFor="scheduleAt">Kirim pada</Label>
                      <Input
                        id="scheduleAt"
                        type="datetime-local"
                        value={draft.scheduleAt}
                        onChange={(event) =>
                          patch({ scheduleAt: event.target.value })
                        }
                      />
                    </div>
                  ) : null}
                </>
              ) : null}

              {step === "send" ? (
                <>
                  <FormSectionHeading
                    title="Kirim"
                    description="Checklist ringkasan sebelum konfirmasi."
                    icon={<Check className="size-4" aria-hidden />}
                  />
                  <ul className="space-y-2">
                    {[
                      {
                        label: "Campaign",
                        value: draft.name || "—",
                        ok: Boolean(draft.name.trim()),
                      },
                      {
                        label: "Department",
                        value: department?.label ?? "—",
                        ok: Boolean(department),
                      },
                      {
                        label: "Audience / reach",
                        value: audience
                          ? `${audience.name} · ${formatMetric(audience.count)}`
                          : "—",
                        ok: Boolean(audience),
                      },
                      {
                        label: "Template",
                        value: template?.name ?? "—",
                        ok: Boolean(template),
                      },
                      {
                        label: "CTA",
                        value: cta?.label ?? "—",
                        ok: Boolean(cta),
                      },
                      {
                        label: "Schedule",
                        value:
                          draft.sendMode === "now"
                            ? "Kirim sekarang"
                            : draft.scheduleAt || "—",
                        ok:
                          draft.sendMode === "now" || Boolean(draft.scheduleAt),
                      },
                    ].map((item) => (
                      <li
                        key={item.label}
                        className="flex items-start gap-3 rounded-xl border border-border/70 px-3.5 py-3"
                      >
                        <CheckCircle2
                          className={cn(
                            "mt-0.5 size-4 shrink-0",
                            item.ok
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-muted-foreground/40",
                          )}
                          aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            {item.label}
                          </p>
                          <p className="mt-0.5 text-sm font-medium">
                            {item.value}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </SolidSurface>
          </div>

          <aside className="hidden min-w-0 flex-col gap-3 xl:flex">
            <SolidSurface className="p-4 md:p-5">
              <FormSectionHeading
                title="Progress"
                description="Alur pembuatan broadcast."
                icon={<Megaphone className="size-4" aria-hidden />}
              />
              <div className="mt-4">
                <WizardStepRail
                  currentIndex={currentIndex}
                  step={step}
                  onSelect={setStep}
                  vertical
                />
              </div>
            </SolidSurface>
            <SolidSurface className="p-4 md:p-5">
              <FormInfoPanel
                title="Informasi"
                description="Status wizard broadcast."
                createHint="Broadcast belum dikirim. Selesaikan semua langkah lalu konfirmasi di akhir."
                saveReminder="Audience & template mengikuti department yang dipilih."
                allSavedHint=""
                genericDirtyHint="Wizard sedang diisi."
                changedSections={
                  draft.departmentId || draft.name
                    ? [currentStepMeta.label]
                    : []
                }
                hasUnsavedChanges={Boolean(
                  draft.departmentId || draft.name || draft.audienceId,
                )}
                formatDate={(value) => value}
              />
            </SolidSurface>
          </aside>
        </div>
      </div>
    </>
  );
}

function WizardStepRail({
  currentIndex,
  step,
  onSelect,
  vertical = false,
}: {
  currentIndex: number;
  step: BroadcastWizardStepId;
  onSelect: (id: BroadcastWizardStepId) => void;
  vertical?: boolean;
}) {
  return (
    <ol
      className={cn(
        vertical ? "flex flex-col gap-1" : "flex gap-1 overflow-x-auto pb-1",
      )}
    >
      {BROADCAST_WIZARD_STEPS.map((item, index) => {
        const active = item.id === step;
        const done = index < currentIndex;
        return (
          <li key={item.id} className={vertical ? "w-full" : "min-w-0 flex-1"}>
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left transition-colors",
                !vertical && "flex-col gap-1.5 text-center",
                active && "bg-primary/8",
              )}
              onClick={() => {
                if (index <= currentIndex) onSelect(item.id);
              }}
              disabled={index > currentIndex}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  done || active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {done ? <Check className="size-3.5" aria-hidden /> : index + 1}
              </span>
              <span
                className={cn(
                  "truncate text-[10px] font-medium sm:text-xs",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
