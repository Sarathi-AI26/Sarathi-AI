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
  CheckCircle2,
  Star,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* 🚀 HERO SECTION */}
        <section id="home" className="relative overflow-hidden bg-white py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div className="max-w-2xl">
                <div className="mb-6 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
                  <BrainCircuit className="mr-2 h-4 w-4 text-[#F57D14]" />
                  Powered by AI trained on 15,000+ career trajectories
                </div>
                <h1 className="text-5xl font-extrabold tracking-tight text-[#0A2351] sm:text-6xl xl:text-7xl">
                  Find Your <br className="hidden lg:block"/> True North
                </h1>
                <p className="mt-4 text-lg leading-8 text-slate-600 sm:max-w-md lg:max-w-none">
                  Stop guessing. Use the science of psychometrics and the power of Gemini AI to map your intrinsic traits to a personalized 5-year roadmap for career success.
                </p>
                <div className="mt-10 flex flex-col items-start gap-3">
                  <Button asChild className="h-14 rounded-full bg-[#0A2351] px-8 text-base font-bold text-white hover:bg-[#0A2351]/90 shadow-xl shadow-[#0A2351]/20 transition-all hover:scale-105">
                    <Link href="/assessment">Take the Test <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                  <p className="text-sm font-medium text-slate-500 ml-2">
                    Take the test for free. Full 5-Year PDF Roadmap for just ₹99.
                  </p>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                <div className="rounded-[32px] bg-[#0A2351] p-6 sm:p-8 shadow-2xl ring-1 ring-white/10">
                  <div className="mb-6 rounded-2xl bg-white/10 p-5 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">Predictive Insights</p>
                      <ShieldCheck className="h-5 w-5 text-[#F57D14]" />
                    </div>
                    <p className="mt-3 text-lg font-bold text-white">Clarity score improves with each step</p>
                  </div>

                  <div className="rounded-2xl bg-white p-6 shadow-inner">
                    <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Industry Alignment Match</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                        <p className="text-sm font-bold text-[#0A2351]">Technical Product Manager</p>
                        <span className="rounded-full bg-[#F57D14]/10 px-3 py-1 text-[10px] font-extrabold uppercase text-[#F57D14] whitespace-nowrap">
                          93% Compatibility
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <p className="text-sm font-bold text-[#0A2351]">UX Research Lead</p>
                        <span className="rounded-full bg-[#F57D14]/10 px-3 py-1 text-[10px] font-extrabold uppercase text-[#F57D14] whitespace-nowrap">
                          88% Compatibility
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="bg-[#0A2351] py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="pt-4 md:pt-0">
              <div className="flex justify-center mb-2"><Users className="text-[#F57D14] h-6 w-6" /></div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-blue-200 text-sm mt-1">Students Guided</p>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="flex justify-center mb-2"><GraduationCap className="text-[#F57D14] h-6 w-6" /></div>
              <p className="text-3xl font-bold text-white">12+</p>
              <p className="text-blue-200 text-sm mt-1">Colleges Across India</p>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="flex justify-center mb-2"><CheckCircle2 className="text-[#F57D14] h-6 w-6" /></div>
              <p className="text-3xl font-bold text-white">60</p>
              <p className="text-blue-200 text-sm mt-1">Deep Psychometric Metrics</p>
            </div>
          </div>
        </section>

        {/* 🚀 TESTIMONIALS (Tightened padding to bring content up) */}
        <section id="about" className="scroll-mt-24 py-12 lg:py-16 bg-white px-4 sm:px-6 lg:px-8 border-b border-slate-100">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-[#0A2351] sm:text-4xl">Trusted by students across India</h2>
              <p className="mt-4 text-slate-500">Real outcomes from our 15-minute psychometric analysis.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Rahul S.", college: "SRM University", quote: "I was confused between an MBA and starting a business. The 5-year roadmap gave me exactly what I needed to do in my next 30 days. Best ₹99 I've spent." },
                { name: "Priya M.", college: "Delhi University", quote: "The radar chart was scary accurate. It pointed out my procrastination habit and told me exactly which roles to avoid. Highly recommend it!" },
                { name: "Aman K.", college: "VIT Vellore", quote: "Got clarity on my career path in 15 minutes. The actionable steps for Year 1 and Year 2 are already helping me apply for the right internships." }
              ].map((testimonial, i) => (
                <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex gap-1 mb-5">
                    {[1,2,3,4,5].map(star => <Star key={star} className="h-4 w-4 fill-[#F57D14] text-[#F57D14]" />)}
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-bold text-[#0A2351]">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.college}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🧬 METHODOLOGY SECTION (Tightened padding to bring content up) */}
        <section id="methodology" className="scroll-mt-24 bg-slate-50 py-12 lg:py-16 border-t border-slate-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-[#0A2351] sm:text-4xl">The Science Behind the Roadmap</h2>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
                SARATHI eliminates the "hit-or-miss" approach of traditional counseling. We leverage proprietary psychometric data processed via the Gemini 2.5 Flash engine to provide a blueprint that evolves with the Indian job market.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 text-center transition-all hover:shadow-xl hover:-translate-y-2 group">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0A2351]/5 text-[#0A2351] group-hover:bg-[#0A2351] group-hover:text-white transition-colors duration-300">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-[#0A2351]">Multi-Pillar Evaluation</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  A comprehensive deep-dive into Personality, Interests, Aptitude, Motivation, and Behavioral tendencies to build a 360° student profile.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 text-center transition-all hover:shadow-xl hover:-translate-y-2 group">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F57D14]/10 text-[#F57D14] group-hover:bg-[#F57D14] group-hover:text-white transition-colors duration-300">
                  <BrainCircuit className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-[#0A2351]">AI Pattern Recognition</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Our Gemini-powered engine identifies non-obvious career strengths, removing human bias and matching students to the fastest-growing sectors.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 text-center transition-all hover:shadow-xl hover:-translate-y-2 group">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0A2351]/5 text-[#0A2351] group-hover:bg-[#0A2351] group-hover:text-white transition-colors duration-300">
                  <LineChart className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-[#0A2351]">Actionable Roadmaps</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  We don't just provide a score. We deliver a quarterly 5-year execution plan focused on skill acquisition and placement readiness.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🏢 FOR INSTITUTIONS SECTION (Tightened padding to bring content up) */}
        <section id="institutions" className="scroll-mt-24 bg-white py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="order-2 lg:order-1">
                <div className="mb-4 inline-flex items-center rounded-full border border-[#0A2351]/10 bg-[#0A2351]/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0A2351]">
                  Institutional Partnership
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-[#0A2351] sm:text-4xl">Empowering College Placement Cells</h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  SARATHI partners with forward-thinking universities to modernize their placement infrastructure. Our bulk-assessment platform gives TPOs real-time data to bridge the gap between student potential and industry requirements.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    'Batch-level aptitude and skill gap analytics', 
                    'Predictive placement-readiness reporting', 
                    'White-labeled student transformation portal'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm font-semibold text-[#0A2351]">
                      <CheckCircle2 className="h-5 w-5 text-[#F57D14]" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="order-1 lg:order-2 relative aspect-square overflow-hidden rounded-[32px] bg-[#0A2351] shadow-2xl lg:aspect-auto lg:h-[500px]">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center border border-white/10 m-4 rounded-2xl bg-white/5 backdrop-blur-sm">
                  <Users className="mb-6 h-16 w-16 text-[#F57D14]" />
                  <h3 className="text-2xl font-bold text-white">Placement Intelligence Dashboard</h3>
                  <p className="mt-2 text-sm text-white/70">Coming soon for Institutional Partners</p>
                </div>
                <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#F57D14]/20 blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* 🤝 CONTACT SECTION (Tightened padding to bring content up) */}
       <section id="contact" className="scroll-mt-24 bg-[#0A2351] py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
              <div className="space-y-10">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                    Bring SARATHI to <br className="hidden sm:block" /> Your Campus
                  </h2>
                  <p className="mt-4 max-w-lg text-base leading-relaxed text-white/80">
                    Join the ranks of institutions transforming student outcomes. Schedule a 15-minute demo to see how our predictive data can boost your placement records.
                  </p>
                </div>

                <div className="space-y-6 border-t border-white/10 pt-8">
                  <div className="flex items-center gap-4 group">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/5 group-hover:bg-[#F57D14] transition-colors">
                      <PhoneCall className="h-5 w-5 text-[#F57D14] group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/60 uppercase tracking-widest">Enterprise Sales</p>
                      <p className="text-lg font-semibold text-white">+91 8920857008</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 group">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/5 group-hover:bg-[#F57D14] transition-colors">
                      <Mail className="h-5 w-5 text-[#F57D14] group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/60 uppercase tracking-widest">Partnerships</p>
                      <p className="text-lg font-semibold text-white">partners@sarathi-ai.in</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* B2B Demo Form */}
              <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-2xl text-slate-900 border border-slate-100">
                <h3 className="text-2xl font-bold text-[#0A2351]">Request a Campus Preview</h3>
                <p className="mt-3 text-sm text-slate-500">Discover how SARATHI can elevate your placement strategy.</p>

                <form className="mt-8 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Representative Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Dr. Sharma" 
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm focus:border-[#F57D14] focus:outline-none focus:ring-1 focus:ring-[#F57D14] transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Designation</label>
                      <input 
                        type="text" 
                        placeholder="e.g. TPO / Principal" 
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm focus:border-[#F57D14] focus:outline-none focus:ring-1 focus:ring-[#F57D14] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Institution Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter full college name" 
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-[#F57D14] focus:outline-none focus:ring-1 focus:ring-[#F57D14] transition-all"
                    />
                  </div>

                  <Button type="button" className="mt-4 h-12 w-full rounded-2xl bg-[#F57D14] text-base font-bold text-white hover:bg-[#dd6f11] shadow-lg shadow-[#F57D14]/20 transition-all hover:scale-[1.02]">
                    Book Campus Demo
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
