import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/hooks/use-theme";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Elegant literary font similar to The New Yorker
const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VerseCraft",
  description: "Doom-scroll through poetry and literature",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VerseCraft",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "bg-[var(--accent)] text-[var(--bg-primary)]",
          card: "bg-[var(--bg-primary)]",
          headerTitle: "text-[var(--text-primary)]",
          headerSubtitle: "text-[var(--text-secondary)]",
          socialButtonsBlockButton: "bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-primary)]",
          formFieldLabel: "text-[var(--text-secondary)]",
          formFieldInput: "bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-primary)]",
          footerActionLink: "text-[var(--accent)]",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${cormorantGaramond.variable} antialiased`}
        >
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
