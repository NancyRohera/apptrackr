import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid
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

function Analytics({ applications, darkMode }) {
  const cardBg = darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-[#E8E0D5]"
  const titleColor = darkMode ? "text-white" : "text-[#1C1917]"
  const subColor = darkMode ? "text-gray-500" : "text-[#78716C]"
  const textColor = darkMode ? "#9ca3af" : "#78716C"
  const gridColor = darkMode ? "#1f2937" : "#F0EBE3"
  const borderColor = darkMode ? "border-gray-800" : "border-[#F0EBE3]"
  const rowHover = darkMode ? "hover:bg-gray-800" : "hover:bg-[#FAF7F2]"

  const total = applications.length
  const screening = applications.filter(a => a.status === "Screening").length
  const interviews = applications.filter(a => a.status === "Interview").length
  const offers = applications.filter(a => a.status === "Offer").length
  const rejected = applications.filter(a => a.status === "Rejected").length
  const responded = screening + interviews + offers
  const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0
  const interviewToOffer = interviews > 0 ? Math.round((offers / interviews) * 100) : 0
  const ghosted = applications.filter(app => {
    if (!app.dateApplied || app.status !== "Applied") return false
    return Math.floor((new Date() - new Date(app.dateApplied)) / (1000 * 60 * 60 * 24)) > 21
  }).length

  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  const weekApps = applications.filter(a => a.dateApplied && new Date(a.dateApplied) >= startOfWeek).length
  const weekGoal = 10
  const weekPct = Math.min(Math.round((weekApps / weekGoal) * 100), 100)

  const funnelData = [
    { label: "Applications", value: total, pct: 100, color: "#3D2B1F" },
    { label: "Responses", value: responded, pct: total > 0 ? Math.round((responded / total) * 100) : 0, color: "#6B4423" },
    { label: "Interviews", value: interviews, pct: total > 0 ? Math.round((interviews / total) * 100) : 0, color: "#A67C52" },
    { label: "Offers", value: offers, pct: total > 0 ? Math.round((offers / total) * 100) : 0, color: "#C4A882" },
  ]

  const sourceData = applications.reduce((acc, app) => {
    const source = app.source || ""
    if (!source) return acc
    const existing = acc.find(d => d.name === source)
    if (existing) {
      existing.applied++
      if (app.status !== "Applied" && app.status !== "Rejected") existing.replies++
    } else {
      acc.push({ name: source, applied: 1, replies: app.status !== "Applied" && app.status !== "Rejected" ? 1 : 0 })
    }
    return acc
  }, []).map(s => ({ ...s, rate: s.applied > 0 ? Math.round((s.replies / s.applied) * 100) : 0 }))
    .sort((a, b) => b.applied - a.applied)

  const timeData = applications
    .filter(app => app.dateApplied)
    .reduce((acc, app) => {
      const existing = acc.find(d => d.date === app.dateApplied)
      if (existing) existing.apps++
      else acc.push({ date: app.dateApplied, apps: 1 })
      return acc
    }, [])
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-12)

  const statusDist = [
    { name: "Applied", value: applications.filter(a => a.status === "Applied").length, color: "#6366F1" },
    { name: "Screening", value: screening, color: "#F59E0B" },
    { name: "Interview", value: interviews, color: "#8B5CF6" },
    { name: "Offer", value: offers, color: "#10B981" },
    { name: "Rejected", value: rejected, color: "#F43F5E" },
  ].filter(d => d.value > 0)

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className={`px-3 py-2 rounded-xl text-xs border shadow-lg ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-[#E8E0D5] text-[#1C1917]"}`}>
        {label && <p className="font-medium mb-1">{label}</p>}
        {payload.map((p, i) => <p key={i}>{p.value}</p>)}
      </div>
    )
  }

  return (
    <div className="space-y-4">

      {/* Top 4 stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Applications sent", value: total, sub: "last 90 days", badge: `+${applications.filter(a => a.dateApplied && new Date(a.dateApplied) > new Date(Date.now() - 30*24*60*60*1000)).length} vs prior`, color: darkMode ? "#fff" : "#1C1917" },
          { label: "Response rate", value: `${responseRate}%`, sub: `${responded} responses`, badge: `+${responseRate > 20 ? responseRate : 0}%`, color: darkMode ? "#10B981" : "#059669" },
          { label: "Interviews", value: interviews, sub: "this month", badge: interviews > 0 ? `+${interviews} interviews` : null, color: darkMode ? "#8B5CF6" : "#7C3AED" },
          { label: "Interview-to-offer", value: `${interviewToOffer}%`, sub: `${offers} offers`, badge: offers > 0 ? `+${offers} pts` : null, color: darkMode ? "#F59E0B" : "#D97706" },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl border p-5 ${cardBg}`}>
            <p className={`text-xs mb-2 ${subColor}`}>{s.label}</p>
            <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className={`text-xs mt-1 ${subColor}`}>{s.sub}</p>
            {s.badge && <span className={`text-xs mt-2 inline-block px-2 py-0.5 rounded-full ${darkMode ? "bg-gray-800 text-gray-400" : "bg-[#F5F0E8] text-[#78716C]"}`}>{s.badge}</span>}
          </div>
        ))}
      </div>

      {/* Row 2 — Activity chart + Weekly goal */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`col-span-2 rounded-2xl border p-6 ${cardBg}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className={`font-semibold ${titleColor}`}>Application activity</h2>
              <p className={`text-xs mt-0.5 ${subColor}`}>Applications submitted over time</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="date" tick={{ fill: textColor, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="apps" fill={darkMode ? "#A67C52" : "#C4A882"} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`rounded-2xl border p-6 ${cardBg}`}>
          <h2 className={`font-semibold mb-1 ${titleColor}`}>Weekly goal</h2>
          <p className={`text-xs mb-4 ${subColor}`}>{startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })} — Applications sent</p>
          <div className="flex items-end gap-2 mb-3">
            <p className="text-4xl font-bold" style={{ color: darkMode ? "#fff" : "#1C1917" }}>{weekApps}</p>
            <p className={`text-lg mb-1 ${subColor}`}>of {weekGoal}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ml-auto mb-1 ${darkMode ? "bg-gray-800 text-gray-400" : "bg-[#F5F0E8] text-[#78716C]"}`}>{weekPct}%</span>
          </div>
          <div className={`w-full h-2 rounded-full mb-4 ${darkMode ? "bg-gray-700" : "bg-[#F0EBE3]"}`}>
            <div className="h-full rounded-full bg-[#A67C52] transition-all" style={{ width: `${weekPct}%` }} />
          </div>
          <div className="flex gap-1 mb-4">
            {DAYS.map((day, i) => {
              const dayApps = applications.filter(a => {
                if (!a.dateApplied) return false
                const d = new Date(a.dateApplied)
                const wd = new Date(startOfWeek)
                wd.setDate(startOfWeek.getDate() + i)
                return d.toDateString() === wd.toDateString()
              }).length
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${dayApps > 0 ? "bg-[#A67C52] text-white" : darkMode ? "bg-gray-800 text-gray-600" : "bg-[#F5F0E8] text-[#C4BAB0]"}`}>
                    {dayApps > 0 ? "✓" : ""}
                  </div>
                  <span className={`text-xs ${subColor}`}>{day.charAt(0)}</span>
                </div>
              )
            })}
          </div>
          <p className={`text-xs ${subColor}`}>
            {weekGoal - weekApps > 0 ? `${weekGoal - weekApps} more applications keep you on your strongest pace this week.` : "Weekly goal reached! 🎉"}
          </p>
        </div>
      </div>

      {/* Row 3 — Funnel + Conversion quality */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`rounded-2xl border p-6 ${cardBg}`}>
          <h2 className={`font-semibold mb-1 ${titleColor}`}>Stage conversion funnel</h2>
          <p className={`text-xs mb-5 ${subColor}`}>How {total} applications progressed through your pipeline</p>
          <div className="flex flex-col gap-3">
            {funnelData.map((stage, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-sm ${subColor}`}>{stage.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${titleColor}`}>{stage.value}</span>
                    <span className={`text-xs ${subColor}`}>{stage.pct}%</span>
                  </div>
                </div>
                <div className={`w-full h-8 rounded-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-[#F5F0E8]"}`}>
                  <div
                    className="h-full rounded-lg flex items-center px-3 transition-all duration-700"
                    style={{ width: `${Math.max(stage.pct, stage.value > 0 ? 8 : 0)}%`, background: stage.color }}
                  >
                    {stage.value > 0 && <span className="text-white text-xs font-medium">{stage.value}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl border p-6 ${cardBg}`}>
          <h2 className={`font-semibold mb-1 ${titleColor}`}>Conversion quality</h2>
          <p className={`text-xs mb-5 ${subColor}`}>Key rates for your applications</p>
          <div className="space-y-6">
            {[
              { label: "Response rate", value: `${responseRate}%`, sub: `Total ${responseRate > 0 ? `+${responseRate}` : "0"} pts`, detail: `${responded} of ${total} applications got a response` },
              { label: "Interview-to-offer", value: `${interviewToOffer}%`, sub: `${offers} offers from ${interviews} interviews`, detail: null },
            ].map((s, i) => (
              <div key={i} className={`pb-5 border-b last:border-b-0 last:pb-0 ${borderColor}`}>
                <div className="flex items-start justify-between">
                  <p className={`text-xs ${subColor}`}>{s.label}</p>
                  <p className={`text-xs ${subColor}`}>{s.sub}</p>
                </div>
                <p className="text-3xl font-bold mt-1" style={{ color: darkMode ? "#fff" : "#1C1917" }}>{s.value}</p>
                {s.detail && <p className={`text-xs mt-1 ${subColor}`}>{s.detail}</p>}
              </div>
            ))}
            <div className={`rounded-xl p-3 ${darkMode ? "bg-gray-800" : "bg-[#FAF7F2]"}`}>
              <p className={`text-xs ${subColor}`}>
                💡 {sourceData.length > 0 ? `${sourceData.sort((a,b) => b.rate - a.rate)[0]?.name || "LinkedIn"} is your highest-converting source` : "Add sources to applications to see insights"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4 — Source performance + Status distribution */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`rounded-2xl border p-6 ${cardBg}`}>
          <h2 className={`font-semibold mb-1 ${titleColor}`}>Source performance</h2>
          <p className={`text-xs mb-4 ${subColor}`}>Response quality by where applications originated</p>
          {sourceData.length === 0 ? (
            <p className={`text-sm ${subColor}`}>Add sources to your applications to see this</p>
          ) : (
            <div>
              <div className={`grid grid-cols-4 text-xs font-medium pb-2 border-b mb-1 ${borderColor} ${subColor}`}>
                <span>Source</span>
                <span className="text-center">Applied</span>
                <span className="text-center">Replies</span>
                <span className="text-right">Rate</span>
              </div>
              {sourceData.map((s, i) => (
                <div key={i} className={`grid grid-cols-4 py-2.5 border-b last:border-b-0 rounded-lg px-1 transition ${borderColor} ${rowHover}`}>
                  <span className={`text-sm font-medium ${titleColor}`}>{s.name}</span>
                  <span className={`text-sm text-center ${subColor}`}>{s.applied}</span>
                  <div className="flex items-center justify-center gap-1">
                    <div className={`h-1.5 rounded-full w-10 ${darkMode ? "bg-gray-700" : "bg-[#F0EBE3]"}`}>
                      <div className="h-full rounded-full bg-[#A67C52]" style={{ width: `${s.rate}%` }} />
                    </div>
                    <span className={`text-sm ${subColor}`}>{s.replies}</span>
                  </div>
                  <span className={`text-sm text-right font-medium ${s.rate > 30 ? "text-emerald-500" : subColor}`}>{s.rate}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`rounded-2xl border p-6 ${cardBg}`}>
          <h2 className={`font-semibold mb-1 ${titleColor}`}>Status distribution</h2>
          <p className={`text-xs mb-2 ${subColor}`}>{total} applications in total</p>
          <div className="flex gap-1 mb-4 h-3 rounded-full overflow-hidden">
            {statusDist.map((s, i) => (
              <div key={i} style={{ width: `${total > 0 ? (s.value / total) * 100 : 0}%`, background: s.color }} />
            ))}
          </div>
          <p className="text-4xl font-bold mb-4" style={{ color: darkMode ? "#fff" : "#1C1917" }}>{total}</p>
          <div className="space-y-2">
            {statusDist.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className={`text-sm ${subColor}`}>{s.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${titleColor}`}>{s.value}</span>
                  <span className={`text-xs w-8 text-right ${subColor}`}>{total > 0 ? Math.round((s.value / total) * 100) : 0}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Analytics