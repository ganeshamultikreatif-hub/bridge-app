"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link2, Plus, X } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface UrlListFieldProps {
  className?: string;
  links: string[];
  onChange: (links: string[]) => void;
  placeholder?: string;
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function UrlListField({
  className,
  links,
  onChange,
  placeholder = "https://...",
}: UrlListFieldProps) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  function addLink() {
    const trimmed = draft.trim();

    if (!trimmed) {
      return;
    }

    if (!isValidUrl(trimmed)) {
      setError("URL tidak valid");
      return;
    }

    if (links.includes(trimmed)) {
      setError("Link sudah ditambahkan");
      return;
    }

    onChange([...links, trimmed]);
    setDraft("");
    setError(null);
  }

  function removeLink(link: string) {
    onChange(links.filter((item) => item !== link));
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex gap-2">
        <Input
          onChange={(event) => {
            setDraft(event.target.value);
            setError(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addLink();
            }
          }}
          placeholder={placeholder}
          type="url"
          value={draft}
        />
        <Button onClick={addLink} size="icon" type="button" variant="outline">
          <Plus className="size-4" aria-hidden="true" />
          <span className="sr-only">Tambah link</span>
        </Button>
      </div>

      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      {links.length > 0 ? (
        <ul className="space-y-2">
          {links.map((link) => (
            <li
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2"
              key={link}
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
              <Button
                aria-label="Hapus link"
                className="size-7 shrink-0"
                onClick={() => removeLink(link)}
                size="icon"
                type="button"
                variant="ghost"
              >
                <X className="size-3.5" aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
