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
  Award
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
        
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#0A2351] pt-16 pb-20 sm:pt-24 sm:pb-24">
          <div className="absolute inset-0">
            <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#F57D14]/20 blur-[100px]" />
            <div className="absolute top-40 -left-40 h-[400px] w-[400px] rounded-full bg-white/5 blur-[100px]" />
          </div>
          <div className="container relative z-10 mx-auto px-4 text-center sm:px-6 lg:px-8">
            <div className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-widest text-[#F57D14] border border-white/10 backdrop-blur-sm">
              Our Story
            </div>
            <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl xl:text-7xl">
              Bridging the gap between{' '}
              <span className="text-[#F57D14]">potential</span> and{' '}
              <span className="text-[#F57D14]">placement.</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/80">
              We are on a mission to eliminate career confusion for millions of Indian college students by combining deep psychological science with cutting-edge AI.
            </p>
          </div>
        </section>

        {/* THE PROBLEM & SOLUTION */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-[#0A2351] sm:text-4xl">
                    The old way of career counseling is broken.
                  </h2>
                  <p className="mt-6 text-lg leading-relaxed text-slate-600">
                    Every year, millions of Indian students graduate with degrees, but without direction. Traditional career counseling relies on outdated personality tests, subjective human opinions, and generic advice that does not account for the rapidly changing job market.
                  </p>
                  <p className="mt-4 text-lg leading-relaxed text-slate-600">
                    We knew there had to be a better, more scientific way.{' '}
                    <strong className="text-[#0A2351]">SARATHI</strong> (Student Assessment Roadmap Application for Transformation & Holistic Improvement) was born from a simple idea: what if we could map a student's intrinsic traits directly to high-growth career trajectories with pinpoint accuracy?
                  </p>
                </div>
                
                {/* ── STATS (Updated for Beta) ── */}
                <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-8">
                  <div>
                    <h4 className="text-4xl font-extrabold text-[#F57D14]">15</h4>
                    <p className="mt-2 text-sm font-bold uppercase tracking-wider text-slate-500">
                      Minutes to Clarity
                    </p>
                  </div>
                  <div>
                    <h4 className="text-4xl font-extrabold text-[#F57D14]">60</h4>
                    <p className="mt-2 text-sm font-bold uppercase tracking-wider text-slate-500">
                      Psychometric Dimensions
                    </p>
                  </div>
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
                          AI does not judge. It purely analyses 60 psychological data points to find your true fit.
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
                          We do not just give you a label. We give you a year-by-year execution plan.
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
                          Our engine is specifically trained on the nuances of the Indian tech and corporate job market.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE VALUES GRID */}
        <section className="bg-slate-50 py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-[#0A2351] sm:text-4xl">Our Core DNA</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                The principles that drive every algorithm we write and every student we help.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Target,      title: 'Absolute Clarity',   desc: 'Cutting through the noise to help students find their true north.',                                     color: 'bg-blue-600'    },
                { icon: Sparkles,    title: 'AI Innovation',      desc: 'Leveraging Gemini 2.5 Flash to process complex psychometric data in real-time.',                         color: 'bg-[#F57D14]'  },
                { icon: BrainCircuit,title: 'Scientific Rigor',   desc: 'Built on proven psychological frameworks including Big Five, Holland Codes, and Self-Determination Theory.', color: 'bg-indigo-600' },
                { icon: Award,       title: 'Student First',      desc: 'Empowering the individual above all else, keeping data encrypted and never shared.',                      color: 'bg-emerald-600' },
              ].map((value, i) => (
                <div key={i} className="rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:shadow-xl hover:-translate-y-1">
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

        {/* CTA */}
        <section className="py-12 sm:py-16 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-4xl rounded-[3rem] bg-[#0A2351] p-10 text-center shadow-2xl sm:p-16 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#F57D14]/20 blur-[80px]" />
              <h2 className="text-3xl font-extrabold text-white sm:text-5xl">
                Ready to find your <span className="text-[#F57D14]">True North?</span>
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
                Stop guessing about your future. Take the 15-minute AI-powered psychometric assessment and get your personalised roadmap today.
              </p>
              <div className="mt-10 flex justify-center">
                <Button
                  asChild
                  className="h-14 rounded-full bg-[#F57D14] px-10 text-lg font-bold text-white hover:bg-[#dd6f11] shadow-lg shadow-[#F57D14]/20 transition-transform hover:scale-105"
                >
                  <Link href="/assessment">
                    Start the Assessment <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
