// app/dashboard/student/page.js
import dynamic from 'next/dynamic'

// 1. We dynamically import the actual dashboard and explicitly disable SSR.
// Because this is a Server Component, Next.js physically cannot run the Client code on the server.
const ClientDashboard = dynamic(() => import('./ClientDashboard'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-xl font-bold text-[#0A2351] animate-pulse">
        Loading SARATHI Environment...
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
