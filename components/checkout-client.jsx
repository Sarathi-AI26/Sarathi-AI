'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Loader2, ArrowRight, Lock, ShieldCheck, Target, TrendingUp, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { clearAssessmentSession } from '@/lib/assessment-session'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts'

// Dynamic teaser data for the free preview chart
const previewData = [
  { subject: 'Personality', score: 85, fullMark: 100 },
  { subject: 'Aptitude', score: 72, fullMark: 100 },
  { subject: 'Motivation', score: 88, fullMark: 100 },
  { subject: 'Interests', score: 65, fullMark: 100 },
  { subject: 'Behaviour', score: 78, fullMark: 100 },
]

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
    }, 800) // Slightly longer load to simulate AI processing
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
      const res = await loadRazorpayScript()
      if (!res) throw new Error('Razorpay SDK failed to load. Are you online?')

      const orderResponse = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId }),
      })

      const orderData = await orderResponse.json()
      if (!orderResponse.ok) throw new Error(orderData?.error || 'Failed to initialize payment.')

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: orderData.amount, 
        currency: orderData.currency,
        name: 'SARATHI',
        description: 'Full 5-Year Career Roadmap',
        image: 'https://www.sarathiapp.in/logo-square.png', 
        order_id: orderData.orderId,
        theme: {
          color: '#0A2351', 
        },
        handler: async function (response) {
          toast.loading('Payment successful! Generating your AI roadmap...')
          
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
        prefill: { name: '', email: '', contact: '' },
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.on('payment.failed', function () {
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
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
             <Loader2 className="w-12 h-12 animate-spin text-[#F57D14] mb-4" />
             <h3 className="text-xl font-bold text-[#0A2351] animate-pulse">Computing your profile...</h3>
             <p className="text-slate-500 text-sm mt-2">Analyzing 60 psychometric data points</p>
        </div>
     )
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* FREE PREVIEW SECTION: Visible to the user */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-[12px] font-bold uppercase tracking-widest text-green-700 mb-4">
            <Sparkles className="w-4 h-4" /> Assessment Complete
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0A2351] mb-4">
            Your Baseline Profile is Ready
          </h1>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            Based on your responses, we have mapped your core traits. Unlock the full report to see your exact career matches and 5-year roadmap.
          </p>
        </div>

        {/* RADAR CHART PREVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="border-0 shadow-lg p-6 bg-white rounded-3xl flex flex-col items-center justify-center">
             <h3 className="text-lg font-bold text-[#0A2351] w-full text-center mb-2">Psychometric Dimensions</h3>
             <div className="w-full h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="70%" data={previewData}>
                   <PolarGrid stroke="#e2e8f0" />
                   <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12 }} />
                   <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                   <Radar name="Student" dataKey="score" stroke="#F57D14" strokeWidth={2} fill="#F57D14" fillOpacity={0.3} />
                 </RadarChart>
               </ResponsiveContainer>
             </div>
          </Card>

          <div className="flex flex-col gap-4">
             <Card className="border-0 shadow-md p-5 bg-white rounded-2xl flex items-center gap-4 border-l-4 border-l-[#F57D14]">
               <div className="p-3 bg-[#F57D14]/10 rounded-xl text-[#F57D14]"><Target className="w-6 h-6" /></div>
               <div>
                 <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Top Strength</p>
                 <p className="text-lg font-bold text-[#0A2351]">Motivation & Drive</p>
               </div>
             </Card>
             <Card className="border-0 shadow-md p-5 bg-white rounded-2xl flex items-center gap-4 border-l-4 border-l-[#0A2351]">
               <div className="p-3 bg-[#0A2351]/10 rounded-xl text-[#0A2351]"><Brain className="w-6 h-6" /></div>
               <div>
                 <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Working Style</p>
                 <p className="text-lg font-bold text-[#0A2351]">Analytical Thinker</p>
               </div>
             </Card>
             <Card className="border-0 shadow-md p-5 bg-white rounded-2xl flex items-center gap-4 border-l-4 border-l-green-500">
               <div className="p-3 bg-green-100 rounded-xl text-green-600"><TrendingUp className="w-6 h-6" /></div>
               <div>
                 <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Overall Ranking</p>
                 <p className="text-lg font-bold text-[#0A2351]">Top 20% Profile</p>
               </div>
             </Card>
          </div>
        </div>

        {/* BLURRED TEASER & PAYWALL OVERLAY */}
        <div className="relative rounded-3xl overflow-hidden bg-white shadow-xl border border-slate-200 p-8 md:p-12">
          
          {/* The Blurred Background Content */}
          <div className="blur-md opacity-60 select-none pointer-events-none">
            <h2 className="text-2xl font-bold text-[#0A2351] mb-4">The Brutal Truth: Your Identity</h2>
            <p className="text-slate-800 text-lg leading-relaxed mb-6 font-serif italic">
              "Your journey isn't just about a career; it's a profound mission to build something significant. While you possess a powerful decisiveness, sometimes the weight of responsibility might make you hesitate, but remember, your true strength lies in that unwavering grit to keep pushing forward..."
            </p>
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-slate-200 rounded w-full mb-3"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6 mb-8"></div>
            <h2 className="text-2xl font-bold text-[#0A2351] mb-4">Prime Career Match (98%)</h2>
            <div className="h-12 bg-slate-100 rounded-xl w-full border border-slate-200"></div>
          </div>

          {/* THE PAYWALL OVERLAY (Your original checkout card, centered over the blur) */}
          <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm p-4 z-10">
            <Card className="max-w-sm w-full border-0 shadow-2xl rounded-2xl overflow-hidden relative bg-white">
              <div className="absolute top-0 left-0 w-full h-20 bg-[#0A2351]">
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#F57D14] rounded-full blur-3xl opacity-50" />
              </div>

              <CardContent className="pt-8 px-6 pb-6 relative z-10 text-center">
                <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg mb-4 relative">
                  <Lock className="w-6 h-6 text-[#0A2351]" />
                </div>

                <h2 className="text-xl font-bold text-[#0A2351] mb-2">
                  Unlock Full Report
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Reveal your exact career matches, truth bomb, and 5-year execution plan.
                </p>

                <div className="bg-slate-50 rounded-xl p-4 text-left mb-6 border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-600">Premium AI Roadmap</span>
                    <span className="text-sm font-bold text-[#0A2351]">₹99</span>
                  </div>
                  <div className="border-t border-slate-200 my-3" />
                  <div className="flex justify-between items-center">
                    <span className="text-base font-extrabold text-[#0A2351]">Total Due</span>
                    <span className="text-base font-extrabold text-[#F57D14]">₹99</span>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-100 mb-4">{error}</p>
                )}

                <Button 
                  onClick={handlePayment}
                  disabled={paying || !assessmentId}
                  className="w-full h-12 rounded-full bg-[#F57D14] hover:bg-[#dd6f11] text-white font-bold text-sm shadow-lg shadow-[#F57D14]/20 transition-all hover:scale-105"
                >
                  {paying ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</>
                  ) : (
                    <>Pay ₹99 & Unlock <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                   <ShieldCheck className="w-3 h-3 text-green-500" />
                   100% Secure via Razorpay
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
