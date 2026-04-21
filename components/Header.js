"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SarathiLogo from './sarathi-logo' 

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="border-b border-slate-100 bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex h-20 sm:h-24 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* 🚀 STRIP-STYLE LOGO WITH TAGLINE */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3 sm:gap-5">
            <div className="h-10 sm:h-16 flex items-center [&>svg]:h-full [&>svg]:w-auto">
               <SarathiLogo />
            </div>
            {/* Vertical Divider Line */}
            <div className="h-8 sm:h-10 w-[2px] bg-slate-200"></div>
            {/* Empowering Tagline */}
            <div className="flex flex-col justify-center">
              <span className="text-[8px] sm:text-[10px] lg:text-xs font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-slate-400 leading-tight">Empowering</span>
              <span className="text-[8px] sm:text-[10px] lg:text-xs font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-slate-400 leading-tight">Student Clarity</span>
            </div>
          </Link>
        </div>

        {/* 💻 Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-bold text-slate-600">
          <Link href="/" className="hover:text-[#F57D14] transition-colors">Home</Link>
          <Link href="/about" className="hover:text-[#F57D14] transition-colors">About SARATHI</Link>
          <Link href="/#methodology" className="hover:text-[#F57D14] transition-colors">Methodology</Link>
          <Link href="/#institutions" className="hover:text-[#F57D14] transition-colors">For Institutions</Link>
          <Link href="/#contact" className="hover:text-[#F57D14] transition-colors">Contact</Link>
        </div>

        {/* 📱&💻 Action Buttons Wrapper */}
        <div className="flex items-center gap-3 ml-auto lg:ml-0">
          
          {/* 🚀 FIX: Persistent Mobile CTA + Standardized Desktop Orange Pill */}
          <Button asChild className="rounded-full bg-[#F57D14] px-4 sm:px-6 h-10 sm:h-12 text-xs sm:text-sm font-bold text-white hover:bg-[#dd6f11] shadow-md shadow-[#F57D14]/20 transition-all hover:scale-105">
            <Link href="/assessment">Take the Test</Link>
          </Button>

          {/* 📱 Mobile Hamburger Button */}
          <button 
            className="p-2 text-[#0A2351] lg:hidden" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

      </div>

      {/* 📱 Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 w-full border-t border-slate-100 bg-white p-6 shadow-xl lg:hidden">
          <div className="flex flex-col space-y-4 text-center text-sm font-bold text-slate-600">
            <Link href="/" onClick={() => setIsOpen(false)} className="py-2 hover:text-[#F57D14]">Home</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="py-2 hover:text-[#F57D14]">About SARATHI</Link>
            <Link href="/#methodology" onClick={() => setIsOpen(false)} className="py-2 hover:text-[#F57D14]">Methodology</Link>
            <Link href="/#institutions" onClick={() => setIsOpen(false)} className="py-2 hover:text-[#F57D14]">For Institutions</Link>
            <Link href="/#contact" onClick={() => setIsOpen(false)} className="py-2 hover:text-[#F57D14]">Contact</Link>
          </div>
        </div>
      )}
    </header>
  )
}
