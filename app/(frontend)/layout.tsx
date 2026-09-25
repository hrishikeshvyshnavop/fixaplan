import type { Metadata, Viewport } from "next";
import { Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import { preconnect } from "react-dom";
import SmoothScroll from "@/app/components/SmoothScroll";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/app/site";
import "./globals.css";

// Switzer (Fontshare, free licence) — the original site's font
const switzer = localFont({
  variable: "--font-switzer",
  src: [
    { path: "./fonts/Switzer-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Switzer-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Switzer-600.woff2", weight: "600", style: "normal" },
  ],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

// Mirrors the original's <head>. The social card image is app/opengraph-image.png (the original's).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: SITE_DESCRIPTION },
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large" } },
  // The original's favicons: white "Fixa." tile in light mode, black in dark mode
  icons: {
    icon: [
      { url: "/icon-light.svg", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#eaeaea",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Start connecting to the hero video host before the iframe is parsed
  preconnect("https://kinescope.io");

  return (
    <html
      lang="en"
      className={`${switzer.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
