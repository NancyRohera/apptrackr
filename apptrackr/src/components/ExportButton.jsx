function ExportButton({ applications }) {
  function handleExport() {
    const headers = ["Company", "Role", "Status", "Date Applied", "Job Link", "Notes"]
    const rows = applications.map(app => [
      app.company,
      app.role,
      app.status,
      app.dateApplied,
      app.jobLink,
      app.notes
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "apptrackr_applications.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm"
    >
      ⬇️ Export CSV
    </button>
  )
}

export default ExportButton