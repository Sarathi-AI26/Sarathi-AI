import ResultDashboard from '@/components/result-dashboard'

const App = ({ searchParams }) => {
  const assessmentId = Array.isArray(searchParams?.id) ? searchParams?.id?.[0] : searchParams?.id || ''

  return <ResultDashboard assessmentId={assessmentId} />
}

export default App
