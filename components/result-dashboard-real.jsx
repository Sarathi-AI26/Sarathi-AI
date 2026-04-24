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
  ResponsiveContainer, Tooltip,
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
// GLOBAL PDF STYLES — injected once at top of PDF render
// ─────────────────────────────────────────────
const PDF_GLOBAL_STYLES = `
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    box-sizing: border-box !important;
  }
  body {
    width: 100% !important;
    overflow: visible !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  @page {
    margin-bottom: 26mm !important;
  }
  .avoid-break {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    orphans: 3 !important;
    widows: 3 !important;
  }
  .force-break {
    page-break-before: always !important;
    break-before: page !important;
    display: block !important;
    height: 0 !important;
  }
  /* Kill all shadows — they cause canvas artifacts */
  * {
    box-shadow: none !important;
    text-shadow: none !important;
  }
  /* Suppress animated / absolute decorative blobs */
  .pdf-hide {
    display: none !important;
  }
  /* Ensure grids don't collapse */
  .pdf-grid-2 {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 12px !important;
  }
  /* Card base in PDF */
  .pdf-card {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    border-radius: 12px !important;
    overflow: visible !important;
  }
  /* Recharts SVG: ensure it doesn't collapse */
  .recharts-wrapper,
  .recharts-surface {
    overflow: visible !important;
  }
`

// ─────────────────────────────────────────────
// PDF FOOTER
// ─────────────────────────────────────────────
const PdfFooter = ({ studentName }) => (
  <div style={{
    marginTop: '32px',
    borderTop: '2px solid #F57D14',
    paddingTop: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <img
        src="/logo-horizontal.png"
        alt="SARATHI"
        style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
      />
    </div>
    <p style={{ fontSize: '9px', color: '#94a3b8', textAlign: 'center', margin: 0 }}>
      This report is personalised and confidential. Generated for {studentName}.
    </p>
    <p style={{ fontSize: '9px', color: '#94a3b8', margin: 0 }}>
      sarathi.careers
    </p>
  </div>
)

// ─────────────────────────────────────────────
// PDF HEADER
// ─────────────────────────────────────────────
const PdfHeader = ({ studentName, archetype, generatedDate }) => (
  <div
    className="avoid-break"
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      borderBottom: '2px solid #F57D14',
      marginBottom: '20px',
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <img
        src="/logo-horizontal.png"
        alt="SARATHI"
        style={{ height: '64px', width: 'auto', objectFit: 'contain' }}
      />
      <div style={{ height: '40px', width: '2px', backgroundColor: '#e2e8f0' }} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8', lineHeight: 1.3 }}>Empowering</span>
        <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8', lineHeight: 1.3 }}>Student Clarity</span>
      </div>
    </div>
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0A2351' }}>{studentName}</div>
      <div style={{ fontSize: '11px', color: '#F57D14', fontWeight: 700, marginTop: '3px' }}>{archetype}</div>
      <div style={{ fontSize: '9px', color: '#aaa', marginTop: '3px' }}>Generated {generatedDate}</div>
    </div>
  </div>
)

// ─────────────────────────────────────────────
// PROFILE BADGE
// ─────────────────────────────────────────────
const ProfileBadge = ({ radarScores, isPdfMode }) => {
  if (!radarScores) return null

  const dims = [
    { key: 'Personality',            label: 'Personality'  },
    { key: 'Aptitude',               label: 'Aptitude'     },
    { key: 'Motivation',             label: 'Motivation'   },
    { key: 'Career Interests',       label: 'Career Focus' },
    { key: 'Behavioural Tendencies', label: 'Behaviour'    },
  ]
    .map(d => ({ ...d, score: Number(radarScores[d.key]) || 0 }))
    .sort((a, b) => b.score - a.score)

  const top1    = dims[0]
  const top2    = dims[1]
  const overall = Math.round(dims.reduce((s, d) => s + d.score, 0) / dims.length)

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
      className="avoid-break pdf-card"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: isPdfMode ? 10 : 14,
        marginBottom: isPdfMode ? 16 : 28,
        alignItems: 'stretch',
        pageBreakInside: 'avoid',
        breakInside: 'avoid',
      }}
    >
      {/* Main badge */}
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
          width: isPdfMode ? 44 : 56,
          height: isPdfMode ? 44 : 56,
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
          <div style={{ fontSize: isPdfMode ? 9 : 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: tier.color, marginBottom: 3 }}>
            {tier.label}
          </div>
          <div style={{ fontSize: isPdfMode ? 15 : 20, fontWeight: 800, color: '#0A2351', lineHeight: 1.2 }}>
            Top {percentile}% {top1.label} Profile
          </div>
          <div style={{ fontSize: isPdfMode ? 11 : 13, color: '#64748b', marginTop: 3 }}>
            Stronger than {100 - percentile}% of students assessed
          </div>
        </div>
      </div>

      {/* Score pills */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isPdfMode ? 6 : 10,
        flex: '0 1 auto',
        minWidth: isPdfMode ? 140 : 160,
      }}>
        {[top1, top2, { label: 'Overall', score: overall }].map((d, i) => (
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
            <span style={{ fontSize: isPdfMode ? 11 : 12, fontWeight: 600, color: '#334155' }}>{d.label}</span>
            <span style={{ fontSize: isPdfMode ? 13 : 15, fontWeight: 800, color: i === 0 ? '#F57D14' : '#0A2351' }}>
              {d.score}
              <span style={{ fontSize: isPdfMode ? 9 : 10, fontWeight: 500, color: '#94a3b8' }}>/100</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// SECTION HEADING
// ─────────────────────────────────────────────
const SectionHeading = ({ icon: Icon, title, subtitle, isPdfMode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: isPdfMode ? '10px' : '24px' }}>
    <div style={{
      display: 'flex',
      width: '36px',
      height: '36px',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '10px',
      background: '#0A2351',
      flexShrink: 0,
    }}>
      <Icon style={{ width: '18px', height: '18px', color: '#F57D14', display: 'block' }} />
    </div>
    <div>
      <h2 style={{ fontWeight: 700, color: '#0A2351', margin: 0, fontSize: isPdfMode ? '15px' : '18px', lineHeight: 1.3 }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>{subtitle}</p>
      )}
    </div>
  </div>
)

// ─────────────────────────────────────────────
// LOADING VIEW
// ─────────────────────────────────────────────
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
        ? 'Our AI is reading all 60 of your answers. This takes about 30 seconds — please do not refresh.'
        : 'Fetching your results...'}
    </p>
    {analyzing && elapsed > 20 && (
      <div className="mt-6 max-w-md rounded-xl bg-amber-50 border border-amber-200 p-4 text-left">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800">Still working — retrying automatically...</p>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              Gemini AI is currently experiencing peak traffic. We are actively retrying. This can take up to 60 seconds. Please do not close the page.
            </p>
          </div>
        </div>
      </div>
    )}
    <div className="mt-8 flex items-center gap-2 text-[#F57D14] font-medium">
      <Loader2 className="h-4 w-4 animate-spin" />
      {analyzing && elapsed > 0 ? `Processing... (${elapsed}s)` : 'Processing...'}
    </div>
  </div>
)

