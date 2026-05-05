'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import PeacockFeatherIcon from '@/components/PeacockFeatherIcon'
import {
  BadgeIndianRupee, BrainCircuit, Compass, Lightbulb,
  Network, Sparkles, Target, Loader2, Lock,
  BookOpen, TrendingUp, Timer, Activity, Globe,
  AlertTriangle, ArrowRight, CheckCircle2,
  Zap, Users, Shield, Brain, XCircle, Quote, Share2, Flame, Scale
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts'

// ─────────────────────────────────────────────
// 🛡️ THE TANK: INDESTRUCTIBLE DATA PARSERS
// ─────────────────────────────────────────────
const hasFullAnalysis = (analysis) =>
  Boolean(analysis?.executive_summary && Array.isArray(analysis?.top_career_matches))

const safeText = (val) => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (Array.isArray(val)) return val.map(safeText).join(', ');
  if (typeof val === 'object') {
    try {
      return Object.values(val)
        .map(v => (typeof v === 'object' && v !== null) ? '' : String(v))
        .filter(Boolean).join(' ');
    } catch (e) {
      return '';
    }
  }
  return String(val);
}

const parseExecutiveSummary = (raw) => {
  if (!raw) return { core_wiring: [], risk_profile: [], motivation: [] }
  if (typeof raw === 'string') {
    return { core_wiring: raw.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean), risk_profile: [], motivation: [] }
  }
  if (Array.isArray(raw)) {
    return { core_wiring: raw.map(safeText).filter(Boolean), risk_profile: [], motivation: [] }
  }
  if (typeof raw === 'object') {
    return {
      core_wiring: Array.isArray(raw.core_wiring) ? raw.core_wiring.map(safeText).filter(Boolean) : [],
      risk_profile: Array.isArray(raw.risk_profile) ? raw.risk_profile.map(safeText).filter(Boolean) : [],
      motivation: Array.isArray(raw.motivation) ? raw.motivation.map(safeText).filter(Boolean) : [],
    }
  }
  return { core_wiring: [], risk_profile: [], motivation: [] }
}

const ICON_MAP = {
  brain: Brain, target: Target, users: Users,
  'trending-up': TrendingUp, lightbulb: Lightbulb,
  globe: Globe, shield: Shield, zap: Zap,
}

