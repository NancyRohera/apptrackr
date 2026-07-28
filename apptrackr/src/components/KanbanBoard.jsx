import { useState } from "react"
import ApplicationModal from "./ApplicationModal"

const STATUSES = ["Applied", "Screening", "Interview", "Offer", "Rejected"]

const COLUMN_COLORS = {
  Applied: "border-t-blue-400",
  Screening: "border-t-yellow-400",
  Interview: "border-t-purple-400",
  Offer: "border-t-green-400",
  Rejected: "border-t-red-400",
}

function isOverdue(dateApplied) {
  if (!dateApplied) return false
  const applied = new Date(dateApplied)
  const today = new Date()
  const diffDays = Math.floor((today - applied) / (1000 * 60 * 60 * 24))
  return diffDays > 14
}

function getRoleTag(role) {
  const r = role.toLowerCase()
  if (r.includes("pm") || r.includes("project manager") || r.includes("project management") || r.includes("coordinator")) {
    return { label: "PM", color: "bg-blue-100 text-blue-600" }
  }
  if (r.includes("social media") || r.includes("content") || r.includes("brand") || r.includes("marketing")) {
    return { label: "Social", color: "bg-pink-100 text-pink-600" }
  }
  if (r.includes("dev") || r.includes("engineer") || r.includes("software") || r.includes("web") || r.includes("frontend") || r.includes("backend")) {
    return { label: "Dev", color: "bg-green-100 text-green-600" }
  }
  if (r.includes("qa") || r.includes("sqa") || r.includes("quality")) {
    return { label: "QA", color: "bg-orange-100 text-orange-600" }
  }
  if (r.includes("data") || r.includes("analyst") || r.includes("business analyst") || r.includes("ba")) {
    return { label: "Data/BA", color: "bg-yellow-100 text-yellow-600" }
  }
  if (r.includes("ai") || r.includes("ml") || r.includes("machine learning")) {
    return { label: "AI/ML", color: "bg-purple-100 text-purple-600" }
  }
  if (r.includes("ui") || r.includes("ux") || r.includes("design")) {
    return { label: "Design", color: "bg-rose-100 text-rose-600" }
  }
  return { label: "Other", color: "bg-gray-100 text-gray-500" }
}

function KanbanBoard({ applications, updateStatus, updateApplication, deleteApplication, darkMode, filterStatus }) {
  const [selectedApp, setSelectedApp] = useState(null)

  const colBg = darkMode ? "bg-gray-800" : "bg-gray-50"
  const cardBg = darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"
  const titleColor = darkMode ? "text-gray-200" : "text-gray-700"
  const companyColor = darkMode ? "text-white" : "text-gray-800"
  const roleColor = darkMode ? "text-gray-300" : "text-gray-400"
  const selectBg = darkMode ? "bg-gray-800 border-gray-600 text-gray-300" : "border-gray-200 text-gray-600"
  const emptyText = darkMode ? "text-gray-500" : "text-gray-300"
  const countBg = darkMode ? "bg-gray-700 border-gray-600 text-gray-400" : "bg-white border-gray-200 text-gray-500"

  const columnsToShow = filterStatus === "All" ? STATUSES : [filterStatus]

  return (
    <>
      <div className="flex gap-4 pb-4">
        {columnsToShow.map(status => {
          const filtered = applications.filter(app => app.status === status)
          return (
            <div key={status} className={`flex-1 min-w-[260px] ${colBg} rounded-xl border-t-4 ${COLUMN_COLORS[status]} p-4 flex flex-col gap-3`}>
              <div className="flex items-center justify-between mb-1">
                <h2 className={`font-semibold ${titleColor}`}>{status}</h2>
                <span className={`text-xs border px-2 py-0.5 rounded-full ${countBg}`}>{filtered.length}</span>
              </div>
              {filtered.map(app => {
                const roleTag = getRoleTag(app.role)
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`${cardBg} rounded-lg p-3 shadow-sm border cursor-pointer hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${companyColor}`}>{app.company}</p>
                        <p className={`text-xs mt-0.5 mb-2 ${roleColor}`}>{app.role}</p>
                        {app.secondPreference && (
                          <p className={`text-xs mb-2 ${roleColor}`}>2nd: {app.secondPreference}</p>
                        )}
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          if (window.confirm(`Delete ${app.company}?`)) deleteApplication(app.id)
                        }}
                        className="text-gray-300 hover:text-red-500 text-xs px-1"
                      >🗑️</button>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleTag.color}`}>
                        {roleTag.label}
                      </span>
                    </div>
                    <select
                      value={app.status}
                      onClick={e => e.stopPropagation()}
                      onChange={e => updateStatus(app.id, e.target.value)}
                      className={`text-xs rounded-md px-2 py-1 w-full cursor-pointer border ${selectBg}`}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {app.dateApplied && (
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-xs text-gray-400">📅 {app.dateApplied}</p>
                        {isOverdue(app.dateApplied) && app.status === "Applied" && (
                          <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full font-medium">Follow up?</span>
                        )}
                      </div>
                    )}
                    {app.interviewDate && (
                      <p className="text-xs text-purple-400 mt-1">🗓️ Interview: {app.interviewDate}</p>
                    )}
                    {app.notes && (
                      <p className="text-xs text-gray-400 mt-1 italic truncate">📝 {app.notes.slice(0, 50)}{app.notes.length > 50 ? "..." : ""}</p>
                    )}
                  </div>
                )
              })}
              {filtered.length === 0 && (
                <p className={`text-xs text-center mt-4 ${emptyText}`}>No applications</p>
              )}
            </div>
          )
        })}
      </div>

      {selectedApp && (
        <ApplicationModal
          existingApp={selectedApp}
          onClose={() => setSelectedApp(null)}
          darkMode={darkMode}
          onSave={(updated) => {
            updateApplication({ ...selectedApp, ...updated })
            setSelectedApp(null)
          }}
        />
      )}
    </>
  )
}

export default KanbanBoard