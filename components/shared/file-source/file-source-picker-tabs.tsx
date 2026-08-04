"use client";

import { FILE_SOURCE_LABELS } from "@/config/file-source";
import {
  IOS_SEGMENTED_ITEM,
  IOS_SEGMENTED_ITEM_ACTIVE,
  IOS_SEGMENTED_ITEM_INACTIVE,
  IOS_SEGMENTED_TRACK,
} from "@/config/ios-segmented";
import { cn } from "@/lib/utils";
import type { FileSourcePickerTab } from "@/types/file-source-picker";

const TAB_LABELS: Record<FileSourcePickerTab, string> = {
  device: FILE_SOURCE_LABELS.device,
  drive: FILE_SOURCE_LABELS.drive,
  url: FILE_SOURCE_LABELS.url,
};

interface FileSourcePickerTabsProps {
  tabs: FileSourcePickerTab[];
  value: FileSourcePickerTab;
  onChange: (value: FileSourcePickerTab) => void;
}

export function FileSourcePickerTabs({
  tabs,
  value,
  onChange,
}: FileSourcePickerTabsProps) {
  return (
    <nav className={cn(IOS_SEGMENTED_TRACK, "w-full")} aria-label="File source">
      {tabs.map((tab) => {
        const isActive = value === tab;

        return (
          <button
            key={tab}
            type="button"
            aria-current={isActive ? "true" : undefined}
            onClick={() => onChange(tab)}
            className={cn(
              IOS_SEGMENTED_ITEM,
              isActive
                ? IOS_SEGMENTED_ITEM_ACTIVE
                : IOS_SEGMENTED_ITEM_INACTIVE,
            )}
          >
            {TAB_LABELS[tab]}
          </button>
        );
      })}
    </nav>
  );
}
