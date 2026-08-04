import {
  getDivisionById,
  getProductById,
  getSalesById,
} from "@/lib/customers/org";
import type {
  Customer,
  CustomerIncomingDraft,
  CustomerMergeConflict,
  CustomerMergeField,
  CustomerMergeProposal,
} from "@/types/customer";

const MERGE_FIELDS: CustomerMergeField[] = [
  "picName",
  "email",
  "companyName",
  "jobTitle",
];

function fieldValue(
  source: Pick<CustomerIncomingDraft, CustomerMergeField> | Customer,
  field: CustomerMergeField,
): string | undefined {
  const value = source[field];
  return value?.trim() ? value.trim() : undefined;
}

export function buildMembershipPreview(draft: CustomerIncomingDraft) {
  const division = getDivisionById(draft.divisionId);
  const sales = getSalesById(draft.salesId);
  const product = getProductById(draft.productId);

  return {
    divisionId: draft.divisionId,
    divisionName: division?.name ?? draft.divisionId,
    salesId: draft.salesId,
    salesName: sales?.name ?? draft.salesId,
    productId: draft.productId,
    productName: product?.name ?? draft.productId,
    source: "manual",
  };
}

export function proposeMerge(
  existing: Customer,
  incoming: CustomerIncomingDraft,
  matchKind: "whatsapp" | "email" = "whatsapp",
): CustomerMergeProposal {
  const conflicts: CustomerMergeConflict[] = [];

  for (const field of MERGE_FIELDS) {
    const left = fieldValue(existing, field);
    const right = fieldValue(incoming, field);
    if (left && right && left !== right) {
      conflicts.push({ field, existing: left, incoming: right });
    } else if (!left && right) {
      conflicts.push({ field, existing: left, incoming: right });
    }
  }

  return {
    existing,
    incoming,
    conflicts,
    membershipPreview: buildMembershipPreview(incoming),
    matchKind,
  };
}

export function applyFieldResolutions(
  existing: Customer,
  incoming: CustomerIncomingDraft,
  resolutions: Partial<Record<CustomerMergeField, "existing" | "incoming">>,
): Pick<Customer, CustomerMergeField> {
  const next: Pick<Customer, CustomerMergeField> = {
    picName: existing.picName,
    email: existing.email,
    companyName: existing.companyName,
    jobTitle: existing.jobTitle,
  };

  for (const field of MERGE_FIELDS) {
    const left = fieldValue(existing, field);
    const right = fieldValue(incoming, field);
    const choice =
      resolutions[field] ?? (right && !left ? "incoming" : "existing");

    if (choice === "incoming" && right) {
      next[field] = right;
    } else if (left) {
      next[field] = left;
    } else if (right) {
      next[field] = right;
    } else {
      next[field] = undefined;
    }
  }

  return next;
}

export const MERGE_FIELD_LABEL: Record<CustomerMergeField, string> = {
  picName: "Nama customer (PIC)",
  email: "Email customer",
  companyName: "Perusahaan customer",
  jobTitle: "Jabatan customer",
};
