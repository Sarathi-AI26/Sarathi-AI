"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import SarathiLogo from './sarathi-logo' 

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="border-b border-slate-100 bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex h-16 sm:h-24 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* 🚀 STRIP-STYLE LOGO WITH TAGLINE */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 sm:gap-4 hover:opacity-90 transition-opacity">
            
            {/* Logo scaling: h-6 on mobile, h-9 on laptop */}
            <div className="h-6 sm:h-9 flex items-center [&>svg]:h-full [&>svg]:w-auto [&>img]:h-full [&>img]:w-auto">
               <SarathiLogo />
            </div>
            
            {/* Hidden divider on phones */}
            <div className="hidden sm:block h-5 sm:h-7 w-[2px] bg-slate-200"></div>
            
            {/* Hidden tagline on phones */}
            <div className="hidden sm:flex flex-col justify-center">
              <span className="text-[7px] sm:text-[8px] lg:text-[10px] font-bold uppercase tracking-tight sm:tracking-widest text-slate-400 leading-tight">Empowering</span>
              <span className="text-[7px] sm:text-[8px] lg:text-[10px] font-bold uppercase tracking-tight sm:tracking-widest text-slate-400 leading-tight">Student Clarity</span>
            </div>
          </Link>
        </div>

        {/* 💻 Desktop Navigation */}
        {/* Adjusted ml-auto to push links to the right since the button is gone */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-bold text-slate-600 ml-auto">
          <Link href="/" className="hover:text-[#F57D14] transition-colors">Home</Link>
          <Link href="/about" className="hover:text-[#F57D14] transition-colors">About SARATHI</Link>
          <Link href="/#methodology" className="hover:text-[#F57D14] transition-colors">Methodology</Link>
          <Link href="/#institutions" className="hover:text-[#F57D14] transition-colors">For Institutions</Link>
          <Link href="/#contact" className="hover:text-[#F57D14] transition-colors">Contact</Link>
        </div>

        {/* 📱 Mobile Hamburger Button */}
        <div className="flex items-center lg:hidden ml-auto">
          <button 
            className="p-1 sm:p-2 text-[#0A2351]" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-6 w-6 sm:h-7 sm:w-7" /> : <Menu className="h-6 w-6 sm:h-7 sm:w-7" />}
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
