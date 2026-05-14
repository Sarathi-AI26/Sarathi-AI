// app/dashboard/student/page.js
"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function StudentDashboard() {
  const router = useRouter()
  
  const [isClient, setIsClient] = useState(false)
  const [status, setStatus] = useState("Connecting to server...")
  const [reportData, setReportData] = useState(null)
  
  // We store the dashboard component in state so the server CANNOT render it
  const [ReportComponent, setReportComponent] = useState(null)

  // 1. STRICT CLIENT MOUNT & MANUAL IMPORT
  useEffect(() => {
    setIsClient(true)
    
    // We import your charting component manually in the browser.
    // Next.js SSR completely ignores this block.
    import('@/components/result-dashboard-real')
      .then((mod) => setReportComponent(() => mod.default))
      .catch((err) => console.error("Failed to load dashboard:", err))
  }, [])

  // 2. VANILLA DATA FETCHING
  useEffect(() => {
    if (!isClient) return

    // Bypassing useSearchParams to prevent Next.js Suspense crashes
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')

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
  }, [isClient, router])

  // 3. PERFECT SSR MATCH
  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-extrabold text-[#0A2351] mb-6">SARATHI Dashboard</h1>
        <p className="text-lg font-bold text-[#F57D14] animate-pulse">Initializing Environment...</p>
      </div>
    )
  }

  // 4. CLIENT LOADING STATE
  if (status !== "SUCCESS" || !reportData || !ReportComponent) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-extrabold text-[#0A2351] mb-6">SARATHI Dashboard</h1>
        <p className={`text-lg font-bold animate-pulse ${status.includes('Error') ? 'text-red-600' : 'text-[#F57D14]'}`}>
          {status}
        </p>
      </div>
    )
  }

  // 5. THE REAL DASHBOARD
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#0A2351] text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="font-extrabold text-xl tracking-tight">SARATHI</h1>
        <button onClick={() => router.push('/')} className="text-sm font-bold bg-white/10 hover:bg-white/20 rounded-full px-4 py-2">
          Exit Dashboard
        </button>
      </header>
      
      <main className="flex-1 w-full">
        {/* Rendered securely with no server interference */}
        <ReportComponent data={reportData} />
      </main>
    </div>
  )
}
