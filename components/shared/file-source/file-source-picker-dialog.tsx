"use client";

import { useEffect, useState } from "react";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogFooter,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/shared/app-dialog";
import { FileSourceDevicePanel } from "@/components/shared/file-source/file-source-device-panel";
import { FileSourceDrivePanel } from "@/components/shared/file-source/file-source-drive-panel";
import { FileSourcePickerTabs } from "@/components/shared/file-source/file-source-picker-tabs";
import { FileSourceUrlPanel } from "@/components/shared/file-source/file-source-url-panel";
import { Button } from "@/components/ui/button";
import { FILE_SOURCE_HINT, FILE_SOURCE_LABELS } from "@/config/file-source";
import type { FileSourcePickerTab } from "@/types/file-source-picker";

interface FileSourcePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tabs: FileSourcePickerTab[];
  initialTab?: FileSourcePickerTab;
  title?: string;
  description?: string;
  allowMultiple?: boolean;
  isReading?: boolean;
  disabled?: boolean;
  driveLinks: string[];
  urls: string[];
  onChooseDeviceFiles: () => void;
  onDropDeviceFiles: (files: File[]) => void;
  onAddDriveLink: (link: string) => void;
  onAddUrl: (url: string) => void;
}

export function FileSourcePickerDialog({
  open,
  onOpenChange,
  tabs,
  initialTab = "device",
  title = FILE_SOURCE_LABELS.title,
  description = FILE_SOURCE_HINT,
  allowMultiple = true,
  isReading = false,
  disabled = false,
  driveLinks,
  urls,
  onChooseDeviceFiles,
  onDropDeviceFiles,
  onAddDriveLink,
  onAddUrl,
}: FileSourcePickerDialogProps) {
  const [tab, setTab] = useState<FileSourcePickerTab>(initialTab);

  useEffect(() => {
    if (!open) {
      return;
    }

    setTab(tabs.includes(initialTab) ? initialTab : (tabs[0] ?? "device"));
  }, [initialTab, open, tabs]);

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent size="lg" showCloseButton className="flex flex-col">
        <AppDialogHeader>
          <AppDialogTitle>{title}</AppDialogTitle>
          <AppDialogDescription>{description}</AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody className="space-y-4">
          {tabs.length > 1 ? (
            <FileSourcePickerTabs value={tab} tabs={tabs} onChange={setTab} />
          ) : null}

          {tab === "device" ? (
            <FileSourceDevicePanel
              allowMultiple={allowMultiple}
              disabled={disabled}
              isReading={isReading}
              onChooseFiles={onChooseDeviceFiles}
              onDropFiles={onDropDeviceFiles}
            />
          ) : null}

          {tab === "drive" ? (
            <FileSourceDrivePanel
              disabled={disabled || isReading}
              existingLinks={driveLinks}
              onAdd={onAddDriveLink}
            />
          ) : null}

          {tab === "url" ? (
            <FileSourceUrlPanel
              disabled={disabled || isReading}
              existingUrls={urls}
              onAdd={onAddUrl}
            />
          ) : null}
        </AppDialogBody>

        <AppDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </AppDialogFooter>
      </AppDialogContent>
    </AppDialog>
  );
}
