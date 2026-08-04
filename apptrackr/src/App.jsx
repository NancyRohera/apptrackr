import { useState, useEffect } from "react"
import KanbanBoard from "./components/KanbanBoard"
import Stats from "./components/Stats"
import ApplicationModal from "./components/ApplicationModal"
import SearchBar from "./components/SearchBar"
import ExportButton from "./components/ExportButton"
import Analytics from "./components/Analytics"
import CalendarView from "./components/CalendarView"
import useApplications from "./hooks/useApplications"

function App() {
  const { applications, addApplication, updateApplication, deleteApplication, updateStatus } = useApplications()
  const [showModal, setShowModal] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [search, setSearch] = useState("")
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"
  })
  const [filterStatus, setFilterStatus] = useState("All")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode)
  }, [darkMode])

  const STATUSES = ["All", "Applied", "Screening", "Interview", "Offer", "Rejected"]

  const filtered = applications
    .filter(app => {
      const matchesSearch =
        app.company.toLowerCase().includes(search.toLowerCase()) ||
        app.role.toLowerCase().includes(search.toLowerCase())
      return matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.dateApplied || 0) - new Date(a.dateApplied || 0)
      if (sortBy === "oldest") return new Date(a.dateApplied || 0) - new Date(b.dateApplied || 0)
      if (sortBy === "az") return a.company.localeCompare(b.company)
      if (sortBy === "za") return b.company.localeCompare(a.company)
      return 0
    })

  const bg = darkMode ? "min-h-screen bg-gray-900 text-white" : "min-h-screen bg-gray-100 text-gray-800"
  const headerText = darkMode ? "text-white" : "text-gray-800"
  const subText = darkMode ? "text-gray-400" : "text-gray-400"
  const selectBg = darkMode ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-white border-gray-200 text-gray-600"

  return (
    <div className={bg}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${headerText}`}>AppTrackr</h1>
            <p className={`text-sm mt-1 ${subText}`}>Track your job applications</p>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="border border-gray-200 bg-white text-gray-600 text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              onClick={() => setShowAnalytics(true)}
              className="border border-gray-200 bg-white text-gray-600 text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm"
            >
              📊 Analytics
            </button>
            <button
              onClick={() => setShowCalendar(true)}
              className="border border-gray-200 bg-white text-gray-600 text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm"
            >
              📅 Calendar
            </button>
            <ExportButton applications={applications} />
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow"
            >
              + Add Application
            </button>
          </div>
        </div>

        <Stats applications={applications} darkMode={darkMode} />

        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <SearchBar search={search} setSearch={setSearch} darkMode={darkMode} />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className={`border rounded-lg px-4 py-2 text-sm cursor-pointer ${selectBg}`}
          >
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className={`border rounded-lg px-4 py-2 text-sm cursor-pointer ${selectBg}`}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
          </select>
        </div>

        <KanbanBoard
          applications={filtered}
          updateStatus={updateStatus}
          updateApplication={updateApplication}
          deleteApplication={deleteApplication}
          darkMode={darkMode}
          filterStatus={filterStatus}
        />

        {showModal && (
          <ApplicationModal
            onClose={() => setShowModal(false)}
            onSave={addApplication}
            darkMode={darkMode}
          />
        )}

        {showAnalytics && (
          <Analytics
            applications={applications}
            darkMode={darkMode}
            onClose={() => setShowAnalytics(false)}
          />
        )}

        {showCalendar && (
          <CalendarView
            applications={applications}
            darkMode={darkMode}
            onClose={() => setShowCalendar(false)}
          />
        )}
      </div>
    </div>
  )
}

export default App