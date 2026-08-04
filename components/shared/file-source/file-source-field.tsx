"use client";

import { useState } from "react";
import { FileSourceInfra } from "@/components/shared/file-source/file-source-infra";
import { FileSourceItemsList } from "@/components/shared/file-source/file-source-items-list";
import { FILE_SOURCE_HINT, FILE_SOURCE_LABELS } from "@/config/file-source";
import { RADIUS_DEEP } from "@/config/shape";
import { useFileSource } from "@/hooks/use-file-source";
import { UploadSimpleIcon } from "@/lib/icons";
import { getFileKey } from "@/lib/scheduler/file-upload-utils";
import { cn } from "@/lib/utils";
import type { FileSourcePickerTab } from "@/types/file-source-picker";

interface FileSourceFieldProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  driveLinks?: string[];
  onDriveLinksChange?: (links: string[]) => void;
  urls?: string[];
  onUrlsChange?: (urls: string[]) => void;
  accept?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  tabs?: FileSourcePickerTab[];
  dialogTitle?: string;
  dialogDescription?: string;
}

export function FileSourceField({
  files,
  onFilesChange,
  driveLinks,
  onDriveLinksChange,
  urls,
  onUrlsChange,
  accept,
  disabled = false,
  className,
  placeholder = "Klik atau tarik file ke sini",
  tabs,
  dialogTitle,
  dialogDescription = FILE_SOURCE_HINT,
}: FileSourceFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const source = useFileSource({
    files,
    onFilesChange,
    ...(driveLinks !== undefined ? { driveLinks } : {}),
    ...(onDriveLinksChange ? { onDriveLinksChange } : {}),
    ...(urls !== undefined ? { urls } : {}),
    ...(onUrlsChange ? { onUrlsChange } : {}),
    disabled,
    ...(accept ? { accept } : {}),
    ...(tabs ? { tabs } : {}),
  });

  function handleDrop(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsDragging(false);

    if (source.busy) {
      return;
    }

    const dropped = Array.from(event.dataTransfer.files);
    source.openPicker("device");

    if (dropped.length > 0) {
      source.addFiles(dropped, { close: false });
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <FileSourceItemsList
        files={files}
        driveLinks={source.driveLinks}
        urls={source.urls}
        onRemoveFile={(file) => {
          onFilesChange(
            files.filter((item) => getFileKey(item) !== getFileKey(file)),
          );
        }}
        {...(onDriveLinksChange
          ? {
              onRemoveDriveLink: (link: string) => {
                onDriveLinksChange(
                  source.driveLinks.filter((item) => item !== link),
                );
              },
            }
          : {})}
        {...(onUrlsChange
          ? {
              onRemoveUrl: (link: string) => {
                onUrlsChange(source.urls.filter((item) => item !== link));
              },
            }
          : {})}
      />

      <button
        type="button"
        disabled={source.busy}
        onClick={() => source.open()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          RADIUS_DEEP,
          "flex w-full flex-col items-center justify-center gap-1.5 border border-dashed px-3 py-5 text-center transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:opacity-50",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40",
        )}
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-background text-muted-foreground ring-1 ring-border">
          <UploadSimpleIcon className="size-4.5" aria-hidden="true" />
        </span>
        <span className="text-sm font-medium text-foreground">
          {source.isReading ? FILE_SOURCE_LABELS.processing : placeholder}
        </span>
        <span className="max-w-sm text-xs text-muted-foreground">
          {dialogDescription}
        </span>
      </button>

      {source.localError ? (
        <p className="text-destructive text-xs">{source.localError}</p>
      ) : null}

      <FileSourceInfra
        source={source}
        {...(dialogTitle ? { title: dialogTitle } : {})}
        {...(dialogDescription ? { description: dialogDescription } : {})}
      />
    </div>
  );
}
