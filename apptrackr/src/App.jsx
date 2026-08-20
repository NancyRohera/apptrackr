import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import TopBar from "./components/TopBar"
import KanbanBoard from "./components/KanbanBoard"
import Analytics from "./components/Analytics"
import CalendarView from "./components/CalendarView"
import ApplicationModal from "./components/ApplicationModal"
import useApplications from "./hooks/useApplications"

function App() {
  const { applications, addApplication, updateApplication, deleteApplication, updateStatus } = useApplications()
  const [activePage, setActivePage] = useState("board")
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true")

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode)
  }, [darkMode])

  const filtered = applications
    .filter(app =>
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.role.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.dateApplied || 0) - new Date(a.dateApplied || 0)
      if (sortBy === "oldest") return new Date(a.dateApplied || 0) - new Date(b.dateApplied || 0)
      if (sortBy === "az") return a.company.localeCompare(b.company)
      if (sortBy === "za") return b.company.localeCompare(a.company)
      return 0
    })

  const bg = darkMode ? "bg-gray-950" : "bg-[#F4F6F9]"

  return (
    <div className={`flex h-screen overflow-hidden ${bg}`}>
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        applications={applications}
        darkMode={darkMode}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          search={search}
          setSearch={setSearch}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onAdd={() => setShowModal(true)}
          applications={applications}
          activePage={activePage}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {activePage === "board" && (
            <KanbanBoard
              applications={filtered}
              updateStatus={updateStatus}
              updateApplication={updateApplication}
              deleteApplication={deleteApplication}
              darkMode={darkMode}
              filterStatus={filterStatus}
            />
          )}
          {activePage === "analytics" && (
            <Analytics
              applications={applications}
              darkMode={darkMode}
              onClose={() => setActivePage("board")}
            />
          )}
          {activePage === "calendar" && (
            <CalendarView
              applications={applications}
              darkMode={darkMode}
              onClose={() => setActivePage("board")}
            />
          )}
        </main>
      </div>

      {showModal && (
        <ApplicationModal
          onClose={() => setShowModal(false)}
          onSave={addApplication}
          darkMode={darkMode}
        />
      )}
    </div>
  )
}

export default App