"use client"

import React, { useState } from 'react'
import ResultDashboardReal from '@/components/result-dashboard-real'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const App = ({ searchParams }) => {
  const assessmentId = Array.isArray(searchParams?.id) ? searchParams?.id?.[0] : searchParams?.id || ''
  const [isDownloading, setIsDownloading] = useState(false)
  const [isReportReady, setIsReportReady] = useState(false)
  
  // 🚀 NEW: State to trigger the vertical PDF layout
  const [isPdfMode, setIsPdfMode] = useState(false)

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    setIsPdfMode(true) // Trigger the layout shift

    // 🚀 Wait 800ms for the UI to stack vertically before snapping the PDF
    setTimeout(async () => {
      try {
        const html2pdf = (await import('html2pdf.js')).default;
        const element = document.getElementById('sarathi-report');
        
        const opt = {
          margin:       0.5, 
          filename:     'SARATHI_Career_Roadmap.pdf',
          image:        { type: 'jpeg', quality: 1 },
          html2canvas:  { scale: 2, useCORS: true }, 
          jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
          pagebreak:    { mode: ['css', 'legacy'] } 
        };

        await html2pdf().set(opt).from(element).save();
      } catch (error) {
        console.error("PDF Generation Failed:", error);
      } finally {
        setIsPdfMode(false) // Instantly revert back to the beautiful 3-column web view
        setIsDownloading(false)
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        {isReportReady && (
          <div className="flex justify-end mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Button 
              onClick={handleDownloadPDF} 
              disabled={isDownloading}
              className="h-12 rounded-2xl bg-[#F57D14] px-6 font-bold text-white shadow-lg hover:bg-[#dd6f11] transition-all"
            >
              {isDownloading ? (
                <>Generating PDF <Loader2 className="ml-2 h-4 w-4 animate-spin" /></>
              ) : (
                <>Download PDF <Download className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </div>
        )}

        <div id="sarathi-report" className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {/* 🚀 Pass the isPdfMode state down to the dashboard */}
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

export default App
