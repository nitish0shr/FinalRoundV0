"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Link2, Upload, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export interface ParsedJobDescription {
  raw_text: string
  company: string
  role: string
  level: string
  required_skills: string[]
  preferred_skills: string[]
  interview_process: string[]
  key_responsibilities: string[]
}

interface JobDescriptionIntakeProps {
  onComplete: (jdData: ParsedJobDescription) => void
}

export function JobDescriptionIntake({ onComplete }: JobDescriptionIntakeProps) {
  const [activeTab, setActiveTab] = useState('paste')
  const [isProcessing, setIsProcessing] = useState(false)
  const [pastedText, setPastedText] = useState('')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleProcess = async () => {
    setIsProcessing(true)
    try {
      let textToProcess = activeTab === 'paste' ? pastedText : ''
      
      if (activeTab === 'url') {
        const response = await fetch('/api/jd/fetch-url', {
          method: 'POST',
          body: JSON.stringify({ url }),
        })
        const data = await response.json()
        textToProcess = data.content
      } else if (activeTab === 'upload' && file) {
        textToProcess = await file.text()
      }

      const response = await fetch('/api/jd/parse', {
        method: 'POST',
        body: JSON.stringify({ text: textToProcess }),
      })

      const parsed: ParsedJobDescription = await response.json()
      toast.success('Job description analyzed!')
      onComplete(parsed)
    } catch (error) {
      toast.error('Failed to process')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl flex items-center gap-3">
          <FileText className="h-8 w-8 text-violet-400" />
          Add Job Description
        </CardTitle>
        <CardDescription>We'll analyze the JD to match you with experts</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="paste"><FileText className="h-4 w-4 mr-2" />Paste</TabsTrigger>
            <TabsTrigger value="url"><Link2 className="h-4 w-4 mr-2" />URL</TabsTrigger>
            <TabsTrigger value="upload"><Upload className="h-4 w-4 mr-2" />Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="paste" className="space-y-4 mt-4">
            <Label>Job Description</Label>
            <Textarea value={pastedText} onChange={(e) => setPastedText(e.target.value)} 
              placeholder="Paste the full job description..." rows={15} />
          </TabsContent>
          
          <TabsContent value="url" className="space-y-4 mt-4">
            <Label>Job Posting URL</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://careers.company.com/jobs/12345" />
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4 mt-4">
            <Label>Upload File</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input type="file" accept=".txt,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} 
                className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p>{file ? file.name : 'Click to upload'}</p>
              </label>
            </div>
          </TabsContent>
        </Tabs>
        
        <Button onClick={handleProcess} disabled={isProcessing} 
          className="w-full mt-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 h-14 text-lg">
          <Sparkles className="mr-2 h-5 w-5" />
          {isProcessing ? 'Analyzing...' : 'Analyze Job Description'}
        </Button>
      </CardContent>
    </Card>
  )
}
