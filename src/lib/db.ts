import { createClient } from '@/lib/supabase/client'
import { isConfigured } from '@/lib/env'

// This module provides database access for when Supabase is configured
// If Supabase is not configured, use the in-memory stores instead

export const db = {
    user: {
        async findByEmail(email: string) {
            if (!isConfigured.supabase) {
                throw new Error(
                    'Supabase not configured. Use userStore for in-memory user management.'
                )
            }

            const supabase = createClient()
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single()

            if (error) return null
            return data
        },

        async create(data: { name: string; email: string; password_hash: string }) {
            if (!isConfigured.supabase) {
                throw new Error(
                    'Supabase not configured. Use userStore.createUser() for in-memory user management.'
                )
            }

            const supabase = createClient()
            const { data: newUser, error } = await supabase
                .from('users')
                .insert([
                    {
                        name: data.name,
                        email: data.email,
                        password_hash: data.password_hash,
                        role: 'candidate', // Default role
                    },
                ])
                .select()
                .single()

            if (error) throw error
            return newUser
        }
    }
}
