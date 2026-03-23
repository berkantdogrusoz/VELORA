import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "ÉlanNoire — AI Web Builder | Build Websites with Intelligence",
  description:
    "Build stunning, professional websites with AI. Describe your vision and ÉlanNoire creates it instantly. No code required. 3D support, live preview, one-click deploy.",
  keywords: [
    "AI web builder",
    "website generator",
    "AI website maker",
    "no-code website builder",
    "ÉlanNoire",
    "ElanNoire",
    "build website with AI",
    "prompt to website",
    "AI design tool",
    "web builder 2026",
  ],
  metadataBase: new URL("https://elannoire.site"),
  openGraph: {
    title: "ÉlanNoire — AI Web Builder",
    description:
      "Build stunning websites with AI. Describe your vision, deploy in minutes.",
    url: "https://elannoire.site",
    siteName: "ÉlanNoire",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ÉlanNoire — AI Web Builder",
    description:
      "Build stunning websites with AI. Describe your vision, deploy in minutes.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://elannoire.site",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClerkProvider
          appearance={{
            // Dark obsidian-gold theme
            variables: {
              colorPrimary: "#c9a84c",
              colorBackground: "#1e1e22",
              colorText: "#e8e6e3",
              colorTextSecondary: "#a09274",
              colorInputBackground: "#141416",
              colorInputText: "#e8e6e3",
              colorNeutral: "#e8e6e3",
              borderRadius: "0.5rem",
            },
            elements: {
              card: "border border-[rgba(201,168,76,0.15)] shadow-[0_0_30px_rgba(201,168,76,0.05)] bg-[#1e1e22]",
              userButtonPopoverCard: "bg-[#1e1e22] border border-[rgba(201,168,76,0.15)]",
              userButtonPopoverActionButton: "text-[#e8e6e3] hover:bg-[rgba(201,168,76,0.08)]",
              userButtonPopoverActionButtonText: "text-[#e8e6e3]",
              userButtonPopoverActionButtonIcon: "text-[#a09274]",
              userButtonPopoverFooter: "hidden",
              headerTitle: "text-[#c9a84c]",
              headerSubtitle: "text-[#a09274]",
              socialButtonsBlockButton: "border-[rgba(201,168,76,0.15)] hover:bg-[rgba(201,168,76,0.08)] text-[#e8e6e3]",
              socialButtonsBlockButtonText: "text-[#e8e6e3]",
              formFieldLabel: "text-[#a09274]",
              formFieldInput: "bg-[#141416] border-[rgba(201,168,76,0.12)] text-[#e8e6e3]",
              formButtonPrimary: "bg-[#c9a84c] hover:bg-[#d4b65c] text-[#08080a]",
              footerActionLink: "text-[#c9a84c] hover:text-[#d4b65c]",
              footerActionText: "text-[#8a8578]",
              dividerLine: "bg-[rgba(201,168,76,0.1)]",
              dividerText: "text-[#8a8578]",
              identityPreviewText: "text-[#e8e6e3]",
              identityPreviewEditButtonIcon: "text-[#c9a84c]",
            },
          }}
        >
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--card)",
              border: "1px solid rgba(201, 168, 76, 0.15)",
              color: "var(--foreground)",
            },
          }}
        />
        </ClerkProvider>
      </body>
    </html>
  );
}
