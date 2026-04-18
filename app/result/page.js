"use client"

import React, { useState } from 'react'
import ResultDashboardReal from '@/components/result-dashboard-real'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const App = ({ searchParams }) => {
  const assessmentId = Array.isArray(searchParams?.id) ? searchParams?.id?.[0] : searchParams?.id || ''
  const [isDownloading, setIsDownloading] = useState(false)

  // 🚀 PDF Download Logic
  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      // Dynamically import to prevent Next.js server crashes
      const html2pdf = (await import('html2pdf.js')).default;
      
      // Target the safe zone div
      const element = document.getElementById('sarathi-report');
      
      // PDF Configuration for a premium look
      const opt = {
        margin:       [0.5, 0.5, 0.5, 0.5], 
        filename:     'SARATHI_Career_Roadmap.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true }, 
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF Generation Failed:", error);
    } finally {
      setIsDownloading(false)
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        {/* 🟡 Download Button Toolbar */}
        <div className="flex justify-end mb-6">
          <Button 
            onClick={handleDownloadPDF} 
            disabled={isDownloading}
            className="h-12 rounded-xl bg-[#F57D14] px-6 font-bold text-white shadow-lg hover:bg-[#dd6f11] transition-all"
          >
            {isDownloading ? (
              <>Generating PDF <Loader2 className="ml-2 h-4 w-4 animate-spin" /></>
            ) : (
              <>Download PDF <Download className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </div>

        {/* 📄 THE SAFE ZONE: Everything inside this div gets printed to the PDF */}
        <div id="sarathi-report" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          
          {/* Your untouched, fully working dashboard component */}
          <ResultDashboardReal assessmentId={assessmentId} />
          
        </div>
      </div>
    </div>
  )
}

export default App
