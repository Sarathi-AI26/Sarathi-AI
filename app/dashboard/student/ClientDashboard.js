// app/dashboard/student/ClientDashboard.js
"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Loader2, LogOut, AlertTriangle } from 'lucide-react'
import ResultDashboardReal from '@/components/result-dashboard-real'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function ClientDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [status, setStatus] = useState("Fetching your data...")
  const [assessment, setAssessment] = useState(null)
  const [analysisData, setAnalysisData] = useState(null)
  const [fetchedName, setFetchedName] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        let targetId = id;

        // --- SESSION FALLBACK LOGIC WITH ORPHAN CLAIMER ---
        if (!targetId) {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError || !session) {
            setStatus("Redirecting to login...");
            router.push('/login');
            return;
          }

          // 1. Try to find the assessment using their secure Auth ID
          let { data: latestAssessment, error: latestError } = await supabase
            .from('assessments')
            .select('id')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // 2. THE ORPHAN CLAIMER
          if (!latestAssessment && session?.user?.email) {
            const { data: guestUser } = await supabase
              .from('users')
              .select('id')
              .eq('email', session.user.email.toLowerCase())
              .single();

            if (guestUser) {
              const { data: guestAssessment } = await supabase
                .from('assessments')
                .select('id')
                .eq('user_id', guestUser.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

              if (guestAssessment) {
                latestAssessment = guestAssessment; 
                
                // PERMANENTLY LINK GUEST TO AUTH ID
                await supabase
                  .from('users')
                  .update({ id: session.user.id })
                  .eq('email', session.user.email.toLowerCase())
                  .is('id', null);
              }
            }
          }

          if (!latestAssessment) {
            throw new Error("We couldn't find a completed assessment for your account.");
          }
          
          targetId = latestAssessment.id;
          window.history.replaceState(null, '', `/dashboard/student?id=${targetId}`);
        }

        // 🚀 CRITICAL FIX 1: Added 'email' to the join for the ultimate name fallback
        const { data, error } = await supabase
          .from('assessments')
          .select('*, users(name, email, college)') 
          .eq('id', targetId)
          .single()

        if (error) throw error
        if (!data) throw new Error("Assessment not found.")

        console.log("Raw Assessment Data:", data) 

        // 🚀 CRITICAL FIX 2: Bulletproof Name Resolver (Handles array wrappers)
        let clearName = null;
        
        if (data.users) {
          if (Array.isArray(data.users) && data.users[0]?.name) {
            clearName = data.users[0].name;
          } else if (data.users.name) {
            clearName = data.users.name;
          }
        }
        
        if (!clearName && data.user_id) {
          const { data: users } = await supabase
            .from('users') 
            .select('*')
            .eq('id', data.user_id)
            
          if (users && users.length > 0) {
            const userData = users[0];
            clearName = userData.name || userData.full_name || userData.first_name;
          }
        }

        if (!clearName) {
          const { data: { session } } = await supabase.auth.getSession();
          clearName = session?.user?.user_metadata?.full_name || session?.user?.user_metadata?.name;
        }

        if (clearName) {
          setFetchedName(clearName);
        }
        
        // 🚀 CRITICAL FIX 3: Paywall Boolean Trap Fix
        // Extracts the string safely whether users is an array or object
        const userCollegeStr = Array.isArray(data.users) ? data.users[0]?.college : data.users?.college;
        const isB2BUser = userCollegeStr && !userCollegeStr.toLowerCase().includes('individual_guest');
        
        // !! forces truthy evaluation (bypasses the "true" string bug)
        const hasAccessPermitted = !!data.payment_status || isB2BUser;

        const verifiedAssessmentState = {
          ...data,
          payment_status: hasAccessPermitted,
          parsed_student_name: clearName 
        };

        setAssessment(verifiedAssessmentState)

        if (data.ai_analysis_result && hasAccessPermitted) {
           setAnalysisData(data.ai_analysis_result)
           setStatus("SUCCESS")
        } else if (data.payment_status) {
           setStatus("Synthesizing your 5-Year Roadmap...")
           const res = await fetch('/api/generate-roadmap', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ assessmentId: data.id })
           })
           const clientResult = await res.json()
           
           if (!res.ok || !clientResult.ai_analysis_result) {
             throw new Error(clientResult.error || "AI Engine timeout. Please refresh to try again.")
           }
           
           setAnalysisData(clientResult.ai_analysis_result)
           setStatus("SUCCESS")
        } else {
           setStatus("SUCCESS")
        }
      } catch (err) {
        setStatus(`Error: ${err.message}`)
      }
    }

    loadData()
  }, [id, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (status !== "SUCCESS" || !assessment) {
    const isNoAssessmentError = status.includes("couldn't find a completed assessment");

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
        {!status.includes('Error') && (
          <Loader2 className="w-12 h-12 text-[#F57D14] animate-spin mb-4 mx-auto" />
        )}
        
        <h1 className="text-2xl font-extrabold text-[#0A2351] mb-2">SARATHI Dashboard</h1>
        
        <p className={`text-lg font-bold mb-8 ${status.includes('Error') ? 'text-slate-600' : 'text-[#F57D14]'}`}>
          {isNoAssessmentError 
            ? "It looks like you haven't completed your career assessment yet." 
            : status}
        </p>

        {isNoAssessmentError && (
          <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
            <button 
              onClick={() => {
                const urlParams = new URLSearchParams(window.location.search);
                const instId = urlParams.get('institution_id') || localStorage.getItem('institution_id');
                
                if (instId) {
                  localStorage.setItem('institution_id', instId);
                  router.push(`/assessment?institution_id=${instId}`);
                } else {
                  router.push('/assessment');
                }
              }}
              className="w-full bg-[#F57D14] hover:bg-[#dd6f11] text-white font-bold h-12 rounded-full transition-all shadow-md"
            >
              Take Free Assessment
            </button>
            <button 
              onClick={handleLogout}
              className="w-full border-2 border-[#0A2351] text-[#0A2351] hover:bg-[#0A2351] hover:text-white font-bold h-12 rounded-full transition-all"
            >
              Sign Out / Switch Account
            </button>
          </div>
        )}

        {status.includes('AI Engine timeout') && (
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-[#0A2351] hover:bg-[#F57D14] text-white font-bold h-12 px-8 rounded-full transition-all shadow-md"
            >
              Refresh Page
            </button>
        )}
      </div>
    )
  }

  // 2. ULTIMATE NAME RESOLVER WITH EMAIL FALLBACK
  const getDisplayName = () => {
    if (fetchedName) return fetchedName;
    if (assessment?.parsed_student_name) return assessment.parsed_student_name;
    if (assessment?.user_details?.name) return assessment.user_details.name;
    
    const summary = analysisData?.executive_summary;
    if (Array.isArray(summary) && summary[0]) {
        const firstPara = summary[0];
        const match = firstPara.match(/^([^,]+),/);
        if (match && match[1] && match[1].length < 20) return match[1];
    }
    
    // 🚀 NEW: Dynamic email slicing if name is totally absent from database
    const userEmail = Array.isArray(assessment?.users) ? assessment?.users[0]?.email : assessment?.users?.email;
    if (userEmail) {
      const emailPrefix = userEmail.split('@')[0];
      return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    }
    
    return 'Student';
  }

  const studentName = getDisplayName();
  const archetypeTitle = analysisData?.user_archetype || 'Explorer';

return (
    // Replaced min-h-screen with h-full so it doesn't fight your global layout
    <div className="flex flex-col w-full h-full bg-slate-50">
      
      {/* 🚀 THE FIX: Removed 'fixed' and the phantom spacer. 
          Using native 'sticky top-0' keeps it in the normal flow so it doesn't get covered by your global layout header. */}
      <header className="bg-[#0A2351] text-white px-4 sm:px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-40 w-full">
        <div className="flex items-center gap-3 sm:gap-4">
         <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-white">SARATHI Personalised Dashboard</h1>
          <div className="hidden sm:block h-8 w-px bg-white/20"></div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-bold truncate max-w-[150px]">{studentName}</span>
            <span className="text-[10px] text-[#F57D14] uppercase tracking-widest font-bold">
              {archetypeTitle}
            </span>
          </div>
        </div>

        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </header>

      {/* 🚀 THE CONTENT: Normal document flow, no spacing hacks required. */}
      <main className="flex-1 w-full relative">
        {analysisData ? (
            <ResultDashboardReal assessment={assessment} analysisData={analysisData} studentName={studentName} />
        ) : (
            <div className="flex flex-col items-center justify-center p-12 mt-12 text-center text-slate-500">
               <AlertTriangle className="w-12 h-12 text-amber-500 mb-4 mx-auto" />
               <h2 className="text-xl font-bold text-[#0A2351] mb-2">Roadmap Processing</h2>
               <p className="text-sm mb-6 max-w-sm mx-auto">
                 Gemini is experiencing heavy load and couldn't display your data immediately. Please refresh to view your report.
               </p>
               <button 
                 onClick={() => window.location.reload()} 
                 className="bg-[#F57D14] hover:bg-[#dd6f11] text-white font-bold h-12 px-8 rounded-full transition-all"
               >
                 Refresh Page
               </button>
            </div>
        )}
      </main>
    </div>
  )
}
