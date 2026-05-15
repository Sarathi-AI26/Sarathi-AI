// app/layout.js
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: 'SARATHI | Career Guidance for Indian College Students',
  description:
    'Find your true north with SARATHI through a guided assessment, mock checkout, and career roadmap dashboard.',
}

export default function RootLayout({ children }) {
  return (
    // FIX 1: Added suppressHydrationWarning to HTML tag
    <html lang="en" className={`${inter.variable} scroll-pt-16 sm:scroll-pt-24`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        <script
          dangerouslySetInnerHTML={{
            __html:
              'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);',
          }}
        />
      </head>
      
      <body className="min-h-screen bg-background text-foreground font-sans antialiased" suppressHydrationWarning>
        <div className="page-shell flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster richColors position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}
