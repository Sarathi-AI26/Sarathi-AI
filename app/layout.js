import './globals.css'

import { Toaster } from 'sonner'
import Header from '../components/Header'
import Footer from '../components/Footer'
export const metadata = {
  title: 'SARATHI | Career Guidance for Indian College Students',
  description: 'Find your true north with SARATHI through a guided assessment, mock checkout, and career roadmap dashboard.',
}

const App = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);',
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}

export default App
