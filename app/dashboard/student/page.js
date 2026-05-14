// app/dashboard/student/page.js
"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import the report to completely disable SSR for Recharts
const FullReportView = dynamic(() => import('@/components/result-dashboard-real'), { ssr: false })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

function DashboardClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [reportData, setReportData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      setError('No ID provided in the URL.')
      setLoading(false)
      return
    }

    const fetchDashboardData = async () => {
      try {
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
        setGenerating(false)
      }
    }

    fetchDashboardData()
  }, [id, router])

  if (loading || generating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-[#F57D14] animate-spin mb-4" />
        <h2 className="text-xl font-bold text-[#0A2351]">
          {generating ? "Generating Your Roadmap..." : "Loading Dashboard..."}
        </h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 max-w-sm w-full text-center">
          <p className="text-red-600 font-bold mb-3 text-lg">Error</p>
          <p className="text-slate-600 mb-6">{error}</p>
          <button onClick={() => router.push('/')} className="bg-[#0A2351] text-white px-6 py-2 rounded-full font-bold">Go Home</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#0A2351] text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="font-extrabold text-xl tracking-tight">SARATHI</h1>
        <button onClick={() => router.push('/')} className="text-sm font-bold bg-white/10 hover:bg-white/20 rounded-full px-4 py-2">Exit</button>
      </header>
      <main className="flex-1 w-full">
        <FullReportView data={reportData} /> 
      </main>
    </div>
  )
}

export default function StudentDashboard() {
  // THE ULTIMATE HYDRATION FIX: 
  // We force the server to render exactly `null`. No HTML tags to mismatch.
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null

  return (
    <Suspense fallback={null}>
      <DashboardClient />
    </Suspense>
  )
}
