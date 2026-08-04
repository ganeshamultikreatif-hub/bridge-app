"use client";

import { useId, useRef, useState } from "react";
import { SidebarProfileAvatar } from "@/components/shared/sidebar-profile-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrashIcon, UploadSimpleIcon } from "@/lib/icons";

const ACCEPT = "image/png,image/jpeg,image/jpg,image/webp,image/gif";
const MAX_BYTES = 2 * 1024 * 1024;

interface SidebarProfilePhotoControlProps {
  value: string;
  displayName: string;
  onChange: (value: string) => void;
}

export function SidebarProfilePhotoControl({
  value,
  displayName,
  onChange,
}: SidebarProfilePhotoControlProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");
  const [showUrl, setShowUrl] = useState(false);

  async function handleFileChange(file: File | undefined) {
    setLocalError(null);

    if (!file) {
      return;
    }

    if (file.size > MAX_BYTES) {
      setLocalError("Ukuran foto maksimal 2 MB");
      return;
    }

    if (!ACCEPT.split(",").includes(file.type)) {
      setLocalError("Foto harus berformat PNG, JPG, WEBP, atau GIF");
      return;
    }

    setBusy(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      onChange(dataUrl);
    } catch {
      setLocalError("Gagal membaca file foto");
    } finally {
      setBusy(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleApplyUrl() {
    setLocalError(null);
    const trimmed = urlDraft.trim();
    if (!trimmed) {
      setLocalError("URL foto wajib diisi");
      return;
    }
    if (!/^https?:\/\//i.test(trimmed)) {
      setLocalError("URL harus dimulai dengan http:// atau https://");
      return;
    }
    onChange(trimmed);
    setShowUrl(false);
    setUrlDraft("");
  }

  return (
    <div className="space-y-3">
      <Label>Profile photo</Label>
      <div className="flex items-center gap-3">
        <SidebarProfileAvatar
          name={displayName}
          avatarUrl={value || undefined}
          size="lg"
        />

        <div className="min-w-0 flex-1 space-y-2">
          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            disabled={busy}
            onChange={(event) => {
              void handleFileChange(event.target.files?.[0]);
            }}
          />

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={busy}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadSimpleIcon className="size-3.5" />
              {value ? "Change" : "Upload"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => {
                setLocalError(null);
                setShowUrl((current) => !current);
              }}
            >
              URL
            </Button>
            {value ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                disabled={busy}
                onClick={() => {
                  setLocalError(null);
                  onChange("");
                }}
              >
                <TrashIcon className="size-3.5" />
                Remove
              </Button>
            ) : null}
          </div>

          {showUrl ? (
            <div className="flex gap-2">
              <Input
                value={urlDraft}
                onChange={(event) => setUrlDraft(event.target.value)}
                placeholder="https://…"
                disabled={busy}
              />
              <Button
                type="button"
                size="sm"
                disabled={busy}
                onClick={handleApplyUrl}
              >
                Apply
              </Button>
            </div>
          ) : null}

          <p className="text-muted-foreground text-xs leading-relaxed">
            Upload a photo or paste an image URL. Shown in the sidebar and
            profile dialog.
          </p>
          {localError ? (
            <p className="text-destructive text-xs">{localError}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Invalid file result"));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Read failed"));
    reader.readAsDataURL(file);
  });
}
