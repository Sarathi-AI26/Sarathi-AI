'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  BadgeIndianRupee,
  BrainCircuit,
  Compass,
  Download,
  FileText,
  Lightbulb,
  LockKeyhole,
  Network,
  Sparkles,
  Target,
} from 'lucide-react'
import { toast } from 'sonner'

import SarathiLogo from '@/components/sarathi-logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const hasRealAiAnalysis = (analysis) => {
  return Boolean(
    analysis?.user_archetype &&
      typeof analysis?.executive_summary === 'string' &&
      Array.isArray(analysis?.top_career_matches)
  )
}

const ResultDashboardReal = ({ assessmentId }) => {
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [locked, setLocked] = useState(false)
  const [assessment, setAssessment] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadResult = async () => {
      if (!assessmentId || assessmentId === 'demo-locked') {
        setLocked(true)
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/results/${assessmentId}`)
        const data = await response.json()

        if (response.status === 402) {
          setLocked(true)
          setLoading(false)
          return
        }

        if (!response.ok) {
          throw new Error(data?.error || 'Unable to load dashboard')
        }

        const currentAssessment = data?.assessment

        if (hasRealAiAnalysis(currentAssessment?.ai_analysis)) {
          setAssessment(currentAssessment)
          return
        }

        setAnalyzing(true)
        const roadmapResponse = await fetch('/api/generate-roadmap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ assessmentId }),
        })

        const roadmapData = await roadmapResponse.json()

        if (!roadmapResponse.ok) {
          throw new Error(roadmapData?.error || 'Unable to generate AI roadmap')
        }

        setAssessment(roadmapData?.assessment)
      } catch (fetchError) {
        setError(fetchError?.message || 'Unable to load result dashboard.')
      } finally {
        setAnalyzing(false)
        setLoading(false)
      }
    }

    loadResult()
  }, [assessmentId])

  const studentLabel = useMemo(() => assessment?.user?.name || 'Student', [assessment])
  const analysis = assessment?.ai_analysis || {}
  const profile = analysis?.psychometric_profile || {}
  const topCareerMatches = analysis?.top_career_matches || []
  const blindSpots = analysis?.potential_blind_spots || []
  const roadmap = analysis?.one_year_roadmap || {}
  const executiveSummaryParagraphs = String(analysis?.executive_summary || '')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  const handleDownload = () => {
    window.print()
    toast.success('Use “Save as PDF” in the print dialog to download your roadmap.')
  }

  if (loading || analyzing) {
    return (
      <main className="min-h-screen bg-slate-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="mx-auto max-w-3xl border-0 bg-white shadow-xl shadow-[#0A2351]/5">
            <CardContent className="flex flex-col items-center gap-5 p-10 text-center sm:p-14">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F57D14]/10 text-[#F57D14]">
                <BrainCircuit className="h-8 w-8 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0A2351] sm:text-3xl">Analyzing your psychometric profile...</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  SARATHI is generating your real AI roadmap with Gemini 2.5 Pro based on your assessment answers and student profile.
                </p>
              </div>
              <div className="grid w-full gap-3 rounded-3xl bg-slate-50 p-5 text-left text-sm text-slate-600 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-4 shadow-sm">Reading your response patterns</div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">Matching Indian market career paths</div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">Drafting your 1-year roadmap</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-sm text-red-600">{error}</div>
        </div>
      </main>
    )
  }

  if (locked) {
    return (
      <main className="min-h-screen bg-slate-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button asChild variant="ghost" className="mb-4 px-0 text-slate-500 hover:bg-transparent hover:text-[#0A2351]">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </Button>

          <Card className="mx-auto max-w-2xl border-slate-200 bg-white shadow-sm">
            <CardContent className="p-8 text-center sm:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F57D14]/10 text-[#F57D14]">
                <LockKeyhole className="h-8 w-8" />
              </div>
              <h1 className="mt-6 text-3xl font-bold text-[#0A2351]">Your result dashboard is still locked</h1>
              <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
                Complete the MOCKED ₹99 checkout to access your full AI-generated roadmap.
              </p>
              <Button asChild className="mt-6 bg-[#F57D14] text-white hover:bg-[#dd6f11]">
                <Link href={assessmentId && assessmentId !== 'demo-locked' ? `/checkout?assessmentId=${assessmentId}` : '/assessment'}>
                  Go to Checkout
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8 print:bg-white print:py-0">
      <div className="container mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 print:hidden">
          <Button asChild variant="ghost" className="mb-4 px-0 text-slate-500 hover:bg-transparent hover:text-[#0A2351]">
            <Link href={`/checkout?assessmentId=${assessmentId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to checkout
            </Link>
          </Button>
          <SarathiLogo href="/" imageClassName="h-16 w-auto sm:h-20" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.38fr]">
          <div className="space-y-6">
            <Card className="border-0 bg-[#0A2351] text-white shadow-xl shadow-[#0A2351]/10">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                      Real AI Roadmap • Gemini 2.5 Pro
                    </div>
                    <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{studentLabel}, your SARATHI archetype is {analysis?.user_archetype || 'still loading'}</h1>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
                      This roadmap is generated from your psychometric response pattern and tailored for the Indian job market.
                    </p>
                  </div>
                  <Button onClick={handleDownload} className="print:hidden bg-[#F57D14] text-white hover:bg-[#dd6f11]">
                    <Download className="h-4 w-4" />
                    Download Full PDF Roadmap
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-[#0A2351]">Executive Summary</CardTitle>
                <CardDescription>How SARATHI interprets your strengths, work style, and motivation pattern.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
                {executiveSummaryParagraphs.map((paragraph, index) => (
                  <p key={`${analysis?.user_archetype}-${index}`}>{paragraph}</p>
                ))}
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-3">
              {(topCareerMatches || []).map((item) => (
                <Card key={item.career_title} className="border-slate-200 bg-white shadow-sm">
                  <CardHeader>
                    <CardDescription>Career Match</CardDescription>
                    <CardTitle className="text-xl text-[#0A2351]">{item.career_title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-6 text-slate-600">{item.why_it_fits}</p>
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                      <div className="flex items-center gap-2 font-medium text-[#0A2351]">
                        <BadgeIndianRupee className="h-4 w-4 text-[#F57D14]" />
                        {item.starting_salary_inr}
                      </div>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Growth Potential: {item.growth_potential}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-[#0A2351]">Your One-Year Roadmap</CardTitle>
                <CardDescription>Quarter-by-quarter focus areas to move from clarity to career momentum.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    key: 'q1_focus',
                    title: 'Q1 Focus',
                    description: roadmap?.q1_focus,
                    icon: Target,
                  },
                  {
                    key: 'q2_focus',
                    title: 'Q2 Focus',
                    description: roadmap?.q2_focus,
                    icon: Lightbulb,
                  },
                  {
                    key: 'q3_focus',
                    title: 'Q3 Focus',
                    description: roadmap?.q3_focus,
                    icon: Network,
                  },
                  {
                    key: 'q4_focus',
                    title: 'Q4 Focus',
                    description: roadmap?.q4_focus,
                    icon: FileText,
                  },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.key} className="rounded-2xl bg-slate-50 p-5">
                      <div className="mb-4 flex items-center gap-2 text-[#0A2351]">
                        <Icon className="h-4 w-4 text-[#F57D14]" />
                        <p className="font-semibold">{item.title}</p>
                      </div>
                      <p className="text-sm leading-6 text-slate-600">{item.description}</p>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#0A2351]">
                  <Compass className="h-5 w-5 text-[#F57D14]" />
                  Psychometric Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 text-sm text-slate-600">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Dominant personality traits</p>
                  <div className="flex flex-wrap gap-2">
                    {(profile?.dominant_personality_traits || []).map((item) => (
                      <span key={item} className="rounded-full bg-[#0A2351]/5 px-3 py-1 text-sm font-medium text-[#0A2351]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Core motivators</p>
                  <div className="flex flex-wrap gap-2">
                    {(profile?.core_motivators || []).map((item) => (
                      <span key={item} className="rounded-full bg-[#F57D14]/10 px-3 py-1 text-sm font-medium text-[#a25410]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Learning style</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{profile?.learning_style}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#0A2351]">
                  <Sparkles className="h-5 w-5 text-[#F57D14]" />
                  Potential Blind Spots
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                {(blindSpots || []).map((item) => (
                  <div key={item} className="rounded-xl bg-slate-50 p-4 leading-6">
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-lg shadow-[#0A2351]/5 print:hidden">
              <CardContent className="space-y-4 p-6">
                <p className="text-sm leading-6 text-slate-600">
                  This dashboard now uses REAL AI recommendations generated from your submitted assessment and saved into Supabase.
                </p>
                <Button onClick={handleDownload} className="w-full bg-[#F57D14] text-white hover:bg-[#dd6f11]">
                  <Download className="h-4 w-4" />
                  Download Full PDF Roadmap
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ResultDashboardReal
