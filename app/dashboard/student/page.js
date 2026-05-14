// app/dashboard/student/page.js
import dynamic from 'next/dynamic'

// Strictly disables SSR for the entire dashboard UI
const ClientDashboard = dynamic(() => import('./ClientDashboard'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-xl font-bold text-[#0A2351] animate-pulse">
        Loading SARATHI Dashboard...
      </div>
    </div>
  )
})

export const metadata = {
  title: 'Student Dashboard | SARATHI',
}

export default function StudentDashboardPage() {
  return <ClientDashboard />
}
