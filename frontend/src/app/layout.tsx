import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardLanguageProvider } from "@/components/dashboard-language";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "TuneBoss Admin",
  description: "Admin Panel for TuneBoss Marketplace",
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    title: "TuneBoss Admin",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ed6c05",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn("h-full", "antialiased", "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ServiceWorkerRegistration />
        <DashboardLanguageProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </DashboardLanguageProvider>
      </body>
    </html>
  );
}
