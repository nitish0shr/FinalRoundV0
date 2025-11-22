import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hash } from 'bcryptjs'
import { z } from 'zod'

const signupSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, password } = signupSchema.parse(body)

        // Check if user already exists
        const existingUser = await db.user.findByEmail(email)
        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await hash(password, 10)

        // Create user
        const user = await db.user.create({
            name,
            email,
            password_hash: hashedPassword,
        })

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
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}
