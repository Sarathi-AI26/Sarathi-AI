// app/login/page.js
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Loader2, Mail, ArrowRight, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function StudentLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.')
      return
    }

    setLoading(true)

    try {
      // 1. Verify the email actually exists in your assessments table
      const { data: assessment, error: dbError } = await supabase
        .from('assessments')
        .select('id')
        // Adjust this depending on how you store the email (e.g., in a JSON object or a dedicated column)
        .eq('user_details->>email', email.toLowerCase()) 
        .single()

      if (dbError || !assessment) {
        throw new Error("We couldn't find an assessment linked to this email. Did you use a different one?")
      }

      // 2. Send the Supabase Magic Link
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase(),
        options: {
          // This tells Supabase where to send them after they click the link
          emailRedirectTo: `${window.location.origin}/dashboard/student?id=${assessment.id}`,
        },
      })

      if (authError) throw authError

      setSuccess(true)
      
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A2351] mb-2">Check your email!</h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            We've sent a secure login link to <span className="font-bold text-[#0A2351]">{email}</span>. Click it to instantly access your SARATHI Dashboard.
          </p>
          <button 
            onClick={() => setSuccess(false)}
            className="text-sm font-bold text-slate-400 hover:text-[#F57D14] transition-colors"
          >
            Wrong email? Try again.
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - The Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="inline-block mb-12">
            <h1 className="font-extrabold text-2xl tracking-tight text-[#0A2351]">SARATHI</h1>
          </Link>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A2351] mb-3">
            Welcome back.
          </h2>
          <p className="text-slate-500 mb-8">
            Enter the email you used during your assessment to securely access your Career Roadmap.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F57D14]/50 focus:border-[#F57D14] transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A2351] hover:bg-[#F57D14] text-white font-bold h-14 rounded-xl transition-all flex items-center justify-center gap-2 group mt-4 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Get Login Link <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - The Visual */}
      <div className="hidden lg:flex w-1/2 bg-[#0A2351] relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F57D14] rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-20 translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 text-white max-w-lg">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
            <h3 className="text-2xl font-bold mb-4">"The plan is nothing, planning is everything."</h3>
            <p className="text-white/70 leading-relaxed mb-6">
              Your SARATHI Dashboard is continually updating. Log in to review your 5-year roadmap, check your blind spots, and soon, chat directly with Madhav.
            </p>
            <div className="flex items-center gap-3">
               <div className="flex -space-x-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full bg-slate-300 border-2 border-[#0A2351]" />
                 ))}
               </div>
               <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Join 2,000+ Students</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
