import { useState, useEffect } from "react"
import { supabase } from "../supabase"
import confetti from "canvas-confetti"

function useApplications(userId) {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    fetchApplications()
  }, [userId])

  async function fetchApplications() {
    setLoading(true)
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) {
      const mapped = data.map(app => ({
        id: app.id,
        company: app.company,
        role: app.role,
        secondPreference: app.second_preference,
        jobType: app.job_type,
        workMode: app.work_mode,
        status: app.status,
        dateApplied: app.date_applied,
        interviewDate: app.interview_date,
        interviewTime: app.interview_time,
        jobLink: app.job_link,
        source: app.source,
        notes: app.notes,
      }))
      setApplications(mapped)
    }
    setLoading(false)
  }

  async function addApplication(newApp) {
    const duplicate = applications.find(
      app => app.company.toLowerCase().trim() === newApp.company.toLowerCase().trim()
    )
    if (duplicate) {
      const confirm = window.confirm(`⚠️ You already applied to "${newApp.company}"! Add anyway?`)
      if (!confirm) return
    }

    const { data, error } = await supabase.from("applications").insert([{
      user_id: userId,
      company: newApp.company,
      role: newApp.role,
      second_preference: newApp.secondPreference || "",
      job_type: newApp.jobType || "",
      work_mode: newApp.workMode || "",
      status: newApp.status,
      date_applied: newApp.dateApplied || "",
      interview_date: newApp.interviewDate || "",
      interview_time: newApp.interviewTime || "",
      job_link: newApp.jobLink || "",
      source: newApp.source || "",
      notes: newApp.notes || "",
    }]).select()

    if (!error && data) {
      const app = data[0]
      setApplications(prev => [{
        id: app.id,
        company: app.company,
        role: app.role,
        secondPreference: app.second_preference,
        jobType: app.job_type,
        workMode: app.work_mode,
        status: app.status,
        dateApplied: app.date_applied,
        interviewDate: app.interview_date,
        interviewTime: app.interview_time,
        jobLink: app.job_link,
        source: app.source,
        notes: app.notes,
      }, ...prev])
    }
  }

  async function updateApplication(updatedApp) {
    const { error } = await supabase.from("applications").update({
      company: updatedApp.company,
      role: updatedApp.role,
      second_preference: updatedApp.secondPreference || "",
      job_type: updatedApp.jobType || "",
      work_mode: updatedApp.workMode || "",
      status: updatedApp.status,
      date_applied: updatedApp.dateApplied || "",
      interview_date: updatedApp.interviewDate || "",
      interview_time: updatedApp.interviewTime || "",
      job_link: updatedApp.jobLink || "",
      source: updatedApp.source || "",
      notes: updatedApp.notes || "",
    }).eq("id", updatedApp.id)

    if (!error) {
      setApplications(prev => prev.map(app => app.id === updatedApp.id ? updatedApp : app))
    }
  }

  async function deleteApplication(id) {
    const { error } = await supabase.from("applications").delete().eq("id", id)
    if (!error) {
      setApplications(prev => prev.filter(app => app.id !== id))
    }
  }

  async function updateStatus(id, newStatus) {
    if (newStatus === "Offer") {
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#34d399", "#f472b6", "#fbbf24", "#60a5fa"]
      })
    }
    const app = applications.find(a => a.id === id)
    if (app) await updateApplication({ ...app, status: newStatus })
  }

  return { applications, loading, addApplication, updateApplication, deleteApplication, updateStatus }
}

export default useApplications