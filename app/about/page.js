// app/about/page.js
import Link from 'next/link';
import { 
  BrainCircuit, 
  Target, 
  ShieldCheck, 
  Sparkles,
  LineChart,
  Users,
  ArrowRight,
  Rocket,
  Award,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'About SARATHI | Our Vision & Mission',
  description: 'Learn how SARATHI is bridging the gap between potential and placement for Indian college students using AI and psychometrics.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        
        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-[#0A2351] pt-12 pb-20 lg:pt-20 lg:pb-24">
          <div className="absolute inset-0">
            <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#F57D14]/20 blur-[100px]" />
            <div className="absolute top-40 -left-40 h-[400px] w-[400px] rounded-full bg-white/5 blur-[100px]" />
          </div>
          <div className="container relative z-10 mx-auto px-4 text-center sm:px-6 lg:px-8">
            <div className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-widest text-[#F57D14] border border-white/10 backdrop-blur-sm">
              Our Story
            </div>
            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl xl:text-7xl">
              Most students don’t fail because they lack talent.<br className="hidden sm:block" />
              <span className="text-[#F57D14]">They fail because they choose the wrong path.</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed text-white/80">
              Bridging the gap between potential and placement.
            </p>
            
            {/* Hero CTA */}
            <div className="mt-10 flex flex-col items-center justify-center">
              <Button
                asChild
                className="h-14 rounded-full bg-[#F57D14] px-10 text-lg font-bold text-white hover:bg-[#dd6f11] shadow-lg shadow-[#F57D14]/20 transition-transform hover:scale-105"
              >
                <Link href="/assessment">
                  Start Career Test <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="mt-4 text-sm font-medium text-white/70">Takes 15 minutes • No signup required</p>
            </div>
          </div>
        </section>

        {/* ── THE PROBLEM & SOLUTION ── */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-[#0A2351] sm:text-4xl">
                    The current career system is broken.
                  </h2>
                  <ul className="mt-6 space-y-4 text-lg text-slate-600">
                    <li className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F57D14]" /> 
                      Students choose careers based on guesswork
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F57D14]" /> 
                      Outdated tests don’t match real jobs
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F57D14]" /> 
                      Advice is generic, not personalized
                    </li>
                  </ul>
                  
                  <div className="mt-8 rounded-2xl bg-red-50 p-5 border border-red-100">
                    <p className="flex items-start gap-3 text-lg font-bold leading-relaxed text-[#0A2351]">
                      <AlertTriangle className="h-6 w-6 shrink-0 text-red-500" />
                      This leads to years of confusion, wrong choices, and wasted potential.
                    </p>
                  </div>

                  <p className="mt-6 text-lg leading-relaxed text-slate-600">
                    We knew there had to be a better, more scientific way.{' '}
                    <strong className="text-[#0A2351]">SARATHI</strong> (Student Assessment Roadmap Application for Transformation & Holistic Improvement) was born to map your intrinsic traits directly to high-growth career trajectories with pinpoint accuracy.
                  </p>
                </div>
                
                {/* ── STATS ── */}
                <div className="border-t border-slate-100 pt-8">
                  <div className="grid grid-cols-3 gap-4 sm:gap-8">
                    <div>
                      <h4 className="text-3xl sm:text-4xl font-extrabold text-[#F57D14]">15</h4>
                      <p className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">Minutes to Clarity</p>
                    </div>
                    <div>
                      <h4 className="text-3xl sm:text-4xl font-extrabold text-[#F57D14]">60</h4>
                      <p className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">Psychometric Dimensions</p>
                    </div>
                    <div>
                      <h4 className="text-3xl sm:text-4xl font-extrabold text-[#F57D14]">10k+</h4>
                      <p className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">Career Data Points</p>
                    </div>
                  </div>
                  <p className="mt-6 text-sm font-medium italic text-slate-500 text-center sm:text-left">
                    Backed by real career data, not assumptions
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-slate-50" />
                <div className="relative rounded-3xl bg-white p-8 shadow-2xl sm:p-10 border border-slate-100">
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0A2351] text-white shadow-lg shadow-[#0A2351]/20">
                    <Rocket className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0A2351]">The SARATHI Advantage</h3>
                  <ul className="mt-6 space-y-6">
                    <li className="flex gap-4">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F57D14]/20 text-[#F57D14]">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#0A2351]">Bias-Free Analysis</h4>
                        <p className="mt-1 text-sm text-slate-600">
                          No opinions. Pure data-driven career fit.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F57D14]/20 text-[#F57D14]">
                        <LineChart className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#0A2351]">Actionable Roadmaps</h4>
                        <p className="mt-1 text-sm text-slate-600">
                          Not suggestions. A step-by-step execution plan.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F57D14]/20 text-[#F57D14]">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#0A2351]">Built for India</h4>
                        <p className="mt-1 text-sm text-slate-600">
                          Mapped to real Indian job market demands.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MID-PAGE CTA ── */}
        <section className="bg-slate-50 py-16 lg:py-20">
          <div className="container mx-auto px-4 text-center">
             <h2 className="text-3xl font-extrabold text-[#0A2351] sm:text-4xl">Confused about your career path?</h2>
             <p className="mt-4 text-lg text-slate-600">Stop guessing. Get clarity in 15 minutes.</p>
             <div className="mt-8 flex flex-col items-center justify-center">
                <Button
                  asChild
                  className="h-14 rounded-full bg-[#F57D14] px-10 text-lg font-bold text-white hover:bg-[#dd6f11] shadow-lg shadow-[#F57D14]/20 transition-transform hover:scale-105"
                >
                  <Link href="/assessment">
                    Start Career Test <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <p className="mt-4 text-sm font-medium text-slate-500">Takes 15 minutes • No signup required</p>
             </div>
          </div>
        </section>

        {/* ── CORE VALUES GRID ── */}
        <section className="bg-white py-16 lg:py-20 border-t border-slate-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-[#0A2351] sm:text-4xl">Our Core DNA</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                The principles that drive every algorithm we write and every student we help.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Target,      title: 'No More Confusion',   desc: 'Cutting through the noise to help students find their true north.',                                   color: 'bg-blue-600'    },
                { icon: Sparkles,    title: 'AI That Understands You', desc: 'Leveraging Gemini to process complex psychometric data in real-time.',                          color: 'bg-[#F57D14]'  },
                { icon: BrainCircuit,title: 'Backed by Real Science',  desc: 'Built on proven psychological frameworks including Big Five, Holland Codes, and SDT.', color: 'bg-indigo-600' },
                { icon: Award,       title: 'Built for Your Future',   desc: 'Empowering the individual above all else, keeping data encrypted and never shared.',                      color: 'bg-emerald-600' },
              ].map((value, i) => (
                <div key={i} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-md ${value.color}`}>
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-[#0A2351]">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-16 lg:py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-4xl rounded-[3rem] bg-[#0A2351] p-10 text-center shadow-2xl sm:p-16 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#F57D14]/20 blur-[80px]" />
              <h2 className="text-3xl font-extrabold text-white sm:text-5xl">
                Ready to find your <span className="text-[#F57D14]">True North?</span>
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
                Stop guessing about your future. Take the 15-minute AI-powered psychometric assessment and get your personalised roadmap today.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center">
                <Button
                  asChild
                  className="h-14 rounded-full bg-[#F57D14] px-10 text-lg font-bold text-white hover:bg-[#dd6f11] shadow-lg shadow-[#F57D14]/20 transition-transform hover:scale-105"
                >
                  <Link href="/assessment">
                    Start Career Test <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <div className="mt-4 flex flex-col items-center gap-1 text-sm font-medium text-white/70">
                   <span>Takes 15 minutes • No signup required</span>
                   <span>Free to start • Full roadmap ₹99</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
