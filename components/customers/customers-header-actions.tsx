"use client";

import Link from "next/link";
import { toast } from "sonner";
import { HeaderActions } from "@/components/shared/header-actions";
import { Button } from "@/components/ui/button";
import { HEADER_TOOLBAR_BUTTON } from "@/config/header-toolbar";
import { customersToCsv } from "@/lib/customers/filters";
import { Download, PlusIcon, Upload } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Customer } from "@/types/customer";

interface CustomersHeaderActionsProps {
  customers: Customer[];
}

export function CustomersHeaderActions({
  customers,
}: CustomersHeaderActionsProps) {
  function handleExport() {
    const csv = customersToCsv(customers);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Customer list exported");
  }

  function handleImport() {
    toast.message("Import Excel coming soon", {
      description:
        "Upload will detect matching WhatsApp numbers and suggest merges.",
    });
  }

  const actions = (
    <>
      <Button asChild className={cn(HEADER_TOOLBAR_BUTTON, "h-10!")}>
        <Link href="/customers/new">
          <PlusIcon data-icon="inline-start" />
          Add Customer
        </Link>
      </Button>
      <Button
        type="button"
        variant="outline"
        className={cn(HEADER_TOOLBAR_BUTTON, "h-10!")}
        onClick={handleImport}
      >
        <Upload data-icon="inline-start" />
        Import
      </Button>
      <Button
        type="button"
        variant="outline"
        className={cn(HEADER_TOOLBAR_BUTTON, "h-10!")}
        onClick={handleExport}
      >
        <Download data-icon="inline-start" />
        Export
      </Button>
    </>
  );

  return (
    <>
      <HeaderActions viewport="mobile">{actions}</HeaderActions>
      <HeaderActions>{actions}</HeaderActions>
    </>
  );
}
