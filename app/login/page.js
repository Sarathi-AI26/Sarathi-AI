// app/login/page.js
'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { ArrowRight, Loader2, CheckCircle2, Sparkles } from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function LoginPage() {
  const [email, setEmail]     = useState('')
  const [status, setStatus]   = useState('idle') // idle | loading | sent | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleLogin = async (e) => {
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
          emailRedirectTo: `${window.location.origin}/dashboard/student`,
        },
      })

      if (authError) throw authError
      
      setStatus('sent')

    } catch (error) {
      setStatus('error')
      if (error.message.includes('Signups not allowed') || error.message.includes('user_not_found') || error.message.includes('not found')) {
         setErrorMsg('We could not find an account with this email. Did you use a different one?')
      } else {
         setErrorMsg(error.message || 'Something went wrong. Please try again.')
      }
    }
  }

  return (
    // FIXED: Adjusted min-height to account for the header, and added w-full overflow-hidden to prevent clipping
    <div className="relative w-full min-h-[calc(100vh-100px)] bg-[#0A2351] flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      
      {/* Background glow - FIXED positioning so it blends smoothly */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-[#F57D14] opacity-10 blur-[120px]" />
        <div className="absolute bottom-[-100px] right-[-100px] h-[400px] w-[400px] rounded-full bg-[#F57D14] opacity-[0.07] blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* REMOVED: Redundant SARATHI Logo and Tagline text was removed from here */}

        {/* Card */}
        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          {status === 'sent' ? (
            // ── SUCCESS STATE ──────────────────────────────
            <div className="text-center py-6">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#0A2351] mb-3">
                Check your inbox
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                We sent a secure login link to{' '}
                <span className="font-bold text-[#0A2351]">{email}</span>.
                Click the link in your email to access your roadmap — no password needed.
              </p>
              <p className="text-xs text-slate-400">
                Did not receive it?{' '}
                <button
                  onClick={() => setStatus('idle')}
                  className="font-bold text-[#F57D14] hover:underline"
                >
                  Try again
                </button>
              </p>
            </div>
          ) : (
            // ── FORM STATE ────────────────────────────────
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
                  We will send you a secure, one-click login link.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
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
                    <><Loader2 className="h-4 w-4 animate-spin" /> Sending link...</>
                  ) : (
                    <>Send My Login Link <ArrowRight className="h-4 w-4" /></>
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
          No password required · Secure magic link login · Your data is private
        </p>
      </div>
    </div>
  )
}
