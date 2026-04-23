'use client'

import React, { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ResultDashboardReal from '@/components/result-dashboard-real'
import { Download, Loader2, Share2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

// ─────────────────────────────────────────────
// PDF GENERATION CONFIG
// ─────────────────────────────────────────────
const PDF_OPTIONS = {
  margin: [0.5, 0.5, 0.5, 0.5],
  filename: 'SARATHI_Career_Roadmap.pdf',
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: {
    scale: 2,
    useCORS: true,
    windowWidth: 900,         // wider for the new layout
    letterRendering: true,
    logging: false,
    onclone: (clonedDoc) => {
      // Ensure all fonts and colors render correctly in the clone
      clonedDoc.documentElement.style.webkitPrintColorAdjust = 'exact'
    },
  },
  jsPDF: {
    unit: 'in',
    format: 'a4',
    orientation: 'portrait',
    compress: true,
  },
  pagebreak: {
    mode: ['css', 'legacy'],
    avoid: '.avoid-break',
    before: '.html2pdf__page-break',
  },
}

// ─────────────────────────────────────────────
// RESULT PAGE
// ─────────────────────────────────────────────
const ResultPage = () => {
  const searchParams = useSearchParams()
  const assessmentId = searchParams.get('id') || ''

  const [isDownloading, setIsDownloading] = useState(false)
  const [isReportReady, setIsReportReady] = useState(false)
  const [isPdfMode, setIsPdfMode] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    setIsPdfMode(true)

    // Wait for React to repaint in PDF mode
    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      const html2pdf = (await import('html2pdf.js')).default
      const element = document.getElementById('sarathi-report')
      if (!element) throw new Error('Report element not found')

      await html2pdf()
        .set(PDF_OPTIONS)
        .from(element)
        .save()

    } catch (error) {
      console.error('PDF generation failed:', error)
      alert('PDF generation failed. Please try again.')
    } finally {
      setIsPdfMode(false)
      setIsDownloading(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      console.warn('Clipboard copy failed')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

        {/* Action bar */}
        {isReportReady && (
          <div className="flex items-center justify-between mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="text-sm text-slate-500 hidden sm:block">
              Your personalised career roadmap is ready.
            </p>
            <div className="flex items-center gap-3 ml-auto">
              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="h-12 rounded-2xl px-5 font-medium border-slate-200 text-slate-600 hover:border-[#0A2351] transition-all"
              >
                {copied ? (
                  <><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Link Copied</>
                ) : (
                  <><Share2 className="mr-2 h-4 w-4" /> Share</>
                )}
              </Button>
              <Button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="h-12 rounded-2xl bg-[#F57D14] px-6 font-bold text-white shadow-lg hover:bg-[#dd6f11] transition-all disabled:opacity-70"
              >
                {isDownloading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating PDF...</>
                ) : (
                  <><Download className="mr-2 h-4 w-4" /> Download PDF</>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Report */}
        <div
          id="sarathi-report"
          className={`bg-white ${
            isPdfMode
              ? 'm-0 p-0'
              : 'rounded-3xl border border-slate-100 shadow-sm overflow-hidden'
          }`}
        >
          <ResultDashboardReal
            assessmentId={assessmentId}
            onReady={() => setIsReportReady(true)}
            isPdfMode={isPdfMode}
          />
        </div>

      </div>
    </div>
  )
}

// Suspense wrapper required for useSearchParams in App Router
const ResultPageWrapper = () => (
  <Suspense fallback={
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#F57D14]" />
    </div>
  }>
    <ResultPage />
  </Suspense>
)

export default ResultPageWrapper
