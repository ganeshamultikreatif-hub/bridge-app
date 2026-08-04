"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CustomerMergeDialog } from "@/components/customers/customer-merge-dialog";
import { FormInfoPanel } from "@/components/shared/form-info-panel";
import { FormSectionHeading } from "@/components/shared/form-section-heading";
import { HeaderActions } from "@/components/shared/header-actions";
import { HeaderBackButton } from "@/components/shared/header-leading";
import {
  MobileActionDock,
  MobileActionPill,
} from "@/components/shared/mobile-action-dock";
import { SolidSurface } from "@/components/shared/solid-surface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HEADER_TOOLBAR_BUTTON } from "@/config/header-toolbar";
import {
  MOBILE_ACTION_BUTTON_PRIMARY,
  MOBILE_ACTION_BUTTON_STRETCH,
  MOBILE_ACTION_DOCK_SCROLL_PAD,
  MOBILE_ACTION_LABEL,
  MOBILE_ACTION_LABEL_PRIMARY,
} from "@/config/mobile-floating";
import { createCustomer, mergeCustomer } from "@/lib/customers/data";
import {
  listProductsForSales,
  listSalesForDivision,
  ORG_DIVISIONS,
} from "@/lib/customers/org";
import { isValidWhatsapp } from "@/lib/customers/whatsapp";
import { Building2Icon, Check, Package, Users, X } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type {
  CustomerIncomingDraft,
  CustomerMergeField,
  CustomerMergeProposal,
} from "@/types/customer";

const CUSTOMER_FORM_ID = "customer-create-form";

