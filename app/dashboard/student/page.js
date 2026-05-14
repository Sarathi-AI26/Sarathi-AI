// app/dashboard/student/page.js
"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Loader2 } from 'lucide-react'

// IMPORTANT: Adjust this import path if your actual report component has a slightly different name!
import FullReportView from '@/components/result-dashboard-real'

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function StudentDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [reportData, setReportData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Check Supabase Auth Session
        const { data: { session }, error: authError } = await supabase.auth.getSession()
        
        if (authError || !session) {
          router.push('/assessment') // Not logged in? Go take the test.
          return
        }

        // 2. Fetch the student's specific assessment record
        const { data: assessment, error: dbError } = await supabase
          .from('assessments')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (dbError || !assessment) {
          router.push('/assessment') // No record? Go take the test.
          return
        }

        // 3. Check Payment Gate
        if (!assessment.payment_status) {
          router.push(`/checkout?assessmentId=${assessment.id}`) // Hasn't paid? Go to checkout.
          return
        }

        // 4. Check if the AI analysis is already cached in the database
        if (assessment.ai_analysis_result) {
          setReportData(assessment.ai_analysis_result)
          setLoading(false)
        } else {
          // 5. If paid but no result exists yet, trigger generation!
          setGenerating(true)
          const res = await fetch('/api/generate-roadmap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assessmentId: assessment.id })
          })
          
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || 'Failed to generate roadmap')
          
          setReportData(data.ai_analysis_result)
          setGenerating(false)
          setLoading(false)
        }

      } catch (err) {
        console.error('Dashboard Error:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  // --- UI STATES --- //

  if (loading || generating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-[#F57D14]/20 animate-ping" />
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-[#0A2351] shadow-xl">
            <Loader2 className="w-8 h-8 text-[#F57D14] animate-spin" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-[#0A2351]">
          {generating ? "Generating Your 5-Year Roadmap..." : "Loading Your Dashboard..."}
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-sm text-center">
          {generating 
            ? "Our AI is synthesizing your psychometric DNA. This takes about 15 seconds. Do not refresh." 
            : "Securely retrieving your data..."}
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-red-100 max-w-md">
          <p className="text-red-500 font-bold mb-3 text-lg">Error loading dashboard</p>
          <p className="text-slate-600 mb-6 text-sm leading-relaxed">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="rounded-full bg-[#0A2351] px-6 py-3 font-bold text-white transition-all hover:bg-[#0d2d6b]"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Element 4: Simple Navigation Header */}
      <header className="bg-[#0A2351] text-white px-4 sm:px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
        <div>
          <h1 className="font-extrabold text-lg sm:text-xl tracking-tight">SARATHI</h1>
          <p className="text-[10px] sm:text-xs text-[#F57D14] uppercase tracking-widest font-bold">Student Dashboard</p>
        </div>
        <button 
          onClick={async () => {
            await supabase.auth.signOut()
            router.push('/')
          }}
          className="text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition-all"
        >
          Log Out
        </button>
      </header>

      {/* Element 1, 2, & 3: The Cached Report View */}
      <main className="flex-1 w-full relative">
        {/* Pass the retrieved AI data directly into your existing component */}
        <FullReportView data={reportData} /> 
      </main>
    </div>
  )
}
