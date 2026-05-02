// app/layout.js
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import Header from '../components/Header'
import Footer from '../components/Footer'

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

const App = ({ children }) => {
  return (
    // 🚀 THE FIX: Template literals allow the font variable and the scroll padding to coexist
    <html lang="en" className={`${inter.variable} scroll-pt-20 sm:scroll-pt-28`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);',
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <div className="page-shell flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}

export default App
