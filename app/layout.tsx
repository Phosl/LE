import type { Metadata, Viewport } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/libre-baskerville/400.css";
import "@fontsource/libre-baskerville/700.css";
import "./globals.css";
import { siteName, siteUrl, socialImage } from "@/lib/metadata";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: siteName,
    template: "%s — Life Extension Corporation",
  },
  description: "Preserve the body. Continue the mind. Life, part two.",
  keywords: ["cryonic suspension", "life extension", "continuity design", "Lucid Dream"],
  authors: [{ name: siteName }],
  creator: siteName,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/en`,
    siteName,
    title: "Life Extension Corporation",
    description: "A future of your choosing.",
    locale: "en_US",
    alternateLocale: ["it_IT"],
    images: [{ url: socialImage, alt: "Life Extension Corporation" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: "A future of your choosing.",
    images: [socialImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2437A5",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
