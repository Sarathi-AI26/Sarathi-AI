'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Loader2, ArrowRight, Lock, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { clearAssessmentSession } from '@/lib/assessment-session'

// Dynamically loads the Razorpay checkout script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

const CheckoutClient = ({ assessmentId }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
        setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handlePayment = async () => {
    if (!assessmentId) {
      toast.error('Missing assessment ID. Please retake the assessment.')
      return
    }

    setPaying(true)
    setError('')

    try {
      // 1. Load the Razorpay script
      const res = await loadRazorpayScript()
      if (!res) {
        throw new Error('Razorpay SDK failed to load. Are you online?')
      }

      // 2. Call our backend to create a Razorpay Order for ₹99
      const orderResponse = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(orderData?.error || 'Failed to initialize payment.')
      }

      // 3. Configure the Razorpay Popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your public live key
        amount: orderData.amount, // ₹99 in paise (9900)
        currency: orderData.currency,
        name: 'SARATHI',
        description: 'Full 5-Year Career Roadmap',
        order_id: orderData.orderId,
        theme: {
          color: '#0A2351', // SARATHI Navy Blue
        },
        handler: async function (response) {
          // 4. This runs when payment is SUCCESSFUL
          toast.loading('Payment successful! Unlocking your dashboard...')
          
          // Verify payment on our backend
          const verifyRes = await fetch('/api/checkout/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              assessmentId: assessmentId
            }),
          })

          if (verifyRes.ok) {
            clearAssessmentSession()
            toast.dismiss()
            toast.success('Report unlocked successfully!')
            router.push(`/result?id=${assessmentId}`)
          } else {
             toast.dismiss()
             toast.error('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          // You can auto-fill these if you have the user's data in context
          name: '',
          email: '',
          contact: ''
        },
      }

      // 5. Open the Razorpay Popup
      const paymentObject = new window.Razorpay(options)
      paymentObject.on('payment.failed', function (response) {
        toast.error('Payment failed or cancelled.')
        setPaying(false)
      })
      paymentObject.open()

    } catch (paymentError) {
      setError(paymentError?.message || 'Unable to process payment.')
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
        <div className="absolute top-0 left-0 w-full h-32 bg-[#0A2351]">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#F57D14] rounded-full blur-3xl opacity-50" />
        </div>

        <CardContent className="pt-10 px-8 pb-8 relative z-10 text-center">
          <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center shadow-xl mb-6 relative">
            <Lock className="w-8 h-8 text-[#0A2351]" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F57D14]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#F57D14] mb-4">
            <Sparkles className="w-3 h-3" /> Report Ready
          </div>

          <h2 className="text-2xl font-bold text-[#0A2351] mb-2">
            Unlock Your Roadmap
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Your 60-dimension AI analysis is complete. Unlock your dashboard to view your exact career matches, truth bomb, and 5-year execution plan.
          </p>

          <div className="bg-slate-50 rounded-2xl p-5 text-left mb-8 border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-slate-600">Full 5-Year Roadmap & PDF</span>
              <span className="text-sm font-bold text-[#0A2351]">₹99</span>
            </div>
            
            <div className="border-t border-slate-200 my-4" />
            <div className="flex justify-between items-center">
              <span className="text-base font-extrabold text-[#0A2351]">Total Due</span>
              <span className="text-base font-extrabold text-[#F57D14]">₹99</span>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg border border-red-100 mb-4">{error}</p>
          )}

          <Button 
            onClick={handlePayment}
            disabled={paying || !assessmentId}
            className="w-full h-14 rounded-full bg-[#F57D14] hover:bg-[#dd6f11] text-white font-bold text-base shadow-lg shadow-[#F57D14]/20 transition-all hover:scale-105"
          >
            {paying ? (
              <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Processing...</>
            ) : (
              <>Pay ₹99 & Unlock <ArrowRight className="w-5 h-5 ml-2" /></>
            )}
          </Button>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
             <ShieldCheck className="w-4 h-4 text-green-500" />
             100% Secure Payment via Razorpay
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default CheckoutClient
