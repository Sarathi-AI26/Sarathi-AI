"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SarathiLogo from './sarathi-logo' 

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="border-b border-slate-100 bg-white sticky top-0 z-50">
      <div className="container mx-auto flex h-24 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* 🚀 STRIP-STYLE LOGO WITH TAGLINE */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-4 sm:gap-5">
            {/* The Logo */}
            <div className="h-16 sm:h-20 w-auto flex items-center">
               <SarathiLogo />
            </div>
            
            {/* Vertical Divider Line (Hidden on tiny screens) */}
            <div className="hidden sm:block h-10 w-[2px] bg-slate-200"></div>
            
            {/* Empowering Tagline (Hidden on tiny screens) */}
            <div className="hidden sm:flex flex-col justify-center pt-1">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-400 leading-tight">Empowering</span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-400 leading-tight">Student Clarity</span>
            </div>
          </Link>
        </div>

        {/* 💻 Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
          <Link href="/" className="hover:text-[#F57D14] transition-colors">Home</Link>
          <Link href="/about" className="hover:text-[#F57D14] transition-colors">About SARATHI</Link>
          <Link href="/#methodology" className="hover:text-[#F57D14] transition-colors">Methodology</Link>
          <Link href="/#institutions" className="hover:text-[#F57D14] transition-colors">For Institutions</Link>
          <Link href="/#contact" className="hover:text-[#F57D14] transition-colors">Contact</Link>
        </div>

        {/* 💻 Desktop Button */}
        <div className="hidden md:block">
          <Button asChild className="rounded-full bg-[#0A2351] px-6 h-12 font-bold text-white hover:bg-[#0A2351]/90 shadow-md shadow-[#0A2351]/10">
            <Link href="/assessment">Take the Test</Link>
          </Button>
        </div>

        {/* 📱 Mobile Hamburger Button */}
        <button 
          className="p-2 text-[#0A2351] md:hidden" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* 📱 Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 w-full border-t border-slate-100 bg-white p-6 shadow-xl md:hidden">
          <div className="flex flex-col space-y-4 text-center text-sm font-bold text-slate-600">
            <Link href="/" onClick={() => setIsOpen(false)} className="py-2 hover:text-[#F57D14]">Home</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="py-2 hover:text-[#F57D14]">About SARATHI</Link>
            <Link href="/#methodology" onClick={() => setIsOpen(false)} className="py-2 hover:text-[#F57D14]">Methodology</Link>
            <Link href="/#institutions" onClick={() => setIsOpen(false)} className="py-2 hover:text-[#F57D14]">For Institutions</Link>
            <Link href="/#contact" onClick={() => setIsOpen(false)} className="py-2 hover:text-[#F57D14]">Contact</Link>
            <div className="pt-4 border-t border-slate-100">
              <Button asChild className="w-full h-12 rounded-xl bg-[#F57D14] text-white hover:bg-[#dd6f11] shadow-lg shadow-[#F57D14]/20">
                <Link href="/assessment" onClick={() => setIsOpen(false)}>Take the Test</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
