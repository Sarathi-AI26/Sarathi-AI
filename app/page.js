import Link from 'next/link';
import { 
  BrainCircuit, 
  LineChart, 
  Users, 
  Target, 
  ShieldCheck, 
  PhoneCall, 
  Mail, 
  MapPin, 
  ArrowRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/header';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* GLOBAL HEADER */}
      <Header />

      <main>
        {/* 🚀 HERO SECTION (Matches your "True North" design) */}
        <section className="relative overflow-hidden bg-white pt-20 pb-24 sm:pt-32 sm:pb-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div className="max-w-2xl">
                <div className="mb-6 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
                  <Sparkles className="mr-2 h-4 w-4 text-[#F57D14]" />
                  Made for Indian college students who want clarity, not confusion
                </div>
                <h1 className="text-5xl font-extrabold tracking-tight text-[#0A2351] sm:text-6xl xl:text-7xl">
                  Find Your <br className="hidden lg:block"/> True North
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-600 sm:max-w-md lg:max-w-none">
                  Stop guessing about your career. Take the 15-minute AI-powered psychometric assessment and get a personalized 5-year roadmap to success.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Button asChild className="h-14 rounded-full bg-[#0A2351] px-8 text-base font-bold text-white hover:bg-[#0A2351]/90 shadow-xl shadow-[#0A2351]/20">
                    <Link href="/assessment">Take the Test <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                </div>
              </div>

              {/* HERO VISUAL (Placeholder mimicking your UI card) */}
              <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                <div className="rounded-3xl bg-[#0A2351] p-8 shadow-2xl">
                  <div className="mb-6 rounded-2xl bg-white/10 p-6 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white/60">Student snapshot</p>
                      <ShieldCheck className="h-6 w-6 text-[#F57D14]" />
                    </div>
                    <p className="mt-2 text-xl font-bold text-white">Clarity score improves with each step</p>
                  </div>
                  <div className="space-y-4 rounded-2xl bg-white p-6 shadow-inner">
                    <p className="text-sm font-medium text-slate-500">Top match after unlock</p>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <p className="font-bold text-[#0A2351]">Technical Product Manager</p>
                      <span className="rounded-full bg-[#F57D14]/10 px-3 py-1 text-xs font-bold text-[#F57D14]">93% fit</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <p className="font-bold text-[#0A2351]">UX Research Lead</p>
                      <span className="rounded-full bg-[#F57D14]/10 px-3 py-1 text-xs font-bold text-[#F57D14]">88% fit</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🧬 METHODOLOGY SECTION */}
        <section id="methodology" className="bg-slate-50 py-24 sm:py-32 border-t border-slate-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-[#0A2351] sm:text-4xl">The Science Behind the Roadmap</h2>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
                SARATHI goes beyond traditional, outdated career counseling. We map intrinsic student traits to high-growth Indian career trajectories by combining proven psychometric frameworks with advanced Gemini AI processing to deliver pinpoint, actionable accuracy.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#0A2351]/5 text-[#0A2351]">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-[#0A2351]">60-Point Psychometric Evaluation</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  A comprehensive analysis across 6 core pillars: Personality, Interests, Aptitude, Motivation, Behavior, and Open Reflection. We capture the complete student profile.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F57D14]/10 text-[#F57D14]">
                  <BrainCircuit className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-[#0A2351]">Gemini 2.5 Pro AI Engine</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Our engine analyzes complex response patterns instantly, removing human bias and intelligently matching students to the rapidly evolving tech and business job markets.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#0A2351]/5 text-[#0A2351]">
                  <LineChart className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-[#0A2351]">Actionable Career Mapping</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Students don't just get a static score. They receive a dynamic, 4-quarter strategic plan to build crucial skills, network effectively, and secure premium placements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🏢 FOR INSTITUTIONS SECTION */}
        <section id="institutions" className="bg-white py-24 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="mb-4 inline-flex items-center rounded-full border border-[#0A2351]/10 bg-[#0A2351]/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0A2351]">
                  B2B Enterprise
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-[#0A2351] sm:text-4xl">Empowering College Placement Cells</h2>
                <p className="mt-6 text-base leading-relaxed text-slate-600">
                  Transform how your institution handles career counseling. SARATHI partners directly with universities to deploy bulk assessments, giving TPOs (Training & Placement Officers) macro-level insights into their student body.
                </p>
                <ul className="mt-8 space-y-4">
                  {['Cohort-level career analytics dashboard', 'Identify skill gaps before placement season', 'White-labeled portal for your university'].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm font-medium text-[#0A2351]">
                      <CheckCircle2 className="h-5 w-5 text-[#F57D14]" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#0A2351] shadow-2xl lg:aspect-auto lg:h-[500px]">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center border border-white/10 m-4 rounded-2xl bg-white/5 backdrop-blur-sm">
                  <Users className="mb-6 h-16 w-16 text-[#F57D14]" />
                  <h3 className="text-2xl font-bold text-white">Institutional Dashboard</h3>
                  <p className="mt-2 text-sm text-white/70">Coming soon in SARATHI Enterprise</p>
                </div>
                <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#F57D14]/20 blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* 🤝 CONTACT SECTION */}
        <section id="contact" className="bg-[#0A2351] py-24 text-white sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
              
              <div className="space-y-10">
                <div>
                  <div className="mb-4 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#F57D14]">
                    Institutional Partnerships
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    Bring SARATHI to <br className="hidden sm:block" /> Your Campus
                  </h2>
                  <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80">
                    Equip your students with AI-driven clarity. Schedule a 15-minute campus demo to see how our psychometric engine can transform your placement records.
                  </p>
                </div>

                <div className="space-y-6 border-t border-white/10 pt-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/5">
                      <PhoneCall className="h-5 w-5 text-[#F57D14]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/60">Direct Sales Line</p>
                      <p className="text-lg font-semibold">+91 8920857008</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/5">
                      <Mail className="h-5 w-5 text-[#F57D14]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/60">Partnership Inquiries</p>
                      <p className="text-lg font-semibold">partners@sarathi-ai.in</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/5">
                      <MapPin className="h-5 w-5 text-[#F57D14]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/60">Headquarters</p>
                      <p className="text-lg font-semibold">Lucknow, Uttar Pradesh</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* B2B Demo Form */}
              <div className="rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
                <h3 className="text-2xl font-bold text-[#0A2351]">Request a Campus Demo</h3>
                <p className="mt-2 text-sm text-slate-500">Fill out the details below and our team will reach out within 24 hours.</p>

                <form className="mt-8 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Dr. Sharma" 
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-[#0A2351] focus:border-[#F57D14] focus:outline-none focus:ring-1 focus:ring-[#F57D14]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Designation</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Principal / TPO" 
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-[#0A2351] focus:border-[#F57D14] focus:outline-none focus:ring-1 focus:ring-[#F57D14]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">College / Institution Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter full institution name" 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-[#0A2351] focus:border-[#F57D14] focus:outline-none focus:ring-1 focus:ring-[#F57D14]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Contact Number</label>
                    <input 
                      type="tel" 
                      placeholder="+91" 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-[#0A2351] focus:border-[#F57D14] focus:outline-none focus:ring-1 focus:ring-[#F57D14]"
                    />
                  </div>

                  <Button type="button" className="mt-4 h-12 w-full rounded-xl bg-[#F57D14] text-base font-bold text-white hover:bg-[#dd6f11] shadow-lg shadow-[#F57D14]/20">
                    Schedule Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>

            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
