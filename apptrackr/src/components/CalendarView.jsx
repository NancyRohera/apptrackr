import { useState } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { enUS } from "date-fns/locale"
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
})

function CalendarView({ applications, darkMode, onClose }) {
  const [currentView, setCurrentView] = useState("month")
  const [currentDate, setCurrentDate] = useState(new Date())

  const bg = darkMode ? "bg-gray-950" : "bg-slate-50"
  const cardBg = darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
  const titleColor = darkMode ? "text-white" : "text-gray-900"
  const subColor = darkMode ? "text-gray-400" : "text-gray-400"
  const btnBase = darkMode
    ? "border-gray-700 text-gray-400 hover:bg-gray-800 bg-gray-900"
    : "border-gray-200 text-gray-500 hover:bg-gray-100 bg-white"

  const events = applications
    .filter(app => app.interviewDate)
    .map(app => ({
      title: `${app.company} — ${app.role}`,
      start: new Date(app.interviewDate + "T09:00:00"),
      end: new Date(app.interviewDate + "T10:00:00"),
      resource: app,
    }))

  function navigate(direction) {
    const date = new Date(currentDate)
    if (currentView === "month") {
      date.setMonth(date.getMonth() + (direction === "next" ? 1 : -1))
    } else if (currentView === "week") {
      date.setDate(date.getDate() + (direction === "next" ? 7 : -7))
    } else {
      date.setMonth(date.getMonth() + (direction === "next" ? 1 : -1))
    }
    setCurrentDate(date)
  }

  function goToToday() {
    setCurrentDate(new Date())
  }

  const label = currentView === "month"
    ? format(currentDate, "MMMM yyyy")
    : currentView === "week"
    ? `Week of ${format(currentDate, "MMM d, yyyy")}`
    : format(currentDate, "MMMM yyyy")

  return (
    <div className={`fixed inset-0 ${bg} z-50 overflow-y-auto`}>
      <style>{`
        .rbc-calendar { background: transparent !important; }
        .rbc-toolbar { display: none !important; }
        .rbc-header {
          background: ${darkMode ? "#111827" : "#f8fafc"} !important;
          color: ${darkMode ? "#e5e7eb" : "#374151"} !important;
          border-color: ${darkMode ? "#1f2937" : "#e5e7eb"} !important;
          padding: 8px !important;
          font-size: 13px !important;
        }
        .rbc-month-view {
          border-color: ${darkMode ? "#1f2937" : "#e5e7eb"} !important;
          border-radius: 12px !important;
          overflow: hidden !important;
        }
        .rbc-day-bg {
          background: ${darkMode ? "#0f172a" : "#ffffff"} !important;
        }
        .rbc-off-range-bg {
          background: ${darkMode ? "#0a0f1a" : "#f8fafc"} !important;
        }
        .rbc-today {
          background: ${darkMode ? "#1e1b4b" : "#eff6ff"} !important;
        }
        .rbc-date-cell {
          color: ${darkMode ? "#9ca3af" : "#6b7280"} !important;
          font-size: 12px !important;
          padding: 4px 8px !important;
        }
        .rbc-date-cell.rbc-now {
          color: ${darkMode ? "#818cf8" : "#4f46e5"} !important;
          font-weight: 600 !important;
        }
        .rbc-row-segment { padding: 2px 4px !important; }
        .rbc-event {
          background: #6366f1 !important;
          border: none !important;
          border-radius: 6px !important;
          font-size: 11px !important;
          padding: 2px 6px !important;
        }
        .rbc-event:focus { outline: none !important; }
        .rbc-show-more { color: #6366f1 !important; font-size: 11px !important; }
        .rbc-month-row { border-color: ${darkMode ? "#1f2937" : "#e5e7eb"} !important; }
        .rbc-day-bg + .rbc-day-bg { border-color: ${darkMode ? "#1f2937" : "#e5e7eb"} !important; }
        .rbc-agenda-view table { color: ${darkMode ? "#e5e7eb" : "#374151"} !important; }
        .rbc-agenda-date-cell, .rbc-agenda-time-cell, .rbc-agenda-event-cell {
          background: ${darkMode ? "#0f172a" : "#ffffff"} !important;
          color: ${darkMode ? "#e5e7eb" : "#374151"} !important;
          border-color: ${darkMode ? "#1f2937" : "#e5e7eb"} !important;
        }
        .rbc-agenda-empty { color: ${darkMode ? "#6b7280" : "#9ca3af"} !important; }
        .rbc-week-view { border-color: ${darkMode ? "#1f2937" : "#e5e7eb"} !important; }
        .rbc-time-view { border-color: ${darkMode ? "#1f2937" : "#e5e7eb"} !important; }
        .rbc-time-header { background: ${darkMode ? "#111827" : "#f8fafc"} !important; }
        .rbc-time-content { background: ${darkMode ? "#0f172a" : "#ffffff"} !important; }
        .rbc-timeslot-group { border-color: ${darkMode ? "#1f2937" : "#e5e7eb"} !important; }
        .rbc-time-slot { color: ${darkMode ? "#6b7280" : "#9ca3af"} !important; }
      `}</style>

      <div className="max-w-5xl mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${titleColor}`}>Interview Calendar</h1>
            <p className={`text-sm mt-1 ${subColor}`}>
              {events.length} interview{events.length !== 1 ? "s" : ""} scheduled
            </p>
          </div>
          <button
            onClick={onClose}
            className={`text-sm px-4 py-2 rounded-xl border font-medium transition ${btnBase}`}
          >
            ← Back
          </button>
        </div>

        {/* Custom toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button
              onClick={goToToday}
              className={`text-sm px-3 py-1.5 rounded-lg border font-medium ${btnBase}`}
            >
              Today
            </button>
            <button
              onClick={() => navigate("prev")}
              className={`text-sm px-3 py-1.5 rounded-lg border font-medium ${btnBase}`}
            >
              ←
            </button>
            <button
              onClick={() => navigate("next")}
              className={`text-sm px-3 py-1.5 rounded-lg border font-medium ${btnBase}`}
            >
              →
            </button>
          </div>
          <p className={`font-semibold text-base ${titleColor}`}>{label}</p>
          <div className="flex gap-2">
            {["month", "week", "agenda"].map(v => (
              <button
                key={v}
                onClick={() => setCurrentView(v)}
                className={`text-sm px-3 py-1.5 rounded-lg capitalize border font-medium transition ${currentView === v ? "bg-indigo-600 text-white border-indigo-600" : btnBase}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {events.length === 0 ? (
          <div className={`rounded-2xl border p-12 text-center ${cardBg}`}>
            <p className="text-4xl mb-4">📅</p>
            <p className={`font-semibold text-lg ${titleColor}`}>No interviews scheduled yet</p>
            <p className={`text-sm mt-2 ${subColor}`}>Add an interview date to any application and it will show up here</p>
          </div>
        ) : (
          <div className={`rounded-2xl border p-6 ${cardBg}`}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              view={currentView}
              date={currentDate}
              onView={setCurrentView}
              onNavigate={setCurrentDate}
              views={["month", "week", "agenda"]}
              eventPropGetter={() => ({
                style: {
                  backgroundColor: "#6366f1",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "11px",
                  padding: "2px 6px",
                }
              })}
            />
          </div>
        )}

        {events.length > 0 && (
          <div className="mt-6">
            <p className={`text-sm font-semibold ${titleColor} mb-3`}>Upcoming Interviews</p>
            <div className="grid grid-cols-1 gap-3">
              {events
                .sort((a, b) => a.start - b.start)
                .map((event, i) => (
                  <div key={i} className={`rounded-xl border p-4 flex items-center gap-4 ${cardBg}`}>
                    <div className="w-12 h-12 rounded-xl bg-indigo-500 flex flex-col items-center justify-center shrink-0">
                      <p className="text-white text-xs font-medium">{format(event.start, "MMM")}</p>
                      <p className="text-white text-lg font-bold leading-none">{format(event.start, "d")}</p>
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${titleColor}`}>{event.resource.company}</p>
                      <p className={`text-xs mt-0.5 ${subColor}`}>{event.resource.role}</p>
                    </div>
                    <div className="ml-auto">
                      <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? "bg-indigo-900 text-indigo-300" : "bg-indigo-50 text-indigo-600"}`}>
                        {format(event.start, "EEE, MMM d")}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default CalendarView