// ─────────────────────────────────────────────
// FEEDBACK BUTTONS COMPONENT
// ─────────────────────────────────────────────
const FeedbackButtons = ({ assessmentId, careerTitle }) => {
  const [voted, setVoted] = useState(null) 

  const handleVote = async (rating) => {
    if (voted) return 
    setVoted(rating)
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId, careerTitle, rating }),
      })
    } catch {
      // silent fail 
    }
  }

  return (
    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-3">
      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
        Does this feel accurate?
      </p>
      <button
        onClick={() => handleVote('up')}
        disabled={!!voted}
        className={`text-lg transition-all ${voted === 'up' ? 'opacity-100 scale-110' : voted ? 'opacity-30' : 'opacity-60 hover:opacity-100 hover:scale-110'}`}
        title="Yes, this fits me"
      >
        👍
      </button>
      <button
        onClick={() => handleVote('down')}
        disabled={!!voted}
        className={`text-lg transition-all ${voted === 'down' ? 'opacity-100 scale-110' : voted ? 'opacity-30' : 'opacity-60 hover:opacity-100 hover:scale-110'}`}
        title="No, this doesn't fit me"
      >
        👎
      </button>
      {voted && (
        <span className="text-[10px] text-slate-400 italic animate-in fade-in">
          {voted === 'up' ? 'Thanks — helps us improve accuracy.' : 'Noted — your feedback trains the system.'}
        </span>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// PDF HEADER
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
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <img 
        src="/logo-horizontal.png" 
        alt="SARATHI" 
        style={{ height: '80px', width: 'auto', objectFit: 'contain' }} 
      />
      <div style={{ height: '48px', width: '2px', backgroundColor: '#e2e8f0' }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8', lineHeight: '1.2' }}>Empowering</span>
        <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8', lineHeight: '1.2' }}>Student Clarity</span>
      </div>
    </div>
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A2351' }}>{safeText(studentName)}</div>
      <div style={{ fontSize: '12px', color: '#F57D14', fontWeight: '700', marginTop: '4px' }}>{safeText(archetype)}</div>
      <div style={{ fontSize: '10px', color: '#aaa', marginTop: '4px' }}>
        Generated {safeText(generatedDate)}
      </div>
    </div>
  </div>
)

// ─────────────────────────────────────────────
// TRUTH BOMB
// ─────────────────────────────────────────────
const TruthBomb = ({ data, isPdfMode }) => {
  if (!data || !data.headline) return null;
  return (
    <section className={isPdfMode ? 'mb-4' : 'mb-8'}>
      <div 
        className={isPdfMode ? '' : `bg-gradient-to-r from-red-50 to-white`}
        style={{
          borderRadius: isPdfMode ? 16 : 32,
          borderLeft: '8px solid #ef4444',
          backgroundColor: isPdfMode ? '#fff5f5' : undefined,
          padding: isPdfMode ? '20px' : '40px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: isPdfMode ? 'none' : '0 1px 2px 0 rgb(0 0 0 / 0.05)'
        }}
      >
        <div className="absolute -right-10 -top-10 opacity-5">
          <Flame className="h-48 w-48 text-red-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="h-5 w-5 text-red-500" />
            <h3 className={`font-black text-red-700 uppercase tracking-widest ${isPdfMode ? 'text-xs' : 'text-sm'}`}>
              The Brutal Truth: {safeText(data.headline)}
            </h3>
          </div>
          <p className={`font-bold text-[#0A2351] leading-relaxed ${isPdfMode ? 'text-base' : 'text-xl sm:text-2xl'} max-w-4xl`}>
            "{safeText(data.insight)}"
          </p>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// COMPARISON TABLE
// ─────────────────────────────────────────────
const ComparisonTable = ({ isPdfMode }) => {
  if (isPdfMode) return null;
  return (
    <section className="mb-8">
      <SectionHeading icon={Scale} title="Why This Matters" subtitle="Generic Advice vs. Your DNA Blueprint" isPdfMode={false} />
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0A2351] text-white">
            <tr>
              <th className="p-4 sm:p-5 font-bold w-1/2">The Old Way (Generic)</th>
              <th className="p-4 sm:p-5 font-bold w-1/2 bg-[#F57D14]">SARATHI Way (Your Data)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="p-4 sm:p-5 text-slate-500 line-through italic">"Follow your passion."</td>
              <td className="p-4 sm:p-5 text-[#0A2351] font-bold bg-[#F57D14]/5">Align passion strictly with your proven aptitude scores.</td>
            </tr>
            <tr>
              <td className="p-4 sm:p-5 text-slate-500 line-through italic">"Get a safe, stable corporate job."</td>
              <td className="p-4 sm:p-5 text-[#0A2351] font-bold bg-[#F57D14]/5">Leverage your specific risk-tolerance and decisiveness profile.</td>
            </tr>
            <tr>
              <td className="p-4 sm:p-5 text-slate-500 line-through italic">"Figure it out as you go."</td>
              <td className="p-4 sm:p-5 text-[#0A2351] font-bold bg-[#F57D14]/5">Execute a 5-year mapped timeline built for your traits.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// FINAL CTA (Validation Phase)
// ─────────────────────────────────────────────
const FinalCTA = ({ isPdfMode }) => {
  if (isPdfMode) return null; 

  return (
    <section className="mt-12 mb-4 rounded-[2rem] bg-[#0A2351] p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#F57D14]/20 blur-[80px]" />
      
      <div className="relative z-10 space-y-8">
        <div>
          <h2 className="text-white font-extrabold text-3xl sm:text-4xl mb-3">
            Ready to execute your <span className="text-[#F57D14]">blueprint?</span>
          </h2>
          <p className="text-white/70 text-sm max-w-lg mx-auto">
            You have the roadmap. The next step is execution.
          </p>
        </div>

        <div className="border-t border-white/10 pt-6">
          <p className="text-[#F57D14] font-bold text-xs uppercase tracking-widest mb-2">
            Want to go deeper?
          </p>
          <h3 className="text-white text-xl sm:text-2xl font-bold mb-3 flex items-center justify-center gap-2">
            <PeacockFeatherIcon className="h-6 w-6 text-[#F57D14]" />
            Meet Madhav: Your AI Coach
          </h3>
          <p className="text-white/60 text-sm mb-6 max-w-md mx-auto leading-relaxed">
            Don't just read your report—discuss it. Unlock 50 interactive queries with Madhav to build weekly schedules, ask about specific internships, and clarify doubts with a mentor trained exactly on your psychometric profile.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="text-center sm:text-right sm:pr-4 sm:border-r border-white/10 sm:mr-1 hidden sm:block">
               <p className="text-2xl font-extrabold text-white">₹249</p>
               <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 mt-0.5">90-Day Access</p>
            </div>
            <div className="text-center sm:hidden mb-2 border-b border-white/10 pb-4 w-full">
               <p className="text-2xl font-extrabold text-white">₹249</p>
               <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 mt-0.5">90-Day Access</p>
            </div>
            
            <Button 
              onClick={() => window.open('https://forms.zohopublic.in/adminsarat1/form/SARATHIWaitlistDashboard/formperma/Dv72Ts1XH9iyE8_Ph7LkwGUWbE8F-pMaSduHFVXv0J4', '_blank')}
              className="w-full sm:w-auto bg-[#F57D14] hover:bg-[#dd6f11] text-white font-bold h-12 px-8 text-[13px] sm:text-base rounded-full transition-transform hover:scale-105 whitespace-nowrap shadow-xl shadow-[#F57D14]/20"
            >
              Unlock Madhav <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <p className="text-white/40 text-xs mt-6">
            Madhav is launching soon — register your interest to secure early access.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// PROFILE BADGE
// ─────────────────────────────────────────────
const ProfileBadge = ({ radarScores, isPdfMode }) => {
  if (!radarScores || typeof radarScores !== 'object') return null

  const dims = [
    { key: 'Personality',            label: 'Personality'  },
    { key: 'Aptitude',               label: 'Aptitude'     },
    { key: 'Motivation',             label: 'Motivation'   },
    { key: 'Career Interests',       label: 'Career Focus' },
    { key: 'Behavioural Tendencies', label: 'Behaviour'    },
  ]
    .map(d => ({ ...d, score: Number(radarScores[d.key]) || 0 }))
    .sort((a, b) => b.score - a.score)

  const top1    = dims[0] || { label: 'Overall', score: 0 }
  const top2    = dims[1] || { label: 'Focus', score: 0 }
  const overall = Math.round(dims.reduce((s, d) => s + d.score, 0) / (dims.length || 1))

  const toPercentile = (score) => {
    if (score >= 90) return 10
    if (score >= 85) return 15
    if (score >= 80) return 20
    if (score >= 75) return 25
    if (score >= 70) return 30
    return Math.max(5, 100 - score)
  }

  const percentile = toPercentile(top1.score)

  const BADGE_TIERS = [
    { min: 85, color: '#F57D14', bg: 'rgba(245,125,20,0.08)',  border: 'rgba(245,125,20,0.25)',  label: 'Elite Profile'    },
    { min: 75, color: '#0A2351', bg: 'rgba(10,35,81,0.06)',    border: 'rgba(10,35,81,0.18)',    label: 'Strong Profile'   },
    { min: 65, color: '#3b82f6', bg: 'rgba(59,130,246,0.06)',  border: 'rgba(59,130,246,0.18)',  label: 'Solid Profile'    },
    { min: 0,  color: '#64748b', bg: 'rgba(100,116,139,0.06)', border: 'rgba(100,116,139,0.18)', label: 'Emerging Profile' },
  ]
  const tier = BADGE_TIERS.find(t => overall >= t.min) || BADGE_TIERS[3]

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: isPdfMode ? 10 : 14,
        marginBottom: isPdfMode ? 16 : 28,
        alignItems: 'stretch',
      }}
    >
      <div style={{
        flex: '1 1 220px',
        background: tier.bg,
        border: `1.5px solid ${tier.border}`,
        borderRadius: isPdfMode ? 12 : 18,
        padding: isPdfMode ? '14px 18px' : '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: isPdfMode ? 12 : 16,
      }}>
        <div style={{
          width: isPdfMode ? '44px' : '56px',
          height: isPdfMode ? '44px' : '56px',
          minWidth: isPdfMode ? '44px' : '56px',
          minHeight: isPdfMode ? '44px' : '56px',
          borderRadius: '50%',
          background: tier.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: isPdfMode ? 20 : 26,
        }}>
          🏅
        </div>
        <div>
          <div style={{
            fontSize: isPdfMode ? 9 : 10,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: tier.color,
            marginBottom: 3,
          }}>
            {safeText(tier.label)}
          </div>
          <div style={{
            fontSize: isPdfMode ? 16 : 20,
            fontWeight: 800,
            color: '#0A2351',
            lineHeight: 1.2,
          }}>
            Top {percentile}% {safeText(top1.label)} Profile
          </div>
          <div style={{ fontSize: isPdfMode ? 11 : 13, color: '#64748b', marginTop: 3 }}>
            Stronger than {100 - percentile}% of students assessed
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isPdfMode ? 6 : 10,
        flex: '0 1 auto',
        minWidth: isPdfMode ? 140 : 160,
      }}>
        {[top1, top2, { label: 'Overall', score: overall, isOverall: true }].map((d, i) => (
          <div key={i} style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: isPdfMode ? 8 : 12,
            padding: isPdfMode ? '8px 12px' : '10px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{ fontSize: isPdfMode ? 11 : 12, fontWeight: 600, color: '#334155' }}>
              {safeText(d.label)}
            </span>
            <span style={{
              fontSize: isPdfMode ? 13 : 15,
              fontWeight: 800,
              color: i === 0 ? '#F57D14' : '#0A2351',
            }}>
              {Number(d.score) || 0}
              <span style={{ fontSize: isPdfMode ? 9 : 10, fontWeight: 500, color: '#94a3b8' }}>/100</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const SectionHeading = ({ icon: Icon, title, subtitle, isPdfMode }) => (
  <div className={`flex items-center gap-3 ${isPdfMode ? 'mb-3' : 'mb-6'}`}>
    <div 
      className="flex items-center justify-center rounded-xl bg-[#0A2351] text-[#F57D14] shrink-0"
      style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
    >
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h2 className={`font-bold text-[#0A2351] ${isPdfMode ? 'text-lg' : 'text-xl'}`}>{safeText(title)}</h2>
      {subtitle && <p className="text-sm text-slate-500">{safeText(subtitle)}</p>}
    </div>
  </div>
)

const LoadingView = ({ analyzing, elapsed }) => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center p-8 text-center">
    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F57D14]/10">
      <BrainCircuit className={`h-10 w-10 text-[#F57D14] ${analyzing ? 'animate-pulse' : ''}`} />
    </div>
    <h1 className="text-2xl font-bold text-[#0A2351]">
      {analyzing ? 'Building your personalised roadmap...' : 'Loading your results...'}
    </h1>
    <p className="mt-2 text-slate-500 max-w-md">
      {analyzing
        ? 'Our AI is reading all 60 of your answers. This takes about 30-60 seconds — please do not refresh.'
        : 'Fetching your results...'}
    </p>

    {analyzing && elapsed > 20 && (
      <div className="mt-6 max-w-md rounded-xl bg-amber-50 border border-amber-200 p-4 text-left animate-in fade-in slide-in-from-bottom-2">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800">Still working — retrying automatically...</p>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              Gemini AI is currently experiencing peak traffic. We are actively retrying your request. This can take up to 60 seconds. Please do not close the page.
            </p>
          </div>
        </div>
      </div>
    )}

    <div className="mt-8 flex items-center gap-2 text-[#F57D14] font-medium">
      <Loader2 className="h-4 w-4 animate-spin" /> {analyzing && elapsed > 0 ? `Processing... (${elapsed}s)` : 'Processing...'}
    </div>
  </div>
)

const IdentityStatement = ({ statement, isPdfMode }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-[#0A2351] ${isPdfMode ? 'p-5 mb-4' : 'p-8 mb-8'}`}>
    <div className="absolute top-4 left-6 opacity-10">
      <Quote className="h-16 w-16 text-[#F57D14]" />
    </div>
    <div className="relative z-10">
      <p className="text-xs font-bold uppercase tracking-widest text-[#F57D14] mb-3">
        Your Identity
      </p>
      <p className={`font-bold text-white leading-relaxed ${isPdfMode ? 'text-lg' : 'text-2xl sm:text-3xl'}`}>
        {safeText(statement)}
      </p>
    </div>
    <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-[#F57D14]/10" />
  </div>
)

const StrengthSignals = ({ signals, isPdfMode }) => {
  if (!signals?.length) return null
  return (
    <section className={isPdfMode ? 'mb-4' : 'mb-8'}>
      <SectionHeading icon={Zap} title="Your Core Strengths" subtitle="What your scores say you're genuinely good at." isPdfMode={isPdfMode} />
      <div className={`grid gap-3 ${isPdfMode ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
        {signals.map((signal, i) => {
          const Icon = ICON_MAP[signal.icon_hint] || Zap
          return (
            <div
              key={i}
              className={`rounded-2xl border border-slate-100 bg-white p-4 flex gap-3 items-start ${isPdfMode ? '' : 'shadow-sm hover:shadow-md transition-all'}`}
              style={isPdfMode ? { pageBreakInside: 'avoid' } : undefined}
            >
              <div 
                className="flex shrink-0 items-center justify-center rounded-xl bg-[#F57D14]/10"
                style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px' }}
              >
                <Icon className="h-4 w-4 text-[#F57D14]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0A2351]">{safeText(signal.label)}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{safeText(signal.evidence)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

const CareerCompatibilityChart = ({ careers, isPdfMode }) => {
  if (!careers?.length) return null
  
  const data = careers.map((c, i) => ({
    name: safeText(c.career_title)?.split(',')[0] || safeText(c.career_title),
    score: Number(c.compatibility_score) || 85,
    color: i === 0 ? '#F57D14' : i === 1 ? '#0A2351' : '#94a3b8'
  }))

  return (
    <section className={isPdfMode ? 'mb-4' : 'mb-8'}>
      {!isPdfMode && <SectionHeading icon={Activity} title="Career Compatibility" subtitle="How well each career matches your psychometric profile." isPdfMode={isPdfMode} />}
      <Card className="border-0 bg-[#0A2351]/5 shadow-none">
        <CardContent className={isPdfMode ? 'p-3' : 'p-6'}>
          <div className="flex flex-col gap-4 py-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-[140px] shrink-0 text-right pr-4 text-[11px] font-semibold text-[#0A2351] leading-tight">
                  {item.name}
                </div>
                <div className="flex-1 flex items-center h-7 bg-white rounded-r-md overflow-hidden border border-slate-100">
                  <div
                    className="h-full flex items-center justify-end pr-2 transition-all duration-700"
                    style={{ width: `${item.score}%`, backgroundColor: item.color }}
                  >
                    <span className="text-[10px] font-bold text-white">{item.score}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-xs text-slate-400 flex-wrap border-t border-slate-100 pt-3">
            <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#F57D14]"/>Best match</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#0A2351]"/>Strong match</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-slate-300"/>Good match</span>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

const WhatToAvoid = ({ items, isPdfMode }) => {
  if (!items?.length) return null
  return (
    <section className={isPdfMode ? 'mb-4' : 'mb-8'}>
      <SectionHeading icon={XCircle} title="What to Avoid" subtitle="Roles, environments, and habits that your profile says are a bad fit." isPdfMode={isPdfMode} />
      <div className={`grid gap-3 ${isPdfMode ? '' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
        {items.map((item, i) => (
          <div
            key={i}
            className={`rounded-2xl border border-red-100 bg-red-50/60 p-4 ${isPdfMode ? 'mb-2' : ''}`}
            style={isPdfMode ? { pageBreakInside: 'avoid' } : undefined}
          >
            <div className="flex items-start gap-3">
              <div 
                className="flex shrink-0 items-center justify-center rounded-lg bg-red-100 mt-0.5"
                style={{ width: '28px', height: '28px', minWidth: '28px', minHeight: '28px' }}
              >
                <XCircle className="h-3.5 w-3.5 text-red-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-0.5">
                  {safeText(item.category)}
                </p>
                <p className="text-sm font-bold text-red-800 mb-1">{safeText(item.warning)}</p>
                <p className="text-xs text-red-600/80 leading-relaxed">{safeText(item.reason)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const RoadmapTimeline = ({ steps, isPdfMode }) => {
  const colors = ['#3b82f6', '#6366f1', '#F57D14', '#f59e0b', '#0A2351']
  return (
    <div className={isPdfMode ? 'block space-y-2' : 'relative'}>
      {!isPdfMode && (
        <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-[#F57D14] to-[#0A2351] opacity-30" />
      )}
      {steps.map((step, i) => {
        const Icon = step.icon
        return (
          <div
            key={i}
            className={`flex gap-4 ${isPdfMode ? 'mb-2' : 'mb-6'}`}
            style={isPdfMode ? { pageBreakInside: 'avoid' } : undefined}
          >
            {!isPdfMode && (
              <div className="relative flex-shrink-0">
                <div
                  className="flex items-center justify-center rounded-full text-white shadow-lg z-10 relative shrink-0"
                  style={{ backgroundColor: colors[i], width: '44px', height: '44px', minWidth: '44px', minHeight: '44px' }}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            )}
            <div className={`flex-1 rounded-2xl border border-slate-100 bg-white ${isPdfMode ? 'p-3 shadow-none' : 'p-5 shadow-sm hover:shadow-md transition-all'}`}>
              <div className="flex items-center gap-3 mb-2">
                {isPdfMode && (
                  <div
                    className="flex items-center justify-center rounded-md text-white shrink-0"
                    style={{ backgroundColor: colors[i], width: '24px', height: '24px', minWidth: '24px', minHeight: '24px' }}
                  >
                    <Icon className="h-3 w-3" />
                  </div>
                )}
                <div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: colors[i] }}
                  >
                    {safeText(step.label)}
                  </span>
                  <p className="font-bold text-[#0A2351] text-base leading-tight">{safeText(step.title)}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{safeText(step.data)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const FullReportView = ({ analysis, studentName, assessmentId, isPdfMode }) => {
  const sp = isPdfMode
    ? { section: 'mb-4', text: 'text-sm' }
    : { section: 'mb-8', text: 'text-lg' }

  const profile = analysis?.psychometric_profile || {}
  const roadmap = analysis?.five_year_roadmap || {}
  const immediateAction = analysis?.immediate_action_plan || {}
  const summaryBullets = parseExecutiveSummary(analysis?.executive_summary)

  const rawScores = analysis?.radar_chart_scores || {}
  
  const getScore = (keyMatches) => {
      const foundKey = Object.keys(rawScores).find(k => 
          keyMatches.some(match => k.toLowerCase().includes(match.toLowerCase()))
      );
      return foundKey ? Number(rawScores[foundKey]) || 0 : 0;
  }

  const chartData = [
    { subject: 'Personality', score: getScore(['Personality']), fullMark: 100 },
    { subject: 'Aptitude',    score: getScore(['Aptitude']), fullMark: 100 },
    { subject: 'Motivation',  score: getScore(['Motivation']), fullMark: 100 },
    { subject: 'Interests',   score: getScore(['Career', 'Interest']), fullMark: 100 },
    { subject: 'Behaviour',   score: getScore(['Behaviour', 'Behavior']), fullMark: 100 },
  ]

  const blindSpots = Array.isArray(analysis?.potential_blind_spots) 
    ? analysis.potential_blind_spots.map(spot => ({
        text: safeText(spot) || "No critical blind spots identified.",
        isSevere: String(spot).toUpperCase().includes('SEVERE'),
      }))
    : []

  const roadmapSteps = [
    { label: 'Year 1', title: 'Foundation & Skill Launch',     key: 'year_1', icon: Target     },
    { label: 'Year 2', title: 'Skill Application & Execution', key: 'year_2', icon: BookOpen   },
    { label: 'Year 3', title: 'Market Acceleration',           key: 'year_3', icon: Sparkles   },
    { label: 'Year 4', title: 'Strategic Positioning',         key: 'year_4', icon: TrendingUp },
    { label: 'Year 5', title: 'Leadership & Mastery',          key: 'year_5', icon: Network    },
  ].map(s => ({ ...s, data: safeText(roadmap?.[s.key]) })).filter(s => s.data)

  const generatedDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const renderList = (title, items, icon) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm" style={isPdfMode ? { pageBreakInside: 'avoid' } : undefined}>
        <div className="flex items-center gap-2 font-bold text-[#0A2351] mb-3 border-b border-slate-100 pb-2">
           {icon} {title}
        </div>
        <ul className="space-y-3">
           {items.map((item, idx) => (
             <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
               <span 
                  className="mt-1.5 shrink-0 rounded-full bg-[#F57D14]" 
                  style={{ width: '6px', height: '6px', minWidth: '6px', minHeight: '6px' }}
               />
               <span className="leading-relaxed">{item}</span>
             </li>
           ))}
        </ul>
      </div>
    )
  }

  return (
    <div className={isPdfMode ? 'block' : 'space-y-8'}>

      {/* 🚀 PERFECT PAGINATION CSS */}
      {isPdfMode && (
        <style dangerouslySetInnerHTML={{ __html: `
          .pdf-page-break { page-break-before: always !important; display: block; height: 0; margin: 0; padding: 0; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          section { margin-bottom: 14px !important; }
          p, li, span { orphans: 3 !important; widows: 3 !important; }
        `}} />
      )}

      {/* ========================================================================= */}
      {/* PAGE 1: Identity & Report Intro */}
      {/* ========================================================================= */}

      {isPdfMode && (
        <PdfHeader
          studentName={studentName}
          archetype={analysis.user_archetype}
          generatedDate={generatedDate}
        />
      )}

      {!isPdfMode && (
        <section className="rounded-[2rem] bg-[#0A2351] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#F57D14]">
              <Sparkles className="h-3 w-3" /> Real-Time AI Analysis
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
              {safeText(studentName)}, you are a{' '}
              <span className="text-[#F57D14]">{safeText(analysis.user_archetype)}</span>
            </h1>
            
            <p className="mt-4 text-lg text-white/70 max-w-2xl">
              This roadmap was built from your 60 answers — every word of it is specific to you.
            </p>
          </div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        </section>
      )}

      {isPdfMode && (
        <section className="rounded-xl bg-[#0A2351] p-5 mb-4 text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#F57D14] mb-2">
            <Sparkles className="h-3 w-3" /> Real-Time AI Analysis
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            {safeText(studentName)}, you are a{' '}
            <span className="text-[#F57D14]">{safeText(analysis.user_archetype)}</span>
          </h1>
          <p className="mt-2 text-sm text-white/70">
            This roadmap was built from your 60 answers — every word is specific to you.
          </p>
        </section>
      )}

      {analysis.identity_statement && (
        <IdentityStatement statement={analysis.identity_statement} isPdfMode={isPdfMode} />
      )}

      <ProfileBadge radarScores={analysis.radar_chart_scores} isPdfMode={isPdfMode} />

      {isPdfMode && (
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: '10px 14px',
          marginBottom: 16,
          display: 'flex',
          gap: 8,
          alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
          <p style={{ fontSize: 10, color: '#64748b', margin: 0, lineHeight: 1.6 }}>
            <strong style={{ color: '#0A2351' }}>How this report was generated:</strong>{' '}
            Your match scores are computed from 60 psychometric responses across 5 dimensions.
            Career compatibility percentages reflect alignment between your profile and validated role requirements.
            Salary ranges are indicative based on Naukri/LinkedIn India data (2026).
            All inferences are directional — treat this as a starting point, not a definitive prescription.
          </p>
        </div>
      )}

      <TruthBomb data={analysis.truth_bomb} isPdfMode={isPdfMode} />

      {/* ========================================================================= */}
      {/* PAGE 2: DNA Snapshot & Strengths */}
      {/* ========================================================================= */}
      {isPdfMode && <div className="pdf-page-break" />}

      <section className={`${sp.section}`}>
        <SectionHeading icon={BrainCircuit} title="Career DNA Snapshot" subtitle="The core wiring dictating your path." isPdfMode={isPdfMode} />
        {summaryBullets.core_wiring?.length > 0 && typeof summaryBullets.core_wiring[0] === 'string' && !summaryBullets.risk_profile?.length ? (
           <Card className="border-0 shadow-sm">
            <CardContent className={`text-slate-700 leading-relaxed ${isPdfMode ? 'p-4 text-sm space-y-3' : 'p-8 text-lg space-y-5'}`}>
              {summaryBullets.core_wiring.map((para, i) => (
                <p key={i} style={{ orphans: 3, widows: 3 }}>{safeText(para)}</p>
              ))}
            </CardContent>
          </Card>
        ) : (
          <div className={`grid gap-4 ${isPdfMode ? 'grid-cols-3' : 'sm:grid-cols-3'}`}>
            {renderList("Core Wiring", summaryBullets.core_wiring, <Zap className="h-4 w-4 text-[#F57D14]"/>)}
            {renderList("Risk Profile", summaryBullets.risk_profile, <Shield className="h-4 w-4 text-[#F57D14]"/>)}
            {renderList("Motivation", summaryBullets.motivation, <Target className="h-4 w-4 text-[#F57D14]"/>)}
          </div>
        )}
      </section>

      <StrengthSignals signals={analysis.strength_signals} isPdfMode={isPdfMode} />

      {/* ========================================================================= */}
      {/* PAGE 3: Dimensions & Traits (Side-by-side in PDF) */}
      {/* ========================================================================= */}
      {isPdfMode && <div className="pdf-page-break" />}

      <div 
        style={isPdfMode ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' } : undefined} 
        className={isPdfMode ? '' : 'grid gap-6 lg:grid-cols-2'}
      >
        <section className={`${isPdfMode ? '' : sp.section}`}>
          <SectionHeading icon={Activity} title="Psychometric Dimensions" isPdfMode={isPdfMode} />
          <Card className="border-0 bg-[#0A2351]/5 shadow-none h-full">
            <CardContent className={isPdfMode ? 'p-3' : 'p-4'}>
              <div className={isPdfMode ? 'h-[190px]' : 'h-[250px]'}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }}
                    />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#F57D14"
                      fill="#F57D14"
                      fillOpacity={0.35}
                      isAnimationActive={false}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {chartData.map(d => (
                  <div
                    key={d.subject}
                    className="flex items-center gap-1.5 rounded-full bg-white border border-slate-100 px-3 py-1"
                  >
                    <span className="text-xs font-bold text-[#0A2351]">{safeText(d.subject)}</span>
                    <span className="text-xs font-bold text-[#F57D14]">{Number(d.score) || 0}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className={`${isPdfMode ? '' : sp.section}`}>
          <SectionHeading icon={Compass} title="Psychometric Traits" isPdfMode={isPdfMode} />
          <Card className="border-0 bg-[#0A2351]/5 shadow-none h-full">
            <CardContent className={isPdfMode ? 'p-3 space-y-3' : 'p-5 space-y-5'}>
              {profile.dominant_personality_traits?.length > 0 && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                    Dominant Traits
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {profile.dominant_personality_traits.map(trait => (
                      <span
                        key={safeText(trait)}
                        className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#0A2351] shadow-sm border border-slate-100"
                      >
                        {safeText(trait)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.learning_style && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                    How You Learn Best
                  </label>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 italic" style={{ orphans: 3, widows: 3 }}>
                    {safeText(profile.learning_style)}
                  </p>
                </div>
              )}
              {profile.work_environment_fit && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                    Where You'll Thrive
                  </label>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600" style={{ orphans: 3, widows: 3 }}>
                    {safeText(profile.work_environment_fit)}
                  </p>
                </div>
              )}
              {profile.collaboration_style && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                    How You Work With Others
                  </label>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600" style={{ orphans: 3, widows: 3 }}>
                    {safeText(profile.collaboration_style)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 4: Career Compatibility Chart AND Matches */}
      {/* ========================================================================= */}
      {isPdfMode && <div className="pdf-page-break" />}

      <section className={`${sp.section}`}>
        <div style={isPdfMode ? { pageBreakInside: 'avoid' } : undefined}>
          {isPdfMode && (
            <SectionHeading 
              icon={Activity} 
              title="Career Compatibility & Matches" 
              subtitle="How well each career fits, and your path forward." 
              isPdfMode={isPdfMode} 
            />
          )}
          <CareerCompatibilityChart careers={analysis.top_career_matches} isPdfMode={isPdfMode} />
          
          <div className={isPdfMode ? 'mt-2' : ''}>
            {!isPdfMode && (
              <SectionHeading
                icon={Target}
                title="Your Career Matches — In Detail"
                subtitle="Each matched to your specific scores."
                isPdfMode={isPdfMode}
              />
            )}
          </div>
        </div>

        <div className={isPdfMode ? 'block space-y-3' : 'grid gap-6 md:grid-cols-3'}>
          {(analysis.top_career_matches || []).map((match, i) => (
            <Card
              key={i}
              className={`border-0 border-l-4 border-l-[#F57D14] ${isPdfMode ? 'shadow-none border border-slate-200' : 'shadow-sm hover:shadow-md transition-all'}`}
              style={isPdfMode ? { pageBreakInside: 'avoid' } : undefined}
            >
              <CardContent className={isPdfMode ? 'p-3' : 'p-6'}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Prime Match
                  </p>
                  {match.compatibility_score && (
                    <span className="text-xs font-extrabold text-[#F57D14] bg-[#F57D14]/10 px-2 py-0.5 rounded-full">
                      {Number(match.compatibility_score)}% match
                    </span>
                  )}
                </div>
                <h3 className={`font-bold text-[#0A2351] mb-2 ${isPdfMode ? 'text-base' : 'text-xl'}`}>
                  {safeText(match.career_title)}
                </h3>
                <p className="text-sm text-slate-500 mb-2" style={{ orphans: 3, widows: 3 }}>
                  {safeText(match.match_reason || match.why_it_fits)}
                </p>
                {match.growth_path && (
                  <p className="text-xs text-slate-400 mb-2 italic">{safeText(match.growth_path)}</p>
                )}
                <div className="flex items-center gap-2 font-bold text-[#0A2351] text-sm mb-2">
                  <BadgeIndianRupee className="h-4 w-4 text-[#F57D14]" />
                  {safeText(match.starting_salary_inr)}
                </div>
                {match.key_certifications?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {match.key_certifications.map(cert => (
                      <span
                        key={safeText(cert)}
                        className="rounded-md bg-[#0A2351]/5 px-2 py-0.5 text-[10px] font-bold text-[#0A2351]"
                      >
                        {safeText(cert)}
                      </span>
                    ))}
                  </div>
                )}
                
                {!isPdfMode && (
                  <FeedbackButtons
                    assessmentId={assessmentId}
                    careerTitle={safeText(match.career_title)}
                  />
                )}

              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PAGE 5: What To Avoid & Growth Warnings */}
      {/* ========================================================================= */}
      {isPdfMode && <div className="pdf-page-break" />}

      <WhatToAvoid items={analysis.what_to_avoid} isPdfMode={isPdfMode} />

      {blindSpots.length > 0 && (
        <section className={`${sp.section}`}>
          <SectionHeading
            icon={Lightbulb}
            title="Growth Warnings"
            subtitle="Things to watch out for as you build your career."
            isPdfMode={isPdfMode}
          />
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
                      {safeText(spot.text)}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}

      {/* ========================================================================= */}
      {/* PAGE 6: Action Plan & Routing */}
      {/* ========================================================================= */}
      {isPdfMode && <div className="pdf-page-break" />}

      {immediateAction?.next_30_days && (
        <section className={`${sp.section}`}>
          <SectionHeading
            icon={Timer}
            title="Your Action Plan"
            subtitle="Start here. Right now. This week."
            isPdfMode={isPdfMode}
          />
          <Card className={`border-0 text-white ${isPdfMode ? 'bg-[#0A5C44] shadow-none' : 'shadow-lg bg-gradient-to-r from-emerald-600 to-teal-800'}`}>
            <CardContent className={isPdfMode ? 'p-4' : 'p-8'}>
              <div className="space-y-4">
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isPdfMode ? 'text-white/80' : 'text-emerald-200'}`}>
                    This month — next 30 days
                  </p>
                  <p className={`font-bold text-white ${isPdfMode ? 'text-base' : 'text-lg'}`}>
                    {safeText(immediateAction.next_30_days)}
                  </p>
                </div>
                {immediateAction.next_90_days && (
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isPdfMode ? 'text-white/80' : 'text-emerald-200'}`}>
                      This quarter — next 90 days
                    </p>
                    <p className="text-sm font-medium text-white/90">
                      {safeText(immediateAction.next_90_days)}
                    </p>
                  </div>
                )}
                <div className="border-t border-white/20 pt-3">
                  <p className="text-sm text-white">
                    <span className="font-bold text-white">How you'll know it's done: </span>
                    {safeText(immediateAction.success_metric)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {analysis.india_vs_abroad_guidance && (
        <section className={`${sp.section}`}>
          <SectionHeading
            icon={Globe}
            title="India vs Abroad — Your Path"
            subtitle="Based on what you told us in Question 60."
            isPdfMode={isPdfMode}
          />
          <Card className="border-0 bg-blue-50/60 border border-blue-100">
            <CardContent className={isPdfMode ? 'p-3' : 'p-6'}>
              <p className="text-sm leading-relaxed text-slate-700" style={{ orphans: 3, widows: 3 }}>
                {safeText(analysis.india_vs_abroad_guidance)}
              </p>
            </CardContent>
          </Card>
        </section>
      )}

      <div data-html2canvas-ignore="true">
        <ComparisonTable isPdfMode={isPdfMode} />
      </div>

      {/* ========================================================================= */}
      {/* PAGE 7: 5-Year Roadmap */}
      {/* ========================================================================= */}
      {isPdfMode && <div className="pdf-page-break" />}
      
      <section className={isPdfMode ? 'pt-2' : 'mt-4'}>
        <SectionHeading
          icon={TrendingUp}
          title="Your 5-Year Roadmap"
          subtitle="Year by year — from where you are to where you want to be."
          isPdfMode={isPdfMode}
        />
        <RoadmapTimeline steps={roadmapSteps} isPdfMode={isPdfMode} />
      </section>

      <div data-html2canvas-ignore="true">
        <FinalCTA isPdfMode={isPdfMode} />
      </div>

    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const ResultDashboardReal = ({ assessmentId, onReady }) => {
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [assessment, setAssessment] = useState(null)
  const [error, setError] = useState('')
  const [hasPaid, setHasPaid] = useState(true) 
  const [isPdfMode, setIsPdfMode] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isCopied, setIsCopied] = useState(false) 
  const [elapsed, setElapsed] = useState(0)
  const [retryTrigger, setRetryTrigger] = useState(0)

  useEffect(() => {
    let timer;
    if (analyzing) {
      setElapsed(0);
      timer = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => clearInterval(timer);
  }, [analyzing]);

  useEffect(() => {
    const load = async () => {
      if (!assessmentId) {
        setError('No assessment ID found.')
        setLoading(false)
        return
      }
      
      setError('')
      setLoading(true) 

      try {
        const res = await fetch(`/api/results/${assessmentId}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Failed to load')

        const current = data?.assessment

        if (current?.payment_status !== true) {
          setHasPaid(false)
          setAssessment(current)
          setLoading(false)
          return
        }

        if (current?.payment_status && hasFullAnalysis(current?.ai_analysis_result)) {
          setAssessment(current)
          setLoading(false)
          return
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
          setAnalyzing(false)
          setLoading(false)
          return
        }

      } catch (err) {
        setError(err.message)
        setLoading(false)
        setAnalyzing(false)
      }
    }
    load()
  }, [assessmentId, retryTrigger])

  useEffect(() => {
    if (!loading && !analyzing && !error && assessment) {
      if (onReady) onReady()
    }
  }, [loading, analyzing, error, assessment, onReady])

  const studentName = useMemo(
    () => assessment?.users?.name || assessment?.user?.name || 'Student',
    [assessment]
  )

  const handleShare = async () => {
    try {
      const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  }

  const handleDownloadPdf = async () => {
    setIsDownloading(true)
    setIsPdfMode(true) 

    await new Promise(resolve => setTimeout(resolve, 1500)) 

    const html2pdf = (await import('html2pdf.js')).default
    const element = document.getElementById('pdf-wrapper')

    const watermarkUrl = typeof window !== 'undefined' ? `${window.location.origin}/icon.png` : '/icon.png';
    const watermarkImg = new Image();
    watermarkImg.crossOrigin = "anonymous";
    watermarkImg.src = watermarkUrl;
    
    await new Promise((resolve) => {
      watermarkImg.onload = resolve;
      watermarkImg.onerror = () => {
        console.warn("Watermark image failed to load. Proceeding without it.");
        resolve(); 
      };
    });

    const opt = {
      margin:       [10, 10, 10, 10], 
      filename:     `SARATHI_Roadmap_${safeText(studentName).replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true, 
        scrollY: 0,
        windowWidth: 800,
        letterRendering: true,
        logging: false
      },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
      pagebreak:    { mode: 'css' } 
    }

    html2pdf().set(opt).from(element).toPdf().get('pdf').then(function (pdf) {
      const totalPages = pdf.internal.getNumberOfPages();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const wmSize = 40;
      const wmX = (pageWidth - wmSize) / 2;
      const wmY = (pageHeight - wmSize) / 2;
      
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        
        if (watermarkImg.complete && watermarkImg.naturalHeight !== 0) {
          pdf.setGState(new pdf.GState({ opacity: 0.03 }));
          pdf.addImage(watermarkImg, 'PNG', wmX, wmY, wmSize, wmSize);
          pdf.setGState(new pdf.GState({ opacity: 1.0 }));
        }

        pdf.setFontSize(7);
        pdf.setTextColor(160);
        const text = `SARATHI Career Roadmap Report | ${safeText(studentName)} | Page ${i} of ${totalPages} | This report is personalised and confidential`; 
        
        pdf.text(text, pageWidth / 2, pageHeight - 6, {
          align: 'center'
        });
      }
    }).save().then(() => {
        setIsPdfMode(false)
        setIsDownloading(false)
    }).catch((err) => {
        console.error("PDF Generation Failed:", err);
        setIsPdfMode(false)
        setIsDownloading(false)
        alert("PDF download failed on this browser. Please try again on Chrome or open this link on a Desktop/Laptop.")
    });
  }

  if (loading || analyzing) return <LoadingView analyzing={analyzing} elapsed={elapsed} />

  if (!hasPaid) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full border-0 shadow-xl rounded-3xl overflow-hidden text-center p-8 bg-white">
          <div className="w-20 h-20 bg-slate-50 rounded-full mx-auto flex items-center justify-center mb-6">
            <Lock className="w-10 h-10 text-[#0A2351]" />
          </div>
          <h2 className="text-2xl font-bold text-[#0A2351] mb-3">Roadmap Locked</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Your 60-dimension AI analysis is complete and saved. Unlock your dashboard to reveal your Top Career Matches and 5-Year Execution Plan.
          </p>
          <Button asChild className="w-full h-14 rounded-full bg-[#F57D14] hover:bg-[#dd6f11] text-white font-bold text-base shadow-lg transition-all hover:scale-105">
            <Link href={`/checkout?assessmentId=${assessmentId}`}>
              Unlock Now for ₹99 <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </Card>
      </div>
    )
  }

  if (error) {
    const isGenerationError = error.toLowerCase().includes('503') || 
                              error.toLowerCase().includes('failed') || 
                              error.toLowerCase().includes('ai') || 
                              error.toLowerCase().includes('generation');

    return (
      <div className="container mx-auto py-20 text-center">
        <Card className="mx-auto max-w-md border-red-100 bg-red-50 p-8 shadow-sm">
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <p className="font-bold text-red-700 text-lg mb-2">Oops! Something went wrong.</p>
          <p className="text-sm text-red-600/80 mb-6">{error}</p>
          
          {isGenerationError ? (
            <Button onClick={() => setRetryTrigger(prev => prev + 1)} className="w-full bg-[#0A2351] hover:bg-[#F57D14] text-white font-bold h-12">
              Try Again (Data is Saved)
            </Button>
          ) : (
            <Button asChild className="w-full bg-[#0A2351] hover:bg-[#F57D14] text-white font-bold h-12">
              <Link href="/assessment">Return to Home</Link>
            </Button>
          )}
        </Card>
      </div>
    )
  }

  const fullAnalysis = assessment?.ai_analysis_result || assessment?.ai_analysis

  return (
    <div className={isPdfMode ? 'h-max bg-white' : 'min-h-screen bg-slate-50 py-8'}>
      {!isPdfMode && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex flex-col sm:flex-row justify-end gap-3">
          
          <Button 
            onClick={handleShare} 
            variant="outline"
            className={`hidden sm:inline-flex font-bold transition-all ${isCopied ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'text-[#0A2351] border-[#0A2351]/20 hover:bg-[#0A2351]/5'}`}
          >
            {isCopied ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Share2 className="mr-2 h-4 w-4" />}
            {isCopied ? 'Link Copied!' : 'Share Result'}
          </Button>

          <Button 
            onClick={handleDownloadPdf} 
            disabled={isDownloading}
            className="w-full sm:w-auto bg-[#0A2351] hover:bg-[#F57D14] text-white font-bold transition-colors"
          >
            {isDownloading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating PDF...</>
            ) : (
              'Download Career Roadmap PDF'
            )}
          </Button>
        </div>
      )}

      <div id="pdf-wrapper" className={`container mx-auto ${isPdfMode ? 'px-4 max-w-none' : 'px-4 sm:px-6 lg:px-8'}`}>
        <FullReportView
          analysis={fullAnalysis}
          studentName={studentName}
          assessmentId={assessmentId}
          isPdfMode={isPdfMode}
        />
      </div>
    </div>
  )
}

export default ResultDashboardReal
