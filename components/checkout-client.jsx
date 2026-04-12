'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BadgeCheck, BadgeIndianRupee, CheckCircle2, LockKeyhole, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'

const includedItems = [
  'Top career recommendations with fit scores',
  'Strength summary and personalized insight',
  'Action roadmap for the next 30 and 90 days',
]

const CheckoutClient = ({ assessmentId }) => {
  const router = useRouter()
  const [assessment, setAssessment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadAssessment = async () => {
      if (!assessmentId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/assessments/${assessmentId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.error || 'Unable to fetch assessment')
        }

        setAssessment(data?.assessment)
      } catch (fetchError) {
        setError(fetchError?.message || 'Unable to load checkout details.')
      } finally {
        setLoading(false)
      }
    }

    loadAssessment()
  }, [assessmentId])

  const handleMockPayment = async () => {
    if (!assessmentId) {
      toast.error('Missing assessment ID. Please retake the assessment.')
      return
    }

    setPaying(true)

    try {
      const response = await fetch('/api/payments/mock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assessmentId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Mock payment failed')
      }

      toast.success('Mock payment successful. Unlocking your dashboard...')
      router.push(`/result?id=${assessmentId}`)
    } catch (paymentError) {
      toast.error(paymentError?.message || 'Unable to complete mock payment')
    } finally {
      setPaying(false)
    }
  }

  const answeredCount = Object.keys(assessment?.answers_json || {}).length

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" className="mb-4 px-0 text-slate-500 hover:bg-transparent hover:text-[#0A2351]">
          <Link href="/assessment">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to assessment
          </Link>
        </Button>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.55fr]">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <div className="inline-flex w-fit items-center rounded-full bg-[#F57D14]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#F57D14]">
                MOCKED Razorpay-style checkout
              </div>
              <CardTitle className="mt-4 text-3xl text-[#0A2351]">Unlock your SARATHI result dashboard</CardTitle>
              <CardDescription className="text-sm leading-6 text-slate-500">
                This paywall screen is wired to the assessment record. Completing mock payment updates payment_status = true.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {loading ? (
                <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">Loading your assessment summary...</div>
              ) : error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">{error}</div>
              ) : !assessmentId ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700">
                  Missing assessment ID. Please start from the assessment flow.
                </div>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-sm text-slate-500">Student</p>
                      <p className="mt-2 font-semibold text-[#0A2351]">{assessment?.user?.name || 'Student'}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-sm text-slate-500">College</p>
                      <p className="mt-2 font-semibold text-[#0A2351]">{assessment?.user?.college || '—'}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-sm text-slate-500">Questions answered</p>
                      <p className="mt-2 font-semibold text-[#0A2351]">{answeredCount}/5</p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-[#0A2351]/10 bg-[#0A2351] p-6 text-white">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-white/70">SARATHI Pro Insight Unlock</p>
                        <h2 className="mt-2 text-2xl font-bold">₹99</h2>
                        <p className="mt-2 text-sm text-white/70">One-time unlock for recommendations, dashboard, and roadmap view.</p>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-3 text-[#F57D14]">
                        <BadgeIndianRupee className="h-6 w-6" />
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3">
                      {includedItems.map((item) => (
                        <div key={item} className="flex gap-3 rounded-xl bg-white/5 p-3 text-sm text-white/85">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#F57D14]" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#0A2351]">
                  <LockKeyhole className="h-5 w-5 text-[#F57D14]" />
                  What happens on payment?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-600">
                <div className="rounded-xl bg-slate-50 p-4">The assessment record is updated to payment_status = true.</div>
                <div className="rounded-xl bg-slate-50 p-4">The result dashboard becomes accessible.</div>
                <div className="rounded-xl bg-slate-50 p-4">You can then use “Download Full PDF Roadmap” via print-to-PDF flow.</div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-lg shadow-[#0A2351]/5">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-start gap-3 rounded-2xl bg-[#F57D14]/10 p-4 text-sm text-[#a25410]">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-[#F57D14]" />
                  This checkout is MOCKED intentionally so the product UX can be validated before real Razorpay integration.
                </div>
                <Button
                  onClick={handleMockPayment}
                  disabled={loading || paying || !!error || !assessmentId}
                  className="h-11 w-full rounded-xl bg-[#F57D14] text-white hover:bg-[#dd6f11]"
                >
                  {paying ? 'Processing mock payment...' : 'Pay ₹99 and Unlock Results'}
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
                  <BadgeCheck className="h-4 w-4 text-[#0A2351]" />
                  Demo payment flow only • No real charge is made
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

export default CheckoutClient
