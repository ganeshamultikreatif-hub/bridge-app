import type { FileSourcePickerTab } from "@/types/file-source-picker";

export const FILE_SOURCE_HINT =
  "Upload from device, paste a Google Drive link, or add a URL.";

export const FILE_SOURCE_DELIVERABLE_HINT =
  "Upload from device or paste a Google Drive link for large files.";

export const FILE_SOURCE_LABELS = {
  add: "Add",
  title: "Add files",
  deliverableTitle: "Add deliverable",
  device: "Device",
  drive: "Drive",
  url: "URL",
  dropFiles: "Drop files here",
  chooseFiles: "Choose files",
  processing: "Processing…",
} as const;

export const FILE_SOURCE_REFERENCE_TABS: FileSourcePickerTab[] = [
  "device",
  "drive",
  "url",
];

export const FILE_SOURCE_DELIVERABLE_TABS: FileSourcePickerTab[] = [
  "device",
  "drive",
];
