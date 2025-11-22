import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { JobStore } from '@/lib/data-store'
import type { ParsedJD } from '@/types/job'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { company, role, level, requiredSkills, niceToHaveSkills, jdRaw, jdParsed } = body

        if (!company || !role || !jdRaw) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const job = JobStore.createJob({
            userId: session.user.email,
            company,
            role,
            level: level || 'unknown',
            requiredSkills: requiredSkills || [],
            niceToHaveSkills: niceToHaveSkills || [],
            jdRaw,
            jdParsed: jdParsed || {
                company,
                role,
                level: level || 'unknown',
                requiredSkills: requiredSkills || [],
                niceToHaveSkills: niceToHaveSkills || [],
                rawText: jdRaw
            }
        })

        return NextResponse.json({
            success: true,
            data: job
        })
    } catch (error) {
        console.error('Create job error:', error)
        return NextResponse.json(
            { error: 'Failed to create job' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const jobs = JobStore.getJobsByUserId(session.user.email)

        return NextResponse.json({
            success: true,
            data: jobs
        })
    } catch (error) {
        console.error('Get jobs error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch jobs' },
            { status: 500 }
        )
    }
}
