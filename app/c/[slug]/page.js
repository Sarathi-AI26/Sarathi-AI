// app/c/[slug]/page.js
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import CampusLanding from '@/components/CampusLanding'

export async function generateMetadata({ params }) {
  return {
    title: `SARATHI × Campus Assessment`,
    description: 'Discover your career DNA — free for your batch.',
  }
}

export default async function CampusPage({ params }) {
  const supabase = createServerComponentClient({ cookies })

  const { data: institution, error } = await supabase
    .from('institutions')
    .select('id, name, city, seats_purchased, seats_used, active, pilot')
    .eq('slug', params.slug)
    .single()

  if (error || !institution || !institution.active) {
    notFound()
  }

  const seatsRemaining = institution.seats_purchased - institution.seats_used
  const seatsExhausted = seatsRemaining <= 0 && !institution.pilot

  return (
    <CampusLanding
      institution={institution}
      seatsRemaining={seatsRemaining}
      seatsExhausted={seatsExhausted}
    />
  )
}
