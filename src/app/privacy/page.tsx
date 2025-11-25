"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
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
            <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
            <p className="text-muted-foreground">Last updated: November 2025</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
              <p className="text-muted-foreground">
                We collect information you provide directly to us, including your name, email address, LinkedIn profile
                information, resume content, and payment details. We also collect session recordings and feedback when
                you use our interview services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
              <p className="text-muted-foreground">
                We use your information to provide and improve our services, process payments, match you with appropriate
                experts, and send you relevant communications about your sessions and account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">3. Information Sharing</h2>
              <p className="text-muted-foreground">
                We share your information with interview experts you book sessions with (limited to what's necessary for
                the session), payment processors (Stripe), and service providers who help us operate the platform. We do
                not sell your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">4. Session Recordings</h2>
              <p className="text-muted-foreground">
                With your consent, interview sessions may be recorded for quality assurance and your personal review.
                Recordings are stored securely and can be deleted upon request. Experts may not download or share
                session recordings outside the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. Data Security</h2>
              <p className="text-muted-foreground">
                We implement industry-standard security measures to protect your data, including encryption in transit
                and at rest, secure authentication, and regular security audits. Payment information is processed
                securely through Stripe and never stored on our servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">6. Your Rights</h2>
              <p className="text-muted-foreground">
                You have the right to access, correct, or delete your personal information. You can export your data
                or request account deletion by contacting us. We will respond to your request within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">7. Cookies and Tracking</h2>
              <p className="text-muted-foreground">
                We use cookies and similar technologies to maintain your session, remember your preferences, and
                analyze how our service is used. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">8. Contact Us</h2>
              <p className="text-muted-foreground">
                For privacy-related questions or requests, please contact us at privacy@finalround.com.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
