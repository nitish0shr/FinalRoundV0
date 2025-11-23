import { NextRequest, NextResponse } from 'next/server'
import { parseResume, extractTextFromPDF, extractTextFromDOCX } from '@/lib/ai/resume-analyzer'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Get file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Extract text based on file type
    let text = ''
    const fileType = file.name.toLowerCase()

    if (fileType.endsWith('.pdf')) {
      text = await extractTextFromPDF(buffer)
    } else if (fileType.endsWith('.docx') || fileType.endsWith('.doc')) {
      text = await extractTextFromDOCX(buffer)
    } else if (fileType.endsWith('.txt')) {
      text = buffer.toString('utf-8')
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF, DOCX, or TXT' },
        { status: 400 }
      )
    }

    // Parse resume with AI
    const parsed = await parseResume(text)

    return NextResponse.json({
      success: true,
      data: parsed
    })

  } catch (error) {
    console.error('Resume upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process resume' },
      { status: 500 }
    )
  }
}

// Increase payload size limit for file uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}
