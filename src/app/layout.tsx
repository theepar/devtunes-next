import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://devtunes.vercel.app'),
  title: {
    default: "DevTunes - Ultimate Focus & Calm Music for Developers",
    template: "%s | DevTunes"
  },
  description: "Boost your coding productivity with DevTunes. The #1 music player for developers featuring high-fidelity lofi, ambient, and calm music to help you enter the flow state. Distraction-free, open-source, and designed for deep work.",
  keywords: [
    // Core
    "music for developers", "coding music", "programming music", "hackers music", "software engineer music",
    // Genres
    "lofi hip hop", "ambient", "chillstep", "synthwave", "classical for studying", "calm music", "musik tenang", "musik relaksasi", "binaural beats", "white noise",
    // Use Cases
    "focus", "concentration", "deep work", "productivity", "study music", "flow state", "coding background music", "music for reading",
    // Tech
    "nextjs music player", "react audio player", "open source music app", "web audio api",
    // Global/Regional
    "musik untuk coding", "lagu santai untuk kerja", "focus music global",
    // Competitor Alternatives (SEO Strategy)
    "lofi girl alternative", "brain.fm alternative", "endel alternative", "spotify focus playlist alternative"
  ],
  authors: [{ name: "Deva Gundhala", url: "https://github.com/theepar" }, { name: "Tristan Putra" }, { name: "Triana Putri" }],
  creator: "DevTunes Team",
  publisher: "DevTunes",
  category: "music",
  applicationName: "DevTunes",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "DevTunes - Focus & Calm Music for Developers",
    description: "Enter the flow state with curated lofi and ambient tracks. No ads, no distractions, just pure focus.",
    url: "https://devtunes.vercel.app",
    siteName: "DevTunes",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "DevTunes - Music for Focus",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevTunes - Focus Music",
    description: "The ultimate music player for developers. Calm, focus, and code.",
    images: ["/logo.png"],
    creator: "@devtunes",
    site: "@devtunes",
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  appleWebApp: {
    title: "DevTunes",
    statusBarStyle: "black-translucent",
    startupImage: ["/logo.png"],
  },
};

import { SettingsProvider } from "@/context/SettingsContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SettingsProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "DevTunes",
                "url": "https://devtunes.vercel.app",
                "description": "The ultimate music player for developers. Calm, focus, and code.",
                "applicationCategory": "MultimediaApplication",
                "operatingSystem": "Web",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "author": {
                  "@type": "Person",
                  "name": "Deva Gundhala"
                }
              })
            }}
          />
          {children}
          <Analytics />
        </SettingsProvider>
      </body>
    </html>
  );
}

