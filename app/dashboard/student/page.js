// app/dashboard/student/page.js
"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import dynamic from 'next/dynamic'

// 1. Force the charts to ONLY load in the browser
const FullReportView = dynamic(() => import('@/components/result-dashboard-real'), { ssr: false })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

function DashboardEngine() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  // Using the exact same State structure from the successful Diagnostic Test
  const [status, setStatus] = useState("Fetching your data...")
  const [reportData, setReportData] = useState(null)

  useEffect(() => {
    if (!id) {
      setStatus("Error: No ID provided in the URL.")
      return
    }

    const loadData = async () => {
      try {
        const { data, error } = await supabase
          .from('assessments')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        if (!data) throw new Error("Assessment not found.")
        
        if (!data.payment_status) {
          router.push(`/checkout?assessmentId=${data.id}`)
          return
        }

        if (data.ai_analysis_result) {
           setReportData(data.ai_analysis_result)
           setStatus("SUCCESS")
        } else {
           setStatus("Synthesizing your 5-Year Roadmap...")
           const res = await fetch('/api/generate-roadmap', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ assessmentId: data.id })
           })
           const result = await res.json()
           if (!res.ok) throw new Error(result.error || "Failed to generate.")
           
           setReportData(result.ai_analysis_result)
           setStatus("SUCCESS")
        }

      } catch (err) {
        setStatus(`Error: ${err.message}`)
      }
    }

    loadData()
  }, [id, router])

  // 2. THE DIAGNOSTIC RENDER
  // If we don't have the data yet, we show the simple layout that we PROVED works without crashing
  if (status !== "SUCCESS" || !reportData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-extrabold text-[#0A2351] mb-6">SARATHI Dashboard</h1>
        <p className={`text-lg font-bold animate-pulse ${status.includes('Error') ? 'text-red-600' : 'text-[#F57D14]'}`}>
          {status}
        </p>
      </div>
    )
  }

  // 3. THE REAL DASHBOARD
  // Only rendered once the browser has safely downloaded the JSON
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#0A2351] text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="font-extrabold text-xl tracking-tight">SARATHI</h1>
        <button onClick={() => router.push('/')} className="text-sm font-bold bg-white/10 hover:bg-white/20 rounded-full px-4 py-2">
          Exit Dashboard
        </button>
      </header>
      
      <main className="flex-1 w-full">
        <FullReportView data={reportData} />
      </main>
    </div>
  )
}

export default function StudentDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-[#0A2351]">Initializing Environment...</div>}>
      <DashboardEngine />
    </Suspense>
  )
}
