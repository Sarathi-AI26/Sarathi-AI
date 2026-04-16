"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const AssessmentFlowPsychometric = () => {
  const router = useRouter()
  
  // State Management
  const [currentSection, setCurrentSection] = useState(0) 
  const [absoluteStep, setAbsoluteStep] = useState(1)
  const [textResponse, setTextResponse] = useState("")
  
  // Form State for Validation
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    college: ""
  })

  // Track completed questions for the Grid
  const [completedSteps, setCompletedSteps] = useState([])

  const sections = [
    { name: "Basic Information", questions: 1 }, 
    { name: "Personality Traits", questions: 15 },
    { name: "Career Interests", questions: 12 },
    { name: "Aptitude Indicators", questions: 10 },
    { name: "Motivation & Drivers", questions: 10 },
    { name: "Behavioural Tendencies", questions: 8 },
    { name: "Open Reflections", questions: 5 }
  ]

  const questionBank = [
    "I enjoy solving problems that require deep thinking and analysis.",
    "I like having a clear plan and structure for my daily tasks.",
    "I feel comfortable talking to new people and making connections.",
    "I often think of creative ideas or new ways of doing things.",
    "I remain calm even during stressful situations.",
    "I naturally take the lead when working in a group.",
    "I think carefully before making important decisions.",
    "I prefer working alone rather than in large teams.",
    "I avoid taking risks unless I’m confident about the outcome.",
    "I adapt quickly when situations change suddenly.",
    "I try to understand how others feel before reacting.",
    "I can stay focused on tasks for long periods without distraction.",
    "I enjoy learning new topics or exploring unfamiliar fields.",
    "I like keeping my workspace and schedule organized.",
    "I can communicate my thoughts clearly while speaking or writing.",
    "Rate your interest: Analyzing data, numbers, or patterns.",
    "Rate your interest: Designing visuals such as graphics, videos, or UI screens.",
    "Rate your interest: Understanding how machines, software, or technology systems work.",
    "Rate your interest: Helping people with academic, emotional, or career problems.",
    "Rate your interest: Leading teams, planning events, or managing projects.",
    "Rate your interest: Writing articles, blogs, scripts, or social media content.",
    "Rate your interest: Conducting research in science, humanities, commerce, or social studies.",
    "Rate your interest: Exploring business ideas, startups, or entrepreneurial ventures.",
    "Rate your interest: Preparing for competitive exams like UPSC, SSC, Banking, CAT, or GATE.",
    "Rate your interest: Working with NGOs, social impact projects, or community development.",
    "Rate your interest: Building apps, websites, or digital tools.",
    "Rate your interest: Pursuing higher studies abroad for exposure and global career opportunities.",
    "I can easily identify errors in mathematical or numerical calculations.",
    "I understand diagrams, charts, and visual data quickly.",
    "I can explain difficult concepts in a simple way.",
    "I learn new software or technology faster than most people.",
    "I remember information better when I write or visualize it.",
    "I can think of multiple solutions when faced with a problem.",
    "I can stay focused even when tasks are repetitive or long.",
    "I can evaluate pros and cons logically before making decisions.",
    "I easily understand abstract concepts like theories, algorithms, or frameworks.",
    "I am comfortable analyzing large amounts of information to reach conclusions.",
    "Rate importance: Earning a high salary early in my career.",
    "Rate importance: Having long-term job stability and security.",
    "Rate importance: Having opportunities to innovate or build new ideas.",
    "Rate importance: Getting leadership roles and recognition at work.",
    "Rate importance: Having a good work-life balance and manageable workload.",
    "Rate importance: Contributing to society and making a positive impact.",
    "Rate importance: Working in roles that allow international travel or relocation.",
    "Rate importance: Working in a competitive and fast-paced environment.",
    "Rate importance: Being able to work independently without much supervision.",
    "Rate importance: Building a strong personal identity or brand through my achievements.",
    "I usually complete tasks well before the deadline.",
    "I feel stressed when too many tasks pile up at once.",
    "I enjoy collaborating with others and working in teams.",
    "I take initiative even when instructions are not given.",
    "I actively use feedback to improve myself.",
    "I feel confident presenting or speaking in front of groups.",
    "I follow rules and guidelines carefully.",
    "I stay committed to long-term goals even when progress is slow.",
    "What is your dream career, and why does it inspire you?",
    "Describe a challenge you faced and how you overcame it.",
    "What skills do you want to develop in the next 2 years?",
    "What type of work environment helps you perform your best?",
    "Would you prefer building your career in India, abroad, or both? Why?"
  ]

  const totalSteps = questionBank.length + 1
  const progress = (absoluteStep / totalSteps) * 100

  // Form Validation Logic
  const isFormValid = formData.name.trim() !== "" && formData.whatsapp.length >= 10 && formData.college.trim() !== ""

  const updateSection = (step) => {
    let count = 0
    for (let i = 0; i < sections.length; i++) {
      count += sections[i].questions
      if (step <= count) {
        setCurrentSection(i)
        break
      }
    }
  }

  const handleNext = () => {
    if (!completedSteps.includes(absoluteStep)) {
      setCompletedSteps([...completedSteps, absoluteStep])
    }
    
    if (absoluteStep < totalSteps) {
      const nextStep = absoluteStep + 1
      setAbsoluteStep(nextStep)
      updateSection(nextStep)
      setTextResponse("") 
    } else {
      router.push('/result?id=demo-locked')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePrevious = () => {
    if (absoluteStep > 1) {
      const prevStep = absoluteStep - 1
      setAbsoluteStep(prevStep)
      updateSection(prevStep)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <Card className="overflow-hidden border-slate-200 bg-white shadow-xl">
            <div className="bg-[#0A2351] px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium opacity-80">Section {currentSection + 1}: {sections[currentSection]?.name}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">Step {absoluteStep} of {totalSteps}</span>
              </div>
              <Progress value={progress} className="mt-4 h-1.5 bg-white/20" indicatorClassName="bg-[#F57D14]" />
            </div>

            <CardContent className="p-6 sm:p-10">
              <div className="mx-auto max-w-xl">
                {currentSection === 0 ? (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-[#0A2351]">Tell us who you are</h3>
                    <div className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Full Name *" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#F57D14] focus:outline-none" 
                      />
                      <input 
                        type="tel" 
                        placeholder="WhatsApp Number *" 
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#F57D14] focus:outline-none" 
                      />
                      <input 
                        type="text" 
                        placeholder="College Name *" 
                        value={formData.college}
                        onChange={(e) => setFormData({...formData, college: e.target.value})}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#F57D14] focus:outline-none" 
                      />
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={handleNext} 
                        disabled={!isFormValid}
                        className={`h-12 rounded-xl px-8 font-bold text-white ${isFormValid ? 'bg-[#F57D14] hover:bg-[#dd6f11]' : 'bg-slate-300 cursor-not-allowed'}`}
                      >
                        Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    {!isFormValid && <p className="text-right text-xs text-slate-400 mt-2">* Please fill all fields to continue</p>}
                  </div>
                ) : currentSection === 6 ? (
                  <div className="space-y-8 py-4">
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-[#0A2351]">Self-Reflection</h3>
                      <p className="text-base text-slate-700 font-medium">{questionBank[absoluteStep - 2]}</p>
                    </div>
                    <textarea 
                      value={textResponse}
                      onChange={(e) => setTextResponse(e.target.value)}
                      placeholder="Share your thoughts here..." 
                      className="w-full h-40 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm focus:border-[#F57D14] focus:outline-none"
                    />
                    <div className="flex items-center justify-between pt-6">
                      <Button variant="ghost" onClick={handlePrevious} className="text-slate-500">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>
                      <Button onClick={handleNext} disabled={!textResponse} className="h-12 rounded-xl bg-[#F57D14] px-8 font-bold text-white">
                        {absoluteStep === totalSteps ? "Finish" : "Next"} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 py-4">
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-[#0A2351]">Question {absoluteStep - 1}</h3>
                      <p className="text-base text-slate-700 font-medium">{questionBank[absoluteStep - 2]}</p>
                    </div>
                    <div className="grid gap-3">
                      {[
                        currentSection === 2 ? 'Very Interested' : 'Strongly Agree', 
                        currentSection === 2 ? 'Interested' : 'Agree', 
                        'Neutral', 
                        currentSection === 2 ? 'Less Interested' : 'Disagree', 
                        currentSection === 2 ? 'Not Interested' : 'Strongly Disagree'
                      ].map((opt) => (
                        <button key={opt} onClick={handleNext} className="w-full rounded-xl border border-slate-200 p-4 text-left text-sm font-medium hover:border-[#F57D14] hover:bg-[#F57D14]/5">
                          {opt}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-start pt-6 border-t border-slate-100">
                      <Button variant="ghost" onClick={handlePrevious} className="text-slate-500">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Previous Question
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* 🟠 NEW: QUESTION GRID CIRCLES */}
              {currentSection > 0 && (
                <div className="mt-12 border-t border-slate-100 pt-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Question Progress</p>
                  <div className="flex flex-wrap gap-2">
                    {questionBank.map((_, i) => {
                      const stepNum = i + 2
                      const isCompleted = completedSteps.includes(stepNum)
                      const isCurrent = absoluteStep === stepNum
                      return (
                        <div 
                          key={i}
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold transition-all
                            ${isCompleted ? 'bg-[#F57D14] text-white' : 'bg-slate-100 text-slate-400'}
                            ${isCurrent ? 'ring-2 ring-[#0A2351] ring-offset-2' : ''}
                          `}
                        >
                          {i + 1}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <aside className="space-y-6">
            <Card className="border-0 bg-[#0A2351] text-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <ClipboardCheck className="h-5 w-5 text-[#F57D14]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/60">Scientific Method</p>
                    <p className="font-bold text-sm">6-Section Analysis</p>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  {sections.slice(1).map((s, i) => (
                    <div key={s.name} className={`flex items-center gap-3 text-sm transition-opacity ${currentSection > i ? 'opacity-100' : 'opacity-40'}`}>
                      <CheckCircle2 className={`h-4 w-4 shrink-0 ${currentSection > i ? 'text-[#F57D14]' : 'text-white'}`} />
                      <span className={currentSection === i + 1 ? "font-bold text-[#F57D14]" : ""}>{s.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="rounded-2xl border border-[#0A2351]/10 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-1 text-[#F57D14]">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-4 text-sm italic leading-relaxed text-slate-600">
                "The SARATHI assessment gave me a clear direction when I was confused between my core engineering and my interest in design."
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
