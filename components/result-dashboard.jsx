'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, LockKeyhole, Radar, Rocket, Sparkles, TrendingUp } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

import SarathiLogo from '@/components/sarathi-logo'

const ResultDashboard = ({ assessmentId }) => {
  const [loading, setLoading] = useState(true)
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

        setAssessment(data?.assessment)
      } catch (fetchError) {
        setError(fetchError?.message || 'Unable to load result dashboard.')
      } finally {
        setLoading(false)
      }
    }

    loadResult()
  }, [assessmentId])

  const recommendations = assessment?.ai_analysis?.recommendations || []
  const roadmap = assessment?.ai_analysis?.roadmap || {}
  const summary = assessment?.ai_analysis?.summary || ''
  const readiness = assessment?.ai_analysis?.readiness_score || 0
  const topStrengths = assessment?.ai_analysis?.top_strengths || []

  const studentLabel = useMemo(() => assessment?.user?.name || 'Student', [assessment])

  const handleDownload = () => {
    window.print()
    toast.success('Use “Save as PDF” in the print dialog to download your roadmap.')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white p-8 text-sm text-slate-500 shadow-sm">Loading your SARATHI dashboard...</div>
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
                Complete the MOCKED ₹99 checkout to access recommendations, readiness score, and roadmap.
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
            <Link href="/checkout">
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
                      SARATHI Result Dashboard
                    </div>
                    <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{studentLabel}, here is your current career direction map</h1>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">{summary}</p>
                  </div>
                  <Button onClick={handleDownload} className="print:hidden bg-[#F57D14] text-white hover:bg-[#dd6f11]">
                    <Download className="h-4 w-4" />
                    Download Full PDF Roadmap
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-3">
              {recommendations.map((item) => (
                <Card key={item.title} className="border-slate-200 bg-white shadow-sm">
                  <CardHeader>
                    <CardDescription>Rank #{item.rank}</CardDescription>
                    <CardTitle className="text-xl text-[#0A2351]">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
                        <span>Fit score</span>
                        <span>{item.fit_score}%</span>
                      </div>
                      <Progress value={item.fit_score} className="h-2 bg-slate-100 [&>div]:bg-[#F57D14]" />
                    </div>
                    <p className="text-sm text-slate-600">{item.fit_label}</p>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Suggested roles</p>
                      <p className="mt-2 text-sm text-slate-700">{item.roles?.join(' • ')}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-[#0A2351]">Next 30 / 90 Day Roadmap</CardTitle>
                <CardDescription>Use this as your starting operating plan for the next semester.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="mb-4 flex items-center gap-2 text-[#0A2351]">
                    <Rocket className="h-4 w-4 text-[#F57D14]" />
                    <p className="font-semibold">Next 30 days</p>
                  </div>
                  <ul className="space-y-3 text-sm leading-6 text-slate-600">
                    {(roadmap?.next_30_days || []).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="mb-4 flex items-center gap-2 text-[#0A2351]">
                    <TrendingUp className="h-4 w-4 text-[#F57D14]" />
                    <p className="font-semibold">Next 90 days</p>
                  </div>
                  <ul className="space-y-3 text-sm leading-6 text-slate-600">
                    {(roadmap?.next_90_days || []).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="mb-4 flex items-center gap-2 text-[#0A2351]">
                    <Sparkles className="h-4 w-4 text-[#F57D14]" />
                    <p className="font-semibold">Career assets to build</p>
                  </div>
                  <ul className="space-y-3 text-sm leading-6 text-slate-600">
                    {(roadmap?.career_assets_to_build || []).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#0A2351]">
                  <Radar className="h-5 w-5 text-[#F57D14]" />
                  Readiness snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-5 text-center">
                  <p className="text-sm text-slate-500">Current readiness score</p>
                  <p className="mt-2 text-4xl font-bold text-[#0A2351]">{readiness}%</p>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
                    <span>Momentum to first career milestone</span>
                    <span>{readiness}%</span>
                  </div>
                  <Progress value={readiness} className="h-2 bg-slate-100 [&>div]:bg-[#0A2351]" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#0A2351]">Top strengths</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                {topStrengths.map((item) => (
                  <div key={item} className="rounded-xl bg-slate-50 p-4">
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-lg shadow-[#0A2351]/5 print:hidden">
              <CardContent className="space-y-4 p-6">
                <p className="text-sm leading-6 text-slate-600">
                  Current result insights are DUMMY AI recommendations designed to validate the dashboard and unlock journey.
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

export default ResultDashboard
