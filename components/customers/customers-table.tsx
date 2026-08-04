"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CUSTOMER_TAG_CLASS } from "@/config/customers";
import { APP_PANEL_SURFACE } from "@/config/shared-surfaces";
import { CUSTOMER_TAG_LABELS } from "@/lib/customers/data";
import { MoreHorizontal, Users } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Customer } from "@/types/customer";

interface CustomersTableProps {
  customers: Customer[];
  className?: string;
}

export function CustomersTable({ customers, className }: CustomersTableProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const allSelected = useMemo(
    () => customers.length > 0 && selected.length === customers.length,
    [customers.length, selected.length],
  );

  function toggleAll(checked: boolean) {
    setSelected(checked ? customers.map((customer) => customer.id) : []);
  }

  function toggleOne(id: string, checked: boolean) {
    setSelected((current) =>
      checked ? [...current, id] : current.filter((value) => value !== id),
    );
  }

  if (customers.length === 0) {
    return (
      <section
        className={cn(
          APP_PANEL_SURFACE,
          "flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center",
          className,
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Users className="size-5" aria-hidden />
        </div>
        <p className="mt-4 font-semibold text-base">Tidak ada customer</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Ubah filter, atau tambah customer di bawah sales owner dan produk.
        </p>
        <Button asChild className="mt-4">
          <Link href="/customers/new">Tambah customer</Link>
        </Button>
      </section>
    );
  }

  return (
    <section
      className={cn(
        APP_PANEL_SURFACE,
        "overflow-hidden rounded-2xl",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3">
        <div>
          <p className="font-semibold text-sm">Database customer</p>
          <p className="text-xs text-muted-foreground">
            {customers.length} customer{customers.length === 1 ? "" : "s"}
            {selected.length > 0 ? ` · ${selected.length} selected` : ""}
            {" · "}match lewat WA atau email
          </p>
        </div>
        {selected.length > 0 ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.message("Assign sales owner coming soon")}
            >
              Assign sales owner
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.message("Bulk tag coming soon")}
            >
              Add Tag
            </Button>
          </div>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
          <thead className="bg-black/[0.02] text-xs text-muted-foreground dark:bg-white/[0.03]">
            <tr>
              <th className="w-10 px-4 py-3 font-medium">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => toggleAll(Boolean(checked))}
                  aria-label="Select all customers"
                />
              </th>
              <th className="px-3 py-3 font-medium">Customer (PIC)</th>
              <th className="px-3 py-3 font-medium">Nomor WA customer</th>
              <th className="px-3 py-3 font-medium">Perusahaan</th>
              <th className="px-3 py-3 font-medium">Jabatan</th>
              <th className="px-3 py-3 font-medium">Produk</th>
              <th className="px-3 py-3 font-medium">Sales owner</th>
              <th className="px-3 py-3 font-medium">Tag</th>
              <th className="w-14 px-3 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => {
              const checked = selected.includes(customer.id);
              const title =
                customer.picName || customer.companyName || customer.whatsapp;
              const initial = title.slice(0, 1).toUpperCase();

              return (
                <tr
                  key={customer.id}
                  className="border-t border-border/60 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3 align-middle">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(next) =>
                        toggleOne(customer.id, Boolean(next))
                      }
                      aria-label={`Select customer ${title}`}
                    />
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="group flex min-w-0 items-center gap-3"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-semibold text-primary">
                        {initial}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-foreground group-hover:text-primary">
                          {customer.picName || "—"}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {customer.email || "PIC di sisi customer"}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-3 py-3 align-middle tabular-nums">
                    {customer.whatsapp}
                  </td>
                  <td className="px-3 py-3 align-middle">
                    {customer.companyName || (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 align-middle text-muted-foreground">
                    {customer.jobTitle || "—"}
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <div className="flex flex-wrap gap-1">
                      {customer.memberships.map((membership) => (
                        <Badge
                          key={membership.id}
                          variant="secondary"
                          className="border-0 font-medium"
                        >
                          {membership.productName}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <div className="space-y-1.5">
                      {customer.memberships.map((membership) => (
                        <div key={membership.id} className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {membership.salesName}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            Divisi {membership.divisionName}
                          </p>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <div className="flex flex-wrap gap-1">
                      {customer.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className={cn(
                            "border-0 font-medium",
                            CUSTOMER_TAG_CLASS[tag],
                          )}
                        >
                          {CUSTOMER_TAG_LABELS[tag]}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label={`Actions for ${title}`}
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/customers/${customer.id}`}>
                            View detail
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            toast.message("Edit contact coming soon")
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            toast.message("Add product membership coming soon")
                          }
                        >
                          Add product
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() =>
                            toast.message("Delete contact coming soon")
                          }
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
