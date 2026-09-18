import { useState, useEffect } from "react"
import { supabase } from "./supabase"
import Sidebar from "./components/Sidebar"
import TopBar from "./components/TopBar"
import KanbanBoard from "./components/KanbanBoard"
import Analytics from "./components/Analytics"
import CalendarView from "./components/CalendarView"
import ApplicationModal from "./components/ApplicationModal"
import Auth from "./components/Auth"
import useApplications from "./hooks/useApplications"

function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [activePage, setActivePage] = useState("board")
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true")

  const { applications, loading, addApplication, updateApplication, deleteApplication, updateStatus } = useApplications(user?.id)

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode)
  }, [darkMode])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

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

  if (authLoading) return (
    <div className={`min-h-screen flex items-center justify-center ${bg}`}>
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  )

  if (!user) return <Auth darkMode={darkMode} />

  return (
    <div className={`flex h-screen overflow-hidden ${bg}`}>
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        applications={applications}
        darkMode={darkMode}
        user={user}
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
          user={user}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-sm">Loading your applications...</p>
            </div>
          ) : (
            <>
              {activePage === "board" && (
                <KanbanBoard
                  applications={filtered}
                  updateStatus={updateStatus}
                  updateApplication={updateApplication}
                  deleteApplication={deleteApplication}
                  darkMode={darkMode}
                  filterStatus={filterStatus}
                  allApplications={applications}
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
            </>
          )}
        </main>
      </div>

      {showModal && (
        <ApplicationModal
          onClose={() => setShowModal(false)}
          onSave={addApplication}
          darkMode={darkMode}
          allApplications={applications}
        />
      )}
    </div>
  )
}

export default App