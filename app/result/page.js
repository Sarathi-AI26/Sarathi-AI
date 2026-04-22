'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ResultDashboardReal from '@/components/result-dashboard-real'
import { Download, Loader2, Share2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

// ─────────────────────────────────────────────
// Inner component reads searchParams safely via hook
// ─────────────────────────────────────────────
const ResultPage = () => {
  const searchParams = useSearchParams()
  const assessmentId = searchParams.get('id') || ''

  const [isDownloading, setIsDownloading] = useState(false)
  const [isReportReady, setIsReportReady] = useState(false)
  const [isPdfMode, setIsPdfMode] = useState(false)
  const [copied, setCopied] = useState(false)

  // Guard: redirect if no ID
  useEffect(() => {
    if (!assessmentId) {
      console.warn('No assessment ID in URL — user may have landed here directly.')
    }
  }, [assessmentId])

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    setIsPdfMode(true)

    // Give React one paint cycle to re-render in PDF mode before capturing
    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      const html2pdf = (await import('html2pdf.js')).default
      const element = document.getElementById('sarathi-report')

      if (!element) throw new Error('Report element not found')

      const opt = {
        margin: [0.4, 0.4, 0.4, 0.4],
        filename: 'SARATHI_Career_Roadmap.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          windowWidth: 1024,
          letterRendering: true,
        },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        // Synced with the class name used in result-dashboard-real.jsx
        pagebreak: { mode: ['css', 'legacy'], avoid: '.avoid-break' },
      }

      await html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error('PDF Generation Failed:', error)
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
      // Fallback for browsers that block clipboard
      console.warn('Clipboard copy failed')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

        {/* Action bar — only shown once report is ready */}
        {isReportReady && (
          <div className="flex items-center justify-between mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="text-sm text-slate-500 hidden sm:block">
              Your personalised career roadmap is ready.
            </p>
            <div className="flex items-center gap-3 ml-auto">
              {/* Share link button */}
              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="h-12 rounded-2xl px-5 font-medium border-slate-200 text-slate-600 hover:border-[#0A2351] hover:text-[#0A2351] transition-all"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    Link Copied
                  </>
                ) : (
                  <>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </>
                )}
              </Button>

              {/* Download PDF button */}
              <Button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="h-12 rounded-2xl bg-[#F57D14] px-6 font-bold text-white shadow-lg hover:bg-[#dd6f11] transition-all disabled:opacity-70"
              >
                {isDownloading ? (
                  <>
                    Generating PDF
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Download PDF
                    <Download className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Report container */}
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

// ─────────────────────────────────────────────
// Outer wrapper — Suspense required for useSearchParams in App Router
// ─────────────────────────────────────────────
const ResultPageWrapper = () => (
  <Suspense
    fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#F57D14]" />
      </div>
    }
  >
    <ResultPage />
  </Suspense>
)

export default ResultPageWrapper
