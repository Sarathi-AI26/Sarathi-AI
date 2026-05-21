// app/dashboard/student/ClientDashboard.js
"use client"

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Loader2, LogOut, AlertTriangle, CheckCircle2, Sparkles, Brain, Zap } from 'lucide-react'
import ResultDashboardReal from '@/components/result-dashboard-real'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

// ── 1. Animated Generating Screen ──────────────────────────────
function GeneratingScreen({ elapsed }) {
  const stages = [
    { min: 0,  max: 8,  icon: Brain,    text: 'Reading your 60 answers...',       sub: 'Analysing your personality and aptitude signals' },
    { min: 8,  max: 18, icon: Zap,      text: 'Building your psychometric profile...', sub: 'Mapping your risk tolerance, decisiveness, and motivation' },
    { min: 18, max: 30, icon: Sparkles, text: 'Generating your career matches...',  sub: 'Finding careers that fit your exact psychological wiring' },
    { min: 30, max: 50, icon: Sparkles, text: 'Writing your 5-year roadmap...',     sub: 'Personalising every milestone to your specific goals' },
    { min: 50, max: 999,icon: Sparkles, text: 'Finalising your report...',          sub: 'Almost ready — this is our most detailed analysis yet' },
  ]

  const current = stages.find(s => elapsed >= s.min && elapsed < s.max) || stages[stages.length - 1]
  const Icon = current.icon
  const progress = Math.min(95, (elapsed / 60) * 100)

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-8 text-center mt-8 animate-in fade-in zoom-in duration-500">
      <div className="mb-8 relative">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#F57D14]/10 animate-pulse">
          <Icon className="h-12 w-12 text-[#F57D14]" />
        </div>
        <div
          className="absolute h-3 w-3 rounded-full bg-[#F57D14]"
          style={{
            top: '50%', left: '50%',
            transform: `rotate(${elapsed * 6}deg) translate(44px) rotate(-${elapsed * 6}deg)`,
            transition: 'transform 0.1s linear',
          }}
        />
      </div>

      <h1 className="text-2xl font-bold text-[#0A2351] mb-2 transition-all">
        {current.text}
      </h1>
      <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-8">
        {current.sub}
      </p>

      <div className="w-full max-w-sm mb-3">
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#F57D14] transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <p className="text-xs text-slate-400 font-medium mb-8">
        {elapsed < 60
          ? `Approximately ${Math.max(5, 60 - elapsed)} seconds remaining`
          : 'Taking a little longer than usual — please keep this tab open'}
      </p>

      {elapsed >= 35 && (
        <div className="max-w-sm rounded-2xl bg-[#0A2351]/5 border border-[#0A2351]/10 p-4 text-left animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[#0A2351]">Your answers are safely saved</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Even if you close this tab, your report will be waiting when you return.
                Log back in at any time to see it.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-2 text-slate-400 text-xs">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        AI is working · {elapsed}s
      </div>
    </div>
  )
}

// ── 2. Main Dashboard Manager ─────────────────────────────────
export default function ClientDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [status, setStatus] = useState("Fetching your data...")
  const [assessment, setAssessment] = useState(null)
  const [analysisData, setAnalysisData] = useState(null)
  const [fetchedName, setFetchedName] = useState(null)
  const [elapsed, setElapsed] = useState(0)

  const pollRef = useRef(null)
  const elapsedRef = useRef(null)

  // Clean up polling if user leaves
  const stopPolling = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
    if (elapsedRef.current) { clearInterval(elapsedRef.current); elapsedRef.current = null }
  }, [])

 // 🚀 The Direct-Database Polling Engine (Bypasses Vercel Cache Completely)
  const startPolling = useCallback((assessmentId) => {
    elapsedRef.current = setInterval(() => setElapsed(p => p + 1), 1000)

    pollRef.current = setInterval(async () => {
      try {
        // Query Supabase directly from the browser to get the freshest data
        const { data, error } = await supabase
          .from('assessments')
          .select('*, users(name, email, college)')
          .eq('id', assessmentId)
          .single()

        if (error || !data) return // Keep polling silently on network blips

        // Check if the generation is complete or if the data has arrived
        const isReady = data.generation_status === 'complete' || Boolean(data.ai_analysis_result?.user_archetype)

        if (isReady && data.ai_analysis_result) {
          stopPolling()
          setAnalysisData(data.ai_analysis_result)
          setAssessment(prev => ({ ...prev, ...data }))
          setStatus("SUCCESS")
        }

        // If backend explicitly failed, try kicking it again
        if (data.generation_status === 'failed') {
          stopPolling()
          fetch('/api/generate-roadmap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assessmentId }),
          }).catch(e => console.warn(e))
          startPolling(assessmentId) // restart polling
        }
      } catch (err) {
        console.warn('Poll error (will retry):', err.message)
      }
    }, 3000) // Poll every 3 seconds
  }, [stopPolling])

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

          let { data: latestAssessment } = await supabase
            .from('assessments')
            .select('id')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (!latestAssessment && session?.user?.email) {
            const { data: guestUser } = await supabase
              .from('users')
              .select('id')
              .eq('email', session.user.email.toLowerCase())
              .limit(1)
              .maybeSingle();

            if (guestUser) {
              const { data: guestAssessment } = await supabase
                .from('assessments')
                .select('id')
                .eq('user_id', guestUser.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

              if (guestAssessment) {
                latestAssessment = guestAssessment; 
                
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

        const { data, error } = await supabase
          .from('assessments')
          .select('*, users(name, email, college)') 
          .eq('id', targetId)
          .maybeSingle() 

        if (error) throw error
        if (!data) throw new Error("This assessment link is invalid, expired, or the data was deleted.")

        // Bulletproof Name Resolver
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
        
        // 🚀 THE ULTIMATE PAYWALL SECURITY FIX
        // We only trust the database's payment_status or a cryptographically verified institution_id.
        // We DO NOT trust the text the user typed into the "College Name" input field.
        const hasAccessPermitted = !!data.payment_status || !!data.institution_id;
        const verifiedAssessmentState = {
          ...data,
          payment_status: hasAccessPermitted,
          parsed_student_name: clearName 
        };

        setAssessment(verifiedAssessmentState)

        // 🚀 THE NEW ASYNC ROUTING LOGIC
        if (data.ai_analysis_result && hasAccessPermitted) {
           // Scenario 1: Already Paid, Already Generated
           setAnalysisData(data.ai_analysis_result)
           setStatus("SUCCESS")
        } else if (hasAccessPermitted) {
           // Scenario 2: Paid, but NOT Generated yet (Background job is running)
           setStatus("GENERATING")
           startPolling(data.id)
           
           // Failsafe: Kickstart generation if it never started or crashed previously
           if (!data.generation_status || ['pending', 'failed'].includes(data.generation_status)) {
             fetch('/api/generate-roadmap', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ assessmentId: data.id })
             }).catch(e => console.warn(e))
           }
        } else {
           // Scenario 3: Unpaid Free Preview
           setStatus("SUCCESS")
        }
      } catch (err) {
        setStatus(`Error: ${err.message}`)
      }
    }

    loadData()
    
    // Cleanup polling when component unmounts
    return () => stopPolling()
  }, [id, router, startPolling, stopPolling])

  const handleLogout = async () => {
    stopPolling()
    await supabase.auth.signOut()
    router.push('/')
  }

