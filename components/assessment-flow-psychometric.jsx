"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  Sparkles,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  assessmentSections,
  assessmentQuestions,
} from '@/lib/psychometric-assessment'

// ─────────────────────────────────────────────
// PROCESSING VIEW
// ─────────────────────────────────────────────
const ProcessingView = () => {
  const [step, setStep] = useState(0)
  const messages = [
    'Synthesizing your 60-point profile...',
    'Gemini AI mapping intrinsic traits...',
    'Evaluating industry compatibility...',
    'Generating 5-year transformation roadmap...',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < messages.length - 1 ? prev + 1 : prev))
    }, 2500)
    return () => clearInterval(interval)
  }, [messages.length])

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-[#F57D14]/20 animate-ping" />
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white border-4 border-[#0A2351] shadow-xl">
          <Loader2 className="w-10 h-10 text-[#F57D14] animate-spin" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-[#0A2351] mb-2">Creating Your Future</h3>
      <p className="text-slate-500 mb-8 text-sm">
        Please do not refresh. Our AI engine is building your roadmap.
      </p>
      <div className="w-full max-w-xs space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 transition-all duration-500 ${
              i === step
                ? 'opacity-100 translate-x-2'
                : i < step
                ? 'opacity-40'
                : 'opacity-10'
            }`}
          >
            {i < step ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <Sparkles
                className={`w-4 h-4 ${i === step ? 'text-[#F57D14]' : 'text-slate-300'}`}
              />
            )}
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                i === step ? 'text-[#0A2351]' : 'text-slate-400'
              }`}
            >
              {msg}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const AssessmentFlowPsychometric = () => {
  const router = useRouter()

  const [isFormCompleted, setIsFormCompleted] = useState(false)
  const [absoluteStep, setAbsoluteStep] = useState(1)
  const [highestStep, setHighestStep] = useState(1) // Tracks the furthest question reached for the Map
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0)
  const [textResponse, setTextResponse] = useState('')
  
  const [isTransitioning, setIsTransitioning] = useState(false) // Prevents double-tap skipping
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const [answersMap, setAnswersMap] = useState({})
  const [completedSteps, setCompletedSteps] = useState([])
  const [formData, setFormData] = useState({ name: '', email: '', college: '' })

  const totalSteps = assessmentQuestions.length // 60
  const progress = (absoluteStep / totalSteps) * 100

  const currentQuestion = assessmentQuestions[absoluteStep - 1]
  const isOpenEnded = currentQuestion?.input_type === 'text'
  const isLastStep = absoluteStep === totalSteps
  const currentSection = assessmentSections[currentSectionIdx]

  // Track the furthest step reached so users can freely navigate backwards and forwards via the Map
  useEffect(() => {
    setHighestStep((prev) => Math.max(prev, absoluteStep))
  }, [absoluteStep])

  useEffect(() => {
    let count = 0
    for (let i = 0; i < assessmentSections.length; i++) {
      count += assessmentSections[i].questions.length
      if (absoluteStep <= count) {
        setCurrentSectionIdx(i)
        break
      }
    }
  }, [absoluteStep])

  useEffect(() => {
    if (isOpenEnded) {
      setTextResponse(answersMap[currentQuestion.id] || '')
    }
  }, [absoluteStep, isOpenEnded, currentQuestion.id, answersMap])

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.email.includes('@') &&
    formData.college.trim() !== ''

  const handleStartTest = () => {
    setIsFormCompleted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submitAssessment = async (finalMap) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const orderedAnswers = assessmentQuestions.map(q => finalMap[q.id])

      const missingIndex = orderedAnswers.findIndex(a => a === undefined || a === null || a === '')
      if (missingIndex !== -1) {
        throw new Error(`Question ${missingIndex + 1} is missing an answer. Please use the Assessment Map below to jump back and answer it!`)
      }

      const response = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          college: formData.college,
          answers: orderedAnswers,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Submission failed')
      }

     if (data.assessmentId) {
        router.push(`/checkout?assessmentId=${data.assessmentId}`) // <--- THE FIX
      } else {
        throw new Error('No assessment ID returned')
      }
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitError(error.message || 'Something went wrong. Please try again.')
      setIsSubmitting(false)
      setIsTransitioning(false)
    }
  }

  const handleNext = async (selectedOptionValue = null) => {
    if (isTransitioning) return // Double-tap protection

    setIsTransitioning(true)
    const qId = currentQuestion.id
    const finalAnswer = isOpenEnded ? textResponse.trim() : selectedOptionValue

    if (!completedSteps.includes(absoluteStep)) {
      setCompletedSteps((prev) => [...prev, absoluteStep])
    }

    setAnswersMap((prevMap) => {
      const newMap = { ...prevMap, [qId]: finalAnswer }
      
      if (isLastStep) {
        submitAssessment(newMap)
      }
      return newMap
    })

    if (!isLastStep) {
      setTimeout(() => {
        setAbsoluteStep((prev) => prev + 1)
        setTextResponse('')
        setIsTransitioning(false) // Unlock buttons for the next question
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 300)
    }
  }

  const handlePrevious = () => {
    if (isTransitioning) return
    
    if (absoluteStep > 1) {
      setAbsoluteStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setIsFormCompleted(false)
    }
  }

  const currentAnswer = answersMap[currentQuestion?.id]
  const canProceedOpenEnded = isOpenEnded && textResponse.trim().length > 0

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-slate-50 py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* ── MAIN CARD ── */}
          <Card className="overflow-hidden rounded-3xl border-slate-200 bg-white shadow-xl">

            {/* Progress Header */}
            <div className="bg-[#0A2351] px-6 py-4 text-white">
              {!isFormCompleted ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium opacity-80">Step 1 of 2: Profile Setup</span>
                  <span className="text-xs font-bold text-[#F57D14] uppercase tracking-wider">
                    Profile → Assessment
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium opacity-80">
                    Section {currentSectionIdx + 1}: {currentSection?.title}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                    Q{absoluteStep} of {totalSteps}
                  </span>
                </div>
              )}
              <Progress
                value={!isFormCompleted ? 0 : progress}
                className="mt-4 h-1.5 bg-white/20"
                indicatorClassName="bg-[#F57D14]"
              />
            </div>

            <CardContent className="p-6 sm:p-8">
              <div className="mx-auto max-w-xl">

                {/* ── PROCESSING ── */}
                {isSubmitting ? (
                  <ProcessingView />

                ) : !isFormCompleted ? (
                  /* ── PROFILE FORM ── */
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-[#0A2351]">Tell us who you are</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Takes ~15 minutes. No payment required to start.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#F57D14] focus:outline-none"
                      />
                      <input
                        type="email"
                        placeholder="Email Address *"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#F57D14] focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="College Name *"
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#F57D14] focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 order-2 sm:order-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Data is secure. Full report unlocks for ₹99.</span>
                      </div>
                      <Button
                        onClick={handleStartTest}
                        disabled={!isFormValid}
                        className={`order-1 sm:order-2 w-full sm:w-auto h-14 rounded-full px-8 font-bold text-white transition-all shadow-lg ${
                          isFormValid
                            ? 'bg-[#F57D14] hover:bg-[#dd6f11] shadow-[#F57D14]/20 hover:scale-105'
                            : 'bg-[#F57D14]/50 cursor-not-allowed'
                        }`}
                      >
                        Start the Assessment <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                ) : isOpenEnded ? (
                  /* ── OPEN-ENDED QUESTION ── */
                  <div className="space-y-8 py-4">
                    <div className="space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#F57D14]">
                        {currentSection?.title}
                      </span>
                      <p className="text-base text-slate-700 font-medium leading-relaxed">
                        {currentQuestion.question}
                      </p>
                    </div>
                    <textarea
                      value={textResponse}
                      onChange={(e) => setTextResponse(e.target.value)}
                      placeholder="Type your reflection here. AI uses this to build your personalised roadmap..."
                      className="w-full h-40 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm focus:border-[#F57D14] focus:outline-none focus:ring-1 focus:ring-[#F57D14]"
                    />
                    {submitError && (
                      <div className="text-sm text-red-600 font-bold bg-red-50 p-4 rounded-xl border border-red-200">
                        {submitError}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-6">
                      <Button
                        variant="ghost"
                        onClick={handlePrevious}
                        disabled={isTransitioning}
                        className="text-slate-500 hover:text-[#0A2351]"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>
                      <Button
                        onClick={() => handleNext(null)}
                        disabled={!canProceedOpenEnded || isTransitioning}
                        className="h-14 rounded-full bg-[#F57D14] px-4 sm:px-8 font-bold text-white shadow-xl hover:bg-[#dd6f11] transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLastStep ? 'Finish & View Results' : 'Next Reflection'}{' '}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                ) : (
                  /* ── CHOICE QUESTION ── */
                  <div className="space-y-8 py-4">
                    <div className="space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#F57D14]">
                        {currentSection?.title}
                      </span>
                      <h3 className="text-lg font-bold text-[#0A2351]">
                        Question {absoluteStep}
                      </h3>
                      <p className="text-base text-slate-700 font-medium leading-relaxed">
                        {currentQuestion.question}
                      </p>
                    </div>

                    <div className="grid gap-3">
                      {currentQuestion.options.map((opt) => {
                        const isSelected = currentAnswer === opt.value
                        return (
                          // Mobile-friendly active states and transition lock applied here
                          <button
                            key={opt.value}
                            onClick={() => handleNext(opt.value)}
                            disabled={isTransitioning}
                            className={`w-full rounded-2xl border p-4 text-left text-sm font-medium transition-all duration-200 ${
                              isSelected
                                ? 'border-[#F57D14] bg-[#F57D14]/5 text-[#F57D14] shadow-[0_0_0_1px_#F57D14]'
                                : 'border-slate-200 text-slate-700 bg-white active:scale-[0.98] active:border-[#F57D14] active:bg-[#F57D14]/5'
                            } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>

                    <div className="flex justify-start pt-6 border-t border-slate-100">
                      <Button
                        variant="ghost"
                        onClick={handlePrevious}
                        disabled={isTransitioning}
                        className="text-slate-500 hover:text-[#0A2351]"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {absoluteStep === 1 ? 'Back to Details' : 'Previous Question'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── INTERACTIVE ASSESSMENT MAP ── */}
              {isFormCompleted && !isSubmitting && (
                <div className="mt-12 border-t border-slate-100 pt-8">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Assessment Map
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#F57D14]">
                      Tap a circle to jump
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {assessmentQuestions.map((_, i) => {
                      const stepNum = i + 1
                      const isCompleted = completedSteps.includes(stepNum)
                      const isCurrent = absoluteStep === stepNum
                      const isClickable = stepNum <= highestStep && !isTransitioning

                      return (
                        <button
                          key={i}
                          onClick={() => {
                            if (isClickable) {
                              setAbsoluteStep(stepNum)
                              window.scrollTo({ top: 0, behavior: 'smooth' })
                            }
                          }}
                          disabled={!isClickable}
                          title={isClickable ? `Jump to Question ${stepNum}` : `Locked`}
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                            isCompleted ? 'bg-[#F57D14] text-white' : 'bg-slate-100 text-slate-400'
                          } ${isCurrent ? 'ring-2 ring-[#0A2351] ring-offset-2' : ''} ${
                            isClickable ? 'cursor-pointer hover:scale-110 active:scale-95' : 'opacity-50 cursor-not-allowed'
                          }`}
                        >
                          {stepNum}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── SIDEBAR ── */}
          <aside className="space-y-6 hidden lg:block">
            <Card className="border-0 rounded-3xl bg-[#0A2351] text-white shadow-lg">
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
                <div className="mt-6 space-y-4">
                  {assessmentSections.map((s, i) => {
                    const isPassed = isFormCompleted && currentSectionIdx > i
                    const isActive = isFormCompleted && currentSectionIdx === i
                    const isUpcoming = !isFormCompleted || currentSectionIdx < i
                    return (
                      <div
                        key={s.id}
                        className={`flex items-center gap-3 text-sm transition-opacity ${
                          isUpcoming ? 'opacity-40' : 'opacity-100'
                        }`}
                      >
                        <CheckCircle2
                          className={`h-4 w-4 shrink-0 ${
                            isPassed || isActive ? 'text-[#F57D14]' : 'text-white'
                          }`}
                        />
                        <span className={isActive ? 'font-bold text-[#F57D14]' : ''}>
                          {s.title}
                        </span>
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
