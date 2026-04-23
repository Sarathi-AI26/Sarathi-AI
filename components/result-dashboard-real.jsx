'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  BadgeIndianRupee, BrainCircuit, Compass, Lightbulb,
  LockKeyhole, Network, Sparkles, Target, Loader2,
  BookOpen, TrendingUp, Timer, Activity, Globe,
  AlertTriangle, Lock, ArrowRight, CheckCircle2,
  Zap, Users, Shield, Brain, XCircle, Quote,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip, BarChart, Bar,
  XAxis, YAxis, Cell,
} from 'recharts'

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const hasFullAnalysis = (analysis) =>
  Boolean(analysis?.executive_summary && Array.isArray(analysis?.top_career_matches))

const parseExecutiveSummary = (raw) => {
  if (!raw) return []
  if (typeof raw === 'string') return raw.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
  if (typeof raw === 'object') return Object.values(raw).filter(Boolean)
  return []
}

const safeText = (val) => {
  if (!val) return null
  if (typeof val === 'string') return val
  if (typeof val === 'object') return Object.values(val).filter(Boolean).join(' — ')
  return String(val)
}

const ICON_MAP = {
  brain: Brain, target: Target, users: Users,
  'trending-up': TrendingUp, lightbulb: Lightbulb,
  globe: Globe, shield: Shield, zap: Zap,
}

// ─────────────────────────────────────────────
// SARATHI LOGO — inline SVG, works in PDF
// ─────────────────────────────────────────────
const SarathiLogo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#0A2351"/>
    <path d="M8 28 L20 12 L32 28" stroke="#F57D14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 28 L20 20 L26 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="20" cy="10" r="2.5" fill="#F57D14"/>
  </svg>
)

// ─────────────────────────────────────────────
// PDF HEADER — only shown in PDF mode
// ─────────────────────────────────────────────
const PdfHeader = ({ studentName, archetype, generatedDate }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '2px solid #F57D14',
    marginBottom: '24px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <SarathiLogo size={36} />
      <div>
        <div style={{ fontSize: '16px', fontWeight: '700', color: '#0A2351' }}>SARATHI</div>
        <div style={{ fontSize: '10px', color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Career Roadmap Report
        </div>
      </div>
    </div>
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: '13px', fontWeight: '600', color: '#0A2351' }}>{studentName}</div>
      <div style={{ fontSize: '11px', color: '#F57D14', fontWeight: '600' }}>{archetype}</div>
      <div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>
        Generated {generatedDate}
      </div>
    </div>
  </div>
)

// ─────────────────────────────────────────────
// PDF FOOTER — page branding
// ─────────────────────────────────────────────
const PdfFooter = () => (
  <div style={{
    marginTop: '32px',
    paddingTop: '12px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}>
    <div style={{ fontSize: '10px', color: '#aaa' }}>
      © {new Date().getFullYear()} SARATHI · sarathi-ai.in · Empowering Student Clarity
    </div>
    <div style={{ fontSize: '10px', color: '#aaa' }}>
      This report is confidential and personalised for the recipient.
    </div>
  </div>
)

// ─────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────
const SectionHeading = ({ icon: Icon, title, subtitle, isPdfMode }) => (
  <div className={`flex items-center gap-3 ${isPdfMode ? 'mb-3' : 'mb-6'}`}>
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A2351] text-[#F57D14] shrink-0">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h2 className={`font-bold text-[#0A2351] ${isPdfMode ? 'text-lg' : 'text-xl'}`}>{title}</h2>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
  </div>
)

const LoadingView = ({ analyzing }) => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center p-8 text-center">
    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F57D14]/10">
      <BrainCircuit className="h-10 w-10 text-[#F57D14] animate-pulse" />
    </div>
    <h1 className="text-2xl font-bold text-[#0A2351]">
      {analyzing ? 'Building your personalised roadmap...' : 'Loading your results...'}
    </h1>
    <p className="mt-2 text-slate-500 max-w-md">
      {analyzing
        ? 'Our AI is reading all 60 of your answers. This takes about 30 seconds — please do not refresh.'
        : 'Fetching your results...'}
    </p>
    <div className="mt-8 flex items-center gap-2 text-[#F57D14] font-medium">
      <Loader2 className="h-4 w-4 animate-spin" /> Processing...
    </div>
  </div>
)

