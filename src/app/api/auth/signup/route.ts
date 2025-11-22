import { NextRequest, NextResponse } from 'next/server'
import { userStore } from '@/lib/user-store'
import { z } from 'zod'
import { authLimiter, getClientIp } from '@/lib/rate-limit'

const signupSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
})

export async function POST(request: NextRequest) {
    try {
        // Rate limiting: 5 signups per 15 minutes per IP
        const ip = getClientIp(request)
        const { success, limit, remaining, reset } = authLimiter.check(5, ip)

        if (!success) {
            return NextResponse.json(
                { 
                    error: 'Too many signup attempts. Please try again later.',
                    limit,
                    remaining: 0,
                    reset,
                },
                { status: 429 }
            )
        }

        const body = await request.json()
        const { name, email, password } = signupSchema.parse(body)

        // Create user using userStore (in-memory)
        // This matches the auth.ts credentials provider which also uses userStore
        const user = await userStore.createUser(name, email, password)

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        })
    } catch (error: any) {
        console.error('Signup error:', error)
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input data' },
                { status: 400 }
            )
        }
        // Handle duplicate email error
        if (error.message?.includes('already exists')) {
            return NextResponse.json(
                { error: 'User already exists with this email' },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}
