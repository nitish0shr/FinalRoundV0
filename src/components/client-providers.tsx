"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/header"
import { Toaster } from "react-hot-toast"

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                <Header />
                <main>{children}</main>
                <Toaster position="top-center" />
            </ThemeProvider>
        </SessionProvider>
    )
}
