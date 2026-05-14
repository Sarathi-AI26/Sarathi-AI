// app/dashboard/student/page.js
"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import dynamic from 'next/dynamic'

// 1. Force the charts to only exist in the browser
const FullReportView = dynamic(() => import('@/components/result-dashboard-real'), { ssr: false })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// ==========================================
// THE ENGINE (Runs safely ONLY in the browser)
// ==========================================
function DashboardEngine() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [assessment, setAssessment] = useState(null)
  const [reportData, setReportData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      setError('No assessment ID found. Please return to checkout.')
      setLoading(false)
      return
    }

    const fetchDashboardData = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('assessments')
          .select('*')
          .eq('id', id)
          .single()

        if (dbError) throw new Error(dbError.message)
        if (!data) throw new Error('Assessment not found.')

        if (!data.payment_status) {
          router.push(`/checkout?assessmentId=${data.id}`)
          return
        }

        setAssessment(data)

        if (data.ai_analysis_result) {
          setReportData(data.ai_analysis_result)
          setLoading(false)
        } else {
          setGenerating(true)
          const res = await fetch('/api/generate-roadmap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assessmentId: data.id })
          })
          const result = await res.json()
          if (!res.ok) throw new Error(result.error || 'Failed to generate')
          setReportData(result.ai_analysis_result)
          setGenerating(false)
          setLoading(false)
        }
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [id, router])

  if (loading || generating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
         <h2 className="text-2xl font-bold text-[#0A2351] animate-pulse">
           {generating ? "Synthesizing your 5-Year Roadmap..." : "Loading SARATHI Dashboard..."}
         </h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-xl border border-red-200 text-center shadow-sm">
          <p className="text-red-600 font-bold mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-[#0A2351] text-white px-6 py-2 rounded-full font-bold">
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
      <header className="bg-[#0A2351] text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="font-extrabold text-xl tracking-tight">SARATHI</h1>
        </div>
        <div className="text-right">
          <p className="font-bold text-sm">{studentName}</p>
          <p className="text-[10px] text-[#F57D14] uppercase tracking-widest font-bold">{archetypeTitle}</p>
        </div>
      </header>
      <main className="flex-1 w-full">
        <FullReportView data={reportData} />
      </main>
    </div>
  )
}

// ==========================================
// THE SHELL (Perfect HTML Match for Hydration)
// ==========================================
export default function StudentDashboardPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 2. THE IRONCLAD FALLBACK
  // The Server AND the initial Browser render will output this EXACT inline-styled div.
  // Because it uses inline styles (not Tailwind classes), the CSS compiler cannot cause a mismatch.
  if (!mounted) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }} />
  }

  // 3. SAFE MOUNT
  // React is now 100% in the browser. We safely render the Engine and the Suspense boundary.
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }} />}>
      <DashboardEngine />
    </Suspense>
  )
}
