"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FileText, Upload, X } from "@/lib/icons";
import {
  formatFileSize,
  getFileKey,
  isImageFile,
  MAX_SERVER_UPLOAD_BYTES,
} from "@/lib/scheduler/file-upload-utils";
import { cn } from "@/lib/utils";

interface MultiFileUploadFieldProps {
  accept?: string;
  className?: string;
  files: File[];
  onChange: (files: File[]) => void;
  placeholder?: string;
}

export function MultiFileUploadField({
  accept,
  className,
  files,
  onChange,
  placeholder = "Klik atau tarik file ke sini",
}: MultiFileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<Map<string, string>>(
    new Map(),
  );

  useEffect(() => {
    const next = new Map<string, string>();

    for (const file of files) {
      if (!isImageFile(file)) {
        continue;
      }

      next.set(getFileKey(file), URL.createObjectURL(file));
    }

    setPreviewUrls(next);

    return () => {
      for (const url of next.values()) {
        URL.revokeObjectURL(url);
      }
    };
  }, [files]);

  function appendFiles(fileList: FileList | null) {
    if (!fileList?.length) {
      return;
    }

    const incoming = Array.from(fileList);
    const oversized = incoming.filter(
      (file) => file.size > MAX_SERVER_UPLOAD_BYTES,
    );

    if (oversized.length > 0) {
      toast.error(
        `File melebihi ${formatFileSize(MAX_SERVER_UPLOAD_BYTES)}. Upload manual ke Google Drive dan tempel link di bawah.`,
      );
    }

    const accepted = incoming.filter(
      (file) => file.size <= MAX_SERVER_UPLOAD_BYTES,
    );
    const existingKeys = new Set(files.map(getFileKey));
    const merged = [
      ...files,
      ...accepted.filter((file) => !existingKeys.has(getFileKey(file))),
    ];

    onChange(merged);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    appendFiles(event.target.files);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleDrop(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsDragging(false);
    appendFiles(event.dataTransfer.files);
  }

  function removeFile(file: File) {
    onChange(files.filter((item) => getFileKey(item) !== getFileKey(file)));
  }

  return (
    <div className={cn("space-y-3", className)}>
      {files.length > 0 ? (
        <ul className="space-y-2">
          {files.map((file) => {
            const fileKey = getFileKey(file);
            const previewUrl = previewUrls.get(fileKey);

            return (
              <li
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5"
                key={fileKey}
              >
                {previewUrl ? (
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      alt={file.name}
                      className="object-cover"
                      fill
                      sizes="48px"
                      src={previewUrl}
                    />
                  </div>
                ) : (
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="size-5" aria-hidden="true" />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </span>
                </span>
                <Button
                  aria-label={`Hapus ${file.name}`}
                  className="size-8 shrink-0 rounded-lg"
                  onClick={() => removeFile(file)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <X className="size-4" aria-hidden="true" />
                </Button>
              </li>
            );
          })}
        </ul>
      ) : null}

      <button
        className={cn(
          "flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed px-3 py-5 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40",
        )}
        onClick={() => inputRef.current?.click()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        type="button"
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-background text-muted-foreground ring-1 ring-border">
          <Upload className="size-4.5" aria-hidden="true" />
        </span>
        <span className="text-sm font-medium text-foreground">
          {placeholder}
        </span>
        <span className="text-xs text-muted-foreground">
          PNG, JPG, PDF, ZIP — maks. {formatFileSize(MAX_SERVER_UPLOAD_BYTES)}{" "}
          per file
        </span>
      </button>

      <input
        accept={accept}
        className="sr-only"
        multiple
        onChange={handleInputChange}
        ref={inputRef}
        type="file"
      />
    </div>
  );
}
