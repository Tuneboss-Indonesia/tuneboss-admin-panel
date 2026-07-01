import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardLanguageProvider } from "@/components/dashboard-language";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "TuneBoss Admin",
  description: "Admin Panel for TuneBoss Marketplace",
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
        <DashboardLanguageProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </DashboardLanguageProvider>
      </body>
    </html>
  );
}
