// components/CampusLanding.jsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, Shield, Brain, Users } from 'lucide-react'

export default function CampusLanding({
  institution,
  seatsRemaining,
  seatsExhausted
}) {

  useEffect(() => {
    if (institution?.id) {
      // Store in both localStorage AND sessionStorage for resilience
      localStorage.setItem('sarathi_institution_id', institution.id)
      localStorage.setItem('sarathi_institution_name', institution.name)
      sessionStorage.setItem('sarathi_institution_id', institution.id)
    }
  }, [institution])

  if (seatsExhausted) {
    return (
      <div className="min-h-screen bg-[#0A2351] flex items-center justify-center p-8 text-center">
        <div className="max-w-md">
          <h1 className="text-3xl font-extrabold text-white mb-4">
            Assessment slots are full
          </h1>
          <p className="text-white/60 text-base leading-relaxed mb-6">
            {institution.name} has used all available assessment seats for this batch.
            Please contact your placement cell for the next batch opening.
          </p>
          
          <a
            href={`mailto:admin@sarathiapp.in?subject=Seats request — ${institution.name}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white hover:border-[#F57D14] hover:text-[#F57D14] transition-colors"
          >
            Contact SARATHI
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A2351] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">

      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-[#F57D14] opacity-10 blur-[120px]" />
        
        {/* 🚀 THE FIX: Reduced bottom glow opacity to let the CTA button pop */}
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#F57D14] opacity-5 blur-[120px]" />
        
        {/* Grid dots */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center">

        {/* Co-brand header */}
        <div className="mb-10 flex items-center justify-center gap-4 flex-wrap">
          <span className="text-2xl font-extrabold text-white tracking-tight">
            SARATHI
          </span>
          <span className="text-white/30 text-2xl font-light">×</span>
          <span className="text-2xl font-bold text-[#F57D14]">
            {institution.name}
          </span>
        </div>

        {/* 🚀 THE FIX: High-contrast badge for better readability */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F57D14]/40 bg-[#F57D14]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm">
          <Shield className="h-3 w-3 text-[#F57D14]" />
          Institutional Partnership — Free for Your Batch
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
          Discover Your
          <br />
          <span className="text-[#F57D14]">Career DNA</span>
        </h1>

        <p className="text-white/60 text-base mb-10 max-w-sm mx-auto leading-relaxed">
          {institution.name} has partnered with SARATHI to give every student
          a personalised 8-page career roadmap — at no cost to you.
        </p>

        {/* Feature grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { icon: Zap,    label: '15 Minutes' },
            { icon: Shield, label: 'Free for You' },
            { icon: Brain,  label: '60 Dimensions' },
            { icon: Users,  label: '8-Page Report' },
          ].map(({ icon: Icon, label }) => (
            <div key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm">
              <Icon className="h-5 w-5 text-[#F57D14] mx-auto mb-2" />
              <p className="text-xs font-bold text-white/70">{label}</p>
            </div>
          ))}
        </div>

        {/* Seats indicator */}
        {seatsRemaining <= 20 && seatsRemaining > 0 && (
          <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-bold text-amber-400">
            ⚠ Only {seatsRemaining} assessment slots remaining for your batch
          </div>
        )}

        {/* CTA */}
        <Link
          href="/assessment"
          className="inline-flex items-center gap-3 rounded-full bg-[#F57D14] px-8 py-4 text-base font-extrabold text-white shadow-2xl shadow-[#F57D14]/30 transition-all hover:bg-[#dd6f11] hover:scale-105"
        >
          Start Your Free Assessment
          <ArrowRight className="h-5 w-5" />
        </Link>

        <p className="mt-4 text-xs text-white/30">
          Takes 15 minutes · No payment required · Results saved permanently
        </p>

        {/* Already have a report */}
        <p className="mt-6 text-sm text-white/40">
          Already completed your assessment?{' '}
          <Link href="/login" className="font-bold text-[#F57D14] hover:underline">
            View your report →
          </Link>
        </p>
      </div>
    </div>
  )
}
