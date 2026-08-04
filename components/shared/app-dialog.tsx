"use client";

import {
  type ComponentProps,
  createContext,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DrawerStackProvider,
  useRegisterDrawerCloser,
} from "@/components/shared/drawer-stack-context";
import { FadeScrollBody } from "@/components/shared/fade-scroll-body";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  APP_DIALOG_DRAWER_SURFACE,
  APP_DIALOG_DRAWER_SURFACE_TALL,
} from "@/config/app-dialog-drawer";
import {
  DIALOG_BODY_CLASS,
  DIALOG_DEFAULT_SIZE,
  DIALOG_SIZE,
  type DialogSize,
} from "@/config/dialog";
import { useDrawerScrollLock } from "@/hooks/use-drawer-scroll-lock";
import { useIsMobileViewport } from "@/hooks/use-is-mobile-viewport";
import { cn } from "@/lib/utils";

type AppDialogMode = "dialog" | "drawer";

interface AppDialogContextValue {
  mode: AppDialogMode;
  setTitle: (title: string) => void;
  title: string;
}

const AppDialogContext = createContext<AppDialogContextValue | null>(null);

function useAppDialogContext() {
  const context = useContext(AppDialogContext);
  if (!context) {
    throw new Error("AppDialog components must be used within AppDialog");
  }
  return context;
}

interface AppDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  /**
   * Keep centered Dialog even on mobile (compact alerts).
   * Default: bottom drawer on mobile (wang pattern).
   */
  forceDialog?: boolean;
}

function AppDialogDrawerBranch({
  open,
  defaultOpen,
  onOpenChange,
  children,
  value,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  value: AppDialogContextValue;
}) {
  const resolvedOpen = open ?? false;

  useRegisterDrawerCloser(
    () => onOpenChange?.(false),
    open !== undefined && resolvedOpen,
  );

  return (
    <Drawer
      showSwipeHandle
      swipeDirection="down"
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(open !== undefined ? { open } : {})}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      <AppDialogContext.Provider value={value}>
        {children}
      </AppDialogContext.Provider>
    </Drawer>
  );
}

export function AppDialog({
  open,
  defaultOpen,
  onOpenChange,
  children,
  forceDialog = false,
}: AppDialogProps) {
  const isMobile = useIsMobileViewport();
  const useDrawer = isMobile && !forceDialog;
  const [title, setTitleState] = useState("");
  const setTitle = useCallback((next: string) => {
    setTitleState(next);
  }, []);
  const resolvedOpen = open ?? defaultOpen ?? false;

  useDrawerScrollLock(useDrawer && resolvedOpen);

  const value = useMemo(
    () => ({
      mode: (useDrawer ? "drawer" : "dialog") as AppDialogMode,
      setTitle,
      title,
    }),
    [setTitle, title, useDrawer],
  );

  if (useDrawer) {
    return (
      <DrawerStackProvider>
        <AppDialogDrawerBranch
          value={value}
          {...(defaultOpen !== undefined ? { defaultOpen } : {})}
          {...(open !== undefined ? { open } : {})}
          {...(onOpenChange ? { onOpenChange } : {})}
        >
          {children}
        </AppDialogDrawerBranch>
      </DrawerStackProvider>
    );
  }

  return (
    <Dialog
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(open !== undefined ? { open } : {})}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      <AppDialogContext.Provider value={value}>
        {children}
      </AppDialogContext.Provider>
    </Dialog>
  );
}

type TriggerProps = ComponentProps<typeof DialogTrigger> & {
  asChild?: boolean;
  render?: ReactElement;
};

export function AppDialogTrigger({
  asChild,
  children,
  render,
  ...props
}: TriggerProps) {
  const { mode } = useAppDialogContext();

  if (mode === "drawer") {
    const triggerRender =
      render ??
      (asChild && isValidElement(children)
        ? (children as ReactElement)
        : undefined);

    if (triggerRender) {
      return (
        <DrawerTrigger
          data-slot="dialog-trigger"
          render={triggerRender}
          {...props}
        />
      );
    }

    return (
      <DrawerTrigger data-slot="dialog-trigger" {...props}>
        {children}
      </DrawerTrigger>
    );
  }

  if (asChild) {
    return (
      <DialogTrigger asChild {...props}>
        {children}
      </DialogTrigger>
    );
  }

  return <DialogTrigger {...props}>{children}</DialogTrigger>;
}

type CloseProps = ComponentProps<typeof DialogClose> & {
  asChild?: boolean;
  render?: ReactElement;
};

