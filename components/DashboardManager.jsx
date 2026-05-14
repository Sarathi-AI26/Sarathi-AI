"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Loader2 } from 'lucide-react'
import FullReportView from '@/components/result-dashboard-real'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function DashboardManager() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [reportData, setReportData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const id = params.get('id')
        if (!id) throw new Error('No ID found.')

        const { data: assessment, error: dbError } = await supabase
          .from('assessments').select('*').eq('id', id).single()

        if (dbError || !assessment) throw new Error('Record not found.')
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
          if (!res.ok) throw new Error(data.error || 'Generation failed')
          setReportData(data.ai_analysis_result)
          setGenerating(false)
          setLoading(false)
        }
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [router])

  if (loading || generating) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#F57D14] animate-spin mb-4" />
        <h2 className="text-xl font-bold text-[#0A2351]">
          {generating ? "Generating Roadmap..." : "Loading Dashboard..."}
        </h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-red-100 text-center max-w-md mx-auto mt-20">
        <p className="text-red-600 font-bold mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-[#0A2351] text-white px-6 py-2 rounded-full">Try Again</button>
      </div>
    )
  }

  return <FullReportView data={reportData} />
}
