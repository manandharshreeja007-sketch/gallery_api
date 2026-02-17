import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";
import {
  Header,
  Footer,
  AgeGate,
  ToastContainer,
  ScrollToTop,
  ServiceWorkerRegistration,
} from "@/components";
import { SEO_DEFAULTS } from "@/lib/constants";
import { WebSiteJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";
import { PopunderAd, SocialBarAd } from "@/components/ads";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://waifugallery.netlify.app"),
  title: {
    default: SEO_DEFAULTS.title,
    template: "%s | Waifu Gallery",
  },
  description: SEO_DEFAULTS.description,
  keywords: SEO_DEFAULTS.keywords,
  authors: [{ name: "Waifu Gallery" }],
  creator: "Waifu Gallery",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SEO_DEFAULTS.url,
    title: SEO_DEFAULTS.title,
    description: SEO_DEFAULTS.description,
    siteName: "Waifu Gallery",
    images: [
      {
        url: SEO_DEFAULTS.image,
        width: 1200,
        height: 630,
        alt: "Waifu Gallery - Anime Image Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_DEFAULTS.title,
    description: SEO_DEFAULTS.description,
    images: [SEO_DEFAULTS.image],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/favicon.ico",
    apple: "/icons/favicon.ico",
  },
  applicationName: "Waifu Gallery",
  appleWebApp: {
    capable: true,
    title: "Waifu Gallery",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.waifu.pics" />
        <link rel="preconnect" href="https://i.waifu.pics" />
        <WebSiteJsonLd />
        <OrganizationJsonLd />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300`}
      >
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <AgeGate />
          <ToastContainer />
          <ScrollToTop />
          <ServiceWorkerRegistration />
          <PopunderAd />
          <SocialBarAd />
        </Providers>
      </body>
    </html>
  );
}