export function AppDialogClose({
  asChild,
  children,
  render,
  ...props
}: CloseProps) {
  const { mode } = useAppDialogContext();

  if (mode === "drawer") {
    const closeRender =
      render ??
      (asChild && isValidElement(children)
        ? (children as ReactElement)
        : undefined);

    if (closeRender) {
      return (
        <DrawerClose data-slot="dialog-close" render={closeRender} {...props} />
      );
    }

    return (
      <DrawerClose data-slot="dialog-close" {...props}>
        {children}
      </DrawerClose>
    );
  }

  if (asChild) {
    return (
      <DialogClose asChild {...props}>
        {children}
      </DialogClose>
    );
  }

  return <DialogClose {...props}>{children}</DialogClose>;
}

interface AppDialogContentProps extends ComponentProps<typeof DialogContent> {
  size?: DialogSize;
}

const TALL_DRAWER_SIZES = new Set<DialogSize>(["lg", "xl", "2xl", "full"]);

export function AppDialogContent({
  className,
  size = DIALOG_DEFAULT_SIZE,
  fullscreen,
  showCloseButton = true,
  children,
  ...props
}: AppDialogContentProps) {
  const { mode, title } = useAppDialogContext();
  const isFullscreen = fullscreen ?? size === "full";
  const useTallDrawer = isFullscreen || TALL_DRAWER_SIZES.has(size);

  if (mode === "drawer") {
    return (
      <DrawerContent
        className={cn(
          useTallDrawer
            ? APP_DIALOG_DRAWER_SURFACE_TALL
            : APP_DIALOG_DRAWER_SURFACE,
          className,
        )}
      >
        <DrawerTitle className="sr-only">{title || "Dialog"}</DrawerTitle>
        {children}
      </DrawerContent>
    );
  }

  return (
    <DialogContent
      className={cn(DIALOG_SIZE[size], className)}
      fullscreen={isFullscreen}
      showCloseButton={showCloseButton}
      {...props}
    >
      {children}
    </DialogContent>
  );
}

export function AppDialogHeader({
  className,
  ...props
}: ComponentProps<"div">) {
  const { mode } = useAppDialogContext();

  if (mode === "drawer") {
    return (
      <DrawerHeader
        data-slot="dialog-header"
        className={cn(
          "shrink-0 gap-1 border-b border-black/8 px-5 pt-1 pb-4 text-left dark:border-white/10",
          className,
        )}
        {...props}
      />
    );
  }

  return <DialogHeader className={className} {...props} />;
}

export function AppDialogFooter({
  className,
  ...props
}: ComponentProps<"div">) {
  const { mode } = useAppDialogContext();

  if (mode === "drawer") {
    return (
      <DrawerFooter
        data-slot="dialog-footer"
        className={cn(
          "mt-0 shrink-0 flex-row gap-2 border-t border-black/8 bg-black/2 px-5 py-4 dark:border-white/10 dark:bg-white/3",
          "*:min-w-0 *:flex-1",
          className,
        )}
        {...props}
      />
    );
  }

  return <DialogFooter className={className} {...props} />;
}

export function AppDialogTitle({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogTitle>) {
  const { mode, setTitle } = useAppDialogContext();
  const titleText = typeof children === "string" ? children : "";

  useEffect(() => {
    if (titleText) {
      setTitle(titleText);
    }
  }, [setTitle, titleText]);

  if (mode === "drawer") {
    return (
      <DrawerTitle
        className={cn(
          "text-left text-[17px] font-semibold leading-snug tracking-tight",
          className,
        )}
        {...props}
      >
        {children}
      </DrawerTitle>
    );
  }

  return (
    <DialogTitle className={className} {...props}>
      {children}
    </DialogTitle>
  );
}

export function AppDialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogDescription>) {
  const { mode } = useAppDialogContext();

  if (mode === "drawer") {
    return (
      <DrawerDescription
        className={cn("text-left text-sm text-muted-foreground", className)}
        {...props}
      />
    );
  }

  return <DialogDescription className={className} {...props} />;
}

export function AppDialogBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { mode } = useAppDialogContext();

  if (mode === "drawer") {
    return (
      <FadeScrollBody
        className={cn("px-5 py-4", className)}
        data-slot="drawer-scroll-body"
      >
        {children}
      </FadeScrollBody>
    );
  }

  return (
    <div data-slot="dialog-body" className={cn(DIALOG_BODY_CLASS, className)}>
      {children}
    </div>
  );
}
