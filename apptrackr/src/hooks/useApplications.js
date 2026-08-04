import { useState, useEffect } from "react"
import initialData from "../data/applications"
import confetti from "canvas-confetti"

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
    if (newStatus === "Offer") {
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#34d399", "#f472b6", "#fbbf24", "#60a5fa"]
      })
    }
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app))
  }

  return { applications, addApplication, updateApplication, deleteApplication, updateStatus }
}

export default useApplications