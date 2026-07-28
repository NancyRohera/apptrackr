import { useState, useEffect } from "react"
import initialData from "../data/applications"

function useApplications() {
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem("apptrackr")
    return saved ? JSON.parse(saved) : initialData
  })

  useEffect(() => {
    localStorage.setItem("apptrackr", JSON.stringify(applications))
  }, [applications])

  function addApplication(newApp) {
    const duplicate = applications.find(
      app => app.company.toLowerCase().trim() === newApp.company.toLowerCase().trim()
    )
    if (duplicate) {
      const confirm = window.confirm(`⚠️ You already applied to "${newApp.company}"! Are you sure you want to add it again?`)
      if (!confirm) return
    }
    setApplications(prev => [...prev, { ...newApp, id: Date.now() }])
  }

  function updateApplication(updatedApp) {
    setApplications(prev => prev.map(app => app.id === updatedApp.id ? updatedApp : app))
  }

  function deleteApplication(id) {
    setApplications(prev => prev.filter(app => app.id !== id))
  }

  function updateStatus(id, newStatus) {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app))
  }

  return { applications, addApplication, updateApplication, deleteApplication, updateStatus }
}

export default useApplications