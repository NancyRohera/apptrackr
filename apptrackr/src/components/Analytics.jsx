import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid,
  FunnelChart, Funnel, LabelList
} from "recharts"
import CalendarHeatmap from "react-calendar-heatmap"
import "react-calendar-heatmap/dist/styles.css"

const STATUS_COLORS = {
  Applied: "#60a5fa",
  Screening: "#fbbf24",
  Interview: "#a78bfa",
  Offer: "#34d399",
  Rejected: "#f87171",
}

const ROLE_COLORS = ["#60a5fa", "#f472b6", "#34d399", "#fb923c", "#fbbf24", "#a78bfa", "#f87171", "#94a3b8"]
const SOURCE_COLORS = ["#60a5fa", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#fb923c"]
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`px-3 py-2 rounded-lg shadow-lg text-sm ${darkMode ? "bg-gray-700 text-white border border-gray-600" : "bg-white text-gray-800 border border-gray-100"}`}>
        <p className="font-medium">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.fill || p.color }}>{p.value} applications</p>
        ))}
      </div>
    )
  }
  return null
}

function Analytics({ applications, darkMode, onClose }) {
  const bgColor = darkMode ? "bg-gray-900" : "bg-gray-100"
  const cardBg = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
  const titleColor = darkMode ? "text-white" : "text-gray-800"
  const subColor = darkMode ? "text-gray-400" : "text-gray-500"
  const textColor = darkMode ? "#e5e7eb" : "#374151"
  const gridColor = darkMode ? "#374151" : "#f0f0f0"

  const total = applications.length
  const interviews = applications.filter(a => a.status === "Interview").length
  const offers = applications.filter(a => a.status === "Offer").length
  const rejected = applications.filter(a => a.status === "Rejected").length
  const screening = applications.filter(a => a.status === "Screening").length
  const responseRate = total > 0 ? Math.round(((interviews + offers + screening) / total) * 100) : 0

  const ghosted = applications.filter(app => {
    if (!app.dateApplied || app.status !== "Applied") return false
    const days = Math.floor((new Date() - new Date(app.dateApplied)) / (1000 * 60 * 60 * 24))
    return days > 21
  }).length
  const ghostingRate = total > 0 ? Math.round((ghosted / total) * 100) : 0

  const responded = screening + interviews + offers
  const interviewConversion = responded > 0 ? Math.round((interviews + offers) / responded * 100) : 0

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
  const mostActiveWeekLabel = mostActiveWeek ? `Week of ${mostActiveWeek[0]} (${mostActiveWeek[1]} apps)` : "No data yet"

  const dayCounts = applications.reduce((acc, app) => {
    if (!app.dateApplied) return acc
    const day = new Date(app.dateApplied).getDay()
    acc[day] = (acc[day] || 0) + 1
    return acc
  }, {})
  const bestDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]
  const bestDayLabel = bestDay ? DAYS[bestDay[0]] : "No data yet"

  const statCards = [
    { label: "Total Applied", value: total, color: "text-blue-500" },
    { label: "Interviews", value: interviews, color: "text-purple-500" },
    { label: "Offers", value: offers, color: "text-green-500" },
    { label: "Rejected", value: rejected, color: "text-red-500" },
    { label: "Response Rate", value: `${responseRate}%`, color: "text-yellow-500" },
    { label: "Ghosting Rate", value: `${ghostingRate}%`, color: "text-pink-500" },
    { label: "Interview Conv.", value: `${interviewConversion}%`, color: "text-indigo-500" },
    { label: "Most Active Week", value: mostActiveWeekLabel, color: "text-teal-500", small: true },
  ]

  const statusData = ["Applied", "Screening", "Interview", "Offer", "Rejected"].map(status => ({
    name: status,
    value: applications.filter(app => app.status === status).length
  })).filter(d => d.value > 0)

  // Funnel data
  const funnelData = [
    { name: "Applied", value: total, fill: "#60a5fa" },
    { name: "Screening", value: screening, fill: "#fbbf24" },
    { name: "Interview", value: interviews, fill: "#a78bfa" },
    { name: "Offer", value: offers, fill: "#34d399" },
  ]

  // Heatmap data
  const heatmapData = applications
    .filter(app => app.dateApplied)
    .reduce((acc, app) => {
      const existing = acc.find(d => d.date === app.dateApplied)
      if (existing) existing.count++
      else acc.push({ date: app.dateApplied, count: 1 })
      return acc
    }, [])

  const today = new Date()
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(today.getMonth() - 6)

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

  const roleData = applications.reduce((acc, app) => {
    const type = getRoleType(app.role)
    const existing = acc.find(d => d.name === type)
    if (existing) existing.value++
    else acc.push({ name: type, value: 1 })
    return acc
  }, []).sort((a, b) => b.value - a.value)

  const sourceData = applications.reduce((acc, app) => {
    const source = app.source || "Unknown"
    const existing = acc.find(d => d.name === source)
    if (existing) existing.value++
    else acc.push({ name: source, value: 1 })
    return acc
  }, []).filter(d => d.name !== "Unknown").sort((a, b) => b.value - a.value)

  const timeData = applications
    .filter(app => app.dateApplied)
    .reduce((acc, app) => {
      const date = app.dateApplied
      const existing = acc.find(d => d.date === date)
      if (existing) existing.count++
      else acc.push({ date, count: 1 })
      return acc
    }, [])
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-14)

  const dayData = DAYS.map((day, i) => ({
    name: day.slice(0, 3),
    value: dayCounts[i] || 0
  }))

  return (
    <div className={`fixed inset-0 ${bgColor} z-50 overflow-y-auto`}>
      <div className="max-w-6xl mx-auto p-6">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${titleColor}`}>Analytics</h1>
            <p className={`text-sm mt-1 ${subColor}`}>A breakdown of your job hunt so far</p>
          </div>
          <button onClick={onClose} className="border border-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-200">
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map(stat => (
            <div key={stat.label} className={`${cardBg} border rounded-xl p-4 text-center`}>
              <p className={`font-bold ${stat.color} ${stat.small ? "text-sm" : "text-2xl"}`}>{stat.value}</p>
              <p className={`text-xs mt-1 ${subColor}`}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div className={`${cardBg} border rounded-xl p-4 mb-6 flex items-center gap-3`}>
          <span className="text-2xl">💡</span>
          <p className={`text-sm ${subColor}`}>
            You apply most on <span className={`font-semibold ${titleColor}`}>{bestDayLabel}s</span> —
            {ghosted > 0 && ` ${ghosted} applications have gone silent for over 3 weeks.`}
            {ghosted === 0 && ` keep that momentum going!`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          <div className={`${cardBg} border rounded-xl p-6`}>
            <h2 className={`font-semibold mb-4 ${titleColor}`}>Status Breakdown</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" isAnimationActive animationDuration={800} label={({ name, value }) => `${name} (${value})`}>
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={`${cardBg} border rounded-xl p-6`}>
            <h2 className={`font-semibold mb-4 ${titleColor}`}>Application Funnel</h2>
            <ResponsiveContainer width="100%" height={250}>
              <FunnelChart>
                <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                <Funnel dataKey="value" data={funnelData} isAnimationActive animationDuration={800}>
                  <LabelList position="center" fill="#fff" fontSize={12} formatter={(value) => value} />
                  {funnelData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>

          <div className={`${cardBg} border rounded-xl p-6`}>
            <h2 className={`font-semibold mb-4 ${titleColor}`}>Applications by Role Type</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={roleData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 12 }} />
                <YAxis tick={{ fill: textColor, fontSize: 12 }} />
                <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={800}>
                  {roleData.map((entry, index) => (
                    <Cell key={index} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={`${cardBg} border rounded-xl p-6`}>
            <h2 className={`font-semibold mb-4 ${titleColor}`}>Applications by Day of Week</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dayData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 12 }} />
                <YAxis tick={{ fill: textColor, fontSize: 12 }} />
                <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={800}>
                  {dayData.map((entry, index) => (
                    <Cell key={index} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {sourceData.length > 0 && (
            <div className={`${cardBg} border rounded-xl p-6`}>
              <h2 className={`font-semibold mb-4 ${titleColor}`}>Applications by Source</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={sourceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 12 }} />
                  <YAxis tick={{ fill: textColor, fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={800}>
                    {sourceData.map((entry, index) => (
                      <Cell key={index} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {timeData.length > 0 && (
            <div className={`${cardBg} border rounded-xl p-6 md:col-span-2`}>
              <h2 className={`font-semibold mb-4 ${titleColor}`}>Applications Over Time (last 14 days)</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="date" tick={{ fill: textColor, fontSize: 10 }} />
                  <YAxis tick={{ fill: textColor, fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                  <Line type="monotone" dataKey="count" stroke="#34d399" strokeWidth={2} dot={{ fill: "#34d399" }} isAnimationActive animationDuration={800} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Heatmap calendar */}
          <div className={`${cardBg} border rounded-xl p-6 md:col-span-2`}>
            <h2 className={`font-semibold mb-4 ${titleColor}`}>Application Heatmap (last 6 months)</h2>
            <CalendarHeatmap
              startDate={sixMonthsAgo}
              endDate={today}
              values={heatmapData}
              classForValue={(value) => {
                if (!value) return "color-empty"
                if (value.count >= 4) return "color-scale-4"
                return `color-scale-${value.count}`
              }}
              tooltipDataAttrs={(value) => ({
                "data-tip": value.date ? `${value.date}: ${value.count} application(s)` : "No applications"
              })}
            />
            <div className="flex items-center gap-2 mt-3 justify-end">
              <span className={`text-xs ${subColor}`}>Less</span>
              <div className="w-3 h-3 rounded-sm bg-gray-200"></div>
              <div className="w-3 h-3 rounded-sm bg-blue-200"></div>
              <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
              <div className="w-3 h-3 rounded-sm bg-blue-600"></div>
              <div className="w-3 h-3 rounded-sm bg-blue-800"></div>
              <span className={`text-xs ${subColor}`}>More</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Analytics