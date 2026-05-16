'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Loader2, ArrowRight } from 'lucide-react'

export default function TPOLoginPage() {
  const supabase = createClientComponentClient()
  const [email, setEmail]   = useState('')
  const [otp, setOtp]       = useState('')
  const [step, setStep]     = useState('email') // email | otp 
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const handleRequestOTP = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithOtp({ 
        email: email.toLowerCase(),
        options: {
            // Force code generation instead of link
        }
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setStep('otp')
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.verifyOtp({
      email: email.toLowerCase(), 
      token: otp, 
      type: 'email',
    })
    setLoading(false)
    if (error) { setError('Invalid or expired code. Please try again.'); return }
    window.location.href = '/tpo/dashboard'
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <span className="text-3xl font-extrabold tracking-tight text-[#0A2351]">SARATHI</span>
          <p className="mt-1 text-sm text-slate-500 font-medium">Placement Intelligence Portal</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
          <h1 className="text-xl font-bold text-[#0A2351] mb-1">
            {step === 'email' ? 'Sign in as Placement Officer' : 'Enter verification code'}
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            {step === 'email'
              ? 'Enter your institutional email to receive a verification code.'
              : `We sent an 8-digit code to ${email}`}
          </p>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Institutional Email
                </label>
                <input
                  type="email" required
                  placeholder="tpo@college.ac.in"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#F57D14] focus:outline-none focus:ring-2 focus:ring-[#F57D14]/20 transition-all"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full h-12 rounded-full bg-[#F57D14] font-bold text-white text-sm hover:bg-[#dd6f11] transition-all hover:scale-[1.02] disabled:opacity-70 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : <>Send Code <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  8-Digit Verification Code
                </label>
                <input
                  type="text" required
                  placeholder="00000000"
                  maxLength={8}
                  value={otp}
                  onChange={e => { setOtp(e.target.value.replace(/\D/,'')); setError('') }}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-center tracking-[0.5em] font-bold text-xl focus:border-[#F57D14] focus:outline-none focus:ring-2 focus:ring-[#F57D14]/20 transition-all"
                />
              </div>
              <button type="submit" disabled={loading || otp.length < 8}
                className="w-full h-12 rounded-full bg-[#0A2351] font-bold text-white text-sm hover:bg-[#F57D14] transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</> : 'Access Dashboard'}
              </button>
              <button type="button" onClick={() => { setStep('email'); setOtp(''); setError('') }}
                className="w-full text-sm text-slate-400 hover:text-[#F57D14] transition-colors mt-2">
                ← Use a different email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
