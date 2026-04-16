import Link from 'next/link'
import { ArrowRight, BadgeIndianRupee, BrainCircuit, BriefcaseBusiness, CheckCircle2, LineChart, ShieldCheck, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import SarathiLogo from '@/components/sarathi-logo'

const steps = [
  {
    title: 'Take a comprehensive psychometric test',
    description: 'Answer 60 guided questions designed to deeply analyze your personality, aptitude, and career drivers.',
    icon: BrainCircuit,
  },
  {
    title: 'Unlock your result for ₹99',
    description: 'Securely process your ₹99 assessment fee to instantly generate your premium AI career insights.',
    icon: BadgeIndianRupee,
  },
  {
    title: 'Get your roadmap dashboard',
    description: 'See your top career matches, strengths, readiness score, and your personalized 5-year action plan.',
    icon: LineChart,
  },
]

const highlights = [
  'Built for India-first college and campus career journeys',
  'Frictionless assessment flow with instant roadmap generation',
  'Actionable dashboard instead of generic motivational advice',
]

const trustSignals = [
  { label: 'Career paths mapped', value: 'Dynamic' }, // Changed from 12+ since AI can map to hundreds
  { label: 'Minutes to finish', value: '15 min' }, // Changed from 4 min
  { label: 'Early unlock price', value: '₹99' },
]

const App = () => {
  return (
    <main className="bg-slate-50">
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(10,35,81,0.12),_transparent_55%)]" />
        <div className="container relative mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <nav className="mb-16 flex items-center justify-between rounded-full border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
            <Button asChild className="bg-[#0A2351] text-white hover:bg-[#16356d]">
              <Link href="/assessment">Take the Test</Link>
            </Button>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-[#0A2351]/10 bg-[#0A2351]/5 px-4 py-2 text-sm font-medium text-[#0A2351]">
                <Sparkles className="mr-2 h-4 w-4 text-[#F57D14]" />
                Made for Indian college students who want clarity, not confusion
              </div>

              <div className="space-y-5">
                <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-[#0A2351] sm:text-5xl lg:text-6xl">
                  Find Your True North with SARATHI
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                  Go from “I am not sure what fits me” to a clear shortlist of career directions, strengths, and next steps — all in one guided flow.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="bg-[#F57D14] text-white hover:bg-[#dd6f11]">
                  <Link href="/assessment">
                    Take the Test - ₹99
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-[#0A2351]/20 text-[#0A2351] hover:bg-[#0A2351]/5">
                  <Link href="/result?id=demo-locked">Preview Dashboard UX</Link>
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {trustSignals.map((item) => (
                  <Card key={item.label} className="border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-2xl font-bold text-[#0A2351]">{item.value}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="border-0 bg-[#0A2351] text-white shadow-2xl shadow-[#0A2351]/15">
              <CardContent className="space-y-6 p-6 sm:p-8">
                <div className="flex items-center justify-between rounded-2xl bg-white/10 p-4">
                  <div>
                    <p className="text-sm text-white/70">Student snapshot</p>
                    <p className="text-lg font-semibold">Clarity score improves with each step</p>
                  </div>
                  <ShieldCheck className="h-10 w-10 text-[#F57D14]" />
                </div>

                <div className="space-y-4 rounded-2xl bg-white p-5 text-slate-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Top match after unlock</p>
                      <p className="text-xl font-bold text-[#0A2351]">AI, Data & Software</p>
                    </div>
                    <div className="rounded-full bg-[#F57D14]/10 px-3 py-1 text-sm font-semibold text-[#F57D14]">92% fit</div>
                  </div>
                  <div className="grid gap-3">
                    {highlights.map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#F57D14]" />
                        <p className="text-sm text-slate-600">{item}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-dashed border-[#0A2351]/15 bg-[#0A2351]/[0.03] p-4 text-sm text-slate-600">
                    Your complete, interactive career dashboard and step-by-step personalized roadmap are unlocked instantly upon completing the assessment.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F57D14]">How it Works</p>
          <h2 className="mt-3 text-3xl font-bold text-[#0A2351] sm:text-4xl">A focused 3-step journey from uncertainty to direction</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            A seamless, guided journey from taking your initial assessment to unlocking deep career clarity.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card key={step.title} className="border-slate-200 bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0A2351]/5 text-[#0A2351]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#F57D14]">
                    <span>Step {index + 1}</span>
                    <span className="h-1 w-1 rounded-full bg-[#F57D14]" />
                    <span>SARATHI Flow</span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-[#0A2351]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="bg-[#0A2351] py-20 text-white">
        <div className="container mx-auto grid gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F57D14]">Why students choose SARATHI</p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">A trustworthy, modern experience built for first-career decisions</h2>
            <div className="mt-8 grid gap-4">
              {[
                {
                  icon: BriefcaseBusiness,
                  title: 'Career clarity over generic advice',
                  description: 'Instead of vague motivation, SARATHI translates your answers into role families and concrete next actions.',
                },
                {
                  icon: BrainCircuit,
                  title: 'Comprehensive assessment, strong insight',
                  description: 'The guided, one-question-at-a-time flow keeps students focused on mobile while producing a rich dashboard experience.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Built to feel premium from day one',
                  description: 'A seamless, secure platform designed to give students a world-class, professional career planning experience.',
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <Icon className="h-5 w-5 text-[#F57D14]" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/70">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <Card className="border-white/10 bg-white text-slate-900 shadow-2xl">
            <CardContent className="p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F57D14]">Ready to explore?</p>
             <h3 className="mt-3 text-2xl font-bold text-[#0A2351]">Start your SARATHI assessment in under 15 minutes</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                SARATHI uses advanced AI to analyze your psychometric profile and generate a highly personalized, actionable 5-year career roadmap.
              </p>
              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">What you unlock</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[#F57D14]" /> Top career matches with fit score</li>
                  <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[#F57D14]" /> Strength summary and readiness score</li>
                  <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[#F57D14]" /> Step-by-step 5-year action plan tailored to the Indian job market</li>
                </ul>
              </div>
              <Button asChild size="lg" className="mt-6 w-full bg-[#F57D14] text-white hover:bg-[#dd6f11]">
                <Link href="/assessment">Take the Test - ₹99</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}

export default App