// ─────────────────────────────────────────────
// IDENTITY STATEMENT — new, most prominent section
// ─────────────────────────────────────────────
const IdentityStatement = ({ statement, isPdfMode }) => (
  <div className={`avoid-break relative overflow-hidden rounded-2xl bg-[#0A2351] ${isPdfMode ? 'p-5 mb-4' : 'p-8 mb-8'}`}>
    <div className="absolute top-4 left-6 opacity-10">
      <Quote className="h-16 w-16 text-[#F57D14]" />
    </div>
    <div className="relative z-10">
      <p className={`text-xs font-bold uppercase tracking-widest text-[#F57D14] mb-3`}>
        Your Identity
      </p>
      <p className={`font-bold text-white leading-relaxed ${isPdfMode ? 'text-lg' : 'text-2xl sm:text-3xl'}`}>
        {statement}
      </p>
    </div>
    <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-[#F57D14]/10" />
  </div>
)

// ─────────────────────────────────────────────
// STRENGTH SIGNALS — visual cards for strengths
// ─────────────────────────────────────────────
const StrengthSignals = ({ signals, isPdfMode }) => {
  if (!signals?.length) return null
  return (
    <section className={`avoid-break ${isPdfMode ? 'mb-4' : 'mb-8'}`}>
      <SectionHeading icon={Zap} title="Your Core Strengths" subtitle="What your scores say you're genuinely good at." isPdfMode={isPdfMode} />
      <div className={`grid gap-3 ${isPdfMode ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
        {signals.map((signal, i) => {
          const Icon = ICON_MAP[signal.icon_hint] || Zap
          return (
            <div
              key={i}
              className={`rounded-2xl border border-slate-100 bg-white p-4 flex gap-3 items-start ${isPdfMode ? '' : 'shadow-sm hover:shadow-md transition-all'}`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F57D14]/10">
                <Icon className="h-4 w-4 text-[#F57D14]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0A2351]">{signal.label}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{signal.evidence}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// CAREER COMPATIBILITY BARS — visual match %
// ─────────────────────────────────────────────
const CareerCompatibilityChart = ({ careers, isPdfMode }) => {
  if (!careers?.length) return null
  const data = careers.map(c => ({
    name: c.career_title?.split(',')[0] || c.career_title,
    score: c.compatibility_score || 85,
  }))

  return (
    <section className={`avoid-break ${isPdfMode ? 'mb-4' : 'mb-8'}`}>
      <SectionHeading icon={Activity} title="Career Compatibility" subtitle="How well each career matches your psychometric profile." isPdfMode={isPdfMode} />
      <Card className="border-0 bg-[#0A2351]/5 shadow-none">
        <CardContent className={isPdfMode ? 'p-3' : 'p-6'}>
          <div className={isPdfMode ? 'h-[140px]' : 'h-[180px]'}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 0, right: 40, top: 4, bottom: 4 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={isPdfMode ? 130 : 160}
                  tick={{ fontSize: 11, fill: '#0A2351', fontWeight: 600 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(val) => [`${val}% match`, 'Compatibility']}
                  contentStyle={{ borderRadius: '10px', border: 'none', fontSize: '12px' }}
                />
                <Bar dataKey="score" radius={[0, 6, 6, 0]} maxBarSize={28}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#F57D14' : i === 1 ? '#0A2351' : '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex gap-4 text-xs text-slate-400 flex-wrap">
            <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#F57D14]"/>Best match</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#0A2351]"/>Strong match</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-slate-300"/>Good match</span>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

// ─────────────────────────────────────────────
// WHAT TO AVOID — new section
// ─────────────────────────────────────────────
const WhatToAvoid = ({ items, isPdfMode }) => {
  if (!items?.length) return null
  return (
    <section className={`avoid-break ${isPdfMode ? 'mb-4' : 'mb-8'}`}>
      <SectionHeading icon={XCircle} title="What to Avoid" subtitle="Roles, environments, and habits that your profile says are a bad fit." isPdfMode={isPdfMode} />
      <div className={`grid gap-3 ${isPdfMode ? '' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
        {items.map((item, i) => (
          <div
            key={i}
            className={`rounded-2xl border border-red-100 bg-red-50/60 p-4 ${isPdfMode ? 'mb-2' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100 mt-0.5">
                <XCircle className="h-3.5 w-3.5 text-red-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-0.5">
                  {item.category}
                </p>
                <p className="text-sm font-bold text-red-800 mb-1">{item.warning}</p>
                <p className="text-xs text-red-600/80 leading-relaxed">{item.reason}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// 5-YEAR TIMELINE VISUAL
// ─────────────────────────────────────────────
const RoadmapTimeline = ({ steps, isPdfMode }) => {
  const colors = ['#3b82f6', '#6366f1', '#F57D14', '#f59e0b', '#0A2351']
  return (
    <div className={isPdfMode ? 'block space-y-3' : 'relative'}>
      {!isPdfMode && (
        <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-[#F57D14] to-[#0A2351] opacity-30" />
      )}
      {steps.map((step, i) => {
        const Icon = step.icon
        return (
          <div
            key={i}
            className={`avoid-break flex gap-4 ${isPdfMode ? 'mb-4' : 'mb-6'}`}
            style={{ pageBreakInside: 'avoid' }}
          >
            {/* Timeline dot */}
            {!isPdfMode && (
              <div className="relative flex-shrink-0">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg z-10 relative"
                  style={{ backgroundColor: colors[i] }}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            )}
            <div className={`flex-1 rounded-2xl border border-slate-100 bg-white ${isPdfMode ? 'p-4 shadow-none' : 'p-5 shadow-sm hover:shadow-md transition-all'}`}>
              <div className="flex items-center gap-3 mb-2">
                {isPdfMode && (
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white shrink-0"
                    style={{ backgroundColor: colors[i] }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                )}
                <div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: colors[i] }}
                  >
                    {step.label}
                  </span>
                  <p className="font-bold text-[#0A2351] text-base leading-tight">{step.title}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{step.data}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────
// FULL REPORT VIEW
// ─────────────────────────────────────────────
const FullReportView = ({ analysis, studentName, assessmentId, isPdfMode }) => {
  const sp = isPdfMode
    ? { section: 'mb-3', text: 'text-sm' }
    : { section: 'mb-8', text: 'text-lg' }

  const profile = analysis?.psychometric_profile || {}
  const roadmap = analysis?.five_year_roadmap || {}
  const immediateAction = analysis?.immediate_action_plan || {}
  const executiveSummaryParagraphs = parseExecutiveSummary(analysis?.executive_summary)

  const rawScores = analysis?.radar_chart_scores || {}
  const chartData = [
    { subject: 'Personality', score: Number(rawScores['Personality'])           || 0, fullMark: 100 },
    { subject: 'Aptitude',    score: Number(rawScores['Aptitude'])               || 0, fullMark: 100 },
    { subject: 'Motivation',  score: Number(rawScores['Motivation'])             || 0, fullMark: 100 },
    { subject: 'Interests',   score: Number(rawScores['Career Interests'])       || 0, fullMark: 100 },
    { subject: 'Behaviour',   score: Number(rawScores['Behavioural Tendencies']) || 0, fullMark: 100 },
  ]

  const blindSpots = (analysis?.potential_blind_spots || []).map(spot => ({
    text: safeText(spot),
    isSevere: safeText(spot)?.toUpperCase().includes('SEVERE'),
  }))

  const roadmapSteps = [
    { label: 'Year 1', title: 'Foundation & Skill Launch',     key: 'year_1', icon: Target     },
    { label: 'Year 2', title: 'Skill Application & Execution', key: 'year_2', icon: BookOpen   },
    { label: 'Year 3', title: 'Market Acceleration',           key: 'year_3', icon: Sparkles   },
    { label: 'Year 4', title: 'Strategic Positioning',         key: 'year_4', icon: TrendingUp },
    { label: 'Year 5', title: 'Leadership & Mastery',          key: 'year_5', icon: Network    },
  ].map(s => ({ ...s, data: roadmap?.[s.key] })).filter(s => s.data)

  const generatedDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className={isPdfMode ? 'block' : 'space-y-8'}>
      {isPdfMode && (
        <style dangerouslySetInnerHTML={{ __html: `
          .avoid-break { page-break-inside: avoid !important; break-inside: avoid !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          section { margin-bottom: 12px !important; }
        `}} />
      )}

      {/* PDF HEADER — branded, only in PDF mode */}
      {isPdfMode && (
        <PdfHeader
          studentName={studentName}
          archetype={analysis.user_archetype}
          generatedDate={generatedDate}
        />
      )}

      {/* ── HERO BANNER ── */}
      {!isPdfMode && (
        <section className="avoid-break rounded-[2rem] bg-[#0A2351] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#F57D14]">
              <Sparkles className="h-3 w-3" /> Real-Time AI Analysis
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              {studentName}, you are a{' '}
              <span className="text-[#F57D14]">{analysis.user_archetype}</span>
            </h1>
            <p className="mt-4 text-lg text-white/70 max-w-2xl">
              This roadmap was built from your 60 answers — every word of it is specific to you.
            </p>
          </div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        </section>
      )}

      {/* PDF hero (compact) */}
      {isPdfMode && (
        <section className="avoid-break rounded-xl bg-[#0A2351] p-5 mb-4 text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#F57D14] mb-2">
            <Sparkles className="h-3 w-3" /> Real-Time AI Analysis
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            {studentName}, you are a <span className="text-[#F57D14]">{analysis.user_archetype}</span>
          </h1>
          <p className="mt-2 text-sm text-white/70">
            This roadmap was built from your 60 answers — every word is specific to you.
          </p>
        </section>
      )}

      {/* ── IDENTITY STATEMENT — new ── */}
      {analysis.identity_statement && (
        <IdentityStatement statement={analysis.identity_statement} isPdfMode={isPdfMode} />
      )}

      {/* ── EXECUTIVE SUMMARY ── */}
      <section className={`avoid-break ${sp.section}`}>
        <SectionHeading icon={BrainCircuit} title="Your Psychometric Summary" subtitle="What your 60 answers actually say about you." isPdfMode={isPdfMode} />
        <Card className="border-0 shadow-sm">
          <CardContent className={`text-slate-700 leading-relaxed ${isPdfMode ? 'p-4 text-sm space-y-3' : 'p-8 text-lg space-y-5'}`}>
            {executiveSummaryParagraphs.map((para, i) => <p key={i}>{para}</p>)}
          </CardContent>
        </Card>
      </section>

      {/* ── STRENGTH SIGNALS — new visual ── */}
      <StrengthSignals signals={analysis.strength_signals} isPdfMode={isPdfMode} />

      {/* ── RADAR + DNA ── */}
      <div className={isPdfMode ? 'block' : 'grid gap-6 lg:grid-cols-2'}>
        <section className={`avoid-break ${sp.section}`}>
          <SectionHeading icon={Activity} title="Psychometric Dimensions" isPdfMode={isPdfMode} />
          <Card className="border-0 bg-[#0A2351]/5 shadow-none">
            <CardContent className={isPdfMode ? 'p-3' : 'p-4'}>
              <div className={isPdfMode ? 'h-[190px]' : 'h-[250px]'}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    <Radar name="Score" dataKey="score" stroke="#F57D14" fill="#F57D14" fillOpacity={0.35} isAnimationActive={false} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {chartData.map(d => (
                  <div key={d.subject} className="flex items-center gap-1.5 rounded-full bg-white border border-slate-100 px-3 py-1">
                    <span className="text-xs font-bold text-[#0A2351]">{d.subject}</span>
                    <span className="text-xs font-bold text-[#F57D14]">{d.score}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className={`avoid-break ${sp.section}`}>
          <SectionHeading icon={Compass} title="Psychometric DNA" isPdfMode={isPdfMode} />
          <Card className="border-0 bg-[#0A2351]/5 shadow-none">
            <CardContent className={isPdfMode ? 'p-3 space-y-3' : 'p-5 space-y-5'}>
              {profile.dominant_personality_traits?.length > 0 && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Dominant Traits</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {profile.dominant_personality_traits.map(trait => (
                      <span key={trait} className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#0A2351] shadow-sm border border-slate-100">{trait}</span>
                    ))}
                  </div>
                </div>
              )}
              {profile.learning_style && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">How You Learn Best</label>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 italic">{profile.learning_style}</p>
                </div>
              )}
              {profile.work_environment_fit && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Where You'll Thrive</label>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{profile.work_environment_fit}</p>
                </div>
              )}
              {profile.collaboration_style && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">How You Work With Others</label>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{profile.collaboration_style}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      {/* ── CAREER COMPATIBILITY CHART — new visual ── */}
      <CareerCompatibilityChart careers={analysis.top_career_matches} isPdfMode={isPdfMode} />

      {/* ── CAREER MATCH DETAIL CARDS ── */}
      <section className={`avoid-break ${sp.section}`}>
        <SectionHeading icon={Target} title="Your Career Matches — In Detail" subtitle="Each matched to your specific scores." isPdfMode={isPdfMode} />
        <div className={isPdfMode ? 'block space-y-3' : 'grid gap-6 md:grid-cols-3'}>
          {(analysis.top_career_matches || []).map((match, i) => (
            <Card key={i} className={`border-0 border-l-4 border-l-[#F57D14] ${isPdfMode ? 'shadow-none border border-slate-200' : 'shadow-sm hover:shadow-md transition-all'}`}>
              <CardContent className={isPdfMode ? 'p-3' : 'p-6'}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Prime Match</p>
                  {match.compatibility_score && (
                    <span className="text-xs font-extrabold text-[#F57D14] bg-[#F57D14]/10 px-2 py-0.5 rounded-full">
                      {match.compatibility_score}% match
                    </span>
                  )}
                </div>
                <h3 className={`font-bold text-[#0A2351] mb-2 ${isPdfMode ? 'text-base' : 'text-xl'}`}>{match.career_title}</h3>
                <p className="text-sm text-slate-500 mb-2">{match.match_reason || match.why_it_fits}</p>
                {match.growth_path && <p className="text-xs text-slate-400 mb-2 italic">{match.growth_path}</p>}
                <div className="flex items-center gap-2 font-bold text-[#0A2351] text-sm mb-2">
                  <BadgeIndianRupee className="h-4 w-4 text-[#F57D14]" />{match.starting_salary_inr}
                </div>
                {match.key_certifications?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {match.key_certifications.map(cert => (
                      <span key={cert} className="rounded-md bg-[#0A2351]/5 px-2 py-0.5 text-[10px] font-bold text-[#0A2351]">{cert}</span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── WHAT TO AVOID — new section ── */}
      <WhatToAvoid items={analysis.what_to_avoid} isPdfMode={isPdfMode} />

      {/* ── GROWTH WARNINGS ── */}
      {blindSpots.length > 0 && (
        <section className={`avoid-break ${sp.section}`}>
          <SectionHeading icon={Lightbulb} title="Growth Warnings" subtitle="Things to watch out for as you build your career." isPdfMode={isPdfMode} />
          <Card className="border-0 bg-orange-50/60 border border-orange-100">
            <CardContent className={isPdfMode ? 'p-3' : 'p-6'}>
              <ul className="space-y-3">
                {blindSpots.map((spot, i) => (
                  <li key={i} className="flex gap-3 pb-2">
                    <span className="mt-1 shrink-0">
                      {spot.isSevere
                        ? <AlertTriangle className="h-4 w-4 text-red-500" />
                        : <span className="mt-1.5 block h-1.5 w-1.5 rounded-full bg-orange-400" />}
                    </span>
                    <span className={`text-sm leading-relaxed ${spot.isSevere ? 'text-red-700 font-medium' : 'text-orange-900/80'}`}>
                      {spot.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}

      {/* ── ACTION PLAN ── */}
      {immediateAction?.next_30_days && (
        <section className={`avoid-break ${sp.section}`}>
          <SectionHeading icon={Timer} title="Your Action Plan" subtitle="Start here. Right now. This week." isPdfMode={isPdfMode} />
          <Card className={`border-0 text-white ${isPdfMode ? 'bg-[#0A5C44] shadow-none' : 'shadow-lg bg-gradient-to-r from-emerald-600 to-teal-800'}`}>
            <CardContent className={isPdfMode ? 'p-4' : 'p-8'}>
              <div className="space-y-4">
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isPdfMode ? 'text-white/80' : 'text-emerald-200'}`}>
                    This month — next 30 days
                  </p>
                  <p className={`font-bold ${isPdfMode ? 'text-base' : 'text-lg'}`}>{immediateAction.next_30_days}</p>
                </div>
                {immediateAction.next_90_days && (
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isPdfMode ? 'text-white/80' : 'text-emerald-200'}`}>
                      This quarter — next 90 days
                    </p>
                    <p className="text-sm font-medium text-white/90">{immediateAction.next_90_days}</p>
                  </div>
                )}
                <div className="border-t border-white/20 pt-3">
                  <p className="text-sm text-white/80">
                    <span className="font-bold text-white">How you'll know it's done: </span>
                    {immediateAction.success_metric}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* ── INDIA VS ABROAD ── */}
      {analysis.india_vs_abroad_guidance && (
        <section className={`avoid-break ${sp.section}`}>
          <SectionHeading icon={Globe} title="India vs Abroad — Your Path" subtitle="Based on what you told us in Question 60." isPdfMode={isPdfMode} />
          <Card className="border-0 bg-blue-50/60 border border-blue-100">
            <CardContent className={isPdfMode ? 'p-3' : 'p-6'}>
              <p className="text-sm leading-relaxed text-slate-700">{analysis.india_vs_abroad_guidance}</p>
            </CardContent>
          </Card>
        </section>
      )}

      {isPdfMode && (
        <div className="html2pdf__page-break" style={{ pageBreakBefore: 'always', display: 'block', height: '1px' }} />
      )}

      {/* ── 5-YEAR ROADMAP — new timeline layout ── */}
      <section className={isPdfMode ? 'pt-2' : 'mt-4'}>
        <SectionHeading
          icon={TrendingUp}
          title="Your 5-Year Roadmap"
          subtitle="Year by year — from where you are to where you want to be."
          isPdfMode={isPdfMode}
        />
        <RoadmapTimeline steps={roadmapSteps} isPdfMode={isPdfMode} />
      </section>

      {/* PDF FOOTER */}
      {isPdfMode && <PdfFooter />}
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const ResultDashboardReal = ({ assessmentId, onReady, isPdfMode }) => {
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [assessment, setAssessment] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      if (!assessmentId) { setError('No assessment ID found.'); setLoading(false); return }
      try {
        const res = await fetch(`/api/results/${assessmentId}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Failed to load')

        const current = data?.assessment

        if (current?.payment_status && hasFullAnalysis(current?.ai_analysis_result)) {
          setAssessment(current); setLoading(false); return
        }

        if (current?.payment_status) {
          setAnalyzing(true)
          const r = await fetch('/api/generate-roadmap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assessmentId, mode: 'full' }),
          })
          const d = await r.json()
          if (!r.ok) throw new Error(d?.error || 'Generation failed')
          setAssessment(d?.assessment)
          setAnalyzing(false); setLoading(false); return
        }

        // Unpaid — redirect to checkout
        window.location.href = `/checkout?assessmentId=${assessmentId}`

      } catch (err) {
        setError(err.message)
        setLoading(false)
        setAnalyzing(false)
      }
    }
    load()
  }, [assessmentId])

  useEffect(() => {
    if (!loading && !analyzing && !error && assessment) {
      if (onReady) onReady()
    }
  }, [loading, analyzing, error, assessment, onReady])

  const studentName = useMemo(
    () => assessment?.users?.name || assessment?.user?.name || 'Student',
    [assessment]
  )

  if (loading || analyzing) return <LoadingView analyzing={analyzing} />

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

  const fullAnalysis = assessment?.ai_analysis_result || assessment?.ai_analysis

  return (
    <main className={isPdfMode ? 'h-max bg-white' : 'min-h-screen bg-slate-50 py-8'}>
      <div className={`container mx-auto ${isPdfMode ? 'px-4 max-w-none' : 'px-4 sm:px-6 lg:px-8'}`}>
        <FullReportView
          analysis={fullAnalysis}
          studentName={studentName}
          assessmentId={assessmentId}
          isPdfMode={isPdfMode}
        />
      </div>
    </main>
  )
}

export default ResultDashboardReal
