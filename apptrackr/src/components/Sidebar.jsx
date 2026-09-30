import { useState } from "react"
import { LayoutDashboard, BarChart2, Calendar, Briefcase, ChevronRight, ChevronLeft } from "lucide-react"
import ExportButton from "./ExportButton"

function Sidebar({ activePage, setActivePage, applications }) {
  const [collapsed, setCollapsed] = useState(true)

  const navItems = [
    { id: "board", label: "Applications", icon: LayoutDashboard },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "calendar", label: "Calendar", icon: Calendar },
  ]

  const total = applications.length
  const interviews = applications.filter(a => a.status === "Interview").length
  const offers = applications.filter(a => a.status === "Offer").length

  return (
    <div className={`h-full flex flex-col transition-all duration-300 bg-[#1C1917] shrink-0 ${collapsed ? "w-16" : "w-56"}`}>

      {/* Logo */}
      <div className="px-3 py-5 flex items-center justify-between border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#A67C52] flex items-center justify-center shrink-0">
              <Briefcase size={15} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-white tracking-tight">AppTrackr</p>
              <p className="text-xs text-white/40">Job hunt organiser</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-[#A67C52] flex items-center justify-center mx-auto">
            <Briefcase size={15} className="text-white" />
          </div>
        )}
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 transition">
            <ChevronLeft size={15} />
          </button>
        )}
      </div>

      {/* Expand */}
      {collapsed && (
        <button onClick={() => setCollapsed(false)} className="mx-auto mt-3 p-1.5 rounded-lg hover:bg-white/10 text-white/40 transition">
          <ChevronRight size={15} />
        </button>
      )}

      {/* Nav */}
      <div className="px-2 py-4 flex-1">
        {!collapsed && (
          <p className="text-xs font-semibold uppercase tracking-wider px-3 mb-2 text-white/30">Menu</p>
        )}
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              title={collapsed ? item.label : ""}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-all ${
                isActive
                  ? "bg-[#A67C52] text-white"
                  : "text-white/50 hover:bg-white/10 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon size={17} />
              {!collapsed && item.label}
            </button>
          )
        })}

        {/* Quick stats */}
        {!collapsed && (
          <div className="mt-6 px-3">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-white/30">Pipeline</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Total", value: total, color: "text-white" },
                { label: "Interviews", value: interviews, color: "text-violet-400" },
                { label: "Offers", value: offers, color: "text-emerald-400" },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-xs text-white/40">{s.label}</span>
                  <span className={`text-sm font-semibold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Export */}
      {!collapsed && (
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={() => {
              const headers = ["Company", "Role", "Status", "Date Applied", "Source", "Notes"]
              const rows = applications.map(app => [app.company, app.role, app.status, app.dateApplied, app.source, app.notes])
              const csv = [headers, ...rows].map(r => r.map(c => `"${c || ""}"`).join(",")).join("\n")
              const blob = new Blob([csv], { type: "text/csv" })
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url; a.download = "apptrackr.csv"; a.click()
            }}
            className="w-full flex items-center gap-2 text-xs text-white/40 hover:text-white/70 px-2 py-2 rounded-lg hover:bg-white/10 transition"
          >
            ↓ Export CSV
          </button>
        </div>
      )}
    </div>
  )
}

export default Sidebar