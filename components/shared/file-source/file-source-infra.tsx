"use client";

import { FileSourcePickerDialog } from "@/components/shared/file-source/file-source-picker-dialog";
import type { FileSourceApi } from "@/hooks/use-file-source";

interface FileSourceInfraProps {
  source: FileSourceApi;
  title?: string;
  description?: string;
}

/** Hidden file input + source picker dialog — mount once per field. */
export function FileSourceInfra({
  source,
  title,
  description,
}: FileSourceInfraProps) {
  return (
    <>
      <input
        ref={source.inputRef}
        id={source.inputId}
        type="file"
        accept={source.accept}
        multiple={source.allowMultiple}
        className="sr-only"
        disabled={source.disabled || !source.canAdd}
        onChange={source.handleInputChange}
      />
      <FileSourcePickerDialog
        open={source.pickerOpen}
        onOpenChange={source.setPickerOpen}
        tabs={source.tabs}
        initialTab={source.pickerTab}
        {...(title ? { title } : {})}
        {...(description ? { description } : {})}
        allowMultiple={source.allowMultiple}
        isReading={source.isReading}
        disabled={source.disabled || !source.canAdd}
        driveLinks={source.driveLinks}
        urls={source.urls}
        onChooseDeviceFiles={source.openUpload}
        onDropDeviceFiles={(files) => {
          source.addFiles(files);
        }}
        onAddDriveLink={source.addDriveLink}
        onAddUrl={source.addUrl}
      />
    </>
  );
}
