import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppThemeProvider } from "@/components/providers/app-theme-provider";
import { RootAppearanceBootstrap } from "@/components/shared/root-appearance-bootstrap";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { APP_DESCRIPTION, APP_NAME } from "@/config/app";
import { APP_FRAME_MIN_HEIGHT } from "@/config/viewport";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body
        className={cn("flex flex-col font-sans", APP_FRAME_MIN_HEIGHT)}
        suppressHydrationWarning
      >
        <RootAppearanceBootstrap />
        <AppThemeProvider>
          <TooltipProvider>
            {children}
            <Toaster position="top-center" />
          </TooltipProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
