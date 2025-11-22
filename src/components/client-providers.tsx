"use client"

import { Toaster } from 'react-hot-toast'
import { CommandPalette } from './command-palette'

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#18181b',
                        color: '#fff',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    },
                }}
            />
            <CommandPalette />
        </>
    )
}
