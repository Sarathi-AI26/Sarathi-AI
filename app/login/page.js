// app/login/page.js
'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2, KeyRound, Sparkles, ArrowLeft } from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]     = useState('')
  const [otp, setOtp]         = useState('')
  const [status, setStatus]   = useState('idle') // idle | loading | verify | verifying | error
  const [errorMsg, setErrorMsg] = useState('')

  // STEP 1: Request the 8-digit code
  const handleRequestOtp = async (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.')
      return
    }
    setStatus('loading')
    setErrorMsg('')

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase(),
        options: {
          // No emailRedirectTo! This stops the link and forces an OTP code.
          // Note: We deliberately allow shouldCreateUser (default true) so Guest 
          // accounts can seamlessly upgrade to Official Auth accounts here.
        },
      })

      if (authError) throw authError
      
      setStatus('verify')

    } catch (error) {
      setStatus('error')
      setErrorMsg(error.message || 'Something went wrong. Please try again.')
    }
  }

  // STEP 2: Verify the 8-digit code
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otp.length < 8) {
      setErrorMsg('Please enter the full 8-digit code.')
      return
    }
    
    setStatus('verifying')
    setErrorMsg('')

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.toLowerCase(),
        token: otp,
        type: 'email',
      })

      if (verifyError) throw verifyError

      // Success! The session is securely established. Route them to the dashboard.
      router.push('/dashboard/student')

    } catch (error) {
      setStatus('verify')
      setErrorMsg('Invalid or expired code. Please try again.')
    }
  }

  return (
    <div className="relative w-full min-h-[calc(100vh-100px)] bg-[#0A2351] flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-[#F57D14] opacity-10 blur-[120px]" />
        <div className="absolute bottom-[-100px] right-[-100px] h-[400px] w-[400px] rounded-full bg-[#F57D14] opacity-[0.07] blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          
          {status === 'verify' || status === 'verifying' ? (
            // ── STEP 2: OTP VERIFICATION STATE ──────────────────────────────
            <div className="text-center py-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#0A2351]/5">
                <KeyRound className="h-8 w-8 text-[#0A2351]" />
              </div>
              <h2 className="text-2xl font-bold text-[#0A2351] mb-3">
                Enter your code
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                We sent an 8-digit secure code to <span className="font-bold text-[#0A2351]">{email}</span>.
              </p>
              
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    placeholder="00000000"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/[^0-9]/g, '')) // Only allow numbers
                      setErrorMsg('')
                    }}
                    className="w-full text-center tracking-[0.5em] text-2xl font-bold rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-[#0A2351] placeholder-slate-300 focus:border-[#F57D14] focus:outline-none focus:ring-2 focus:ring-[#F57D14]/20 transition-all"
                  />
                  {errorMsg && (
                    <p className="mt-2 text-xs text-red-500 font-medium">{errorMsg}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === 'verifying' || otp.length < 8}
                  className="w-full h-12 rounded-full bg-[#F57D14] font-bold text-white text-sm shadow-lg shadow-[#F57D14]/25 transition-all hover:bg-[#dd6f11] hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === 'verifying' ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</>
                  ) : (
                    <>Access Dashboard <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </form>

              <button
                onClick={() => {
                  setStatus('idle')
                  setOtp('')
                  setErrorMsg('')
                }}
                className="mt-6 flex items-center justify-center gap-2 w-full text-xs font-bold text-slate-400 hover:text-[#0A2351] transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Use a different email
              </button>
            </div>
          ) : (
            // ── STEP 1: REQUEST EMAIL STATE ────────────────────────────────
            <>
              <div className="mb-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F57D14]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#F57D14] mb-4">
                  <Sparkles className="h-3 w-3" />
                  Returning Student Login
                </div>
                <h1 className="text-2xl font-extrabold text-[#0A2351] leading-tight">
                  Access your career roadmap
                </h1>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  Enter the email you used when you took the assessment.
                  We will send you a secure 8-digit code.
                </p>
              </div>

              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setErrorMsg('')
                    }}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[#F57D14] focus:outline-none focus:ring-2 focus:ring-[#F57D14]/20 transition-all"
                  />
                  {errorMsg && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium">{errorMsg}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full h-12 rounded-full bg-[#F57D14] font-bold text-white text-sm shadow-lg shadow-[#F57D14]/25 transition-all hover:bg-[#dd6f11] hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Sending code...</>
                  ) : (
                    <>Send 8-Digit Code <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-xs text-slate-400 font-medium">New to SARATHI?</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              <Link
                href="/assessment"
                className="block w-full h-12 rounded-full border-2 border-[#0A2351] text-center text-sm font-bold text-[#0A2351] leading-[44px] transition-all hover:bg-[#0A2351] hover:text-white"
              >
                Take the Free Assessment
              </Link>
            </>
          )}
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-white/40">
          No password required · Secure OTP login · Your data is private
        </p>
      </div>
    </div>
  )
}
