import { Search, Plus, Sun, Moon } from "lucide-react"

const STATUSES = ["All", "Applied", "Screening", "Interview", "Offer", "Rejected"]

function TopBar({ search, setSearch, filterStatus, setFilterStatus, sortBy, setSortBy, darkMode, setDarkMode, onAdd, applications, activePage }) {

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })

  const total = applications.length
  const interviews = applications.filter(a => a.status === "Interview").length
  const offers = applications.filter(a => a.status === "Offer").length
  const responseRate = total > 0 ? Math.round(((interviews + offers) / total) * 100) : 0
  const screening = applications.filter(a => a.status === "Screening").length

  const inputBg = darkMode
    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
    : "bg-white border-[#E8E0D5] text-[#1C1917] placeholder-[#A8A29E]"
  const selectBg = darkMode
    ? "bg-gray-800 border-gray-700 text-gray-300"
    : "bg-white border-[#E8E0D5] text-[#78716C]"
  const headerBg = darkMode ? "bg-gray-950" : "bg-[#FAF7F2]"
  const statsBg = darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-[#E8E0D5]"
  const statsDivider = darkMode ? "border-gray-800" : "border-[#E8E0D5]"
  const titleColor = darkMode ? "text-white" : "text-[#1C1917]"
  const subColor = darkMode ? "text-gray-500" : "text-[#78716C]"

  return (
    <div className={`shrink-0 ${headerBg}`}>

      {/* Greeting */}
      <div className="px-8 pt-6 pb-4 flex items-start justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${titleColor}`}>
            {greeting}, Nancy 👋
          </h1>
          <p className={`text-sm mt-0.5 ${subColor}`}>{dateStr} · Keep the momentum going.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-xl border transition ${darkMode ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-white border-[#E8E0D5] text-[#78716C]"}`}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-[#1C1917] hover:bg-[#2C2C2A] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition"
          >
            <Plus size={16} />
            Add application
          </button>
        </div>
      </div>

      {/* Stats strip — only on board page */}
      {activePage === "board" && (
        <div className={`mx-8 mb-4 grid grid-cols-4 border rounded-2xl ${statsBg}`}>
          {[
            { label: "Total Applied", value: total, sub: `across ${[...new Set(applications.map(a => a.status))].length} stages`, badge: null, color: darkMode ? "#ffffff" : "#1C1917" },
            { label: "Interviews", value: interviews, sub: `${screening} in screening`, badge: interviews > 0 ? `${interviews} scheduled` : null, color: darkMode ? "#8B5CF6" : "#7C3AED" },
            { label: "Response rate", value: `${responseRate}%`, sub: `from ${total} applications`, badge: responseRate > 20 ? "Strong pace" : null, color: darkMode ? "#10B981" : "#059669" },
            { label: "Offers", value: offers, sub: offers > 0 ? "awaiting reply" : "keep applying!", badge: null, color: darkMode ? "#F59E0B" : "#D97706" },
          ].map((stat, i) => (
            <div key={stat.label} className={`p-5 border-r last:border-r-0 ${statsDivider}`}>
              <div className="flex items-center justify-between mb-1">
                <p className={`text-xs ${subColor}`}>{stat.label}</p>
                {stat.badge && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? "bg-gray-800 text-gray-400" : "bg-[#F5F0E8] text-[#78716C]"}`}>{stat.badge}</span>
                )}
              </div>
              <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className={`text-xs mt-0.5 ${subColor}`}>{stat.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Search + filters — only on board */}
      {activePage === "board" && (
        <div className="px-8 pb-4 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className={`absolute left-3 top-2.5 ${darkMode ? "text-gray-500" : "text-[#A8A29E]"}`} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search company or role..."
              className={`pl-8 pr-4 py-2 text-sm border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#A67C52]/30 ${inputBg}`}
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className={`text-sm border rounded-xl px-3 py-2 focus:outline-none cursor-pointer ${selectBg}`}
          >
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className={`text-sm border rounded-xl px-3 py-2 focus:outline-none cursor-pointer ${selectBg}`}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
          </select>
          <p className={`text-sm ml-auto ${subColor}`}>{applications.length} applications</p>
        </div>
      )}

    </div>
  )
}

export default TopBar