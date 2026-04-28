// app/page.js
'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BrainCircuit,
  LineChart,
  Users,
  Target,
  PhoneCall,
  Mail,
  ArrowRight,
  CheckCircle2,
  Star,
  GraduationCap,
  Sparkles,
  Zap,
  Award,
  Lock,
  TrendingUp,
  Loader2,
  CalendarDays // <-- Added for the Calendly button replacement
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const STATS = [
  { icon: CheckCircle2,  value: '60',       label: 'Psychometric Dimensions' }, // Updated
  { icon: Zap,           value: '15',       label: 'Minutes to Clarity' },      // Updated
  { icon: Target,        value: '10,000+',  label: 'Career Data Points' },      // Updated
]

const TESTIMONIALS = [
  {
    name: 'Rahul S.',
    college: 'Engineering Student', // Updated to generic for beta
    avatar: 'RS',
    quote:
      'I was torn between an MBA and starting a venture. The 5-year roadmap broke it down quarter by quarter and told me exactly what to do in the next 30 days. The ₹99 I paid felt like a steal.',
  },
  {
    name: 'Priya M.',
    college: 'Commerce Student', // Updated to generic for beta
    avatar: 'PM',
    quote:
      'The psychometric radar was unsettlingly accurate. It flagged my tendency to overthink before committing and recommended roles with structured decision-making. I avoided a wrong job offer because of it.',
  },
  {
    name: 'Neha T.',
    college: 'Engineering Student', // Updated to generic for beta
    avatar: 'NT',
    quote:
      'Within 15 minutes I had a clear Year 1 and Year 2 action plan. I had already landed two internship interviews at companies the report specifically recommended targeting.',
  },
]

const METHODOLOGY = [
  {
    icon: Target,
    title: 'Role-Level Precision',
    description:
      'We go beyond broad fields like Engineering or Business. SARATHI maps your profile to specific job titles, team cultures, and company archetypes so you apply smarter, not harder.',
    color: 'blue',
  },
  {
    icon: BrainCircuit,
    title: 'AI That Understands Context',
    description:
      'Our Gemini-powered engine does not just score you. It reasons about your trait combinations the way a seasoned career psychologist would, surfacing paths that generic tests miss entirely.',
    color: 'orange',
  },
  {
    icon: LineChart,
    title: 'A Plan, Not Just a Score',
    description:
      'Every report includes a year-by-year execution plan covering skills to build, certifications to pursue, communities to join, and milestones to hit — all the way to year five.',
    color: 'blue',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Take the Assessment',
    desc: 'Answer 60 reflective psychometric questions crafted around personality science, aptitude, motivation, and behavioural tendencies. No right or wrong answers, just honest ones.',
    icon: BrainCircuit,
  },
  {
    step: '02',
    title: 'AI Builds Your Profile',
    desc: 'Gemini AI analyses your responses across 60 dimensions including personality, motivations, cognitive style, and risk tolerance to build a unique psychometric fingerprint.',
    icon: Sparkles,
  },
  {
    step: '03',
    title: 'Receive Your 5-Year Roadmap',
    desc: 'Get a role-specific, year-by-year execution plan with skill benchmarks, certifications to pursue, and milestones to hit — mapped directly to the Indian job market.',
    icon: Target,
  },
]

const FAQS = [
  {
    q: 'Is my personal data secure?',
    a: 'Yes. We collect only the information needed to generate your report. All data is encrypted in transit and at rest using industry-standard protocols, and is never sold or shared with third parties.',
  },
  {
    q: 'How long does the assessment take?',
    a: 'Most students complete all 60 questions in 12 to 18 minutes. The questions are reflective and do not require any prior knowledge — just honest answers about yourself.',
  },
  {
    q: 'Do I have to pay before taking the test?',
    a: 'No. The assessment is completely free to take. You pay a one-time fee of ₹99 only at the end, to unlock and download your full personalised 5-Year PDF Roadmap.',
  },
  {
    q: 'How is SARATHI different from free tests like MBTI or 16Personalities?',
    a: 'Free personality tests tell you your type. SARATHI tells you what to do next. We combine 60 psychometric dimensions with real Indian career market data and AI reasoning to produce an actionable plan, not a label.',
  },
  {
    q: 'Can I retake the assessment?',
    a: 'Yes. We recommend revisiting every 6 to 12 months as your goals evolve. Each retake generates a fresh report accessible via your unique result link.',
  },
  {
    q: 'What format is the final report?',
    a: 'You receive an interactive web dashboard and a beautifully formatted PDF. The PDF is yours to keep, share with mentors, placement officers, or future employers.',
  },
]

