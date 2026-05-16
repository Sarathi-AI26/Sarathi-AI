// app/tpo/dashboard/page.js
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import {
  Users, TrendingUp, Target, Download,
  LogOut, Loader2, AlertTriangle, CheckCircle2
} from 'lucide-react'

const COLORS = ['#F57D14','#0A2351','#3b82f6','#10b981','#6366f1','#f59e0b','#ef4444','#8b5cf6']

export default function TPODashboard() {
  const supabase = createClientComponentClient()
  const router   = useRouter()

  const [state, setState]     = useState('loading')
  const [data, setData]       = useState(null)
  const [search, setSearch]   = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace('/login'); return }

      const res = await fetch('/api/tpo/cohort')
      if (res.status === 403) { setState('unauthorised'); return }
      if (!res.ok)            { setState('error'); return }

      const json = await res.json()
      setData(json)
      setState('ready')
    }
    load()
  }, [supabase, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const downloadCSV = () => {
    if (!data?.roster) return
    const headers = ['Name','Email','Archetype','Top Career','Second Career','Overall Score','Completed At']
    const rows = data.roster.map(s => [
      s.name, s.email, s.archetype,
      s.top_career, s.second_career,
      s.overall_score, new Date(s.completed_at).toLocaleDateString('en-IN'),
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `${data.institution?.name}_SARATHI_Cohort.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = data?.roster?.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.archetype.toLowerCase().includes(search.toLowerCase()) ||
    s.top_career.toLowerCase().includes(search.toLowerCase())
  ) || []

  // ── Loading states ─────────────────────────────────────
  if (state === 'loading') return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex items-center gap-3 text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin text-[#F57D14]" />
        <span className="text-sm font-medium">Loading placement intelligence...</span>
      </div>
    </div>
  )

  if (state === 'unauthorised') return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8 text-center">
      <div className="max-w-sm">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#0A2351] mb-2">Access Denied</h2>
        <p className="text-slate-500 text-sm mb-6">
          Your email is not registered as a placement officer.
          Contact admin@sarathiapp.in to get access.
        </p>
        <button onClick={handleSignOut}
          className="rounded-full bg-[#0A2351] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#F57D14] transition-colors">
          Sign Out
        </button>
      </div>
    </div>
  )

  if (state === 'error') return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8 text-center">
      <div>
        <p className="text-red-600 font-bold mb-4">Failed to load dashboard</p>
        <button onClick={() => window.location.reload()}
          className="rounded-full bg-[#F57D14] px-6 py-2.5 text-sm font-bold text-white">
          Retry
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0A2351] shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-lg text-white tracking-tight">SARATHI</span>
              <span className="text-white/30">|</span>
              <span className="text-sm text-white/70 hidden sm:block">
                Placement Intelligence — {data?.institution?.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={downloadCSV}
                className="flex items-center gap-1.5 rounded-full bg-[#F57D14] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#dd6f11] transition-colors">
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </button>
              <button onClick={handleSignOut}
                className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold text-white/70 hover:border-white/50 hover:text-white transition-all">
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Students Registered',
              value: data?.summary?.total_registered,
              icon: Users,
              color: 'bg-blue-50 text-blue-600',
            },
            {
              label: 'Reports Completed',
              value: data?.summary?.total_completed,
              icon: CheckCircle2,
              color: 'bg-green-50 text-green-600',
            },
            {
              label: 'Completion Rate',
              value: `${data?.summary?.completion_rate}%`,
              icon: TrendingUp,
              color: 'bg-orange-50 text-[#F57D14]',
            },
            {
              label: 'Seats Available',
              value: (data?.institution?.seats_purchased || 0) - (data?.institution?.seats_used || 0),
              icon: Target,
              color: 'bg-purple-50 text-purple-600',
            },
          ].map(card => (
            <div key={card.label}
              className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
              <p className="text-3xl font-extrabold text-[#0A2351]">{card.value}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Archetype Distribution */}
          <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-[#0A2351] mb-1">Archetype Distribution</h3>
            <p className="text-xs text-slate-400 mb-5">Breakdown of student personality profiles</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data?.archetype_distribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%" cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) =>
                    `${name.split(' ')[0]} ${(percent*100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {data?.archetype_distribution?.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} students`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Average Dimension Scores */}
          <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-[#0A2351] mb-1">Cohort Strength Profile</h3>
            <p className="text-xs text-slate-400 mb-5">Average psychometric scores across the batch</p>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={data?.average_scores}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                />
                <Radar
                  name="Cohort Average"
                  dataKey="average"
                  stroke="#F57D14"
                  fill="#F57D14"
                  fillOpacity={0.25}
                />
                <Tooltip formatter={v => [`${v}/100`, 'Avg Score']} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Career Matches */}
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-[#0A2351] mb-1">Top Career Matches Across Batch</h3>
          <p className="text-xs text-slate-400 mb-5">
            Most frequently recommended careers — use this to plan your recruitment outreach
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={data?.top_careers}
              layout="vertical"
              margin={{ left: 160 }}
            >
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="career"
                tick={{ fontSize: 11, fill: '#0A2351', fontWeight: 600 }}
                width={155}
              />
              <Tooltip formatter={v => [`${v} students`, 'Matched']} />
              <Bar dataKey="count" fill="#F57D14" radius={[0,6,6,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Student Roster */}
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h3 className="font-bold text-[#0A2351]">Student Roster</h3>
              <p className="text-xs text-slate-400">
                {filtered.length} of {data?.summary?.total_completed} students
              </p>
            </div>
            <input
              type="text"
              placeholder="Search by name, archetype, or career..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm w-full sm:w-72 focus:border-[#F57D14] focus:outline-none focus:ring-1 focus:ring-[#F57D14]/20 transition-all"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Student','Archetype','Top Career Match','2nd Career Match','Score'].map(h => (
                    <th key={h}
                      className="text-left text-xs font-bold uppercase tracking-wider text-slate-400 pb-3 pr-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((student, i) => (
                  <tr key={student.id}
                    className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-[#0A2351]">{student.name}</p>
                      <p className="text-xs text-slate-400">{student.email}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex rounded-full bg-[#F57D14]/10 px-2.5 py-0.5 text-xs font-bold text-[#F57D14]">
                        {student.archetype}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-700 font-medium">
                      {student.top_career}
                    </td>
                    <td className="py-3 pr-4 text-slate-500">
                      {student.second_career}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`font-bold text-base ${
                        student.overall_score >= 80 ? 'text-green-600' :
                        student.overall_score >= 65 ? 'text-[#F57D14]' :
                        'text-slate-500'
                      }`}>
                        {student.overall_score}
                      </span>
                      <span className="text-xs text-slate-400">/100</span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                      No students match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  )
}
