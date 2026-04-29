'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Loader2, ArrowRight, Gift, CheckCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

import { clearAssessmentSession } from '@/lib/assessment-session'

const CheckoutClient = ({ assessmentId }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // We just need a tiny delay to ensure the page doesn't flash awkwardly
    // if the user navigates here instantly.
    const timer = setTimeout(() => {
        setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleBetaUnlock = async () => {
    if (!assessmentId) {
      toast.error('Missing assessment ID. Please retake the assessment.')
      return
    }

    setPaying(true)

    try {
      // We are reusing your existing mock payment route because it perfectly 
      // updates the database `payment_status = true` without charging a card.
      const response = await fetch('/api/payments/mock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assessmentId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Beta unlock failed.')
      }

      clearAssessmentSession()
      toast.success('Report unlocked successfully!')
      router.push(`/result?id=${assessmentId}`)
    } catch (paymentError) {
      toast.error(paymentError?.message || 'Unable to unlock report.')
    } finally {
      setPaying(false)
    }
  }

  if (loading) {
     return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
             <Loader2 className="w-10 h-10 animate-spin text-[#F57D14]" />
        </div>
     )
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-12">
      <Card className="max-w-md w-full border-0 shadow-2xl rounded-3xl overflow-hidden relative">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-[#0A2351]">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#F57D14] rounded-full blur-3xl opacity-50" />
        </div>

        <CardContent className="pt-10 px-8 pb-8 relative z-10 text-center">
          <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center shadow-xl mb-6 relative">
            <Gift className="w-10 h-10 text-[#F57D14]" />
            <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1 border-2 border-white">
                <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F57D14]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#F57D14] mb-4">
            <Sparkles className="w-3 h-3" /> Private Beta Access
          </div>

          <h2 className="text-2xl font-bold text-[#0A2351] mb-2">
            Your Fee is Waived
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            As one of our early pilot students, your ₹99 assessment fee has been completely covered by SARATHI. Thank you for testing the platform!
          </p>

          <div className="bg-slate-50 rounded-2xl p-5 text-left mb-8 border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-slate-600">Full 5-Year Roadmap</span>
              <span className="text-sm font-medium text-slate-400 line-through">₹99</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-green-600">Beta Discount</span>
              <span className="text-sm font-bold text-green-600">-₹99</span>
            </div>
            <div className="border-t border-slate-200 my-4" />
            <div className="flex justify-between items-center">
              <span className="text-base font-extrabold text-[#0A2351]">Total Due</span>
              <span className="text-base font-extrabold text-green-600">Free</span>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg border border-red-100 mb-4">{error}</p>
          )}

          <Button 
            onClick={handleBetaUnlock}
            disabled={paying || !!error || !assessmentId}
            className="w-full h-14 rounded-full bg-[#F57D14] hover:bg-[#dd6f11] text-white font-bold text-base shadow-lg shadow-[#F57D14]/20 transition-all hover:scale-105"
          >
            {paying ? (
              <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Unlocking...</>
            ) : (
              <>Unlock My Dashboard <ArrowRight className="w-5 h-5 ml-2" /></>
            )}
          </Button>
          
          <p className="mt-4 text-xs text-slate-400 font-medium">
             This will permanently unlock your dashboard and PDF download.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}

export default CheckoutClient
