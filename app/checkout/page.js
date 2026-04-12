import CheckoutClient from '@/components/checkout-client'

const App = ({ searchParams }) => {
  const assessmentId = Array.isArray(searchParams?.assessmentId)
    ? searchParams?.assessmentId?.[0]
    : searchParams?.assessmentId || ''

  return <CheckoutClient assessmentId={assessmentId} />
}

export default App
