import Link from 'next/link'
import { Linkedin, Instagram, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-8 text-center bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center gap-6">
        
        {/* Social Media Links */}
        <div className="flex items-center gap-6">
          <a 
            href="https://www.linkedin.com/company/sarathi-app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 transition-colors hover:text-[#0A2351]"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a 
            href="https://www.instagram.com/sarathi_app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 transition-colors hover:text-[#F57D14]"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a 
            href="https://www.facebook.com/profile.php?id=61589174020614" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 transition-colors hover:text-[#1877F2]"
            aria-label="Facebook"
          >
            <Facebook className="h-5 w-5" />
          </a>
        </div>

        {/* B2B Navigation & Copyright */}
        <div className="w-full border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} SARATHI | Your Roadmap to Success | Empowering Careers in India
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a 
              href="mailto:admin@sarathiapp.in" 
              className="text-xs font-bold text-slate-500 hover:text-[#F57D14] transition-colors"
            >
              Contact Us
            </a>
            <Link 
              href="/tpo/login" 
              className="text-xs font-bold text-[#F57D14] hover:underline"
            >
              TPO Login →
            </Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
