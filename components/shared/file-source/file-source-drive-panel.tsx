"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MANUAL_DRIVE_FOLDER_URL } from "@/config/media";
import { ExternalLink } from "@/lib/icons";

interface FileSourceDrivePanelProps {
  disabled?: boolean;
  existingLinks: string[];
  onAdd: (link: string) => void;
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function FileSourceDrivePanel({
  disabled = false,
  existingLinks,
  onAdd,
}: FileSourceDrivePanelProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleAdd() {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter a Google Drive link.");
      return;
    }

    if (!isValidUrl(trimmed)) {
      setError("Enter a valid http(s) URL.");
      return;
    }

    if (existingLinks.includes(trimmed)) {
      setError("That link is already added.");
      return;
    }

    setError(null);
    onAdd(trimmed);
    setUrl("");
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-muted/30 p-3">
        <p className="text-xs leading-5 text-muted-foreground">
          File lebih dari 25 MB? Upload manual ke folder Google Drive berikut,
          lalu tempel link share-nya di bawah.
        </p>
        <a
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          href={MANUAL_DRIVE_FOLDER_URL}
          rel="noreferrer"
          target="_blank"
        >
          <ExternalLink className="size-3.5" aria-hidden="true" />
          Buka folder Google Drive
        </a>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file-source-drive-url">Google Drive link</Label>
        <Input
          id="file-source-drive-url"
          type="url"
          inputMode="url"
          placeholder="https://drive.google.com/file/d/..."
          value={url}
          disabled={disabled}
          onChange={(event) => {
            setUrl(event.target.value);
            if (error) {
              setError(null);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleAdd();
            }
          }}
        />
      </div>

      {error ? <p className="text-destructive text-xs">{error}</p> : null}

      <Button
        type="button"
        size="sm"
        disabled={disabled || url.trim().length === 0}
        onClick={handleAdd}
      >
        Add Drive link
      </Button>
    </div>
  );
}