// 🚀 ULTIMATE NAME RESOLVER (String & Array Bulletproof)
  const getDisplayName = () => {
    // 1. Priority: Direct from State or Database
    if (fetchedName && fetchedName !== 'Student') return fetchedName;
    if (assessment?.parsed_student_name && assessment.parsed_student_name !== 'Student') return assessment.parsed_student_name;
    
    if (assessment?.users) {
      const dbName = Array.isArray(assessment.users) ? assessment.users[0]?.name : assessment.users.name;
      if (dbName && dbName !== 'Student') return dbName;
    }

    // 2. Fallback: Deep Extract from AI Text
    if (analysisData) {
      // Gather text from multiple places, handling both strings and arrays effortlessly
      let possibleStrings = [];
      
      if (analysisData.truth_bomb?.insight) {
          possibleStrings.push(analysisData.truth_bomb.insight);
      }
      
      if (typeof analysisData.executive_summary === 'string') {
          possibleStrings.push(analysisData.executive_summary);
      } else if (Array.isArray(analysisData.executive_summary)) {
          possibleStrings.push(...analysisData.executive_summary);
      }
      
      if (Array.isArray(analysisData.top_career_matches) && analysisData.top_career_matches[0]?.match_reason) {
          possibleStrings.push(analysisData.top_career_matches[0].match_reason);
      }

      for (let text of possibleStrings) {
        if (!text) continue;
        
        // Strip quotes, asterisks, and newlines so the text is pure
        const cleanText = text.replace(/[*#"_\n]/g, '').trim();
        
       // 🚀 THE ULTIMATE REGEX: Hunts for any capitalized word followed by a comma and "you" or "your", ANYWHERE in the text!
        const match = cleanText.match(/\b([A-Z][a-zA-Z]+),\s+(?:you|your)\b/i);
        
       if (match && match[1]) {
           let extractedName = match[1].trim();
           const lowerName = extractedName.toLowerCase();
           
           // 🚀 THE FIX: A list of words the AI uses that are definitely NOT names
           const bannedWords = ['however', 'overall', 'therefore', 'additionally', 'also', 'student', 'moreover', 'furthermore', 'firstly', 'secondly', 'lastly', 'hello', 'welcome', 'hi'];
           
           // Ensure it isn't an accidental sentence or a banned transition word
           if (extractedName.length < 20 && !bannedWords.includes(lowerName)) {
               return extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
           }
        }
      }
    }

    // 3. Final Fallback: Email Slice
    const userEmail = Array.isArray(assessment?.users) ? assessment?.users[0]?.email : assessment?.users?.email;
    if (userEmail) {
      const emailPrefix = userEmail.split('@')[0];
      return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    }

    return 'Student';
  }
  const studentName = getDisplayName();
  const archetypeTitle = analysisData?.user_archetype || 'Explorer';

  // ── ERROR AND LOADING RENDER STATES ───────────────────────────
  if (status !== "SUCCESS" && status !== "GENERATING") {
    const isNoAssessmentError = status.includes("couldn't find a completed assessment") || status.includes("invalid, expired");

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
        {!status.includes('Error') && (
          <Loader2 className="w-12 h-12 text-[#F57D14] animate-spin mb-4 mx-auto" />
        )}
        
        <h1 className="text-2xl font-extrabold text-[#0A2351] mb-2">SARATHI Dashboard</h1>
        
        <p className={`text-lg font-bold mb-8 ${status.includes('Error') ? 'text-slate-600' : 'text-[#F57D14]'}`}>
          {isNoAssessmentError 
            ? "It looks like you haven't completed your career assessment yet, or this link is expired." 
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

        {(status.includes('timeout') || status.includes('traffic') || status.includes('try again') || status.includes('failed')) && (
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

  // ── SUCCESS / GENERATING RENDER STATE ───────────────────────────
  return (
    <div className="flex flex-col w-full h-full bg-slate-50">
      <header className="bg-[#0A2351] text-white px-4 sm:px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-40 w-full">
        <div className="flex items-center gap-3 sm:gap-4">
         <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-white">SARATHI Personalised Dashboard</h1>
          <div className="hidden sm:block h-8 w-px bg-white/20"></div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-bold truncate max-w-[150px]">
              {status === "GENERATING" ? "Analysing Profile..." : studentName}
            </span>
            {status !== "GENERATING" && (
              <span className="text-[10px] text-[#F57D14] uppercase tracking-widest font-bold">
                {archetypeTitle}
              </span>
            )}
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

      <main className="flex-1 w-full relative">
        {status === "GENERATING" ? (
           <GeneratingScreen elapsed={elapsed} />
        ) : (
           <ResultDashboardReal assessment={assessment} analysisData={analysisData} studentName={studentName} />
        )}
      </main>
    </div>
  )
}