// ─────────────────────────────────────────────
// IDENTITY STATEMENT
// ─────────────────────────────────────────────
const IdentityStatement = ({ statement, isPdfMode }) => (
  <div
    className="avoid-break pdf-card"
    style={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: isPdfMode ? '12px' : '16px',
      background: '#0A2351',
      padding: isPdfMode ? '18px 20px' : '32px',
      marginBottom: isPdfMode ? '14px' : '32px',
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    }}
  >
    {/* Decorative blob — hidden in PDF */}
    {!isPdfMode && (
      <div className="absolute top-4 left-6 opacity-10">
        <Quote className="h-16 w-16 text-[#F57D14]" />
      </div>
    )}
    <div style={{ position: 'relative', zIndex: 10 }}>
      <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#F57D14', marginBottom: '10px', margin: '0 0 10px 0' }}>
        Your Identity
      </p>
      <p style={{ fontWeight: 700, color: '#ffffff', lineHeight: 1.5, margin: 0, fontSize: isPdfMode ? '16px' : '24px' }}>
        {statement}
      </p>
    </div>
    {/* Decorative circle — hidden in PDF */}
    {!isPdfMode && (
      <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-[#F57D14]/10" />
    )}
  </div>
)

// ─────────────────────────────────────────────
// STRENGTH SIGNALS
// ─────────────────────────────────────────────
const StrengthSignals = ({ signals, isPdfMode }) => {
  if (!signals?.length) return null
  return (
    <div
      className="avoid-break"
      style={{ marginBottom: isPdfMode ? '14px' : '32px', pageBreakInside: 'avoid', breakInside: 'avoid' }}
    >
      <SectionHeading icon={Zap} title="Your Core Strengths" subtitle="What your scores say you're genuinely good at." isPdfMode={isPdfMode} />
      <div style={{
        display: 'grid',
        gridTemplateColumns: isPdfMode ? '1fr 1fr' : 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: isPdfMode ? '8px' : '12px',
      }}>
        {signals.map((signal, i) => {
          const Icon = ICON_MAP[signal.icon_hint] || Zap
          return (
            <div
              key={i}
              className="avoid-break pdf-card"
              style={{
                borderRadius: '12px',
                border: '1px solid #f1f5f9',
                background: '#ffffff',
                padding: isPdfMode ? '10px 12px' : '16px',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                pageBreakInside: 'avoid',
                breakInside: 'avoid',
              }}
            >
              <div style={{
                display: 'flex',
                width: '32px',
                height: '32px',
                flexShrink: 0,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                background: 'rgba(245,125,20,0.1)',
              }}>
                <Icon style={{ width: '14px', height: '14px', color: '#F57D14', display: 'block' }} />
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#0A2351', margin: '0 0 3px 0' }}>{signal.label}</p>
                <p style={{ fontSize: '11px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{signal.evidence}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// CAREER COMPATIBILITY CHART — pure CSS bars
// ─────────────────────────────────────────────
const CareerCompatibilityChart = ({ careers, isPdfMode }) => {
  if (!careers?.length) return null

  const data = careers.map((c, i) => ({
    name: c.career_title?.split(',')[0] || c.career_title,
    score: Math.min(100, Math.max(0, Number(c.compatibility_score) || 85)),
    color: i === 0 ? '#F57D14' : i === 1 ? '#0A2351' : '#94a3b8',
  }))

  return (
    <div
      className="avoid-break pdf-card"
      style={{ marginBottom: isPdfMode ? '14px' : '32px', pageBreakInside: 'avoid', breakInside: 'avoid' }}
    >
      <SectionHeading icon={Activity} title="Career Compatibility" subtitle="How well each career matches your psychometric profile." isPdfMode={isPdfMode} />
      <div style={{
        borderRadius: '12px',
        background: 'rgba(10,35,81,0.04)',
        padding: isPdfMode ? '12px' : '24px',
        border: '1px solid #f1f5f9',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px', paddingBottom: '8px' }}>
          {data.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '140px', flexShrink: 0, textAlign: 'right', paddingRight: '14px', fontSize: '11px', fontWeight: 600, color: '#0A2351', lineHeight: 1.3 }}>
                {item.name}
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', height: '26px', background: '#ffffff', borderRadius: '0 6px 6px 0', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                <div style={{ width: `${item.score}%`, height: '100%', backgroundColor: item.color, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#ffffff' }}>{item.score}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '12px', display: 'flex', gap: '16px', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
          {[['#F57D14','Best match'],['#0A2351','Strong match'],['#94a3b8','Good match']].map(([color, label]) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#94a3b8' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', backgroundColor: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// WHAT TO AVOID
// ─────────────────────────────────────────────
const WhatToAvoid = ({ items, isPdfMode }) => {
  if (!items?.length) return null
  return (
    <div
      className="avoid-break"
      style={{ marginBottom: isPdfMode ? '14px' : '32px', pageBreakInside: 'avoid', breakInside: 'avoid' }}
    >
      <SectionHeading icon={XCircle} title="What to Avoid" subtitle="Roles, environments, and habits that your profile says are a bad fit." isPdfMode={isPdfMode} />
      <div style={{
        display: 'grid',
        gridTemplateColumns: isPdfMode ? '1fr' : 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: isPdfMode ? '8px' : '12px',
      }}>
        {items.map((item, i) => (
          <div
            key={i}
            className="avoid-break pdf-card"
            style={{
              borderRadius: '12px',
              border: '1px solid #fee2e2',
              background: 'rgba(254,242,242,0.6)',
              padding: isPdfMode ? '10px 12px' : '16px',
              pageBreakInside: 'avoid',
              breakInside: 'avoid',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ display: 'flex', width: '26px', height: '26px', flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderRadius: '6px', background: '#fee2e2', marginTop: '1px' }}>
                <XCircle style={{ width: '13px', height: '13px', color: '#ef4444', display: 'block' }} />
              </div>
              <div>
                <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#f87171', margin: '0 0 3px 0' }}>{item.category}</p>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#991b1b', margin: '0 0 4px 0' }}>{item.warning}</p>
                <p style={{ fontSize: '11px', color: 'rgba(153,27,27,0.75)', margin: 0, lineHeight: 1.5 }}>{item.reason}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// STATIC RADAR CHART — used in PDF mode
// Bypasses Recharts/ResponsiveContainer entirely
// ─────────────────────────────────────────────
const StaticRadarChart = ({ data }) => {
  const size = 220
  const cx = size / 2
  const cy = size / 2
  const r  = 80
  const n  = data.length

  const angleOf = (i) => (Math.PI * 2 * i) / n - Math.PI / 2

  const gridLevels = [0.25, 0.5, 0.75, 1]

  const gridPolygon = (level) => {
    return data.map((_, i) => {
      const a = angleOf(i)
      return `${cx + r * level * Math.cos(a)},${cy + r * level * Math.sin(a)}`
    }).join(' ')
  }

  const dataPolygon = data.map((d, i) => {
    const a = angleOf(i)
    const v = (d.score || 0) / 100
    return `${cx + r * v * Math.cos(a)},${cy + r * v * Math.sin(a)}`
  }).join(' ')

  return (
    <svg width={size} height={size} style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}>
      {/* Grid */}
      {gridLevels.map((lvl, gi) => (
        <polygon key={gi} points={gridPolygon(lvl)} fill="none" stroke="#cbd5e1" strokeWidth="0.8" />
      ))}
      {/* Axes */}
      {data.map((d, i) => {
        const a = angleOf(i)
        return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="#cbd5e1" strokeWidth="0.8" />
      })}
      {/* Data shape */}
      <polygon points={dataPolygon} fill="rgba(245,125,20,0.3)" stroke="#F57D14" strokeWidth="2" />
      {/* Labels */}
      {data.map((d, i) => {
        const a = angleOf(i)
        const labelR = r + 18
        const x = cx + labelR * Math.cos(a)
        const y = cy + labelR * Math.sin(a)
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="600" fill="#475569">
            {d.subject}
          </text>
        )
      })}
      {/* Score dots */}
      {data.map((d, i) => {
        const a = angleOf(i)
        const v = (d.score || 0) / 100
        return <circle key={i} cx={cx + r * v * Math.cos(a)} cy={cy + r * v * Math.sin(a)} r="3" fill="#F57D14" />
      })}
    </svg>
  )
}

// ─────────────────────────────────────────────
// ROADMAP TIMELINE
// ─────────────────────────────────────────────
const RoadmapTimeline = ({ steps, isPdfMode }) => {
  const colors = ['#3b82f6', '#6366f1', '#F57D14', '#f59e0b', '#0A2351']
  return (
    <div style={{ position: isPdfMode ? 'static' : 'relative' }}>
      {!isPdfMode && (
        <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-[#F57D14] to-[#0A2351] opacity-30" />
      )}
      {steps.map((step, i) => {
        const Icon = step.icon
        return (
          <div
            key={i}
            className="avoid-break pdf-card"
            style={{
              display: 'flex',
              gap: '14px',
              marginBottom: isPdfMode ? '8px' : '20px',
              pageBreakInside: 'avoid',
              breakInside: 'avoid',
            }}
          >
            {!isPdfMode && (
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div
                  style={{ display: 'flex', width: '44px', height: '44px', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: colors[i], color: '#fff', position: 'relative', zIndex: 10 }}
                >
                  <Icon style={{ width: '20px', height: '20px' }} />
                </div>
              </div>
            )}
            <div style={{
              flex: 1,
              borderRadius: '12px',
              border: '1px solid #f1f5f9',
              background: '#ffffff',
              padding: isPdfMode ? '10px 14px' : '18px 20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                {isPdfMode && (
                  <div style={{ display: 'flex', width: '22px', height: '22px', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', backgroundColor: colors[i], flexShrink: 0 }}>
                    <Icon style={{ width: '11px', height: '11px', color: '#fff', display: 'block' }} />
                  </div>
                )}
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: colors[i] }}>
                    {step.label}
                  </span>
                  <p style={{ fontWeight: 700, color: '#0A2351', fontSize: '14px', margin: 0, lineHeight: 1.3 }}>{step.title}</p>
                </div>
              </div>
              <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#475569', margin: 0 }}>{step.data}</p>
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
  const profile         = analysis?.psychometric_profile || {}
  const roadmap         = analysis?.five_year_roadmap || {}
  const immediateAction = analysis?.immediate_action_plan || {}
  const executiveSummaryParagraphs = parseExecutiveSummary(analysis?.executive_summary)

  const rawScores = analysis?.radar_chart_scores || {}
    const chartData = [
    { subject: 'Personality', score: Number(rawScores['Personality'])            || 0, fullMark: 100 },
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

  const generatedDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  // Shared section wrapper style
  const sectionStyle = {
    marginBottom: isPdfMode ? '14px' : '32px',
    pageBreakInside: 'avoid',
    breakInside: 'avoid',
  }

  return (
    <div style={{ display: 'block' }}>

      {/* ── GLOBAL PDF STYLES ── */}
      {isPdfMode && (
        <style dangerouslySetInnerHTML={{ __html: PDF_GLOBAL_STYLES }} />
      )}

      {/* ── PDF HEADER ── */}
      {isPdfMode && (
        <PdfHeader
          studentName={studentName}
          archetype={analysis.user_archetype}
          generatedDate={generatedDate}
        />
      )}

      {/* ── WEB HERO ── */}
      {!isPdfMode && (
        <section className="avoid-break rounded-[2rem] bg-[#0A2351] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden mb-8">
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#F57D14]">
              <Sparkles className="h-3 w-3" /> Real-Time AI Analysis
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
              {studentName}, you are a{' '}
              <span className="text-[#F57D14]">{analysis.user_archetype}</span>
            </h1>
            <p className="mt-4 text-lg text-white/70 max-w-2xl">
              This roadmap was built from your 60 answers — every word of it is specific to you.
            </p>
          </div>
          {/* Decorative blob — web only */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl pdf-hide" />
        </section>
      )}

      {/* ── PDF HERO (compact) ── */}
      {isPdfMode && (
        <div
          className="avoid-break"
          style={{
            borderRadius: '12px',
            background: '#0A2351',
            padding: '16px 20px',
            marginBottom: '14px',
            pageBreakInside: 'avoid',
            breakInside: 'avoid',
          }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            borderRadius: '999px', background: 'rgba(255,255,255,0.1)',
            padding: '4px 10px', fontSize: '9px', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.12em',
            color: '#F57D14', marginBottom: '8px',
          }}>
            ✦ Real-Time AI Analysis
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '0 0 6px 0', lineHeight: 1.3 }}>
            {studentName}, you are a{' '}
            <span style={{ color: '#F57D14' }}>{analysis.user_archetype}</span>
          </h1>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', margin: 0 }}>
            This roadmap was built from your 60 answers — every word is specific to you.
          </p>
        </div>
      )}

      {/* ── IDENTITY STATEMENT ── */}
      {analysis.identity_statement && (
        <IdentityStatement statement={analysis.identity_statement} isPdfMode={isPdfMode} />
      )}

      {/* ── PROFILE BADGE ── */}
      <ProfileBadge radarScores={analysis.radar_chart_scores} isPdfMode={isPdfMode} />

      {/* ── PAGE BREAK 1: after hero / badge block ── */}
      {isPdfMode && <div className="force-break" />}

      {/* ── EXECUTIVE SUMMARY ── */}
      <div className="avoid-break pdf-card" style={sectionStyle}>
        <SectionHeading
          icon={BrainCircuit}
          title="Your Psychometric Summary"
          subtitle="What your 60 answers actually say about you."
          isPdfMode={isPdfMode}
        />
        <div style={{
          borderRadius: '12px',
          border: '1px solid #f1f5f9',
          background: '#ffffff',
          padding: isPdfMode ? '14px 16px' : '28px 32px',
        }}>
          {executiveSummaryParagraphs.map((para, i) => (
            <p key={i} style={{
              fontSize: isPdfMode ? '12px' : '16px',
              color: '#334155',
              lineHeight: 1.7,
              margin: i === 0 ? '0' : '12px 0 0 0',
              orphans: 3,
              widows: 3,
            }}>
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* ── STRENGTH SIGNALS ── */}
      <StrengthSignals signals={analysis.strength_signals} isPdfMode={isPdfMode} />

      {/* ── PAGE BREAK 2: before radar + DNA ── */}
      {isPdfMode && <div className="force-break" />}

      {/* ── RADAR + DNA (side-by-side in PDF) ── */}
      <div
        className="avoid-break"
        style={isPdfMode ? {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '14px',
          pageBreakInside: 'avoid',
          breakInside: 'avoid',
          alignItems: 'start',
        } : {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        {/* Psychometric Dimensions */}
        <div className="avoid-break pdf-card" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <SectionHeading icon={Activity} title="Psychometric Dimensions" isPdfMode={isPdfMode} />
          <div style={{
            borderRadius: '12px',
            background: 'rgba(10,35,81,0.04)',
            border: '1px solid #f1f5f9',
            padding: isPdfMode ? '10px' : '16px',
          }}>
            {/* PDF: static SVG radar. Web: Recharts */}
            {isPdfMode ? (
              <StaticRadarChart data={chartData} />
            ) : (
              <div style={{ height: '250px' }}>
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
            )}
            {/* Score pills */}
            <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {chartData.map(d => (
                <div key={d.subject} style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  borderRadius: '999px', background: '#ffffff',
                  border: '1px solid #f1f5f9',
                  padding: '3px 10px',
                }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#0A2351' }}>{d.subject}</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#F57D14' }}>{d.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Psychometric DNA */}
        <div className="avoid-break pdf-card" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <SectionHeading icon={Compass} title="Psychometric DNA" isPdfMode={isPdfMode} />
          <div style={{
            borderRadius: '12px',
            background: 'rgba(10,35,81,0.04)',
            border: '1px solid #f1f5f9',
            padding: isPdfMode ? '12px' : '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: isPdfMode ? '10px' : '16px',
          }}>
            {profile.dominant_personality_traits?.length > 0 && (
              <div>
                <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', margin: '0 0 6px 0' }}>
                  Dominant Traits
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {profile.dominant_personality_traits.map(trait => (
                    <span key={trait} style={{
                      borderRadius: '8px', background: '#ffffff',
                      padding: '4px 10px', fontSize: '10px', fontWeight: 700,
                      color: '#0A2351', border: '1px solid #f1f5f9',
                    }}>
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {profile.learning_style && (
              <div>
                <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', margin: '0 0 4px 0' }}>
                  How You Learn Best
                </p>
                <p style={{ fontSize: '11px', color: '#475569', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                  {profile.learning_style}
                </p>
              </div>
            )}
            {profile.work_environment_fit && (
              <div>
                <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', margin: '0 0 4px 0' }}>
                  Where You'll Thrive
                </p>
                <p style={{ fontSize: '11px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                  {profile.work_environment_fit}
                </p>
              </div>
            )}
            {profile.collaboration_style && (
              <div>
                <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', margin: '0 0 4px 0' }}>
                  How You Work With Others
                </p>
                <p style={{ fontSize: '11px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                  {profile.collaboration_style}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── PAGE BREAK 3: before career section ── */}
      {isPdfMode && <div className="force-break" />}

      {/* ── CAREER COMPATIBILITY CHART ── */}
      <CareerCompatibilityChart careers={analysis.top_career_matches} isPdfMode={isPdfMode} />

      {/* ── CAREER MATCH DETAIL CARDS ── */}
      <div className="avoid-break" style={sectionStyle}>
        <SectionHeading
          icon={Target}
          title="Your Career Matches — In Detail"
          subtitle="Each matched to your specific scores."
          isPdfMode={isPdfMode}
        />
        <div style={{
          display: isPdfMode ? 'flex' : 'grid',
          flexDirection: isPdfMode ? 'column' : undefined,
          gridTemplateColumns: isPdfMode ? undefined : 'repeat(3, 1fr)',
          gap: isPdfMode ? '10px' : '20px',
        }}>
          {(analysis.top_career_matches || []).map((match, i) => (
            <div
              key={i}
              className="avoid-break pdf-card"
              style={{
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                borderLeft: '4px solid #F57D14',
                background: '#ffffff',
                padding: isPdfMode ? '12px 14px' : '20px 24px',
                pageBreakInside: 'avoid',
                breakInside: 'avoid',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', margin: 0 }}>
                  Prime Match
                </p>
                {match.compatibility_score && (
                  <span style={{
                    fontSize: '10px', fontWeight: 800, color: '#F57D14',
                    background: 'rgba(245,125,20,0.1)', padding: '2px 8px', borderRadius: '999px',
                  }}>
                    {match.compatibility_score}% match
                  </span>
                )}
              </div>
              <h3 style={{ fontWeight: 700, color: '#0A2351', margin: '0 0 6px 0', fontSize: isPdfMode ? '14px' : '18px', lineHeight: 1.3 }}>
                {match.career_title}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 6px 0', lineHeight: 1.6, orphans: 3, widows: 3 }}>
                {match.match_reason || match.why_it_fits}
              </p>
              {match.growth_path && (
                <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 6px 0', fontStyle: 'italic' }}>
                  {match.growth_path}
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#0A2351', fontSize: '12px', marginBottom: '6px' }}>
                <BadgeIndianRupee style={{ width: '14px', height: '14px', color: '#F57D14', display: 'block' }} />
                {match.starting_salary_inr}
              </div>
              {match.key_certifications?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                  {match.key_certifications.map(cert => (
                    <span key={cert} style={{
                      borderRadius: '6px', background: 'rgba(10,35,81,0.05)',
                      padding: '2px 7px', fontSize: '9px', fontWeight: 700, color: '#0A2351',
                    }}>
                      {cert}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── PAGE BREAK 4: before avoid + warnings ── */}
      {isPdfMode && <div className="force-break" />}

      {/* ── WHAT TO AVOID ── */}
      <WhatToAvoid items={analysis.what_to_avoid} isPdfMode={isPdfMode} />

      {/* ── GROWTH WARNINGS ── */}
      {blindSpots.length > 0 && (
        <div className="avoid-break pdf-card" style={sectionStyle}>
          <SectionHeading
            icon={Lightbulb}
            title="Growth Warnings"
            subtitle="Things to watch out for as you build your career."
            isPdfMode={isPdfMode}
          />
          <div style={{
            borderRadius: '12px',
            border: '1px solid #fed7aa',
            background: 'rgba(255,247,237,0.7)',
            padding: isPdfMode ? '12px 14px' : '20px 24px',
          }}>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {blindSpots.map((spot, i) => (
                <li key={i} style={{ display: 'flex', gap: '10px', paddingBottom: '8px', borderBottom: i < blindSpots.length - 1 ? '1px solid rgba(251,191,36,0.2)' : 'none' }}>
                  <span style={{ flexShrink: 0, marginTop: '2px' }}>
                    {spot.isSevere
                      ? <AlertTriangle style={{ width: '14px', height: '14px', color: '#ef4444', display: 'block' }} />
                      : <span style={{ display: 'block', width: '6px', height: '6px', borderRadius: '50%', background: '#f97316', marginTop: '5px' }} />
                    }
                  </span>
                  <span style={{
                    fontSize: '12px',
                    lineHeight: 1.6,
                    color: spot.isSevere ? '#991b1b' : 'rgba(124,45,18,0.85)',
                    fontWeight: spot.isSevere ? 600 : 400,
                    orphans: 3,
                    widows: 3,
                  }}>
                    {spot.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ── ACTION PLAN ── */}
      {immediateAction?.next_30_days && (
        <div className="avoid-break pdf-card" style={sectionStyle}>
          <SectionHeading
            icon={Timer}
            title="Your Action Plan"
            subtitle="Start here. Right now. This week."
            isPdfMode={isPdfMode}
          />
          <div style={{
            borderRadius: '12px',
            background: isPdfMode ? '#0A5C44' : undefined,
            backgroundImage: isPdfMode ? undefined : 'linear-gradient(135deg, #059669, #0f766e)',
            padding: isPdfMode ? '14px 16px' : '24px 28px',
            color: '#ffffff',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', margin: '0 0 5px 0' }}>
                  This month — next 30 days
                </p>
                <p style={{ fontWeight: 700, color: '#ffffff', margin: 0, fontSize: isPdfMode ? '13px' : '16px', lineHeight: 1.5 }}>
                  {immediateAction.next_30_days}
                </p>
              </div>
              {immediateAction.next_90_days && (
                <div>
                  <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', margin: '0 0 5px 0' }}>
                    This quarter — next 90 days
                  </p>
                  <p style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.6 }}>
                    {immediateAction.next_90_days}
                  </p>
                </div>
              )}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '10px' }}>
                <p style={{ fontSize: '12px', color: '#ffffff', margin: 0, lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 700 }}>How you'll know it's done: </span>
                  {immediateAction.success_metric}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PAGE BREAK 5: before India/Abroad + Roadmap ── */}
      {isPdfMode && <div className="force-break" />}

      {/* ── INDIA VS ABROAD ── */}
      {analysis.india_vs_abroad_guidance && (
        <div className="avoid-break pdf-card" style={sectionStyle}>
          <SectionHeading
            icon={Globe}
            title="India vs Abroad — Your Path"
            subtitle="Based on what you told us in Question 60."
            isPdfMode={isPdfMode}
          />
          <div style={{
            borderRadius: '12px',
            border: '1px solid #bfdbfe',
            background: 'rgba(239,246,255,0.7)',
            padding: isPdfMode ? '12px 14px' : '20px 24px',
          }}>
            <p style={{ fontSize: '12px', lineHeight: 1.7, color: '#334155', margin: 0, orphans: 3, widows: 3 }}>
              {analysis.india_vs_abroad_guidance}
            </p>
          </div>
        </div>
      )}

      {/* ── 5-YEAR ROADMAP ── */}
      <div className="avoid-break" style={{ marginBottom: isPdfMode ? '14px' : '32px' }}>
        <SectionHeading
          icon={TrendingUp}
          title="Your 5-Year Roadmap"
          subtitle="Year by year — from where you are to where you want to be."
          isPdfMode={isPdfMode}
        />
        <RoadmapTimeline steps={roadmapSteps} isPdfMode={isPdfMode} />
      </div>

      {/* ── PDF FOOTER ── */}
      {isPdfMode && <PdfFooter studentName={studentName} />}

    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const ResultDashboardReal = ({ assessmentId, onReady }) => {
  const [loading,       setLoading]       = useState(true)
  const [analyzing,     setAnalyzing]     = useState(false)
  const [assessment,    setAssessment]    = useState(null)
  const [error,         setError]         = useState('')
  const [isPdfMode,     setIsPdfMode]     = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [elapsed,       setElapsed]       = useState(0)
  const [retryTrigger,  setRetryTrigger]  = useState(0)

  // Elapsed timer while analyzing
  useEffect(() => {
    let timer
    if (analyzing) {
      setElapsed(0)
      timer = setInterval(() => setElapsed(prev => prev + 1), 1000)
    } else {
      setElapsed(0)
    }
    return () => clearInterval(timer)
  }, [analyzing])

  // Load / generate report
  useEffect(() => {
    const load = async () => {
      if (!assessmentId) { setError('No assessment ID found.'); setLoading(false); return }
      setError('')
      try {
        const res  = await fetch(`/api/results/${assessmentId}`)
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
            body: JSON.stringify({ assessmentId }),
          })
          const d = await r.json()
          if (!r.ok) throw new Error(d?.error || 'Generation failed')
          setAssessment(d?.assessment)
          setAnalyzing(false); setLoading(false); return
        }

        window.location.href = `/checkout?assessmentId=${assessmentId}`

      } catch (err) {
        setError(err.message)
        setLoading(false)
        setAnalyzing(false)
      }
    }
    load()
  }, [assessmentId, retryTrigger])

  useEffect(() => {
    if (!loading && !analyzing && !error && assessment && onReady) onReady()
  }, [loading, analyzing, error, assessment, onReady])

  const studentName = useMemo(
    () => assessment?.users?.name || assessment?.user?.name || 'Student',
    [assessment]
  )

  // ── PDF DOWNLOAD ──
  const handleDownloadPdf = async () => {
    setIsDownloading(true)
    setIsPdfMode(true)

    // Give React time to re-render in PDF mode before capturing
    await new Promise(resolve => setTimeout(resolve, 2000))

    const html2pdf = (await import('html2pdf.js')).default
    const element  = document.getElementById('pdf-wrapper')

    const watermarkUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/icon.png`
      : '/icon.png'

    const watermarkImg = new Image()
    watermarkImg.crossOrigin = 'anonymous'
    watermarkImg.src = watermarkUrl

    await new Promise(resolve => {
      watermarkImg.onload  = resolve
      watermarkImg.onerror = () => { console.warn('Watermark failed to load'); resolve() }
    })

    const opt = {
      margin:      [14, 10, 20, 10],   // [top, left, bottom, right] in mm — extra bottom for footer
      filename:    `SARATHI_Roadmap_${studentName.replace(/\s+/g, '_')}.pdf`,
      image:       { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale:       2,
        useCORS:     true,
        scrollY:     0,
        windowWidth: 780,
        logging:     false,
        // Ensures backgrounds render correctly
        backgroundColor: '#ffffff',
      },
      jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:   { mode: ['css', 'legacy'], avoid: '.avoid-break' },
    }

    html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get('pdf')
      .then(pdf => {
        const totalPages = pdf.internal.getNumberOfPages()
        const pageWidth  = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const wmSize = 90
        const wmX = (pageWidth  - wmSize) / 2
        const wmY = (pageHeight - wmSize) / 2

        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i)

          // Watermark
          if (watermarkImg.complete && watermarkImg.naturalHeight !== 0) {
            pdf.setGState(new pdf.GState({ opacity: 0.04 }))
            pdf.addImage(watermarkImg, 'PNG', wmX, wmY, wmSize, wmSize)
            pdf.setGState(new pdf.GState({ opacity: 1.0 }))
          }

          // Footer bar
          pdf.setDrawColor(245, 125, 20)
          pdf.setLineWidth(0.4)
          pdf.line(10, pageHeight - 12, pageWidth - 10, pageHeight - 12)

          // Footer text
          pdf.setFontSize(7)
          pdf.setTextColor(180)
          pdf.text(
            `SARATHI Career Roadmap  |  ${studentName}  |  Page ${i} of ${totalPages}  |  Personalised & Confidential`,
            pageWidth / 2,
            pageHeight - 7,
            { align: 'center' }
          )
        }
      })
      .save()
      .then(() => {
        setIsPdfMode(false)
        setIsDownloading(false)
      })
  }

  // ── STATES ──
  if (loading || analyzing) return <LoadingView analyzing={analyzing} elapsed={elapsed} />

  if (error) {
    const isGenerationError =
      error.toLowerCase().includes('503')        ||
      error.toLowerCase().includes('failed')     ||
      error.toLowerCase().includes('ai')         ||
      error.toLowerCase().includes('generation') ||
      error.toLowerCase().includes('demand')     ||
      error.toLowerCase().includes('retrying')

    return (
      <div className="container mx-auto py-20 text-center">
        <Card className="mx-auto max-w-md border-red-100 bg-red-50 p-8 shadow-sm">
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <p className="font-bold text-red-700 text-lg mb-2">Oops! Something went wrong.</p>
          <p className="text-sm text-red-600/80 mb-6">{error}</p>
          {isGenerationError ? (
            <Button
              onClick={() => { setLoading(true); setRetryTrigger(prev => prev + 1) }}
              className="w-full bg-[#0A2351] hover:bg-[#F57D14] text-white font-bold h-12"
            >
              Try Again (Your answers are saved)
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
    <main className={isPdfMode ? 'h-max bg-white' : 'min-h-screen bg-slate-50 py-8'}>

      {/* Download button — web only */}
      {!isPdfMode && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex justify-end">
          <Button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="bg-[#0A2351] hover:bg-[#F57D14] text-white font-bold transition-colors"
          >
            {isDownloading
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating PDF...</>
              : 'Download Career Roadmap PDF'
            }
          </Button>
        </div>
      )}

      {/* PDF wrapper — fixed width for html2pdf canvas capture */}
      <div
        id="pdf-wrapper"
        style={isPdfMode ? {
          width: '780px',
          maxWidth: '780px',
          margin: '0 auto',
          padding: '0 16px 40px 16px',
          background: '#ffffff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        } : undefined}
        className={isPdfMode ? '' : 'container mx-auto px-4 sm:px-6 lg:px-8'}
      >
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