export function CustomerCreateForm() {
  const router = useRouter();
  const [divisionId, setDivisionId] = useState("");
  const [salesId, setSalesId] = useState("");
  const [productId, setProductId] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [picName, setPicName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [merging, setMerging] = useState(false);
  const [proposal, setProposal] = useState<CustomerMergeProposal | null>(null);

  const salesOptions = useMemo(
    () => (divisionId ? listSalesForDivision(divisionId) : []),
    [divisionId],
  );
  const productOptions = useMemo(
    () => (salesId ? listProductsForSales(salesId) : []),
    [salesId],
  );

  const changedSections = useMemo(() => {
    const sections: string[] = [];
    if (divisionId || salesId || productId) sections.push("Assignment");
    if (whatsapp || picName || email || companyName || jobTitle) {
      sections.push("Data customer");
    }
    return sections;
  }, [
    companyName,
    divisionId,
    email,
    jobTitle,
    picName,
    productId,
    salesId,
    whatsapp,
  ]);

  const hasUnsavedChanges = changedSections.length > 0;

  function buildDraft(): CustomerIncomingDraft | null {
    if (!divisionId || !salesId || !productId || !whatsapp.trim()) {
      return null;
    }
    return {
      divisionId,
      salesId,
      productId,
      whatsapp: whatsapp.trim(),
      picName: picName.trim() || undefined,
      email: email.trim() || undefined,
      companyName: companyName.trim() || undefined,
      jobTitle: jobTitle.trim() || undefined,
    };
  }

  function handleCancel() {
    router.push("/customers");
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const draft = buildDraft();
    if (!draft) {
      toast.error("Divisi, sales owner, produk, dan WA customer wajib");
      return;
    }
    if (!isValidWhatsapp(draft.whatsapp)) {
      toast.error("Nomor WhatsApp tidak valid");
      return;
    }

    setSaving(true);
    try {
      const result = createCustomer(draft);
      if (result.status === "created") {
        toast.success("Customer disimpan");
        router.push(`/customers/${result.customer.id}`);
        return;
      }
      if (result.status === "membership_exists") {
        toast.message("Membership sudah ada", {
          description: "Customer sudah terhubung ke produk ini.",
        });
        router.push(`/customers/${result.customer.id}`);
        return;
      }
      toast.message(
        result.proposal.matchKind === "email"
          ? "Email cocok dengan customer yang ada"
          : "Nomor WA cocok dengan customer yang ada",
        {
          description:
            "Tinjau Division + Sales di kedua sisi, lalu merge jika ini orang yang sama.",
        },
      );
      setProposal(result.proposal);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  function handleMerge(
    resolutions: Partial<Record<CustomerMergeField, "existing" | "incoming">>,
  ) {
    const draft = buildDraft();
    if (!draft || !proposal) return;

    setMerging(true);
    const updated = mergeCustomer(proposal.existing.id, draft, resolutions);
    setMerging(false);
    setProposal(null);

    if (!updated) {
      toast.error("Merge gagal");
      return;
    }

    toast.success("Customer digabung", {
      description: "Sales owner / produk ditambahkan ke identity yang sama.",
    });
    router.push(`/customers/${updated.id}`);
  }

  const saveLabel = saving ? "Menyimpan…" : "Simpan customer";

  return (
    <>
      <HeaderBackButton href="/customers" label="Kembali ke customer" />

      <HeaderActions disableMobileFallback>
        <Button
          className={cn(HEADER_TOOLBAR_BUTTON, "shrink-0")}
          disabled={saving}
          onClick={handleCancel}
          type="button"
          variant="outline"
        >
          Batal
        </Button>
        <Button
          className={cn(
            HEADER_TOOLBAR_BUTTON,
            "shrink-0 border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
          )}
          disabled={saving}
          form={CUSTOMER_FORM_ID}
          type="submit"
        >
          {saveLabel}
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
              disabled={saving}
              onClick={handleCancel}
              type="button"
              variant="ghost"
            >
              <X aria-hidden className="size-3.5!" />
              <span className={MOBILE_ACTION_LABEL}>Batal</span>
            </Button>
            <Button
              aria-label={saveLabel}
              className={MOBILE_ACTION_BUTTON_PRIMARY}
              disabled={saving}
              form={CUSTOMER_FORM_ID}
              type="submit"
            >
              <Check aria-hidden className="size-3.5!" />
              <span className={MOBILE_ACTION_LABEL_PRIMARY}>{saveLabel}</span>
            </Button>
          </MobileActionPill>
        </MobileActionDock>
      </div>

      <form
        id={CUSTOMER_FORM_ID}
        onSubmit={handleSubmit}
        className={cn(
          "w-full space-y-3 pb-10 md:pb-16",
          MOBILE_ACTION_DOCK_SCROLL_PAD,
        )}
      >
        <div className="min-w-0">
          <h1 className="hidden text-xl font-semibold tracking-tight text-foreground md:block">
            Tambah customer
          </h1>
          <p className="text-sm text-muted-foreground md:mt-1">
            Assignment internal dulu, lalu data customer. Nomor WA wajib.
          </p>
        </div>

        <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="flex min-w-0 flex-col gap-3">
            <SolidSurface className="space-y-6 p-4 md:p-5">
              <FormSectionHeading
                title="Assignment internal"
                description="Divisi → sales owner → produk. Ini tim Bridge, bukan customer."
                icon={<Building2Icon className="size-4" aria-hidden />}
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Divisi</Label>
                  <Select
                    value={divisionId || undefined}
                    onValueChange={(value) => {
                      setDivisionId(value ?? "");
                      setSalesId("");
                      setProductId("");
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih divisi" />
                    </SelectTrigger>
                    <SelectContent>
                      {ORG_DIVISIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sales owner</Label>
                  <Select
                    value={salesId || undefined}
                    onValueChange={(value) => {
                      setSalesId(value ?? "");
                      setProductId("");
                    }}
                    disabled={!divisionId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih sales owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {salesOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Anggota tim Bridge yang punya produk ini
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Produk</Label>
                  <Select
                    value={productId || undefined}
                    onValueChange={(value) => setProductId(value ?? "")}
                    disabled={!salesId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih produk" />
                    </SelectTrigger>
                    <SelectContent>
                      {productOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SolidSurface>

            <SolidSurface className="space-y-6 p-4 md:p-5">
              <FormSectionHeading
                title="Data customer"
                description="Orang / perusahaan di luar. PIC dan WA customer."
                icon={<Users className="size-4" aria-hidden />}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="whatsapp">Nomor WA customer</Label>
                  <Input
                    id="whatsapp"
                    value={whatsapp}
                    onChange={(event) => setWhatsapp(event.target.value)}
                    placeholder="+62 812…"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Wajib. Deteksi customer yang sama lintas divisi/produk.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="picName">Nama customer (PIC)</Label>
                  <Input
                    id="picName"
                    value={picName}
                    onChange={(event) => setPicName(event.target.value)}
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email customer</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Opsional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Perusahaan customer</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                    placeholder="Opsional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Jabatan customer</Label>
                  <Input
                    id="jobTitle"
                    value={jobTitle}
                    onChange={(event) => setJobTitle(event.target.value)}
                    placeholder="Opsional"
                  />
                </div>
              </div>
            </SolidSurface>
          </div>

          <aside className="flex min-w-0 flex-col gap-3">
            <SolidSurface className="p-4 md:p-5">
              <FormInfoPanel
                title="Informasi"
                description="Status form tambah customer."
                createHint="Customer baru belum tersimpan. Setelah simpan, nomor WA jadi kunci identity bersama."
                saveReminder="Pastikan sales owner dan produk sudah benar sebelum menyimpan."
                allSavedHint=""
                genericDirtyHint="Ada field yang sudah diisi."
                changedSections={changedSections}
                hasUnsavedChanges={hasUnsavedChanges}
                formatDate={(value) => value}
              />
            </SolidSurface>
            <SolidSurface className="space-y-3 p-4 md:p-5">
              <FormSectionHeading
                title="Ringkas"
                description="Yang akan tersimpan."
                icon={<Package className="size-4" aria-hidden />}
              />
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Sales owner</dt>
                  <dd className="font-medium">
                    {salesOptions.find((item) => item.id === salesId)?.name ||
                      "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Produk</dt>
                  <dd className="font-medium">
                    {productOptions.find((item) => item.id === productId)
                      ?.name || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Customer (PIC)
                  </dt>
                  <dd className="font-medium">{picName || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">WA</dt>
                  <dd className="font-medium tabular-nums">
                    {whatsapp || "—"}
                  </dd>
                </div>
              </dl>
            </SolidSurface>
          </aside>
        </div>
      </form>

      <CustomerMergeDialog
        open={Boolean(proposal)}
        proposal={proposal}
        merging={merging}
        onOpenChange={(open) => {
          if (!open) setProposal(null);
        }}
        onConfirm={handleMerge}
      />
    </>
  );
}
