'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, BrainCircuit, CheckCircle2, Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { assessmentQuestions } from '@/lib/sarathi-data'
import { toast } from 'sonner'

import SarathiLogo from '@/components/sarathi-logo'

const formSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email'),
  college: z.string().min(2, 'Please enter your college name'),
  q1: z.string().min(1, 'Please pick one option'),
  q2: z.string().min(1, 'Please pick one option'),
  q3: z.string().min(1, 'Please pick one option'),
  q4: z.string().min(1, 'Please pick one option'),
  q5: z.string().min(1, 'Please pick one option'),
})

const stepConfig = [
  {
    title: 'Basic Info',
    description: 'Tell us who you are so your dashboard feels personal.',
    fields: ['name', 'email', 'college'],
  },
  {
    title: 'Mindset & Work Style',
    description: 'Answer the first 2 questions based on instinct, not overthinking.',
    fields: ['q1', 'q2'],
  },
  {
    title: 'Career Signals',
    description: 'Complete the last 3 questions to unlock your recommendation profile.',
    fields: ['q3', 'q4', 'q5'],
  },
]

const trustList = [
  'Short mobile-friendly flow',
  'Mocked payment unlock journey',
  'Dummy AI result dashboard for fast validation',
]

const AssessmentFlow = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      college: '',
      q1: '',
      q2: '',
      q3: '',
      q4: '',
      q5: '',
    },
  })

  const progressValue = useMemo(() => ((currentStep + 1) / stepConfig.length) * 100, [currentStep])
  const questionGroups = [[], assessmentQuestions.slice(0, 2), assessmentQuestions.slice(2)]

  const validateCurrentStep = async () => {
    const fields = stepConfig[currentStep]?.fields || []
    const result = await form.trigger(fields)
    return result
  }

  const onNext = async () => {
    const isValid = await validateCurrentStep()

    if (!isValid) {
      toast.error('Please complete this step before moving ahead.')
      return
    }

    setCurrentStep((previous) => Math.min(previous + 1, stepConfig.length - 1))
  }

  const onPrevious = () => {
    setCurrentStep((previous) => Math.max(previous - 1, 0))
  }

  const onSubmit = async (values) => {
    setSubmitting(true)

    try {
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          college: values.college,
          answers_json: {
            q1: values.q1,
            q2: values.q2,
            q3: values.q3,
            q4: values.q4,
            q5: values.q5,
          },
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
            <SarathiLogo href="/" imageClassName="h-20 w-auto" />
            <div className="mt-4 inline-flex items-center rounded-full border border-[#0A2351]/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0A2351] shadow-sm">
              SARATHI Assessment Flow
            </div>
            <h1 className="mt-4 text-3xl font-bold text-[#0A2351] sm:text-4xl">Discover your strongest career direction</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Complete this short assessment to generate your recommendation profile. Results unlock after a MOCKED ₹99 checkout experience.
            </p>
          </div>

          <Card className="max-w-sm border-slate-200 bg-white shadow-sm">
            <CardContent className="flex items-start gap-3 p-5">
              <div className="rounded-2xl bg-[#F57D14]/10 p-3 text-[#F57D14]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0A2351]">Built for quick mobile completion</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">You can finish the full journey in under 4 minutes.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.55fr]">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="space-y-4 border-b border-slate-100 pb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-2xl text-[#0A2351]">{stepConfig[currentStep]?.title}</CardTitle>
                  <CardDescription className="mt-2 text-sm leading-6 text-slate-500">
                    {stepConfig[currentStep]?.description}
                  </CardDescription>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                  Step {currentStep + 1} of {stepConfig.length}
                </div>
              </div>
              <Progress value={progressValue} className="h-2 bg-slate-100 [&>div]:bg-[#F57D14]" />
            </CardHeader>

            <CardContent className="p-6">
              <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                  {currentStep === 0 && (
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
                  )}

                  {currentStep > 0 && (
                    <div className="space-y-6">
                      {questionGroups[currentStep].map((question) => (
                        <FormField
                          key={question.id}
                          control={form.control}
                          name={question.id}
                          render={({ field }) => (
                            <FormItem className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                              <div className="mb-4">
                                <FormLabel className="text-base font-semibold text-[#0A2351]">{question.question}</FormLabel>
                                <FormDescription className="mt-2">{question.description}</FormDescription>
                              </div>
                              <FormControl>
                                <RadioGroup value={field.value} onValueChange={field.onChange} className="space-y-3">
                                  {question.options.map((option) => (
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
                            </FormItem>
                          )}
                        />
                      ))}
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

                    {currentStep < stepConfig.length - 1 ? (
                      <Button type="button" onClick={onNext} className="h-11 rounded-xl bg-[#0A2351] text-white hover:bg-[#16356d]">
                        Continue
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
                    <p className="text-sm text-white/70">Why this works</p>
                    <p className="font-semibold">Short assessment, strong signal</p>
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
                <CardTitle className="text-lg text-[#0A2351]">What unlocks after payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="rounded-xl bg-slate-50 p-4">Top 3 career paths with fit scores</div>
                <div className="rounded-xl bg-slate-50 p-4">Strength summary and readiness score</div>
                <div className="rounded-xl bg-slate-50 p-4">Download Full PDF Roadmap button</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AssessmentFlow
