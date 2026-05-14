// app/dashboard/student/page.js
"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

function DiagnosticEngine() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [status, setStatus] = useState("Fetching your data...")
  const [rawData, setRawData] = useState(null)

  useEffect(() => {
    if (!id) {
      setStatus("Error: No ID provided in the URL.")
      return
    }

    const testFetch = async () => {
      try {
        const { data, error } = await supabase
          .from('assessments')
          .select('id, payment_status, ai_analysis_result')
          .eq('id', id)
          .single()

        if (error) throw error
        
        setStatus("SUCCESS: Database connected and data retrieved!")
        setRawData(data)

      } catch (err) {
        setStatus(`Supabase Error: ${err.message}`)
      }
    }

    testFetch()
  }, [id])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-2xl font-extrabold text-[#0A2351] mb-6">Diagnostic Mode Active</h1>
      <p className={`text-lg font-bold ${status.includes('SUCCESS') ? 'text-green-600' : 'text-slate-600'}`}>
        {status}
      </p>
      
      {rawData && (
        <div className="mt-8 text-left bg-white p-6 rounded-lg shadow-sm w-full max-w-2xl border border-slate-200">
          <p className="font-bold text-sm text-slate-500 mb-2">Raw Database Payload:</p>
          <pre className="text-xs text-slate-700 overflow-auto max-h-64">
            {JSON.stringify(rawData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default function StudentDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold">Initializing Router...</div>}>
      <DiagnosticEngine />
    </Suspense>
  )
}
