"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle2, ClipboardCheck, Sparkles, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import SarathiLogo from '@/components/sarathi-logo'

const AssessmentFlowPsychometric = () => {
  const router = useRouter()
  
  // State management
  const [currentSection, setCurrentSection] = useState(0) // 0: Basic Info, 1-6: Psychometric Sections
  const [stepInSection, setStepInSection] = useState(1)
  
  const sections = [
    { name: "Basic Information", total: 5 }, // Name, WhatsApp, College, Year, Stream
    { name: "Personality Traits", total: 10 },
    { name: "Career Interests", total: 10 },
    { name: "Aptitude & Skills", total: 10 },
    { name: "Motivation Factors", total: 10 },
    { name: "Work Behaviour", total: 10 },
    { name: "Open Reflections", total: 10 }
  ]

  const totalSteps = sections.reduce((acc, s) => acc + s.total, 0)
  const [absoluteStep, setAbsoluteStep] = useState(1)

  const handleNext = () => {
    if (absoluteStep < totalSteps) {
      setAbsoluteStep(prev => prev + 1)
      
      // Logic to move between sections
      if (stepInSection < sections[currentSection].total) {
        setStepInSection(prev => prev + 1)
      } else {
        setCurrentSection(prev => prev + 1)
        setStepInSection(1)
      }
      
      // Auto-scroll to top of card on move
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      router.push('/result?id=demo-locked')
    }
  }

  const progress = (absoluteStep / totalSteps) * 100

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="mb-4 inline-flex items-center rounded-full border border-[#0A2351]/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0A2351] shadow-sm">
              6-Section Professional Assessment
            </div>
            <h1 className="text-3xl font-bold text-[#0A2351] sm:text-4xl">Discover your strongest career direction</h1>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* MAIN ASSESSMENT CARD */}
          <Card className="overflow-hidden border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            <div className="bg-[#0A2351] px-6 py-4 text-white sm:px-8">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium opacity-80">Section {currentSection + 1}: {sections[currentSection].name}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">Step {absoluteStep} of {totalSteps}</span>
              </div>
              <Progress value={progress} className="mt-4 h-1.5 bg-white/20" indicatorClassName="bg-[#F57D14]" />
            </div>

            <CardContent className="p-6 sm:p-10">
              <div className="mx-auto max-w-xl">
                
                {/* DYNAMIC CONTENT BASED ON SECTION */}
                {currentSection === 0 ? (
                  <div className="space-y-6">
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-[#0A2351]">Tell us who you are</h3>
                      <p className="text-sm text-slate-500">This helps SARATHI tailor the roadmap to your specific background.</p>
                    </div>
                    
                    {/* ALL PREVIOUS FIELDS RESTORED */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-[#0A2351]">Full Name</label>
                        <input type="text" placeholder="e.g. Harshendra Singh" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#F57D14] focus:outline-none" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-[#0A2351]">WhatsApp Number</label>
                        <input type="tel" placeholder="9876543210" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#F57D14] focus:outline-none" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-[#0A2351]">College Name</label>
                        <input type="text" placeholder="e.g. Lucknow University" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#F57D14] focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-[#0A2351]">Current Year</label>
                          <select className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#F57D14] focus:outline-none">
                            <option>1st Year</option>
                            <option>2nd Year</option>
                            <option>3rd Year</option>
                            <option>4th Year</option>
                            <option>Completed</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-[#0A2351]">Stream</label>
                          <input type="text" placeholder="e.g. B.Tech CS" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#F57D14] focus:outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 py-4">
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-[#0A2351]">Question {absoluteStep - sections[0].total}</h3>
                      <p className="text-base text-slate-700">How comfortable are you with working in a fast-paced startup environment?</p>
                    </div>
                    
                    {/* Placeholder for Psychometric Options */}
                    <div className="grid gap-3">
                      {['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'].map((opt) => (
                        <button key={opt} onClick={handleNext} className="w-full rounded-xl border border-slate-200 p-4 text-left text-sm transition-all hover:border-[#F57D14] hover:bg-[#F57D14]/5">
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentSection === 0 && (
                  <div className="mt-10 flex justify-end">
                    <Button onClick={handleNext} className="h-12 rounded-xl bg-[#F57D14] px-8 font-bold text-white hover:bg-[#dd6f11]">
                      Continue to Questions <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            <Card className="border-0 bg-[#0A2351] text-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <ClipboardCheck className="h-5 w-5 text-[#F57D14]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/60">Assessment Details</p>
                    <p className="font-bold">60 Scientific Questions</p>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  {sections.slice(1).map((s, i) => (
                    <div key={s.name} className={`flex items-center gap-3 text-sm ${currentSection > i ? 'text-white' : 'text-white/50'}`}>
                      <CheckCircle2 className={`h-4 w-4 shrink-0 ${currentSection > i ? 'text-[#F57D14]' : 'text-white/20'}`} />
                      <span>{s.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="rounded-2xl border border-[#0A2351]/10 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-1 text-[#F57D14]"><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /></div>
              <p className="mt-4 text-sm italic text-slate-600">"The depth of the 6 sections gave me a roadmap I actually trust."</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default AssessmentFlowPsychometric
