import { useState } from "react"
import { LayoutDashboard, BarChart2, Calendar, Briefcase, ChevronRight, ChevronLeft } from "lucide-react"
import ExportButton from "./ExportButton"

function Sidebar({ activePage, setActivePage, applications, darkMode }) {
  const [collapsed, setCollapsed] = useState(true)

  const sidebarBg = darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
  const textColor = darkMode ? "text-gray-300" : "text-gray-600"
  const activeColor = darkMode ? "bg-indigo-900 text-indigo-300" : "bg-indigo-50 text-indigo-600"
  const labelColor = darkMode ? "text-gray-500" : "text-gray-400"
  const logoColor = darkMode ? "text-white" : "text-gray-900"
  const hoverColor = darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"

  const total = applications.length
  const offers = applications.filter(a => a.status === "Offer").length
  const interviews = applications.filter(a => a.status === "Interview").length

  const navItems = [
    { id: "board", label: "Board", icon: LayoutDashboard },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "calendar", label: "Calendar", icon: Calendar },
  ]

  return (
    <div className={`h-full border-r flex flex-col transition-all duration-300 ${sidebarBg} shrink-0 ${collapsed ? "w-16" : "w-64"}`}>

      <div className="px-3 py-4 border-b border-gray-100 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <Briefcase size={16} className="text-white" />
            </div>
            <div>
              <p className={`font-bold text-sm tracking-tight ${logoColor}`}>AppTrackr</p>
              <p className={`text-xs ${labelColor}`}>Your job hunt, organised</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center mx-auto">
            <Briefcase size={16} className="text-white" />
          </div>
        )}
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} className={`p-1.5 rounded-lg ${hoverColor} ${textColor} transition`}>
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {collapsed && (
        <button onClick={() => setCollapsed(false)} className={`mx-auto mt-3 p-1.5 rounded-lg ${hoverColor} ${textColor} transition`}>
          <ChevronRight size={16} />
        </button>
      )}

      {!collapsed && (
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="grid grid-cols-3 gap-2">
            <div className={`rounded-xl p-3 text-center ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{total}</p>
              <p className={`text-xs ${labelColor}`}>Total</p>
            </div>
            <div className={`rounded-xl p-3 text-center ${darkMode ? "bg-violet-950" : "bg-violet-50"}`}>
              <p className="text-lg font-bold text-violet-600">{interviews}</p>
              <p className={`text-xs ${labelColor}`}>Interviews</p>
            </div>
            <div className={`rounded-xl p-3 text-center ${darkMode ? "bg-emerald-950" : "bg-emerald-50"}`}>
              <p className="text-lg font-bold text-emerald-600">{offers}</p>
              <p className={`text-xs ${labelColor}`}>Offers</p>
            </div>
          </div>
        </div>
      )}

      <div className="px-3 py-4 flex-1 overflow-y-auto">
        {!collapsed && (
          <p className={`text-xs font-semibold uppercase tracking-wider px-3 mb-2 ${labelColor}`}>Navigation</p>
        )}
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              title={collapsed ? item.label : ""}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-all ${isActive ? activeColor : `${textColor} ${hoverColor}`} ${collapsed ? "justify-center" : ""}`}
            >
              <Icon size={17} />
              {!collapsed && (
                <>
                  {item.label}
                  {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
                </>
              )}
            </button>
          )
        })}
      </div>

      {!collapsed && (
        <div className="px-4 py-4 border-t border-gray-100 flex flex-col gap-2">
          <ExportButton applications={applications} />
        
        </div>
      )}

    </div>
  )
}

export default Sidebar