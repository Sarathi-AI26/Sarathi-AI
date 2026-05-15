// components/Header.js
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import SarathiLogo from './sarathi-logo' 

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Check if student is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    
    // Listen for logins/logouts
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    
    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="border-b border-slate-100/80 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="container mx-auto flex h-16 sm:h-24 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* 🚀 STRIP-STYLE LOGO WITH TAGLINE */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 sm:gap-4 hover:opacity-80 transition-all duration-300 group">
            
            {/* Logo scaling: h-6 on mobile, h-9 on laptop */}
            <div className="h-6 sm:h-9 flex items-center [&>svg]:h-full [&>svg]:w-auto [&>img]:h-full [&>img]:w-auto">
               <SarathiLogo />
            </div>
            
            {/* Hidden divider on phones */}
            <div className="hidden sm:block h-5 sm:h-7 w-[1.5px] bg-[#0A2351]/10"></div>
            
            {/* Hidden tagline on phones */}
            <div className="hidden sm:flex flex-col justify-center">
              <span className="text-[7px] sm:text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-[#0A2351]/40 leading-tight">Empowering</span>
              <span className="text-[7px] sm:text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-[#0A2351]/40 leading-tight">Student Clarity</span>
            </div>
          </Link>
        </div>

        {/* 💻 Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-bold text-slate-600 ml-auto">
          <Link href="/" className="hover:text-[#F57D14] transition-colors duration-300">Home</Link>
          <Link href="/about" className="hover:text-[#F57D14] transition-colors duration-300">About SARATHI</Link>
          <Link href="/#methodology" className="hover:text-[#F57D14] transition-colors duration-300">Methodology</Link>
          <Link href="/#institutions" className="hover:text-[#F57D14] transition-colors duration-300">For Institutions</Link>
          <Link href="/#contact" className="hover:text-[#F57D14] transition-colors duration-300">Contact</Link>
          
          {/* NEW: Desktop Login/Dashboard Button */}
          <div className="pl-4 border-l-2 border-slate-100">
            {session ? (
              <Link
                href="/dashboard/student"
                className="flex items-center gap-2 rounded-full bg-[#0A2351] px-5 py-2 text-sm font-bold text-white hover:bg-[#F57D14] transition-all hover:scale-105 shadow-md shadow-[#0A2351]/20"
              >
                My Report <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-full border-2 border-[#0A2351] bg-white px-5 py-1.5 text-sm font-bold text-[#0A2351] hover:bg-[#0A2351] hover:text-white transition-all shadow-sm"
              >
                View My Report
              </Link>
            )}
          </div>
        </div>

        {/* 📱 Mobile Hamburger Button */}
        <div className="flex items-center lg:hidden ml-auto">
          <button 
            className="p-1 sm:p-2 text-[#0A2351] hover:bg-slate-50 rounded-lg transition-colors" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-6 w-6 sm:h-7 sm:w-7" /> : <Menu className="h-6 w-6 sm:h-7 sm:w-7" />}
          </button>
        </div>

      </div>

      {/* 📱 Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 w-full border-t-2 border-[#F57D14] bg-white p-6 shadow-2xl rounded-b-[2rem] lg:hidden animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col space-y-4 text-center text-sm font-bold text-slate-600">
            <Link href="/" onClick={() => setIsOpen(false)} className="py-2 hover:text-[#F57D14] transition-colors">Home</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="py-2 hover:text-[#F57D14] transition-colors">About SARATHI</Link>
            <Link href="/#methodology" onClick={() => setIsOpen(false)} className="py-2 hover:text-[#F57D14] transition-colors">Methodology</Link>
            <Link href="/#institutions" onClick={() => setIsOpen(false)} className="py-2 hover:text-[#F57D14] transition-colors">For Institutions</Link>
            <Link href="/#contact" onClick={() => setIsOpen(false)} className="py-2 hover:text-[#F57D14] transition-colors">Contact</Link>
            
            {/* NEW: Mobile Login/Dashboard Button */}
            <div className="pt-4 border-t border-slate-100 mt-2">
              {session ? (
                <Link
                  href="/dashboard/student"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-full bg-[#0A2351] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#0A2351]/20"
                >
                  My Report <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full rounded-full border-2 border-[#0A2351] bg-white px-5 py-3 text-sm font-bold text-[#0A2351]"
                >
                  View My Report
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
