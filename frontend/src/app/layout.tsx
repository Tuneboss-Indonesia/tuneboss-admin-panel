import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const futuraPt = localFont({
  src: [
    {
      path: "../../public/fonts/Futura-PT-Book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Futura-PT-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-futura-pt",
});

const sqr721be = localFont({
  src: "../../public/fonts/SQR721BE.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-sqr721be",
});

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
      className={`${futuraPt.variable} ${sqr721be.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
