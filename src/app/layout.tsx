import type { Metadata } from "next"
import "./globals.css"
import { ClientProviders } from "@/components/client-providers"
import "@/lib/env" // Trigger environment validation

export const metadata: Metadata = {
  title: "FinalRound | Premium Interview Prep",
  description: "Elite human experts + AI-powered coaching. Master your final round interview with personalized feedback and mock interviews.",
  openGraph: {
    title: "FinalRound | Premium Interview Prep",
    description: "Elite human experts + AI-powered coaching.",
    url: "https://finalround.ai",
    siteName: "FinalRound",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinalRound | Premium Interview Prep",
    description: "Elite human experts + AI-powered coaching.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
