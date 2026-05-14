// components/DashboardManager.jsx
"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Loader2, LogOut, User } from 'lucide-react'
import { toast } from 'sonner'
import FullReportView from '@/components/result-dashboard-real'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function DashboardManager() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // URL Param Handling
  const id = searchParams.get('id')
  const isSuccess = searchParams.get('success')

  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [assessment, setAssessment] = useState(null)
  const [reportData, setReportData] = useState(null)
  const [error, setError] = useState(null)

  // POST-PAYMENT TOAST HANDLER
  useEffect(() => {
    if (isSuccess === 'true') {
      toast.success('Payment successful! Welcome to your SARATHI Dashboard.')
      // Clean the URL so the toast doesn't fire again on refresh
      router.replace(`/dashboard/student?id=${id}`)
    }
  }, [isSuccess, id, router])

  // AUTH & DATA FETCHING FLOW
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!id) {
        setError('No assessment ID provided. Please return to checkout or login.')
        setLoading(false)
        return
      }

      try {
        // 1. Fetch Assessment & User Session Data
        const { data: assessData, error: dbError } = await supabase
          .from('assessments')
          .select('*')
          .eq('id', id)
          .single()

        if (dbError) throw new Error(`Database Error: ${dbError.message}`)
        if (!assessData) throw new Error('Assessment record not found.')

        // 2. Gatekeeper: Payment Verification
        if (!assessData.payment_status) {
          router.push(`/checkout?assessmentId=${assessData.id}`)
          return
        }

        setAssessment(assessData)

        // 3. Roadmap Generation Check
        if (assessData.ai_analysis_result) {
          setReportData(assessData.ai_analysis_result)
          setLoading(false)
        } else {
          setGenerating(true)
          const res = await fetch('/api/generate-roadmap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assessmentId: assessData.id })
          })
          
          const result = await res.json()
          if (!res.ok) throw new Error(`API Error: ${result.error || 'Failed to generate roadmap'}`)
          
          setReportData(result.ai_analysis_result)
          setGenerating(false)
          setLoading(false)
        }
      } catch (err) {
        console.error('Manager Error:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [id, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // UI RENDERING STRATEGIES
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
        <p className="text-sm text-slate-500 mt-2">
          {generating ? "Our AI is synthesizing your psychometric DNA." : "Securely retrieving session data..."}
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 max-w-md w-full text-center">
          <p className="text-red-600 font-bold mb-3 text-lg">Session Error</p>
          <p className="text-slate-600 mb-6 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">{error}</p>
          <button onClick={() => window.location.reload()} className="rounded-full bg-[#0A2351] px-6 py-3 font-bold text-white transition-all hover:bg-[#0d2d6b]">
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  // Safe extraction for Header Data
  const studentName = assessment?.user_details?.name || 'Student'
  const archetypeTitle = reportData?.archetype?.title || 'Explorer'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* IMPROVED HEADER: Includes Student Data & Actions */}
      <header className="bg-[#0A2351] text-white px-4 sm:px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3 sm:gap-4">
          <h1 className="font-extrabold text-lg sm:text-xl tracking-tight">SARATHI</h1>
          <div className="hidden sm:block h-8 w-px bg-white/20"></div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-bold truncate max-w-[150px]">{studentName}</span>
            <span className="text-[10px] text-[#F57D14] uppercase tracking-widest font-bold">
              {archetypeTitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="sm:hidden p-2 bg-white/10 rounded-full">
            <User className="w-4 h-4 text-[#F57D14]" />
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <main className="flex-1 w-full relative">
        <FullReportView data={reportData} /> 
      </main>
    </div>
  )
}
