"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CUSTOM_ACCENT_COLOR_ID } from "@/config/appearance";
import { useAppearance } from "@/contexts/appearance-context";
import { normalizeHex } from "@/lib/appearance/accent-color-utils";

export function CustomAccentColorField() {
  const { customAccentHex, setCustomAccentHex } = useAppearance();
  const [draftHex, setDraftHex] = useState(customAccentHex);
  const [error, setError] = useState<string | null>(null);

  function commitHex(value: string) {
    const normalized = normalizeHex(value);

    if (!normalized) {
      setError("Format hex tidak valid");
      return;
    }

    setError(null);
    setDraftHex(normalized);
    setCustomAccentHex(normalized);
  }

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-muted/20 p-3 sm:p-4">
      <div className="space-y-1">
        <Label htmlFor="custom-accent-hex">Warna custom</Label>
        <p className="text-xs text-muted-foreground">
          Masukkan kode hex atau pilih dari color picker.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          aria-invalid={Boolean(error)}
          className="h-10 rounded-xl bg-card font-mono uppercase"
          id="custom-accent-hex"
          onBlur={() => commitHex(draftHex)}
          onChange={(event) => {
            setDraftHex(event.target.value.toUpperCase());
            setError(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitHex(draftHex);
            }
          }}
          placeholder="#268FE6"
          spellCheck={false}
          value={draftHex}
        />

        <Input
          aria-label="Pilih warna custom"
          className="h-10 w-14 shrink-0 cursor-pointer rounded-xl border-border bg-card p-1"
          onChange={(event) => commitHex(event.target.value)}
          type="color"
          value={normalizeHex(draftHex) ?? customAccentHex}
        />
      </div>

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
