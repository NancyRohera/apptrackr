import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid,
} from "recharts"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function getRoleType(role) {
  const r = role.toLowerCase()
  if (r.includes("pm") || r.includes("project manager") || r.includes("coordinator")) return "PM"
  if (r.includes("social media") || r.includes("content") || r.includes("marketing")) return "Social"
  if (r.includes("dev") || r.includes("engineer") || r.includes("software") || r.includes("web")) return "Dev"
  if (r.includes("qa") || r.includes("sqa") || r.includes("quality")) return "QA"
  if (r.includes("data") || r.includes("analyst") || r.includes("ba")) return "Data/BA"
  if (r.includes("ai") || r.includes("ml")) return "AI/ML"
  if (r.includes("ui") || r.includes("ux") || r.includes("design")) return "Design"
  return "Other"
}

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`px-3 py-2 rounded-xl shadow-lg text-sm border ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-800 border-gray-100"}`}>
        {label && <p className="font-medium mb-1">{label}</p>}
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.fill || p.color }}>
            {p.value} {p.name === "count" ? "applications" : ""}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function StatCard({ label, value, color, bg, darkMode }) {
  return (
    <div className={`rounded-2xl p-5 ${bg} flex flex-col gap-1`}>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
    </div>
  )
}

function SectionTitle({ title, subtitle, darkMode }) {
  return (
    <div className="mb-4">
      <h2 className={`text-base font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>{title}</h2>
      {subtitle && <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{subtitle}</p>}
    </div>
  )
}

function Analytics({ applications, darkMode, onClose }) {
  const bg = darkMode ? "bg-gray-950" : "bg-slate-50"
  const cardBg = darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
  const titleColor = darkMode ? "text-white" : "text-gray-900"
  const subColor = darkMode ? "text-gray-400" : "text-gray-400"
  const textColor = darkMode ? "#9ca3af" : "#6b7280"
  const gridColor = darkMode ? "#1f2937" : "#f3f4f6"

  // Core stats
  const total = applications.length
  const screening = applications.filter(a => a.status === "Screening").length
  const interviews = applications.filter(a => a.status === "Interview").length
  const offers = applications.filter(a => a.status === "Offer").length
  const rejected = applications.filter(a => a.status === "Rejected").length
  const pending = applications.filter(a => a.status === "Applied").length
  const responseRate = total > 0 ? Math.round(((screening + interviews + offers) / total) * 100) : 0
  const interviewConversion = (screening + interviews + offers) > 0 ? Math.round(((interviews + offers) / (screening + interviews + offers)) * 100) : 0
  const ghosted = applications.filter(app => {
    if (!app.dateApplied || app.status !== "Applied") return false
    const days = Math.floor((new Date() - new Date(app.dateApplied)) / (1000 * 60 * 60 * 24))
    return days > 21
  }).length

  // Role data
  const roleData = applications.reduce((acc, app) => {
    const type = getRoleType(app.role)
    const existing = acc.find(d => d.name === type)
    if (existing) existing.value++
    else acc.push({ name: type, value: 1 })
    return acc
  }, []).sort((a, b) => b.value - a.value)

  const ROLE_COLORS = ["#6366f1", "#f472b6", "#34d399", "#fb923c", "#fbbf24", "#a78bfa", "#f87171", "#94a3b8"]

  // Source data
  const sourceData = applications.reduce((acc, app) => {
    const source = app.source || null
    if (!source) return acc
    const existing = acc.find(d => d.name === source)
    if (existing) existing.value++
    else acc.push({ name: source, value: 1 })
    return acc
  }, []).sort((a, b) => b.value - a.value)

  const SOURCE_COLORS = ["#6366f1", "#f472b6", "#34d399", "#fb923c", "#fbbf24", "#a78bfa"]

  // Status pie
  const statusData = [
    { name: "Pending", value: pending, color: "#60a5fa" },
    { name: "Screening", value: screening, color: "#fbbf24" },
    { name: "Interview", value: interviews, color: "#a78bfa" },
    { name: "Offer", value: offers, color: "#34d399" },
    { name: "Rejected", value: rejected, color: "#f87171" },
  ].filter(d => d.value > 0)

  // Day of week
  const dayCounts = applications.reduce((acc, app) => {
    if (!app.dateApplied) return acc
    const day = new Date(app.dateApplied).getDay()
    acc[day] = (acc[day] || 0) + 1
    return acc
  }, {})
  const dayData = DAYS.map((day, i) => ({ name: day, value: dayCounts[i] || 0 }))
  const bestDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]
  const bestDayLabel = bestDay ? DAYS[bestDay[0]] : "—"

  // Time data
  const timeData = applications
    .filter(app => app.dateApplied)
    .reduce((acc, app) => {
      const existing = acc.find(d => d.date === app.dateApplied)
      if (existing) existing.count++
      else acc.push({ date: app.dateApplied, count: 1 })
      return acc
    }, [])
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-14)

  // Most active week
  const weekCounts = applications.reduce((acc, app) => {
    if (!app.dateApplied) return acc
    const date = new Date(app.dateApplied)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    const key = weekStart.toISOString().split("T")[0]
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
  const mostActiveWeek = Object.entries(weekCounts).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className={`fixed inset-0 ${bg} z-50 overflow-y-auto`}>
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className={`text-2xl font-bold ${titleColor}`}>Your Job Hunt</h1>
            <p className={`text-sm mt-1 ${subColor}`}>{total} applications tracked so far</p>
          </div>
          <button
            onClick={onClose}
            className={`text-sm px-4 py-2 rounded-xl border font-medium transition ${darkMode ? "border-gray-700 text-gray-400 hover:bg-gray-800" : "border-gray-200 text-gray-500 hover:bg-gray-100"}`}
          >
            ← Back
          </button>
        </div>

        {/* Top stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Applied" value={total} color="text-indigo-500" bg={darkMode ? "bg-indigo-950" : "bg-indigo-50"} darkMode={darkMode} />
          <StatCard label="Response Rate" value={`${responseRate}%`} color="text-emerald-500" bg={darkMode ? "bg-emerald-950" : "bg-emerald-50"} darkMode={darkMode} />
          <StatCard label="Interview Rate" value={`${interviewConversion}%`} color="text-violet-500" bg={darkMode ? "bg-violet-950" : "bg-violet-50"} darkMode={darkMode} />
          <StatCard label="Ghosted" value={ghosted} color="text-rose-500" bg={darkMode ? "bg-rose-950" : "bg-rose-50"} darkMode={darkMode} />
        </div>

        {/* Second row stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Screening" value={screening} color="text-amber-500" bg={darkMode ? "bg-amber-950" : "bg-amber-50"} darkMode={darkMode} />
          <StatCard label="Interviews" value={interviews} color="text-purple-500" bg={darkMode ? "bg-purple-950" : "bg-purple-50"} darkMode={darkMode} />
          <StatCard label="Offers" value={offers} color="text-green-500" bg={darkMode ? "bg-green-950" : "bg-green-50"} darkMode={darkMode} />
          <StatCard label="Rejected" value={rejected} color="text-red-500" bg={darkMode ? "bg-red-950" : "bg-red-50"} darkMode={darkMode} />
        </div>

        {/* Insight banner */}
        <div className={`rounded-2xl p-4 mb-8 border ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
          <div className="flex flex-wrap gap-6">
            <div>
              <p className={`text-xs ${subColor}`}>Most active day</p>
              <p className={`font-semibold text-sm mt-0.5 ${titleColor}`}>{bestDayLabel}</p>
            </div>
            <div>
              <p className={`text-xs ${subColor}`}>Most active week</p>
              <p className={`font-semibold text-sm mt-0.5 ${titleColor}`}>{mostActiveWeek ? `${mostActiveWeek[0]} · ${mostActiveWeek[1]} apps` : "—"}</p>
            </div>
            <div>
              <p className={`text-xs ${subColor}`}>Still waiting on</p>
              <p className={`font-semibold text-sm mt-0.5 ${titleColor}`}>{pending} applications</p>
            </div>
            <div>
              <p className={`text-xs ${subColor}`}>Gone silent (21+ days)</p>
              <p className={`font-semibold text-sm mt-0.5 text-rose-500`}>{ghosted} applications</p>
            </div>
          </div>
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Status pie */}
          <div className={`rounded-2xl border p-6 ${cardBg}`}>
            <SectionTitle title="Where things stand" subtitle="Breakdown of all your applications by current status" darkMode={darkMode} />
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3} isAnimationActive animationDuration={600}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2">
              {statusData.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }}></div>
                  <span className={`text-xs ${subColor}`}>{s.name} ({s.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Role types */}
          <div className={`rounded-2xl border p-6 ${cardBg}`}>
            <SectionTitle title="What roles you're going for" subtitle="Number of applications per role type" darkMode={darkMode} />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={roleData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip darkMode={darkMode} />} cursor={{ fill: darkMode ? "#1f2937" : "#f9fafb" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={600}>
                  {roleData.map((_, i) => (
                    <Cell key={i} fill={ROLE_COLORS[i % ROLE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Day of week */}
          <div className={`rounded-2xl border p-6 ${cardBg}`}>
            <SectionTitle title="When you apply most" subtitle="Applications by day of the week" darkMode={darkMode} />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dayData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip darkMode={darkMode} />} cursor={{ fill: darkMode ? "#1f2937" : "#f9fafb" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={600}>
                  {dayData.map((entry, i) => (
                    <Cell key={i} fill={entry.name === bestDayLabel.slice(0, 3) ? "#6366f1" : darkMode ? "#374151" : "#e5e7eb"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Source breakdown */}
          {sourceData.length > 0 && (
            <div className={`rounded-2xl border p-6 ${cardBg}`}>
              <SectionTitle title="Where you're finding jobs" subtitle="Which platforms you've applied through" darkMode={darkMode} />
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={sourceData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip darkMode={darkMode} />} cursor={{ fill: darkMode ? "#1f2937" : "#f9fafb" }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={600}>
                    {sourceData.map((_, i) => (
                      <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Applications over time */}
          {timeData.length > 0 && (
            <div className={`rounded-2xl border p-6 md:col-span-2 ${cardBg}`}>
              <SectionTitle title="Your recent activity" subtitle="Applications sent in the last 14 days" darkMode={darkMode} />
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: textColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                  <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: "#6366f1", r: 4 }} activeDot={{ r: 6 }} isAnimationActive animationDuration={600} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Pipeline funnel — manual */}
          <div className={`rounded-2xl border p-6 md:col-span-2 ${cardBg}`}>
            <SectionTitle title="Your pipeline" subtitle="How many applications made it through each stage" darkMode={darkMode} />
            <div className="flex flex-col gap-3 mt-2">
              {[
                { label: "Applied", value: total, color: "bg-blue-400", text: "text-blue-500" },
                { label: "Screening", value: screening, color: "bg-amber-400", text: "text-amber-500" },
                { label: "Interview", value: interviews, color: "bg-violet-400", text: "text-violet-500" },
                { label: "Offer", value: offers, color: "bg-emerald-400", text: "text-emerald-500" },
              ].map((stage, i) => (
                <div key={i} className="flex items-center gap-4">
                  <p className={`text-xs font-medium w-20 shrink-0 ${subColor}`}>{stage.label}</p>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-7 overflow-hidden">
                    <div
                      className={`h-full ${stage.color} rounded-full flex items-center px-3 transition-all duration-700`}
                      style={{ width: total > 0 ? `${Math.max((stage.value / total) * 100, stage.value > 0 ? 5 : 0)}%` : "0%" }}
                    >
                      <span className="text-white text-xs font-medium">{stage.value}</span>
                    </div>
                  </div>
                  <p className={`text-xs font-medium w-10 text-right ${stage.text}`}>
                    {total > 0 ? `${Math.round((stage.value / total) * 100)}%` : "0%"}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Analytics