const INSTITUTION_FEATURES = [
  'Cohort-level skill gap analytics by department and graduation year',
  'Predictive placement-readiness scoring updated in real time',
  'White-labeled portal with your institution branding',
  'TPO dashboard with exportable reports for industry partners',
]

// ─────────────────────────────────────────────
// CONTACT FORM COMPONENT
// ─────────────────────────────────────────────
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '', designation: '', institution: '', email: '', batchSize: '',
  })
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.institution) return
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[#F57D14] focus:outline-none focus:ring-1 focus:ring-[#F57D14] transition-all'

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-bold text-[#0A2351]">Request Received!</h3>
        <p className="mt-2 text-sm text-slate-500 max-w-xs">
          We will reach out to {formData.email} within one business day to schedule your demo.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Name *</label>
          <input
            type="text" required placeholder="Dr. Sharma"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Designation</label>
          <input
            type="text" placeholder="TPO / Principal / Dean"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Institution Name *</label>
        <input
          type="text" required placeholder="Full college or university name"
          value={formData.institution}
          onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Official Email *</label>
        <input
          type="email" required placeholder="director@yourcollege.edu.in"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Approximate Student Strength</label>
        <select
          value={formData.batchSize}
          onChange={(e) => setFormData({ ...formData, batchSize: e.target.value })}
          className={inputClass}
        >
          <option value="">Select batch size</option>
          <option>Under 500 students</option>
          <option>500 – 2,000 students</option>
          <option>2,000 – 5,000 students</option>
          <option>5,000+ students</option>
        </select>
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-500">Something went wrong. Please email us directly at admin@sarathiapp.in</p>
      )}

      <Button
        type="submit"
        disabled={status === 'loading'}
        className="mt-2 h-14 w-full rounded-full bg-[#F57D14] text-base font-bold text-white hover:bg-[#dd6f11] shadow-xl shadow-[#F57D14]/20 transition-all hover:scale-105 disabled:opacity-70"
      >
        {status === 'loading' ? (
          <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</>
        ) : (
          <>Book Campus Demo <ArrowRight className="ml-2 h-5 w-5" /></>
        )}
      </Button>
      <p className="text-center text-xs text-slate-400">
        No spam. We will only contact you regarding your demo request.
      </p>
    </form>
  )
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen bg-white antialiased">
      <main>

        {/* ── HERO ── */}
        <section id="home" className="relative overflow-hidden bg-[#0A2351] py-24 lg:py-32">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(#fff 1px, transparent 1px), linear-gradient(to right, #fff 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#F57D14] opacity-10 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-500 opacity-10 blur-[100px]" />

          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-16 lg:grid-cols-2">

              <div className="max-w-2xl">
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-blue-200 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-[#F57D14]" />
                  Gemini AI · 60 Psychometric Dimensions · Built for India
                </div>

                <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl xl:text-7xl">
                  Know Exactly Where{' '}
                  <span className="relative whitespace-nowrap text-[#F57D14]">
                    Your Career
                    <svg
                      className="absolute -bottom-2 left-0 w-full"
                      viewBox="0 0 300 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M2 9C60 3 150 1 298 9" stroke="#F57D14" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
                    </svg>
                  </span>{' '}
                  Is Headed
                </h1>

                <p className="mt-8 text-lg leading-relaxed text-white/70 sm:max-w-lg">
                  SARATHI is an AI-powered psychometric career platform built
                  specifically for Indian college students. In 15 minutes, we map
                  your personality, strengths, and motivations to a concrete
                  5-year roadmap complete with role matches, year-by-year milestones,
                  and the exact skills to build.
                </p>

                <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <Button
                    asChild
                    className="h-14 rounded-full bg-[#F57D14] px-8 text-base font-bold text-white shadow-2xl shadow-[#F57D14]/30 transition-all hover:scale-105 hover:bg-[#dd6f11]"
                  >
                    <Link href="/assessment">
                      Start Free Assessment
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  
                  <a
                    href="/sample-report.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1 text-sm font-semibold text-white/60 transition-colors hover:text-white"
                  >
                    <span className="underline underline-offset-4">View a sample report</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>

                <p className="mt-5 text-sm font-medium text-white/40">
                  Free to take &nbsp;·&nbsp; Full PDF Roadmap for{' '}
                  <span className="text-white/70">₹99</span>
                  &nbsp;·&nbsp; No subscription ever
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/10 pt-8">
                  {[
                    { icon: Lock,  text: 'Data Encrypted'     },
                    { icon: Zap,   text: '15-Minute Test'      },
                    { icon: Award, text: 'AI-Powered Insights' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-sm font-medium text-white/50">
                      <Icon className="h-4 w-4 text-[#F57D14]" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dashboard Preview */}
              <div className="relative mx-auto w-full max-w-md">
                <div className="absolute -top-4 -right-4 z-20 flex items-center gap-2 rounded-full bg-[#F57D14] px-4 py-2 text-xs font-bold text-white shadow-xl">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                  </span>
                  Live AI Analysis
                </div>

                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm">
                  <div className="border-b border-white/10 bg-white/5 px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-400/70" />
                      <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
                      <div className="h-3 w-3 rounded-full bg-green-400/70" />
                      <p className="ml-3 text-xs font-semibold text-white/40">sarathi-ai.in · Career Report</p>
                    </div>
                  </div>

                  <div className="space-y-4 p-6">
                    <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F57D14] text-sm font-extrabold text-white">
                        RV
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Rohan V.</p>
                        <p className="text-xs text-white/50">BITS Pilani · B.Tech CS</p>
                      </div>
                      <span className="ml-auto rounded-full bg-green-500/20 px-3 py-1 text-[10px] font-bold uppercase text-green-400">
                        Report Ready
                      </span>
                    </div>

                    <div className="rounded-2xl bg-white p-5">
                      <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Top Role Matches
                      </p>
                      <div className="space-y-4">
                        {[
                          { role: 'Technical Product Manager', pct: 93 },
                          { role: 'UX Research Lead',          pct: 88 },
                          { role: 'Data Analyst',              pct: 81 },
                        ].map(({ role, pct }) => (
                          <div key={role}>
                            <div className="mb-1 flex items-center justify-between">
                              <p className="text-xs font-semibold text-[#0A2351]">{role}</p>
                              <span className="text-xs font-extrabold text-[#F57D14]">{pct}%</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-[#F57D14]"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                      <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-[#F57D14]" />
                      <div>
                        <p className="text-xs font-bold text-white">Year 1 Priority Action</p>
                        <p className="mt-1 text-[11px] leading-relaxed text-white/60">
                          High analytical drive and systems thinking detected. Build a
                          public GitHub portfolio with 2 data projects before semester end.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SOCIAL PROOF BAR (Temporarily Hidden for Beta) ── */}
        {/*
        <section className="border-b border-slate-100 bg-white py-14">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <p className="mb-10 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
              Trusted by students from
            </p>
            <div className="flex flex-wrap items-center justify-center gap-10 opacity-40 grayscale">
              {COLLEGES.map((college) => (
                <span key={college} className="text-sm font-bold text-slate-700">{college}</span>
              ))}
            </div>
          </div>
        </section>
        */}

        {/* ── STATS (Updated for Beta) ── */}
        <section className="bg-slate-50 py-14">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:divide-x md:divide-slate-200">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="group flex flex-col items-center gap-2 pt-4 md:pt-0">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0A2351]/5 transition-colors group-hover:bg-[#0A2351]">
                    <Icon className="h-6 w-6 text-[#F57D14]" />
                  </div>
                  <p className="text-4xl font-extrabold text-[#0A2351]">{value}</p>
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="bg-white py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#F57D14]">How It Works</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#0A2351] sm:text-4xl">
                From Confusion to Clarity in 3 Steps
              </h2>
              <p className="mt-4 text-base text-slate-500">
                No counselor appointments. No vague advice. A personalized, AI-generated roadmap built around you.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }) => (
                <div key={step} className="relative rounded-3xl border border-slate-100 bg-slate-50 p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A2351] text-white">
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="text-5xl font-extrabold text-slate-100">{step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0A2351]">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── METHODOLOGY ── */}
        <section id="methodology" className="scroll-mt-24 bg-slate-50 py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#F57D14]">Our Methodology</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#0A2351] sm:text-4xl">
                The Science Behind Your Roadmap
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500">
                SARATHI combines validated psychometric frameworks — Big Five personality theory, Holland Codes,
                and Self-Determination Theory — with Gemini 2.5 Flash to generate insights no generic test can match.
              </p>
            </div>
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {METHODOLOGY.map(({ icon: Icon, title, description, color }) => (
                <div key={title} className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:-translate-y-1 hover:border-[#F57D14]/30 hover:shadow-xl">
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-300 ${
                    color === 'orange'
                      ? 'bg-[#F57D14]/10 text-[#F57D14] group-hover:bg-[#F57D14] group-hover:text-white'
                      : 'bg-[#0A2351]/5 text-[#0A2351] group-hover:bg-[#0A2351] group-hover:text-white'
                  }`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0A2351]">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS (Placeholder) ── */}
        <section id="about" className="scroll-mt-24 bg-[#0A2351] py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#F57D14]">Student Stories</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">What Students Are Saying</h2>
              <p className="mt-4 text-base text-white/50">Unfiltered feedback from students who found their direction with SARATHI.</p>
            </div>
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-[#F57D14]/40 hover:bg-white/10">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#F57D14] text-[#F57D14]" />
                    ))}
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-white/70 italic">{t.quote}</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F57D14] text-xs font-extrabold text-white">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{t.name}</p>
                      <p className="text-xs text-white/40">{t.college}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="bg-white py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#F57D14]">Pricing</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#0A2351] sm:text-4xl">Simple, Honest Pricing</h2>
              <p className="mt-4 text-base text-slate-500">Start for free. Pay only when you are ready for your full roadmap.</p>
            </div>

            <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
                <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Free</p>
                <p className="mt-4 text-5xl font-extrabold text-[#0A2351]">₹0</p>
                <p className="mt-2 text-sm text-slate-500">No credit card required</p>
                <ul className="mt-8 space-y-3">
                  {[
                    'Full 60-question psychometric assessment',
                    'Personality and interest breakdown',
                    'Top 3 career match preview',
                    'Basic strengths summary',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-slate-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="mt-10 h-12 w-full rounded-full border-slate-300 font-bold text-[#0A2351] hover:bg-slate-100">
                  <Link href="/assessment">Take the Free Test</Link>
                </Button>
              </div>

              <div className="relative rounded-3xl border-2 border-[#F57D14] bg-[#0A2351] p-8 shadow-2xl shadow-[#F57D14]/20">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#F57D14] px-5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white">
                  Most Popular
                </div>
                <p className="text-sm font-bold uppercase tracking-widest text-white/50">Full Roadmap</p>
                <p className="mt-4 text-5xl font-extrabold text-white">₹99</p>
                <p className="mt-2 text-sm text-white/50">One-time payment, yours forever</p>
                <ul className="mt-8 space-y-3">
                  {[
                    'Everything in Free',
                    'Full 5-year year-by-year action plan',
                    'Detailed role compatibility breakdown',
                    'Skills, certifications and community roadmap',
                    'Downloadable PDF report, keep forever',
                    'Interactive web dashboard',
                    'Blind spot and growth risk analysis',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-white/80">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#F57D14]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-10 h-12 w-full rounded-full bg-[#F57D14] font-bold text-white hover:bg-[#dd6f11] shadow-xl shadow-[#F57D14]/30 transition-all hover:scale-105">
                  <Link href="/assessment">
                    Get My Roadmap - ₹99 <ArrowRight className="ml-2 h-4 w-4" /> {/* Fixed Price Copy */}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOR INSTITUTIONS ── */}
        <section id="institutions" className="scroll-mt-24 bg-slate-50 py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="order-2 lg:order-1">
                <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#F57D14]">For Institutions</p>
                <h2 className="text-3xl font-extrabold tracking-tight text-[#0A2351] sm:text-4xl">Modernise Your Placement Cell</h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  SARATHI partners with forward-thinking universities to replace guesswork with data. Our bulk-assessment
                  platform gives TPOs real-time cohort intelligence to bridge the gap between student potential and
                  industry requirements — before placement season begins.
                </p>
                <ul className="mt-8 space-y-4">
                  {INSTITUTION_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm font-semibold text-[#0A2351]">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#F57D14]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-10 h-12 rounded-full bg-[#0A2351] px-8 font-bold text-white hover:bg-[#0d2d6b] transition-all hover:scale-105">
                  <Link href="#contact">
                    Request a Campus Demo <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="order-1 lg:order-2 relative overflow-hidden rounded-3xl bg-[#0A2351] shadow-2xl p-8 lg:h-[480px] flex flex-col items-center justify-center text-center border border-white/10">
                <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#F57D14]/20 blur-3xl pointer-events-none" />
                <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
                <Users className="mb-4 h-16 w-16 text-[#F57D14] relative z-10" />
                <div className="mb-3 inline-flex items-center rounded-full bg-[#F57D14]/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#F57D14] relative z-10">
                  Now in Beta
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Placement Intelligence Dashboard</h3>
                <p className="text-sm text-white/50 max-w-xs mb-8 relative z-10">
                  Real-time cohort analytics, skill gap heatmaps, and predictive placement scores — all in one TPO dashboard.
                </p>
                <Button asChild variant="outline" className="rounded-full bg-transparent text-white border-white/20 hover:bg-white hover:text-[#0A2351] transition-all relative z-10">
                  <Link href="#contact">Request Early Access</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-white py-20 lg:py-28">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#F57D14]">FAQ</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#0A2351] sm:text-4xl">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <details key={i} className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all hover:border-[#F57D14]/50 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                  <summary className="flex items-center justify-between font-bold text-[#0A2351] text-base">
                    {faq.q}
                    <span className="ml-4 shrink-0 transition-transform duration-300 group-open:rotate-180 text-[#F57D14]">
                      <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="scroll-mt-24 bg-[#0A2351] py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
              <div className="space-y-10">
                <div>
                  <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#F57D14]">Partner With Us</p>
                  <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                    Bring SARATHI to Your Campus
                  </h2>
                  <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70">
                    Join institutions across India that are transforming student outcomes with data. Schedule a 15-minute
                    demo to see how predictive placement intelligence can raise your placement records this season.
                  </p>
                </div>
                <div className="space-y-6 border-t border-white/10 pt-8">
                   {/* 🚀 FIX: Replaced direct phone number with a Demo link */}
                  <div className="flex items-center gap-4 group">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/5 group-hover:bg-[#F57D14] transition-colors">
                      <CalendarDays className="h-5 w-5 text-[#F57D14] group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-white/40">Enterprise Sales</p>
                      <a href="mailto:admin@sarathiapp.in" className="text-lg font-semibold text-white hover:text-[#F57D14] transition-colors">
                         Schedule a Demo
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/5 group-hover:bg-[#F57D14] transition-colors">
                      <Mail className="h-5 w-5 text-[#F57D14] group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-white/40">Partnerships</p>
                      <a href="mailto:admin@sarathiapp.in" className="text-lg font-semibold text-white hover:text-[#F57D14] transition-colors">
                        admin@sarathiapp.in
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-[#0A2351]">Request a Campus Preview</h3>
                <p className="mt-2 text-sm text-slate-500">Fill in your details and we will reach out within one business day.</p>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA (Updated Footer Text) ── */}
        <section className="bg-[#F57D14] py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
              Your career clarity is 15 minutes away.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/80">
              Join the first wave of Indian students mapping their future with SARATHI. The assessment is currently free.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild className="h-14 rounded-full bg-white px-10 text-base font-extrabold text-[#F57D14] shadow-2xl transition-all hover:scale-105 hover:bg-slate-100">
                <Link href="/assessment">
                  Start Free Assessment <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <a
                href="/sample-report.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-white/80 underline underline-offset-4 hover:text-white transition-colors"
              >
                View a sample report first
              </a>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
