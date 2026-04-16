"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, BrainCircuit, CheckCircle2, ClipboardCheck, Sparkles, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import SarathiLogo from '@/components/sarathi-logo'

const AssessmentFlowPsychometric = () => {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(0)

  // Total steps: 60 questions + Basic Info = 61 steps
  const totalSteps = 61

  useEffect(() => {
    setProgress((step / totalSteps) * 100)
  }, [step])

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1)
    else router.push('/result?id=demo-locked')
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION 1: HEADER & INTRO */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="mb-4 inline-flex items-center rounded-full border border-[#0A2351]/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0A2351] shadow-sm">
              60-Question Psychometric Assessment
            </div>
            <h1 className="text-3xl font-bold text-[#0A2351] sm:text-4xl">
              Discover your strongest career direction
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Move through all 6 sections of the SARATHI assessment—personality, interests, aptitude, 
              motivation, behavior, and reflections—in one guided AI flow.
            </p>
          </div>

          <Card className="border-slate-200 bg-white shadow-sm lg:max-w-xs">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F57D14]/10 text-[#F57D14]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0A2351]">Comprehensive but focused</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  One question at a time keeps the experience mobile-friendly and scientifically accurate.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SECTION 2: THE ASSESSMENT INTERFACE */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <Card className="overflow-hidden border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            <div className="bg-[#0A2351] px-6 py-4 text-white sm:px-8">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium opacity-80">Section 1: Basic Information</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">Step {step} of {totalSteps}</span>
              </div>
              <Progress value={progress} className="mt-4 h-1.5 bg-white/20" indicatorClassName="bg-[#F57D14]" />
            </div>

            <CardContent className="p-6 sm:p-10">
              <div className="mx-auto max-w-xl">
                <div className="mb-8 space-y-2">
                  <h3 className="text-xl font-bold text-[#0A2351]">Tell us who you are</h3>
                  <p className="text-sm text-slate-500">SARATHI uses this to personalize your 5-year roadmap.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#0A2351]">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Aditi Sharma" 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#F57D14] focus:outline-none focus:ring-1 focus:ring-[#F57D14]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#0A2351]">WhatsApp Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">+91</span>
                      <input 
                        type="tel" 
                        placeholder="98765 43210" 
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-14 pr-4 text-sm focus:border-[#F57D14] focus:outline-none focus:ring-1 focus:ring-[#F57D14]"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">For secure dashboard access and roadmap updates.</p>
                  </div>
                </div>

                <div className="mt-10 flex justify-end">
                  <Button 
                    onClick={nextStep}
                    className="h-12 rounded-xl bg-[#F57D14] px-8 font-bold text-white hover:bg-[#dd6f11]"
                  >
                    Continue to Questions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SIDEBAR: TRUST & INFO */}
          <aside className="space-y-6">
            <Card className="border-0 bg-[#0A2351] text-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <ClipboardCheck className="h-5 w-5 text-[#F57D14]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/60">Overview</p>
                    <p className="font-bold">6 Sections • 60 questions</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {[
                    'Structured 6-section psychometric journey',
                    'Progress saved in a single guided flow',
                    'Real-time AI analysis of your profile',
                    'Endorsed by career experts'
                  ].map((text) => (
                    <div key={text} className="flex items-center gap-3 text-sm text-white/80">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#F57D14]" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="rounded-2xl border border-[#0A2351]/10 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-[#F57D14]">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
              </div>
              <p className="mt-4 text-sm italic leading-relaxed text-slate-600">
                "SARATHI helped me realize that my interest in psychology and coding perfectly fit a career in UX Research."
              </p>
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-sm font-bold text-[#0A2351]">Rahul V.</p>
                <p className="text-xs text-slate-400">Final Year, B.Tech</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default AssessmentFlowPsychometric
