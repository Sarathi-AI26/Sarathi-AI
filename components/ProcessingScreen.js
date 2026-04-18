'use client'
import { Loader2, Sparkles, BrainCircuit, LineChart } from 'lucide-react'

export default function ProcessingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 animate-in fade-in duration-700">
      {/* 🌀 The Pulsing Orange Loader */}
      <div className="relative mb-12">
        <div className="absolute inset-0 rounded-full bg-sarathi-orange/20 animate-ping" />
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-white border-4 border-sarathi-blue shadow-2xl">
          <Loader2 className="w-10 h-10 text-sarathi-orange animate-spin" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-sarathi-blue mb-4">
        Analyzing Your Profile
      </h2>
      
      <p className="text-slate-500 mb-10 max-w-sm">
        Our Gemini AI is currently mapping your intrinsic traits to 500+ Indian career pathways. This usually takes about 10 seconds.
      </p>

      {/* ✨ Professional Status Indicators */}
      <div className="w-full max-w-xs space-y-3">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
          <Sparkles className="w-4 h-4 text-sarathi-orange" />
          <span>Synthesizing personality pillars...</span>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
          <BrainCircuit className="w-4 h-4 text-sarathi-orange" />
          <span>Evaluating industry compatibility...</span>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
          <LineChart className="w-4 h-4 text-sarathi-orange" />
          <span>Generating 5-year execution plan...</span>
        </div>
      </div>
    </div>
  )
}
