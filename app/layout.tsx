import type { Metadata, Viewport } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/libre-baskerville/400.css";
import "@fontsource/libre-baskerville/700.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lifeextension.vercel.app"),
  title: {
    default: "Life Extension Corporation",
    template: "%s — Life Extension Corporation",
  },
  description: "Preserve the body. Continue the mind. Life, part two.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Life Extension Corporation",
    description: "A future of your choosing.",
    images: ["/images/le-hero.png"],
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
