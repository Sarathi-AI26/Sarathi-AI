// app/dashboard/student/page.js
"use client"

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// We load the Manager ONLY on the client. 
// This makes it impossible for the server to "see" the dashboard code.
const DashboardManager = dynamic(() => import('@/components/DashboardManager'), { 
  ssr: false 
})

export default function StudentDashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#0A2351] text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="font-extrabold text-xl tracking-tight">SARATHI</h1>
      </header>
      <main className="flex-1 w-full">
        <DashboardManager />
      </main>
    </div>
  )
}
