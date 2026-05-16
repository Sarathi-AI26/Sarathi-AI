// app/api/tpo/cohort/route.js
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'

export async function GET(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Verify the requester is a TPO
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const tpoEmail = session.user.email

    // Get their institution
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('institution_id, role, institutions(name, seats_purchased, seats_used)')
      .eq('email', tpoEmail)
      .eq('active', true)
      .single()

    if (adminError || !adminUser) {
      return NextResponse.json(
        { error: 'Access denied — not a registered TPO' },
        { status: 403 }
      )
    }

    const institutionId = adminUser.institution_id

    // Fetch all assessments for this institution
    // RLS ensures only this institution's data is returned
    const { data: assessments, error: assessError } = await supabase
      .from('assessments')
      .select(`
        id,
        created_at,
        payment_status,
        ai_analysis_result,
        users(name, email, college)
      `)
      .eq('institution_id', institutionId)
      .order('created_at', { ascending: false })

    if (assessError) {
      return NextResponse.json(
        { error: 'Failed to fetch cohort data' },
        { status: 500 }
      )
    }

    // Build cohort analytics
    const completed = assessments.filter(a => a.ai_analysis_result?.user_archetype)
    const pending   = assessments.filter(a => !a.ai_analysis_result?.user_archetype)

    // Archetype distribution
    const archetypeMap = {}
    completed.forEach(a => {
      const arch = a.ai_analysis_result?.user_archetype || 'Unknown'
      archetypeMap[arch] = (archetypeMap[arch] || 0) + 1
    })
    const archetypeDistribution = Object.entries(archetypeMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    // Top career matches across cohort
    const careerMap = {}
    completed.forEach(a => {
      const matches = a.ai_analysis_result?.top_career_matches || []
      matches.slice(0, 1).forEach(m => {
        const title = m.career_title || 'Unknown'
        careerMap[title] = (careerMap[title] || 0) + 1
      })
    })
    const topCareers = Object.entries(careerMap)
      .map(([career, count]) => ({ career, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Average scores across dimensions
    const scoreKeys = ['Personality','Aptitude','Motivation','Career Interests','Behavioural Tendencies']
    const scoreTotals = {}
    scoreKeys.forEach(k => scoreTotals[k] = 0)
    let scoreCount = 0
    completed.forEach(a => {
      const scores = a.ai_analysis_result?.radar_chart_scores
      if (scores) {
        scoreKeys.forEach(k => { scoreTotals[k] += scores[k] || 0 })
        scoreCount++
      }
    })
    const averageScores = scoreKeys.map(k => ({
      dimension: k,
      average: scoreCount > 0 ? Math.round(scoreTotals[k] / scoreCount) : 0,
    }))

    // Student roster for the table
    const roster = completed.map(a => ({
      id:           a.id,
      name:         a.users?.name || 'Student',
      email:        a.users?.email || '',
      archetype:    a.ai_analysis_result?.user_archetype || '',
      top_career:   a.ai_analysis_result?.top_career_matches?.[0]?.career_title || '',
      second_career:a.ai_analysis_result?.top_career_matches?.[1]?.career_title || '',
      overall_score:Math.round(
        Object.values(a.ai_analysis_result?.radar_chart_scores || {})
          .reduce((s, v) => s + v, 0) /
        (Object.values(a.ai_analysis_result?.radar_chart_scores || {}).length || 1)
      ),
      completed_at: a.created_at,
    }))

    return NextResponse.json({
      institution: adminUser.institutions,
      summary: {
        total_registered: assessments.length,
        total_completed:  completed.length,
        total_pending:    pending.length,
        completion_rate:  assessments.length > 0
          ? Math.round((completed.length / assessments.length) * 100)
          : 0,
      },
      archetype_distribution: archetypeDistribution,
      top_careers:            topCareers,
      average_scores:         averageScores,
      roster,
    })

  } catch (error) {
    console.error('TPO cohort API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
