import Link from 'next/link';
// Import your dedicated logo component
import SarathiLogo from '@/components/sarathi-logo'; 

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm sm:px-8">
      
      {/* 🚀 This replaces the plain "SARATHI" text with your actual graphic */}
      <SarathiLogo href="/" imageClassName="h-10 w-auto" />

      <nav className="flex items-center gap-6">
        <Link href="/" className="text-sm font-medium text-[#0A2351] hover:text-[#F57D14] transition-colors">
          Home
        </Link>
        <Link href="/about" className="text-sm font-medium text-[#0A2351] hover:text-[#F57D14] transition-colors">
          About
        </Link>
      </nav>
    </header>
  );
}
