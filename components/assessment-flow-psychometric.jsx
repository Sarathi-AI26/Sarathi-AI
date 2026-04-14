'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, BrainCircuit, CheckCircle2, Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import SarathiLogo from '@/components/sarathi-logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { assessmentQuestions, assessmentSections } from '@/lib/psychometric-assessment'
import { toast } from 'sonner'

const questionSchemaShape = Object.fromEntries(
  assessmentQuestions.map((question) => [
    question.id,
    question.input_type === 'text'
      ? z.string().trim().min(10, 'Please share a bit more detail before moving ahead')
      : z.string().min(1, 'Please select one option before moving ahead'),
  ])
)

const formSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email'),
  college: z.string().min(2, 'Please enter your college name'),
  ...questionSchemaShape,
})

const trustList = [
  'Structured 6-section psychometric journey',
  'Progress saved in a single guided flow',
  'Open-ended responses included for deeper AI insight',
]

const AssessmentFlowPsychometric = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const defaultQuestionValues = Object.fromEntries(
    assessmentQuestions.map((question) => [question.id, ''])
  )

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      college: '',
      ...defaultQuestionValues,
    },
  })

  const totalSteps = assessmentQuestions.length + 1
  const progressValue = useMemo(() => ((currentStep + 1) / totalSteps) * 100, [currentStep, totalSteps])
  const currentQuestion = currentStep > 0 ? assessmentQuestions[currentStep - 1] : null
  const currentSectionIndex = currentQuestion
    ? assessmentSections.findIndex((section) => section.id === currentQuestion.section_id)
    : -1

  const answeredCount = assessmentQuestions.filter((question) => {
    const value = form.watch(question.id)
    return typeof value === 'string' && value.trim().length > 0
  }).length

  const validateCurrentStep = async () => {
    if (currentStep === 0) {
      return form.trigger(['name', 'email', 'college'])
    }

    if (!currentQuestion) {
      return false
    }

    return form.trigger(currentQuestion.id)
  }

  const onNext = async () => {
    const isValid = await validateCurrentStep()

    if (!isValid) {
      toast.error('Please complete this step before moving ahead.')
      return
    }

    setCurrentStep((previous) => Math.min(previous + 1, totalSteps - 1))
  }

  const onPrevious = () => {
    setCurrentStep((previous) => Math.max(previous - 1, 0))
  }

  const onSubmit = async (values) => {
    setSubmitting(true)

    try {
      const answersJson = Object.fromEntries(
        assessmentQuestions.map((question) => [question.id, values[question.id]])
      )

      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          college: values.college,
          answers_json: answersJson,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to create assessment')
      }

      toast.success('Assessment saved. Redirecting to checkout...')
      router.push(`/checkout?assessmentId=${data?.assessment?.id}`)
    } catch (error) {
      toast.error(error?.message || 'Something went wrong while saving your assessment.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Button asChild variant="ghost" className="mb-3 px-0 text-slate-500 hover:bg-transparent hover:text-[#0A2351]">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to home
              </Link>
            </Button>
            <SarathiLogo href="/" imageClassName="h-20 w-auto" />
            <div className="mt-4 inline-flex items-center rounded-full border border-[#0A2351]/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0A2351] shadow-sm">
              60-Question Psychometric Assessment
            </div>
            <h1 className="mt-4 text-3xl font-bold text-[#0A2351] sm:text-4xl">Discover your strongest career direction</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              Move through all 6 sections of the SARATHI assessment — personality, interests, aptitude, motivation, behaviour, and open-ended reflections — in one guided flow.
            </p>
          </div>

          <Card className="max-w-sm border-slate-200 bg-white shadow-sm">
            <CardContent className="flex items-start gap-3 p-5">
              <div className="rounded-2xl bg-[#F57D14]/10 p-3 text-[#F57D14]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0A2351]">Long-form but easy to complete</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">One question at a time keeps the experience focused and mobile-friendly.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.55fr]">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="space-y-4 border-b border-slate-100 pb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-2xl text-[#0A2351]">
                    {currentStep === 0 ? 'Basic Info' : currentQuestion?.section_title}
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm leading-6 text-slate-500">
                    {currentStep === 0
                      ? 'Tell us who you are so SARATHI can personalize your roadmap.'
                      : currentQuestion?.section_description}
                  </CardDescription>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                  Step {currentStep + 1} of {totalSteps}
                </div>
              </div>
              <Progress value={progressValue} className="h-2 bg-slate-100 [&>div]:bg-[#F57D14]" />
            </CardHeader>

            <CardContent className="p-6">
              <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                  {currentStep === 0 ? (
                    <div className="grid gap-5 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-[#0A2351]">Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. Aditi Sharma" className="h-11 rounded-xl border-slate-200" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#0A2351]">Email</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="you@example.com" className="h-11 rounded-xl border-slate-200" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="college"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#0A2351]">College</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. Delhi University" className="h-11 rounded-xl border-slate-200" />
                            </FormControl>
                            <FormDescription>This helps personalize your dashboard summary.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          <span>Question {currentQuestion?.question_number} of {assessmentQuestions.length}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <span>Section {currentSectionIndex + 1} of {assessmentSections.length}</span>
                        </div>
                        <p className="text-lg font-semibold leading-8 text-[#0A2351]">{currentQuestion?.question}</p>
                      </div>

                      <FormField
                        control={form.control}
                        name={currentQuestion?.id}
                        render={({ field }) => (
                          <FormItem>
                            {currentQuestion?.input_type === 'text' ? (
                              <>
                                <FormLabel className="text-[#0A2351]">Your Response</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    rows={6}
                                    placeholder="Write your thoughts in a few meaningful sentences..."
                                    className="min-h-[180px] rounded-2xl border-slate-200 bg-white"
                                  />
                                </FormControl>
                                <FormDescription>
                                  These responses help SARATHI understand your motivation, communication style, and long-term goals.
                                </FormDescription>
                                <FormMessage />
                              </>
                            ) : (
                              <>
                                <FormLabel className="text-[#0A2351]">Choose the option that fits best</FormLabel>
                                <FormControl>
                                  <RadioGroup value={field.value} onValueChange={field.onChange} className="space-y-3">
                                    {(currentQuestion?.options || []).map((option) => (
                                      <label
                                        key={option.value}
                                        className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-[#0A2351]/30 hover:bg-[#0A2351]/[0.02]"
                                      >
                                        <RadioGroupItem value={option.value} className="mt-1 border-[#0A2351] text-[#0A2351]" />
                                        <span className="text-sm leading-6 text-slate-700">{option.label}</span>
                                      </label>
                                    ))}
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onPrevious}
                      disabled={currentStep === 0 || submitting}
                      className="h-11 rounded-xl border-slate-200"
                    >
                      Previous
                    </Button>

                    {currentStep < totalSteps - 1 ? (
                      <Button type="button" onClick={onNext} className="h-11 rounded-xl bg-[#0A2351] text-white hover:bg-[#16356d]">
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button type="submit" disabled={submitting} className="h-11 rounded-xl bg-[#F57D14] text-white hover:bg-[#dd6f11]">
                        {submitting ? 'Saving assessment...' : 'Continue to Checkout'}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-0 bg-[#0A2351] text-white shadow-lg shadow-[#0A2351]/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/10 p-3 text-[#F57D14]">
                    <BrainCircuit className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Assessment overview</p>
                    <p className="font-semibold">6 sections • 60 questions • guided flow</p>
                  </div>
                </div>
                <ul className="mt-6 space-y-4 text-sm text-white/80">
                  {trustList.map((item) => (
                    <li key={item} className="flex gap-3 rounded-xl bg-white/5 p-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#F57D14]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-[#0A2351]">Section progress</CardTitle>
                <CardDescription>{answeredCount} of {assessmentQuestions.length} assessment responses completed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                {assessmentSections.map((section, index) => {
                  const completedInSection = section.questions.filter((question) => {
                    const value = form.watch(question.id)
                    return typeof value === 'string' && value.trim().length > 0
                  }).length

                  const isActive = currentQuestion?.section_id === section.id

                  return (
                    <div
                      key={section.id}
                      className={`rounded-xl border p-4 ${isActive ? 'border-[#F57D14]/40 bg-[#F57D14]/5' : 'border-slate-200 bg-slate-50'}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#0A2351]">Section {index + 1}: {section.title}</p>
                          <p className="mt-1 text-xs text-slate-500">{section.description}</p>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          {completedInSection}/{section.questions.length}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AssessmentFlowPsychometric
