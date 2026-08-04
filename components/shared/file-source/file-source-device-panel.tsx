"use client";

import type { DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { FILE_SOURCE_LABELS } from "@/config/file-source";
import { RADIUS_DEEP } from "@/config/shape";
import { UploadSimpleIcon } from "@/lib/icons";
import {
  formatFileSize,
  MAX_SERVER_UPLOAD_BYTES,
} from "@/lib/scheduler/file-upload-utils";
import { cn } from "@/lib/utils";

interface FileSourceDevicePanelProps {
  allowMultiple: boolean;
  disabled?: boolean;
  isReading?: boolean;
  onChooseFiles: () => void;
  onDropFiles: (files: File[]) => void;
}

export function FileSourceDevicePanel({
  allowMultiple,
  disabled = false,
  isReading = false,
  onChooseFiles,
  onDropFiles,
}: FileSourceDevicePanelProps) {
  const busy = disabled || isReading;

  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    if (busy) {
      return;
    }

    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      onDropFiles(files);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={busy}
        onClick={onChooseFiles}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
        className={cn(
          RADIUS_DEEP,
          "flex min-h-40 w-full flex-col items-center justify-center gap-3 border border-dashed border-border bg-muted/20 px-4 py-8 text-center transition-colors",
          "hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:opacity-50",
        )}
      >
        <UploadSimpleIcon className="size-8 text-muted-foreground/70" />
        <div className="space-y-1">
          <p className="font-medium text-sm">
            {isReading
              ? FILE_SOURCE_LABELS.processing
              : FILE_SOURCE_LABELS.dropFiles}
          </p>
          <p className="text-muted-foreground text-xs">
            or choose files from your device
            {allowMultiple ? " · multiple files allowed" : null}
          </p>
          <p className="text-muted-foreground text-[11px]">
            Max {formatFileSize(MAX_SERVER_UPLOAD_BYTES)} per file
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          className="pointer-events-none"
        >
          {isReading
            ? FILE_SOURCE_LABELS.processing
            : FILE_SOURCE_LABELS.chooseFiles}
        </Button>
      </button>
    </div>
  );
}
