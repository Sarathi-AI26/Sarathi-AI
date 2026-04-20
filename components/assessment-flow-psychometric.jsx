"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ClipboardCheck, 
  Star, 
  Loader2, 
  Sparkles, 
  BrainCircuit, 
  LineChart 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const ProcessingView = () => {
  const [step, setStep] = useState(0);
  const messages = [
    "Synthesizing your 60-point profile...",
    "Gemini AI mapping intrinsic traits...",
    "Evaluating industry compatibility...",
    "Generating 5-year transformation roadmap..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < messages.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-[#F57D14]/20 animate-ping" />
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white border-4 border-[#0A2351] shadow-xl">
          <Loader2 className="w-10 h-10 text-[#F57D14] animate-spin" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-[#0A2351] mb-2">Creating Your Future</h3>
      <p className="text-slate-500 mb-8 text-sm">Please do not refresh. Our AI engine is building your roadmap.</p>
      
      <div className="w-full max-w-xs space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${i === step ? 'opacity-100 translate-x-2' : i < step ? 'opacity-40' : 'opacity-10'}`}>
            {i < step ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Sparkles className={`w-4 h-4 ${i === step ? 'text-[#F57D14]' : 'text-slate-300'}`} />}
            <span className={`text-xs font-bold uppercase tracking-wider ${i === step ? 'text-[#0A2351]' : 'text-slate-400'}`}>{msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AssessmentFlowPsychometric = () => {
  const router = useRouter()
  
  const [isFormCompleted, setIsFormCompleted] = useState(false)
  const [currentSection, setCurrentSection] = useState(0) 
  const [absoluteStep, setAbsoluteStep] = useState(1) 
  const [textResponse, setTextResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [allAnswers, setAllAnswers] = useState(Array(60).fill(null))
  const [formData, setFormData] = useState({ name: "", email: "", whatsapp: "", college: "" })
  const [completedSteps, setCompletedSteps] = useState([])

  const sections = [
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

  const totalSteps = questionBank.length 
  const progress = (absoluteStep / totalSteps) * 100
  
  const isFormValid = 
    formData.name.trim() !== "" && 
    formData.email.includes("@") && 
    formData.whatsapp.length >= 10 && 
    formData.college.trim() !== ""

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

  const handleStartTest = () => {
    setIsFormCompleted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNext = async (selectedOption) => {
    const updatedAnswers = [...allAnswers]
    if (currentSection === 5) {
      updatedAnswers[absoluteStep - 1] = textResponse.trim()
    } else {
      updatedAnswers[absoluteStep - 1] = selectedOption
    }
    setAllAnswers(updatedAnswers)

    if (!completedSteps.includes(absoluteStep)) {
      setCompletedSteps([...completedSteps, absoluteStep])
    }
    
    if (absoluteStep < totalSteps) {
      setTimeout(() => {
        const nextStep = absoluteStep + 1
        const nextSavedAnswer = updatedAnswers[nextStep - 1]
        setTextResponse(nextSavedAnswer || "")
        setAbsoluteStep(nextStep)
        updateSection(nextStep)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 300);
    } else {
      setIsSubmitting(true)
      try {
        const response = await fetch('/api/submit-assessment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            whatsapp: formData.whatsapp,
            college: formData.college,
            answers: updatedAnswers 
          })
        });
        
        const data = await response.json();
        if (data.assessmentId) {
          router.push(`/result?id=${data.assessmentId}`);
        } else {
          setIsSubmitting(false)
        }
      } catch (error) {
        setIsSubmitting(false)
      }
    }
  }

  const handlePrevious = () => {
    if (absoluteStep > 1) {
      const prevStep = absoluteStep - 1
      const prevSavedAnswer = allAnswers[prevStep - 1]
      setTextResponse(prevSavedAnswer || "")
      setAbsoluteStep(prevStep)
      updateSection(prevStep)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setIsFormCompleted(false)
    }
  }

  return (
    {/* 🚀 Section Padding: py-12 mobile, py-20 desktop */}
    <main className="min-h-screen bg-slate-50 py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <Card className="overflow-hidden rounded-3xl border-slate-200 bg-white shadow-xl">
            
            <div className="bg-[#0A2351] px-6 py-4 text-white">
              {!isFormCompleted ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium opacity-80">Student Profile Setup</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">Pre-Assessment</span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium opacity-80">
                     Section {currentSection + 1}: {sections[currentSection]?.name}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                     Step {absoluteStep} of {totalSteps}
                  </span>
                </div>
              )}
              <Progress value={!isFormCompleted ? 0 : progress} className="mt-4 h-1.5 bg-white/20" indicatorClassName="bg-[#F57D14]" />
            </div>

            {/* 🚀 Card Inner Padding: 24px mobile, 32px desktop */}
            <CardContent className="p-6 sm:p-8">
              <div className="mx-auto max-w-xl">
                
                {isSubmitting ? (
                  <ProcessingView />
                ) : !isFormCompleted ? (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-[#0A2351]">Tell us who you are</h3>
                    <div className="space-y-4">
                      <input type="text" placeholder="Full Name *" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#F57D14] focus:outline-none" />
                      <input type="email" placeholder="Email Address *" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#F57D14] focus:outline-none" />
                      <input type="tel" placeholder="WhatsApp Number *" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#F57D14] focus:outline-none" />
                      <input type="text" placeholder="College Name *" value={formData.college} onChange={(e) => setFormData({...formData, college: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#F57D14] focus:outline-none" />
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button onClick={handleStartTest} disabled={!isFormValid} className={`h-12 rounded-2xl px-8 font-bold text-white transition-all ${isFormValid ? 'bg-[#F57D14] hover:bg-[#dd6f11]' : 'bg-slate-300 cursor-not-allowed'}`}>
                        Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : currentSection === 5 ? (
                  <div className="space-y-8 py-4">
                    {/* 🚀 Space between Title and content: 12px */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-[#0A2351]">Self-Reflection</h3>
                      <p className="text-base text-slate-700 font-medium leading-relaxed">{questionBank[absoluteStep - 1]}</p>
                    </div>
                    <textarea value={textResponse} onChange={(e) => setTextResponse(e.target.value)} placeholder="Type your reflection here. AI uses this to measure career clarity..." className="w-full h-40 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm focus:border-[#F57D14] focus:outline-none focus:ring-1 focus:ring-[#F57D14]" />
                    <div className="flex items-center justify-between pt-6">
                      <Button variant="ghost" onClick={handlePrevious} className="text-slate-500 hover:text-[#0A2351]">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>
                      <Button onClick={() => handleNext(null)} disabled={!textResponse.trim()} className="h-12 rounded-2xl bg-[#F57D14] px-4 sm:px-8 font-bold text-white shadow-lg hover:bg-[#dd6f11]">
                        {absoluteStep === totalSteps ? "Finish & View Results" : "Next Reflection"} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 py-4">
                    {/* 🚀 Space between Title and content: 12px */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-[#0A2351]">Question {absoluteStep}</h3>
                      <p className="text-base text-slate-700 font-medium leading-relaxed">{questionBank[absoluteStep - 1]}</p>
                    </div>
                    {/* 🚀 Gap between options: 12px */}
                    <div className="grid gap-3">
                      {[
                        currentSection === 1 ? 'Very Interested' : 'Strongly Agree', 
                        currentSection === 1 ? 'Interested' : 'Agree', 
                        'Neutral', 
                        currentSection === 1 ? 'Less Interested' : 'Disagree', 
                        currentSection === 1 ? 'Not Interested' : 'Strongly Disagree'
                      ].map((opt) => {
                        const isSelected = allAnswers[absoluteStep - 1] === opt;
                        return (
                          <button key={`${absoluteStep}-${opt}`} onClick={() => handleNext(opt)} className={`w-full rounded-2xl border p-4 text-left text-sm font-medium transition-all ${isSelected ? 'border-[#F57D14] bg-[#F57D14]/5 text-[#F57D14]' : 'border-slate-200 hover:border-[#F57D14] hover:bg-[#F57D14]/5 hover:text-[#F57D14]'}`}>
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                    <div className="flex justify-start pt-6 border-t border-slate-100">
                      <Button variant="ghost" onClick={handlePrevious} className="text-slate-500 hover:text-[#0A2351]">
                        <ArrowLeft className="mr-2 h-4 w-4" /> {absoluteStep === 1 ? 'Back to Details' : 'Previous Question'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {isFormCompleted && !isSubmitting && (
                <div className="mt-12 border-t border-slate-100 pt-8">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">Assessment Map</p>
                  <div className="flex flex-wrap gap-2">
                    {questionBank.map((_, i) => {
                      const stepNum = i + 1;
                      const isCompleted = completedSteps.includes(stepNum);
                      const isCurrent = absoluteStep === stepNum;
                      return (
                        <div key={i} className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold transition-all ${isCompleted ? 'bg-[#F57D14] text-white' : 'bg-slate-100 text-slate-400'} ${isCurrent ? 'ring-2 ring-[#0A2351] ring-offset-2' : ''}`}>
                          {stepNum}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <aside className="space-y-6 hidden lg:block">
            <Card className="border-0 rounded-3xl bg-[#0A2351] text-white shadow-lg">
              {/* 🚀 Card Inner Padding: 24px */}
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                    <ClipboardCheck className="h-5 w-5 text-[#F57D14]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/60">Scientific Method</p>
                    <p className="font-bold text-sm">6-Section Analysis</p>
                  </div>
                </div>
                {/* 🚀 Margin above list: 24px */}
                <div className="mt-6 space-y-4">
                  {sections.map((s, i) => {
                    const isPassed = isFormCompleted && currentSection > i;
                    const isActive = isFormCompleted && currentSection === i;
                    const isUpcoming = !isFormCompleted || currentSection < i;
                    return (
                      <div key={s.name} className={`flex items-center gap-3 text-sm transition-opacity ${isUpcoming ? 'opacity-40' : 'opacity-100'}`}>
                        <CheckCircle2 className={`h-4 w-4 shrink-0 ${isPassed || isActive ? 'text-[#F57D14]' : 'text-white'}`} />
                        <span className={isActive ? "font-bold text-[#F57D14]" : ""}>{s.name}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default AssessmentFlowPsychometric
