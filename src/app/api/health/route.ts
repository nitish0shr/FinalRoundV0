import { NextResponse } from 'next/server'

export async function GET() {
    const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        version: '0.2.0',
        services: {
            api: 'operational',
            auth: 'operational',
            ai: process.env.OPENAI_API_KEY ? 'configured' : 'not_configured',
            database: 'in-memory',
            persistence: 'file-based',
        },
        features: {
            authentication: true,
            jobParsing: !!process.env.OPENAI_API_KEY,
            resumeAnalysis: !!process.env.OPENAI_API_KEY,
            expertBooking: false, // Coming soon
            videoSessions: false, // Coming soon
        }
    }

    return NextResponse.json(health)
}
