"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Link2, X } from "@/lib/icons";
import {
  formatFileSize,
  getFileKey,
  isImageFile,
} from "@/lib/scheduler/file-upload-utils";

interface FileSourceItemsListProps {
  files: File[];
  driveLinks: string[];
  urls: string[];
  onRemoveFile: (file: File) => void;
  onRemoveDriveLink?: (link: string) => void;
  onRemoveUrl?: (url: string) => void;
}

export function FileSourceItemsList({
  files,
  driveLinks,
  urls,
  onRemoveFile,
  onRemoveDriveLink,
  onRemoveUrl,
}: FileSourceItemsListProps) {
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

  if (files.length === 0 && driveLinks.length === 0 && urls.length === 0) {
    return null;
  }

  return (
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
              onClick={() => onRemoveFile(file)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </li>
        );
      })}

      {driveLinks.map((link) => (
        <li
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2"
          key={`drive-${link}`}
        >
          <Link2
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <a
            className="min-w-0 flex-1 truncate text-sm text-primary hover:underline"
            href={link}
            rel="noreferrer"
            target="_blank"
          >
            {link}
          </a>
          {onRemoveDriveLink ? (
            <Button
              aria-label="Hapus Drive link"
              className="size-7 shrink-0"
              onClick={() => onRemoveDriveLink(link)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <X className="size-3.5" aria-hidden="true" />
            </Button>
          ) : null}
        </li>
      ))}

      {urls.map((link) => (
        <li
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2"
          key={`url-${link}`}
        >
          <Link2
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <a
            className="min-w-0 flex-1 truncate text-sm text-primary hover:underline"
            href={link}
            rel="noreferrer"
            target="_blank"
          >
            {link}
          </a>
          {onRemoveUrl ? (
            <Button
              aria-label="Hapus URL"
              className="size-7 shrink-0"
              onClick={() => onRemoveUrl(link)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <X className="size-3.5" aria-hidden="true" />
            </Button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
