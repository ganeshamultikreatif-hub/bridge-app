"use client";

import { XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { MODAL_PANEL_SURFACE } from "@/config/glass";
import { cn } from "@/lib/utils";

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/8 duration-300 ease-out backdrop-blur-[1px]",
        "dark:bg-black/10",
        "data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

function resetDialogScrollContainers(root: HTMLElement) {
  root
    .querySelectorAll<HTMLElement>(
      "[data-slot='dialog-body'], [data-dialog-scroll]",
    )
    .forEach((node) => {
      node.scrollTop = 0;
      node.scrollLeft = 0;
    });
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  fullscreen = false,
  onOpenAutoFocus,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
  /** Edge-to-edge viewport panel (e.g. media / report preview). */
  fullscreen?: boolean;
}) {
  const popupRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const node = popupRef.current;
    if (!node) {
      return;
    }

    resetDialogScrollContainers(node);
    const frame = window.requestAnimationFrame(() => {
      resetDialogScrollContainers(node);
    });
    const timeout = window.setTimeout(() => {
      resetDialogScrollContainers(node);
    }, 120);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        {...props}
        ref={popupRef}
        tabIndex={-1}
        onOpenAutoFocus={(event) => {
          if (onOpenAutoFocus) {
            onOpenAutoFocus(event);
            return;
          }
          // Focus the panel so deep tabbables do not scroll the body to the bottom.
          event.preventDefault();
          popupRef.current?.focus({ preventScroll: true });
        }}
        className={cn(
          MODAL_PANEL_SURFACE,
          "fixed z-50 flex flex-col gap-0 overflow-hidden p-0 text-sm text-popover-foreground outline-none duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          fullscreen
            ? "inset-0 h-svh max-h-svh w-screen max-w-none rounded-none data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
            : [
                "top-1/2 left-1/2 max-h-[min(92svh,40rem)] w-full max-w-none -translate-x-1/2 -translate-y-1/2 rounded-[1.75rem]",
                "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-[0.985] data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-[0.985]",
              ],
          className,
        )}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close data-slot="dialog-close" asChild>
            <Button
              variant="ghost"
              className={cn(
                "absolute top-3 right-3",
                fullscreen && "top-2.5 right-3 z-10",
              )}
              size="icon-sm"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex shrink-0 flex-col gap-1 border-b border-(--separator) px-5 py-4 text-left",
        className,
      )}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex shrink-0 flex-col-reverse gap-2 border-t border-(--separator) bg-transparent p-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton ? (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      ) : null}
    </div>
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-base font-medium leading-none",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
