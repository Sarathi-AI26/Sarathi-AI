// app/dashboard/student/ClientDashboard.js
"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Loader2, LogOut } from 'lucide-react'
import ResultDashboardReal from '@/components/result-dashboard-real'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function ClientDashboard() {
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
        const { data, error } = await supabase
          .from('assessments')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        if (!data) throw new Error("Assessment not found.")

        // THE GOLD MINE: Check the console to see where the name is actually stored!
        console.log("Raw Assessment Data:", data) 

        if (data.user_id) {
          // This might be blocked by RLS if the user isn't logged in, which is fine!
          const { data: userData, error: userError } = await supabase
            .from('users') 
            .select('*')
            .eq('id', data.user_id)
            .single()
            
          if (userError) console.warn("Supabase RLS blocked user fetch:", userError.message)

          if (userData) {
            const actualName = userData.name || userData.full_name || userData.first_name || userData.student_name;
            if (actualName) {
              data.user_details = { ...data.user_details, name: actualName }
            }
          }
        }
        
        setAssessment(data)

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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

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

  // Look for the name in multiple places where guest checkout forms usually save it
  const studentName = assessment?.user_details?.name || assessment?.user_details?.full_name || assessment?.name || 'Student'
  const archetypeTitle = analysisData?.user_archetype || 'Explorer'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#0A2351] text-white px-4 sm:px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3 sm:gap-4">
         <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-white">SARATHI</h1>
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

      <main className="flex-1 w-full">
        <ResultDashboardReal assessment={assessment} analysisData={analysisData} />
      </main>
    </div>
  )
}
