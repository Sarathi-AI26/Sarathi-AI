import ResultDashboardReal from '@/components/result-dashboard-real'

const App = ({ searchParams }) => {
  const assessmentId = Array.isArray(searchParams?.id) ? searchParams?.id?.[0] : searchParams?.id || ''

  return <ResultDashboardReal assessmentId={assessmentId} />
}

export default App
