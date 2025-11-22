import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Only throw if we are actually trying to create a client
    if (!url || !key) {
        // If we are in a build step or just importing, we might not want to throw yet
        // But if this function is called, we definitely need the client.
        throw new Error(
            'Supabase environment variables not configured. ' +
            'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY or use in-memory storage.'
        )
    }

    return createBrowserClient(url, key)
}
