"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FileSourceUrlPanelProps {
  disabled?: boolean;
  existingUrls: string[];
  onAdd: (url: string) => void;
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function FileSourceUrlPanel({
  disabled = false,
  existingUrls,
  onAdd,
}: FileSourceUrlPanelProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleAdd() {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter a URL.");
      return;
    }

    if (!isValidUrl(trimmed)) {
      setError("Enter a valid http(s) URL.");
      return;
    }

    if (existingUrls.includes(trimmed)) {
      setError("That URL is already added.");
      return;
    }

    setError(null);
    onAdd(trimmed);
    setUrl("");
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="file-source-url">Reference URL</Label>
        <Input
          id="file-source-url"
          type="url"
          inputMode="url"
          placeholder="https://…"
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
        <p className="text-muted-foreground text-[11px] leading-relaxed">
          Paste any http(s) reference link. The URL is stored as-is.
        </p>
      </div>

      {error ? <p className="text-destructive text-xs">{error}</p> : null}

      <Button
        type="button"
        size="sm"
        disabled={disabled || url.trim().length === 0}
        onClick={handleAdd}
      >
        Add URL
      </Button>
    </div>
  );
}
