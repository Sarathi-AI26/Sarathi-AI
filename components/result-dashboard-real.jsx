'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
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
  ArrowLeft,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const hasRealAiAnalysis = (analysis) => {
  return Boolean(
    analysis?.user_archetype &&
    typeof analysis?.executive_summary === 'string' &&
    Array.isArray(analysis?.top_career_matches)
  )
}

const ResultDashboardReal = ({ assessmentId, onReady, isPdfMode }) => {
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [locked, setLocked] = useState(false)
  const [assessment, setAssessment] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadResult = async () => {
      if (!assessmentId) {
        setError('No assessment ID found.')
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

        if (!response.ok) throw new Error(data?.error || 'Failed to load dashboard')

        const currentAssessment = data?.assessment

        if (hasRealAiAnalysis(currentAssessment?.ai_analysis)) {
          setAssessment(currentAssessment)
          setLoading(false)
        } else {
          setAnalyzing(true)
          const roadmapResponse = await fetch('/api/generate-roadmap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assessmentId }),
          })

          const textData = await roadmapResponse.text() 
          let roadmapData = {}
          try {
            roadmapData = JSON.parse(textData) 
          } catch (e) {
            console.error("Vercel returned non-JSON:", textData)
            throw new Error("The AI took too long to respond (Vercel Timeout). Please click 'Retake' to resume.")
          }
          if (!roadmapResponse.ok) throw new Error(roadmapData?.error || 'AI generation failed')
          
          setAssessment(roadmapData?.assessment)
          setAnalyzing(false)
          setLoading(false)
        }
      } catch (err) {
        setError(err.message)
        setLoading(false)
        setAnalyzing(false)
      }
    }

    loadResult()
  }, [assessmentId])

  useEffect(() => {
    if (!loading && !analyzing && !error && !locked && assessment) {
      if (onReady) onReady();
    }
  }, [loading, analyzing, error, locked, assessment, onReady]);

  const studentName = useMemo(() => assessment?.user?.name || 'Student', [assessment])
  const analysis = assessment?.ai_analysis || {}
  const profile = analysis?.psychometric_profile || {}
  const roadmap = analysis?.five_year_roadmap || {}
  
  const executiveSummaryParagraphs = String(analysis?.executive_summary || '')
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean)

  if (loading || analyzing) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-8 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F57D14]/10 text-[#F57D14]">
          <BrainCircuit className="h-10 w-10 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold text-[#0A2351]">Synthesizing Your 5-Year Vision...</h1>
        <p className="mt-2 text-slate-500 max-w-md">Our AI is analyzing 60+ data points to build your custom career transformation roadmap.</p>
        <div className="mt-8 flex items-center gap-2 text-[#F57D14] font-medium">
          <Loader2 className="h-4 w-4 animate-spin" /> Gemini 2.5 Flash Processing
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-20 text-center">
        <Card className="mx-auto max-w-md border-red-100 bg-red-50 p-8">
          <p className="font-bold text-red-600">{error}</p>
          <Button asChild className="mt-6 bg-[#0A2351]">
            <Link href="/assessment">Retake Assessment</Link>
          </Button>
        </Card>
      </div>
    )
  }

  if (locked) {
    return (
      <div className="container mx-auto py-20 text-center">
        <Card className="mx-auto max-w-lg p-10 shadow-xl">
          <LockKeyhole className="mx-auto h-12 w-12 text-[#F57D14]" />
          <h2 className="mt-6 text-2xl font-bold text-[#0A2351]">Unlock Your Full Roadmap</h2>
          <p className="mt-4 text-slate-600">Complete your one-time contribution to access the full 5-year vision and PDF download.</p>
          <Button asChild className="mt-8 h-12 w-full bg-[#F57D14] hover:bg-[#dd6f11]">
            <Link href={`/checkout?assessmentId=${assessmentId}`}>Unlock Now</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8 print:bg-white print:py-0">
      <div className="container mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
        
        {/* HERO BANNER - Kept as one solid block so the banner doesn't split */}
        <div className="avoid-page-break break-inside-avoid block mb-8" style={{ pageBreakInside: 'avoid' }}>
          <section className="relative overflow-hidden rounded-[2rem] bg-[#0A2351] p-8 text-white shadow-2xl shadow-[#0A2351]/20 sm:p-12">
            <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#F57D14]">
                  <Sparkles className="h-3 w-3" /> Real-Time AI Analysis
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {studentName}, you are a <span className="text-[#F57D14]">{analysis.user_archetype}</span>
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-white/70">
                  This transformation strategy was custom-built using your unique psychometric signature, mapping your future within the Indian job market.
                </p>
              </div>
            </div>
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          </section>
        </div>

        <div className={isPdfMode ? 'block space-y-8' : 'grid gap-8 lg:grid-cols-3'}>
          
          <div className={`${isPdfMode ? 'block' : 'lg:col-span-2'} space-y-8`}>
            
            <Card className="border-0 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 avoid-page-break break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                <CardTitle className="text-2xl text-[#0A2351]">Strategic Executive Summary</CardTitle>
                <CardDescription>How SARATHI interprets your unique behavioral fingerprint.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6 text-slate-700 leading-relaxed text-lg">
                {executiveSummaryParagraphs.map((para, i) => (
                  <p key={i} className="avoid-page-break break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>{para}</p>
                ))}
              </CardContent>
            </Card>

            <div className={isPdfMode ? 'block space-y-6' : 'grid gap-6 md:grid-cols-3'}>
              {isPdfMode && <h2 className="text-2xl font-bold text-[#0A2351] avoid-page-break break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>Recommended Career Paths</h2>}
              
              {(analysis.top_career_matches || []).map((match, i) => (
                <div key={i} className={`avoid-page-break break-inside-avoid block ${isPdfMode ? 'mb-6' : ''}`} style={{ pageBreakInside: 'avoid' }}>
                  <Card className="group border-0 shadow-sm hover:shadow-md transition-all border-l-4 border-l-[#F57D14]">
                    <CardContent className="p-6">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Prime Match</p>
                      <h3 className="text-xl font-bold text-[#0A2351] mb-3">{match.career_title}</h3>
                      <p className="text-sm text-slate-500 mb-4">{match.why_it_fits}</p>
                      <div className="flex items-center gap-2 font-bold text-[#0A2351] text-sm">
                        <BadgeIndianRupee className="h-4 w-4 text-[#F57D14]" />
                        {match.starting_salary_inr}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {isPdfMode && <h2 className="text-2xl font-bold text-[#0A2351] avoid-page-break break-inside-avoid" style={{ pageBreakInside: 'avoid', marginTop: '2rem' }}>Psychometric Profile & Growth</h2>}
            
            <div className="avoid-page-break break-inside-avoid block" style={{ pageBreakInside: 'avoid' }}>
              <Card className="border-0 bg-[#0A2351]/5 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-[#0A2351]">
                    <Compass className="h-5 w-5 text-[#F57D14]" /> Psychometric DNA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-tighter">Dominant Personality Traits</label>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {profile.dominant_personality_traits?.map(trait => (
                        <span key={trait} className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#0A2351] shadow-sm border border-slate-100">{trait}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-tighter">Preferred Learning Style</label>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 font-medium italic">{profile.learning_style}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-sm bg-orange-50/50 mb-8">
               <CardHeader className="avoid-page-break break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                 <CardTitle className="text-sm uppercase tracking-widest text-orange-800">Growth Warnings</CardTitle>
               </CardHeader>
               <CardContent>
                 <ul className="space-y-3">
                   {analysis.potential_blind_spots?.map((spot, i) => (
                     <li key={i} className="flex gap-3 text-sm text-orange-900/70 avoid-page-break break-inside-avoid block" style={{ pageBreakInside: 'avoid' }}>
                       <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                       {spot}
                     </li>
                   ))}
                 </ul>
               </CardContent>
            </Card>
          </div>
        </div>

       <section className="mt-12">
         <h2 className="text-3xl font-bold text-[#0A2351] mb-8 avoid-page-break break-inside-avoid block" style={{ pageBreakInside: 'avoid' }}>Your 5-Year Career Transformation</h2>
         <div className={isPdfMode ? 'block space-y-6' : 'grid gap-6 lg:grid-cols-3'}>
           {[
             { 
               label: 'Year 1', 
               title: 'Foundation & Skill Launch', 
               data: roadmap?.year_1 || roadmap?.['Year 1'] || roadmap?.Year_1, 
               icon: Target, 
               color: 'bg-blue-600' 
             },
             { 
               label: 'Year 3', 
               title: 'Market Acceleration', 
               data: roadmap?.year_3 || roadmap?.['Year 3'] || roadmap?.Year_3, 
               icon: Sparkles, 
               color: 'bg-[#F57D14]' 
             },
             { 
               label: 'Year 5', 
               title: 'Leadership & Mastery', 
               data: roadmap?.year_5 || roadmap?.['Year 5'] || roadmap?.Year_5, 
               icon: Network, 
               color: 'bg-[#0A2351]' 
             }
           ].map((step, i) => (
             <div key={i} className={`avoid-page-break break-inside-avoid block ${isPdfMode ? 'mb-6' : ''}`} style={{ pageBreakInside: 'avoid' }}>
               <Card className="relative overflow-hidden border-0 shadow-lg bg-white">
                 <div className={`h-2 w-full ${step.color}`} />
                 <CardHeader>
                   <div className="flex items-center gap-3">
                     <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${step.color}`}>
                       <step.icon className="h-5 w-5" />
                     </div>
                     <div>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">{step.label}</p>
                       <CardTitle className="text-lg text-[#0A2351]">{step.title}</CardTitle>
                     </div>
                   </div>
                 </CardHeader>
                 <CardContent>
                   <p className="text-sm leading-relaxed text-slate-600">
                     {step.data ? step.data : "Your personalized milestone is being calculated for this period."}
                   </p>
                 </CardContent>
               </Card>
             </div>
           ))}
         </div>
       </section>

      </div>
    </main>
  )
}

export default ResultDashboardReal
