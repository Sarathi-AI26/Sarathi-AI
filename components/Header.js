import Link from 'next/link';
// Import your dedicated logo component
import SarathiLogo from '@/components/sarathi-logo'; 

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm sm:px-8">
      
      {/* 🚀 SIGNIFICANTLY LARGER LOGO: h-16 on mobile, h-24 on desktop */}
      <div className="flex items-center py-2">
        <SarathiLogo href="/" imageClassName="h-16 w-auto sm:h-24" />
      </div>

      <nav className="flex items-center gap-8">
        <Link href="/" className="text-base font-semibold text-[#0A2351] hover:text-[#F57D14] transition-colors">
          Home
        </Link>
        <Link href="/about" className="text-base font-semibold text-[#0A2351] hover:text-[#F57D14] transition-colors">
          About
        </Link>
      </nav>
    </header>
  );
}
