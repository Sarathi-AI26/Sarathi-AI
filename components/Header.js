import Link from 'next/link';
import SarathiLogo from '@/components/sarathi-logo'; 
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-24 items-center justify-between px-6 sm:px-8">
        
        {/* 🚀 LONG STRIP LOGO AREA */}
        <div className="flex items-center gap-4">
          <SarathiLogo href="/" imageClassName="h-14 w-auto sm:h-20" />
          <div className="hidden h-10 w-[1px] bg-slate-200 md:block" />
          <p className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-[#0A2351]/40 md:block">
            Empowering <br /> Student Clarity
          </p>
        </div>

        {/* 🧭 EXPANDED NAVIGATION */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link href="/" className="text-sm font-semibold text-[#0A2351] hover:text-[#F57D14] transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-sm font-semibold text-[#0A2351] hover:text-[#F57D14] transition-colors">
            About SARATHI
          </Link>
          <Link href="#methodology" className="text-sm font-semibold text-[#0A2351] hover:text-[#F57D14] transition-colors">
            Methodology
          </Link>
          <Link href="#institutions" className="text-sm font-semibold text-[#0A2351] hover:text-[#F57D14] transition-colors">
            For Institutions
          </Link>
        </nav>

        {/* 🎯 HEADER CTA */}
        <div className="flex items-center gap-4">
          <Button asChild className="hidden rounded-full bg-[#0A2351] px-6 text-sm font-bold text-white hover:bg-[#0A2351]/90 sm:flex">
            <Link href="/assessment">Take the Test</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
