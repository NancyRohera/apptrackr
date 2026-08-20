import { Download } from "lucide-react"

function ExportButton({ applications }) {
  function handleExport() {
    const headers = ["Company", "Role", "Job Type", "Status", "Date Applied", "Interview Date", "Interview Time", "Source", "Job Link", "Notes"]
    const rows = applications.map(app => [
      app.company, app.role, app.jobType || "", app.status,
      app.dateApplied, app.interviewDate || "", app.interviewTime || "",
      app.source, app.jobLink, app.notes
    ])
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "apptrackr.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="w-full flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-50 transition"
    >
      <Download size={15} />
      Export CSV
    </button>
  )
}

export default ExportButton