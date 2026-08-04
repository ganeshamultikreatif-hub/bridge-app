import { cn } from "@/lib/utils";

interface FormInfoPanelProps {
  /** ISO timestamps — omit when creating a new entity. */
  createdAt?: string;
  updatedAt?: string;
  formatDate: (value: string) => string;
  changedSections: string[];
  hasUnsavedChanges: boolean;
  /** Copy when the entity has never been saved. */
  createHint: string;
  /** Reminder under the unsaved-changes list. */
  saveReminder: string;
  /** When edit mode is clean. */
  allSavedHint: string;
  /** When dirty but no section labels were detected. */
  genericDirtyHint: string;
  title?: string;
  description?: string;
}

export function FormInfoPanel({
  createdAt,
  updatedAt,
  formatDate,
  changedSections,
  hasUnsavedChanges,
  createHint,
  saveReminder,
  allSavedHint,
  genericDirtyHint,
  title = "Informasi",
  description = "Metadata dan status simpan.",
}: FormInfoPanelProps) {
  const isSavedEntity = Boolean(createdAt || updatedAt);

  return (
    <div className="space-y-4">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      {isSavedEntity ? (
        <dl className="space-y-3 text-sm">
          {updatedAt ? (
            <div className="space-y-1">
              <dt className="text-xs text-muted-foreground">Terakhir diubah</dt>
              <dd className="font-medium text-primary">
                {formatDate(updatedAt)}
              </dd>
            </div>
          ) : null}
          {createdAt ? (
            <div className="space-y-1">
              <dt className="text-xs text-muted-foreground">Dibuat</dt>
              <dd>{formatDate(createdAt)}</dd>
            </div>
          ) : null}
        </dl>
      ) : (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {createHint}
        </p>
      )}

      {hasUnsavedChanges ? (
        <output className="block space-y-2 rounded-lg bg-amber-500/10 px-3 py-2.5">
          <p className="text-xs font-medium text-amber-950 dark:text-amber-100">
            Perubahan belum disimpan
          </p>
          {changedSections.length > 0 ? (
            <ul className="list-disc space-y-0.5 pl-4 text-xs text-amber-900/90 dark:text-amber-100/90">
              {changedSections.map((section) => (
                <li key={section}>{section}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-amber-900/90 dark:text-amber-100/90">
              {genericDirtyHint}
            </p>
          )}
          <p className="text-xs leading-relaxed text-amber-900/80 dark:text-amber-100/80">
            {saveReminder}
          </p>
        </output>
      ) : isSavedEntity ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {allSavedHint}
        </p>
      ) : null}
    </div>
  );
}
