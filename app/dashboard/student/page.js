// app/dashboard/student/page.js
"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import dynamic from 'next/dynamic'
import { Loader2, LogOut } from 'lucide-react'

// Safe import of your working dashboard view
const ResultDashboardReal = dynamic(() => import('@/components/result-dashboard-real'), { ssr: false })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

function DashboardEngine() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [status, setStatus] = useState("Fetching your data...")
  const [assessment, setAssessment] = useState(null)
  const [analysisData, setAnalysisData] = useState(null)

  useEffect(() => {
    if (!id) {
      setStatus("Error: No ID provided in the URL.")
      return
    }

    const loadData = async () => {
      try {
        // 1. Safe Fetch: Get the assessment data 
        const { data, error } = await supabase
          .from('assessments')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        if (!data) throw new Error("Assessment not found.")

        // 2. Two-Step Fetch: Grab the user safely
        if (data.user_id) {
          const { data: userData } = await supabase
            .from('user') // Note: if your table is plural in Supabase, change this to 'users'
            .select('*') // Changed to * to prevent "column not found" errors
            .eq('id', data.user_id)
            .single()

          console.log("Supabase User Data found:", userData) // Hidden console check

          if (userData) {
            // Checks multiple common column names just in case
            const actualName = userData.name || userData.full_name || userData.first_name || userData.student_name;
            
            if (actualName) {
              data.user_details = { ...data.user_details, name: actualName }
            }
          }
        }
        
        setAssessment(data)

        // 3. AI Generation Logic
        if (data.ai_analysis_result) {
           setAnalysisData(data.ai_analysis_result)
           setStatus("SUCCESS")
        } else if (data.payment_status) {
           setStatus("Synthesizing your 5-Year Roadmap...")
           const res = await fetch('/api/generate-roadmap', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ assessmentId: data.id })
           })
           const result = await res.json()
           if (!res.ok) throw new Error(result.error || "Failed to generate.")
           
           setAnalysisData(result.ai_analysis_result)
           setStatus("SUCCESS")
        } else {
           setStatus("SUCCESS")
        }
      } catch (err) {
        setStatus(`Error: ${err.message}`)
      }
    }

    loadData()
  }, [id, router])

  // SUPABASE LOGOUT LOGIC
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // LOADING STATE
  if (status !== "SUCCESS" || !assessment) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-12 h-12 text-[#F57D14] animate-spin mb-4 mx-auto" />
        <h1 className="text-2xl font-extrabold text-[#0A2351] mb-2">SARATHI Dashboard</h1>
        <p className={`text-lg font-bold ${status.includes('Error') ? 'text-red-600' : 'text-[#F57D14]'}`}>
          {status}
        </p>
      </div>
    )
  }

  // Extract student details for the Header
  const studentName = assessment?.user_details?.name || assessment?.users?.name || 'Student'
  const archetypeTitle = analysisData?.user_archetype || 'Explorer'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* THE RESTORED HEADER WITH LOGOUT */}
      <header className="bg-[#0A2351] text-white px-4 sm:px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3 sm:gap-4">
         <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-white">SARATHI Personalised Dashboard</h1>
          <div className="hidden sm:block h-8 w-px bg-white/20"></div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-bold truncate max-w-[150px]">{studentName}</span>
            <span className="text-[10px] text-[#F57D14] uppercase tracking-widest font-bold">
              {archetypeTitle}
            </span>
          </div>
        </div>

        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </header>

      {/* YOUR ROADMAP */}
      <main className="flex-1 w-full">
        <ResultDashboardReal assessment={assessment} analysisData={analysisData} />
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
