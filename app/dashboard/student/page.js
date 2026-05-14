// app/dashboard/student/page.js
"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

// 1. DYNAMIC IMPORT: Natively prevents hydration errors without the "mounted" anti-pattern
const DashboardManager = dynamic(() => import('@/components/DashboardManager'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="w-10 h-10 animate-spin text-[#F57D14]" />
      <p className="mt-4 text-[#0A2351] font-bold">Initializing Environment...</p>
    </div>
  )
})

export default function StudentDashboardPage() {
  return (
    // 2. ERROR BOUNDARY & SUSPENSE: Safely wraps the client-side router hooks
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-[#F57D14]" />
      </div>
    }>
      <DashboardManager />
    </Suspense>
  )
}
