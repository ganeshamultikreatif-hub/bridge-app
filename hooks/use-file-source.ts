"use client";

import { useCallback, useId, useRef, useState } from "react";
import { toast } from "sonner";
import {
  formatFileSize,
  getFileKey,
  MAX_SERVER_UPLOAD_BYTES,
} from "@/lib/scheduler/file-upload-utils";
import type { FileSourcePickerTab } from "@/types/file-source-picker";

export interface UseFileSourceOptions {
  files: File[];
  onFilesChange: (files: File[]) => void;
  driveLinks?: string[];
  onDriveLinksChange?: (links: string[]) => void;
  urls?: string[];
  onUrlsChange?: (urls: string[]) => void;
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
  inputId?: string;
  tabs?: FileSourcePickerTab[];
}

export function useFileSource({
  files,
  onFilesChange,
  driveLinks = [],
  onDriveLinksChange,
  urls = [],
  onUrlsChange,
  disabled = false,
  multiple = true,
  accept,
  inputId: inputIdProp,
  tabs: tabsProp,
}: UseFileSourceOptions) {
  const generatedId = useId();
  const inputId = inputIdProp ?? `file-source-${generatedId}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTab, setPickerTab] = useState<FileSourcePickerTab>("device");

  const tabs =
    tabsProp ??
    ([
      "device",
      onDriveLinksChange ? "drive" : null,
      onUrlsChange ? "url" : null,
    ].filter(Boolean) as FileSourcePickerTab[]);

  const canAdd = !disabled;
  const busy = disabled || isReading;

  const addFiles = useCallback(
    (
      fileList: FileList | File[],
      options?: {
        close?: boolean;
      },
    ) => {
      if (!canAdd) {
        return;
      }

      const incoming = Array.from(fileList);
      if (incoming.length === 0) {
        return;
      }

      setLocalError(null);
      setIsReading(true);
      if (options?.close !== false) {
        setPickerOpen(false);
      }

      try {
        const oversized = incoming.filter(
          (file) => file.size > MAX_SERVER_UPLOAD_BYTES,
        );

        if (oversized.length > 0) {
          toast.error(
            `File melebihi ${formatFileSize(MAX_SERVER_UPLOAD_BYTES)}. Upload ke Google Drive dan tempel link di tab Drive.`,
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

        if (merged.length !== files.length) {
          onFilesChange(merged);
        }
      } finally {
        setIsReading(false);
      }
    },
    [canAdd, files, onFilesChange],
  );

  const addDriveLink = useCallback(
    (link: string) => {
      if (!onDriveLinksChange || !canAdd) {
        return;
      }

      const trimmed = link.trim();
      if (!trimmed || driveLinks.includes(trimmed)) {
        return;
      }

      onDriveLinksChange([...driveLinks, trimmed]);
      setPickerOpen(false);
    },
    [canAdd, driveLinks, onDriveLinksChange],
  );

  const addUrl = useCallback(
    (link: string) => {
      if (!onUrlsChange || !canAdd) {
        return;
      }

      const trimmed = link.trim();
      if (!trimmed || urls.includes(trimmed)) {
        return;
      }

      onUrlsChange([...urls, trimmed]);
      setPickerOpen(false);
    },
    [canAdd, onUrlsChange, urls],
  );

  function openUpload() {
    if (busy) {
      return;
    }
    inputRef.current?.click();
  }

  function openPicker(tab: FileSourcePickerTab = "device") {
    if (busy) {
      return;
    }
    const nextTab = tabs.includes(tab) ? tab : (tabs[0] ?? "device");
    setPickerTab(nextTab);
    setPickerOpen(true);
  }

  function open() {
    openPicker("device");
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextFiles = event.target.files ? Array.from(event.target.files) : [];
    event.target.value = "";

    if (nextFiles.length > 0) {
      addFiles(nextFiles);
    }
  }

  return {
    inputId,
    inputRef,
    accept,
    allowMultiple: multiple,
    tabs,
    disabled,
    localError,
    setLocalError,
    isReading,
    busy,
    canAdd,
    pickerOpen,
    setPickerOpen,
    pickerTab,
    open,
    openUpload,
    openPicker,
    addFiles,
    addDriveLink,
    addUrl,
    handleInputChange,
    files,
    driveLinks,
    urls,
    onFilesChange,
    onDriveLinksChange,
    onUrlsChange,
  };
}

export type FileSourceApi = ReturnType<typeof useFileSource>;
