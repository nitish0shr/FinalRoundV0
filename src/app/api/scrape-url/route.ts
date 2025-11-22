import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import { parseJobDescription } from '@/lib/openai'

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json()

        if (!url || typeof url !== 'string') {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            )
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'OpenAI API key not configured' },
                { status: 500 }
            )
        }

        // Fetch the page
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; FinalRound/1.0)',
            },
        })

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch URL' },
                { status: 400 }
            )
        }

        const html = await response.text()
        const $ = cheerio.load(html)

        // Remove script and style elements
        $('script, style, nav, header, footer').remove()

        // Extract text content
        const bodyText = $('body').text().trim()

        // Clean up whitespace
        const cleanedText = bodyText
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, '\n')
            .trim()

        if (!cleanedText) {
            return NextResponse.json(
                { error: 'No text content found at URL' },
                { status: 400 }
            )
        }

        // Parse the extracted text
        const parsed = await parseJobDescription(cleanedText)

        return NextResponse.json({ success: true, data: parsed })
    } catch (error) {
        console.error('Scrape URL error:', error)
        return NextResponse.json(
            { error: 'Failed to scrape and parse URL' },
            { status: 500 }
        )
    }
}
