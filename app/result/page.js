'use client'

import React, { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ResultDashboardReal from '@/components/result-dashboard-real'
import { Loader2 } from 'lucide-react'

// ─────────────────────────────────────────────
// RESULT PAGE
// ─────────────────────────────────────────────
const ResultPage = () => {
  const searchParams = useSearchParams()
  const assessmentId = searchParams.get('id') || ''

  const [isReportReady, setIsReportReady] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

        {/* Action bar */}
        {isReportReady && (
          <div className="flex items-center justify-between mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="text-sm text-slate-500 hidden sm:block">
              Your personalised career roadmap is ready.
            </p>
          </div>
        )}

        {/* Report */}
        <div
          id="sarathi-report"
          className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <ResultDashboardReal
            assessmentId={assessmentId}
            onReady={() => setIsReportReady(true)}
          />
        </div>

      </div>
    </div>
  )
}

// Suspense wrapper required for useSearchParams in App Router
const ResultPageWrapper = () => (
  <Suspense fallback={
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#F57D14]" />
    </div>
  }>
    <ResultPage />
  </Suspense>
)

export default ResultPageWrapper
