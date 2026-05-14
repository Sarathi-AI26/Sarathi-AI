// app/dashboard/student/ClientDashboard.js
"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Loader2, LogOut, User } from 'lucide-react'
import { toast } from 'sonner'
import FullReportView from '@/components/result-dashboard-real'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function ClientDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const id = searchParams.get('id')
  const isSuccess = searchParams.get('success')

  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [assessment, setAssessment] = useState(null)
  const [reportData, setReportData] = useState(null)
  const [error, setError] = useState(null)

  // Payment Success Toast
  useEffect(() => {
    if (isSuccess === 'true') {
      toast.success('Payment successful! Welcome to your SARATHI Dashboard.')
      router.replace(`/dashboard/student?id=${id}`)
    }
  }, [isSuccess, id, router])

  // Data Fetching
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!id) {
        setError('No assessment ID provided. Please return to checkout.')
        setLoading(false)
        return
      }

      try {
        const { data: assessData, error: dbError } = await supabase
          .from('assessments')
          .select('*')
          .eq('id', id)
          .single()

        if (dbError) throw new Error(dbError.message)
        if (!assessData) throw new Error('Assessment record not found.')

        if (!assessData.payment_status) {
          router.push(`/checkout?assessmentId=${assessData.id}`)
          return
        }

        setAssessment(assessData)

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
          if (!res.ok) throw new Error(result.error || 'Failed to generate roadmap')
          
          setReportData(result.ai_analysis_result)
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
  }, [id, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading || generating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-[#F57D14] animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-[#0A2351]">
          {generating ? "Generating Your 5-Year Roadmap..." : "Retrieving Your Data..."}
        </h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 max-w-md w-full text-center">
          <p className="text-red-600 font-bold mb-3 text-lg">Dashboard Error</p>
          <p className="text-slate-600 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-[#0A2351] text-white px-6 py-3 rounded-full font-bold">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const studentName = assessment?.user_details?.name || 'Student'
  const archetypeTitle = reportData?.archetype?.title || 'Explorer'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#0A2351] text-white px-4 sm:px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="font-extrabold text-xl tracking-tight">SARATHI</h1>
          <div className="hidden sm:block h-8 w-px bg-white/20"></div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-bold truncate max-w-[150px]">{studentName}</span>
            <span className="text-[10px] text-[#F57D14] uppercase tracking-widest font-bold">
              {archetypeTitle}
            </span>
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition-all">
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </header>

      <main className="flex-1 w-full">
        <FullReportView data={reportData} /> 
      </main>
    </div>
  )
}
