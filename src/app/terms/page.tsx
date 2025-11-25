"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-violet-900/10 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Link>

        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
            <p className="text-muted-foreground">Last updated: November 2025</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using FinalRound ("the Service"), you accept and agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
              <p className="text-muted-foreground">
                FinalRound is a platform that connects job candidates with interview experts from leading technology companies.
                Our Service facilitates mock interviews, resume reviews, and career coaching sessions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">3. User Accounts</h2>
              <p className="text-muted-foreground">
                You must create an account to use certain features of our Service. You are responsible for maintaining
                the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">4. Payment Terms</h2>
              <p className="text-muted-foreground">
                Session fees are held in escrow until the session is completed. Experts receive payment after successful
                session completion, minus our platform fee (15%). Refunds are available for sessions that do not meet
                our quality standards.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. User Conduct</h2>
              <p className="text-muted-foreground">
                Users agree to use the Service professionally and respectfully. Harassment, discrimination, or sharing
                of confidential interview content is prohibited and may result in account termination.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">6. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content on FinalRound, including but not limited to text, graphics, logos, and software, is the
                property of FinalRound or its licensors and is protected by intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">7. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                FinalRound is not responsible for the outcome of any job interviews or hiring decisions. Our Service
                provides practice and preparation tools but does not guarantee employment outcomes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">8. Contact</h2>
              <p className="text-muted-foreground">
                For questions about these Terms, please contact us at legal@finalround.com.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
