import { Search, Sun, Moon, Plus, SlidersHorizontal } from "lucide-react"

const STATUSES = ["All", "Applied", "Screening", "Interview", "Offer", "Rejected"]

function TopBar({ search, setSearch, filterStatus, setFilterStatus, sortBy, setSortBy, darkMode, setDarkMode, onAdd, applications, activePage }) {
  const barBg = darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
  const inputBg = darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400"
  const textColor = darkMode ? "text-gray-300" : "text-gray-600"
  const selectBg = darkMode ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-gray-50 border-gray-200 text-gray-600"

  const pageTitles = {
    board: "Kanban Board",
    analytics: "Analytics",
    calendar: "Interview Calendar",
  }

  return (
    <div className={`border-b px-6 py-3.5 flex items-center gap-4 shrink-0 ${barBg}`}>

      <div>
        <h1 className={`text-base font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>{pageTitles[activePage]}</h1>
        <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{applications.length} applications tracked</p>
      </div>

      <div className="flex-1" />

      {activePage === "board" && (
        <>
          {/* Search */}
          <div className="relative">
            <Search size={14} className={`absolute left-3 top-2.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className={`pl-8 pr-4 py-2 text-sm border rounded-xl w-52 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${inputBg}`}
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className={`text-sm border rounded-xl px-3 py-2 focus:outline-none cursor-pointer ${selectBg}`}
          >
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className={`text-sm border rounded-xl px-3 py-2 focus:outline-none cursor-pointer ${selectBg}`}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
          </select>
        </>
      )}

      {/* Dark mode */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`p-2 rounded-xl border transition ${darkMode ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-gray-50 border-gray-200 text-gray-600"}`}
      >
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Add button */}
      <button
        onClick={onAdd}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition shadow-sm shadow-indigo-200"
      >
        <Plus size={16} />
        Add Application
      </button>

    </div>
  )
}

export default TopBar