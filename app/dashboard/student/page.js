// app/dashboard/student/page.js
"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

// 1. Force the report (and its charts) to be browser-only
const FullReportView = dynamic(() => import('@/components/result-dashboard-real'), { 
  ssr: false,
  loading: () => <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#F57D14]" /></div>
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function StudentDashboard() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [reportData, setReportData] = useState(null)
  const [error, setError] = useState(null)

  // 2. Proof of browser-only execution
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const fetchDashboardData = async () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const id = params.get('id')

        if (!id) throw new Error('No ID provided in the URL.')

        const { data: assessment, error: dbError } = await supabase
          .from('assessments')
          .select('*')
          .eq('id', id)
          .single()

        if (dbError) throw new Error(dbError.message)
        if (!assessment) throw new Error('No record found for this ID.')

        if (!assessment.payment_status) {
          router.push(`/checkout?assessmentId=${assessment.id}`)
          return
        }

        if (assessment.ai_analysis_result) {
          setReportData(assessment.ai_analysis_result)
          setLoading(false)
        } else {
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
        console.error(err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [isMounted, router])

  // 3. Keep the server render extremely simple (just like the isolation test)
  if (!isMounted) {
    return <div className="min-h-screen bg-slate-50" />
  }

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
          {generating ? "Generating Your Roadmap..." : "Loading Your Dashboard..."}
        </h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 max-w-md w-full">
          <p className="text-red-600 font-bold mb-3 text-lg">Error</p>
          <p className="text-slate-600 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="rounded-full bg-[#0A2351] px-6 py-3 font-bold text-white">Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#0A2351] text-white px-4 sm:px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
        <h1 className="font-extrabold text-lg sm:text-xl tracking-tight">SARATHI</h1>
        <button onClick={() => router.push('/')} className="text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 rounded-full px-4 py-2">Exit</button>
      </header>
      <main className="flex-1 w-full relative">
        <FullReportView data={reportData} /> 
      </main>
    </div>
  )
}
