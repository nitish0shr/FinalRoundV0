import { createClient } from '@/lib/supabase/client'

export const db = {
    user: {
        async findByEmail(email: string) {
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
