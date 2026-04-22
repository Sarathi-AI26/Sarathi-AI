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
  toNumericAnswers,
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
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0)
  const [textResponse, setTextResponse] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  // answersMap: { q1: 2, q2: 4, q56: "I want to be..." }
  // Integer values for choice questions, string for open-ended
  const [answersMap, setAnswersMap] = useState({})
  const [completedSteps, setCompletedSteps] = useState([])
  const [formData, setFormData] = useState({ name: '', email: '', college: '' })

  const totalSteps = assessmentQuestions.length // 60
  const progress = (absoluteStep / totalSteps) * 100

  // Current question object from the single source of truth
  const currentQuestion = assessmentQuestions[absoluteStep - 1]
  const isOpenEnded = currentQuestion?.input_type === 'text'
  const isLastStep = absoluteStep === totalSteps

  // Which section are we in?
  const currentSection = assessmentSections[currentSectionIdx]

  // Sync currentSectionIdx whenever absoluteStep changes
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

  // When navigating back to an open-ended question, restore the saved text
  useEffect(() => {
    if (isOpenEnded) {
      setTextResponse(answersMap[currentQuestion.id] || '')
    }
  }, [absoluteStep, isOpenEnded])

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.email.includes('@') &&
    formData.college.trim() !== ''

  const handleStartTest = () => {
    setIsFormCompleted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Save answer and advance — or submit on last step
  const handleNext = async (selectedOptionValue = null) => {
    const qId = currentQuestion.id

    // Build updated answers map
    const updatedMap = { ...answersMap }
    if (isOpenEnded) {
      updatedMap[qId] = textResponse.trim()
    } else {
      // selectedOptionValue is already an integer (1–5 or 1–4)
      updatedMap[qId] = selectedOptionValue
    }
    setAnswersMap(updatedMap)

    if (!completedSteps.includes(absoluteStep)) {
      setCompletedSteps((prev) => [...prev, absoluteStep])
    }

    if (!isLastStep) {
      setTimeout(() => {
        setAbsoluteStep((prev) => prev + 1)
        setTextResponse('')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 300)
      return
    }

    // ── FINAL SUBMISSION ──────────────────────────────────────
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // toNumericAnswers converts the map to an ordered array of 60 integers
      // Open-ended answers (strings) are kept as-is at their positions
      const orderedAnswers = toNumericAnswers(updatedMap)

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
        router.push(`/result?id=${data.assessmentId}`)
      } else {
        throw new Error('No assessment ID returned')
      }
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitError(error.message || 'Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handlePrevious = () => {
    if (absoluteStep > 1) {
      setAbsoluteStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setIsFormCompleted(false)
    }
  }

  // Is the current choice question already answered?
  const currentAnswer = answersMap[currentQuestion?.id]
  const canProceedOpenEnded = isOpenEnded && textResponse.trim().length > 0
  const isAnswered = !isOpenEnded && currentAnswer !== undefined && currentAnswer !== null

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
                      <p className="text-sm text-red-500">{submitError}</p>
                    )}
                    <div className="flex items-center justify-between pt-6">
                      <Button
                        variant="ghost"
                        onClick={handlePrevious}
                        className="text-slate-500 hover:text-[#0A2351]"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>
                      <Button
                        onClick={() => handleNext(null)}
                        disabled={!canProceedOpenEnded}
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

                    {/* Options — driven by question.options from psychometric-assessment.js */}
                    <div className="grid gap-3">
                      {currentQuestion.options.map((opt) => {
                        const isSelected = currentAnswer === opt.value
                        return (
                          <button
                            key={opt.value}
                            onClick={() => handleNext(opt.value)}
                            className={`w-full rounded-2xl border p-4 text-left text-sm font-medium transition-all ${
                              isSelected
                                ? 'border-[#F57D14] bg-[#F57D14]/5 text-[#F57D14]'
                                : 'border-slate-200 hover:border-[#F57D14] hover:bg-[#F57D14]/5 hover:text-[#F57D14]'
                            }`}
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
                        className="text-slate-500 hover:text-[#0A2351]"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {absoluteStep === 1 ? 'Back to Details' : 'Previous Question'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── ASSESSMENT MAP ── */}
              {isFormCompleted && !isSubmitting && (
                <div className="mt-12 border-t border-slate-100 pt-8">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                    Assessment Map
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {assessmentQuestions.map((_, i) => {
                      const stepNum = i + 1
                      const isCompleted = completedSteps.includes(stepNum)
                      const isCurrent = absoluteStep === stepNum
                      return (
                        <div
                          key={i}
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                            isCompleted ? 'bg-[#F57D14] text-white' : 'bg-slate-100 text-slate-400'
                          } ${isCurrent ? 'ring-2 ring-[#0A2351] ring-offset-2' : ''}`}
                        >
                          {stepNum}
                        </div>
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
