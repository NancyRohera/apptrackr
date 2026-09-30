import { useState } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { enUS } from "date-fns/locale"
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales: { "en-US": enUS } })

function CalendarView({ applications, darkMode }) {
  const [currentView, setCurrentView] = useState("month")
  const [currentDate, setCurrentDate] = useState(new Date())

  const cardBg = darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-[#E8E0D5]"
  const titleColor = darkMode ? "text-white" : "text-[#1C1917]"
  const subColor = darkMode ? "text-gray-500" : "text-[#78716C]"
  const btnBase = darkMode ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700" : "bg-white border-[#E8E0D5] text-[#78716C] hover:bg-[#F5F0E8]"
  const activeBtn = "bg-[#1C1917] text-white border-[#1C1917]"

  const events = applications
    .filter(app => app.interviewDate)
    .map(app => {
      const startTime = app.interviewTime || "09:00"
      const start = new Date(app.interviewDate + "T" + startTime + ":00")
      const end = new Date(start)
      end.setHours(end.getHours() + 1)
      return { title: `${app.company} — ${app.role}`, start, end, resource: app }
    })

  function navigate(dir) {
    const date = new Date(currentDate)
    if (currentView === "week") date.setDate(date.getDate() + (dir === "next" ? 7 : -7))
    else date.setMonth(date.getMonth() + (dir === "next" ? 1 : -1))
    setCurrentDate(date)
  }

  const label = currentView === "week"
    ? `Week of ${format(currentDate, "MMM d, yyyy")}`
    : format(currentDate, "MMMM yyyy")

  return (
    <div className="space-y-4">

      {/* Upcoming interviews */}
      {events.length > 0 && (
        <div className={`rounded-2xl border p-5 ${cardBg}`}>
          <h2 className={`font-semibold mb-3 ${titleColor}`}>Upcoming interviews</h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {events.sort((a, b) => a.start - b.start).slice(0, 5).map((event, i) => (
              <div key={i} className={`shrink-0 rounded-xl border p-4 min-w-[200px] ${darkMode ? "bg-gray-800 border-gray-700" : "bg-[#FAF7F2] border-[#E8E0D5]"}`}>
                <div className="w-10 h-10 rounded-xl bg-[#1C1917] flex flex-col items-center justify-center mb-3">
                  <p className="text-white text-xs">{format(event.start, "MMM")}</p>
                  <p className="text-white text-base font-bold leading-none">{format(event.start, "d")}</p>
                </div>
                <p className={`font-semibold text-sm ${titleColor}`}>{event.resource.company}</p>
                <p className={`text-xs mt-0.5 ${subColor}`}>{event.resource.role}</p>
                {event.resource.interviewTime && (
                  <p className={`text-xs mt-2 ${subColor}`}>🕐 {event.resource.interviewTime}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className={`rounded-2xl border p-6 ${cardBg}`}>
        <style>{`
          .rbc-calendar { background: transparent !important; }
          .rbc-toolbar { display: none !important; }
          .rbc-header { background: ${darkMode ? "#111827" : "#FAF7F2"} !important; color: ${darkMode ? "#9ca3af" : "#78716C"} !important; border-color: ${darkMode ? "#1f2937" : "#E8E0D5"} !important; padding: 8px !important; font-size: 12px !important; font-weight: 500 !important; }
          .rbc-month-view { border-color: ${darkMode ? "#1f2937" : "#E8E0D5"} !important; border-radius: 12px !important; overflow: hidden !important; }
          .rbc-day-bg { background: ${darkMode ? "#0f172a" : "#ffffff"} !important; }
          .rbc-off-range-bg { background: ${darkMode ? "#0a0f1a" : "#FAF7F2"} !important; }
          .rbc-today { background: ${darkMode ? "#1e1b4b" : "#F5F0E8"} !important; }
          .rbc-date-cell { color: ${darkMode ? "#9ca3af" : "#78716C"} !important; font-size: 12px !important; padding: 4px 8px !important; }
          .rbc-date-cell.rbc-now { color: ${darkMode ? "#A67C52" : "#A67C52"} !important; font-weight: 600 !important; }
          .rbc-event { background: #1C1917 !important; border: none !important; border-radius: 6px !important; font-size: 11px !important; padding: 2px 6px !important; }
          .rbc-month-row { border-color: ${darkMode ? "#1f2937" : "#E8E0D5"} !important; }
          .rbc-day-bg + .rbc-day-bg { border-color: ${darkMode ? "#1f2937" : "#E8E0D5"} !important; }
          .rbc-agenda-date-cell, .rbc-agenda-time-cell, .rbc-agenda-event-cell { background: ${darkMode ? "#0f172a" : "#ffffff"} !important; color: ${darkMode ? "#e5e7eb" : "#1C1917"} !important; border-color: ${darkMode ? "#1f2937" : "#E8E0D5"} !important; }
        `}</style>

        {/* Custom toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button onClick={() => setCurrentDate(new Date())} className={`text-sm px-3 py-1.5 rounded-lg border font-medium transition ${btnBase}`}>Today</button>
            <button onClick={() => navigate("prev")} className={`text-sm px-3 py-1.5 rounded-lg border font-medium transition ${btnBase}`}>←</button>
            <button onClick={() => navigate("next")} className={`text-sm px-3 py-1.5 rounded-lg border font-medium transition ${btnBase}`}>→</button>
          </div>
          <p className={`font-semibold ${titleColor}`}>{label}</p>
          <div className="flex gap-2">
            {["month", "week", "agenda"].map(v => (
              <button key={v} onClick={() => setCurrentView(v)} className={`text-sm px-3 py-1.5 rounded-lg border font-medium capitalize transition ${currentView === v ? activeBtn : btnBase}`}>{v}</button>
            ))}
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📅</p>
            <p className={`font-semibold ${titleColor}`}>No interviews scheduled yet</p>
            <p className={`text-sm mt-1 ${subColor}`}>Add an interview date to any application and it will appear here</p>
          </div>
        ) : (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            view={currentView}
            date={currentDate}
            onView={setCurrentView}
            onNavigate={setCurrentDate}
            views={["month", "week", "agenda"]}
            eventPropGetter={() => ({ style: { backgroundColor: "#1C1917", borderRadius: "6px", border: "none", fontSize: "11px", padding: "2px 6px" } })}
          />
        )}
      </div>
    </div>
  )
}

export default CalendarView