import { useState } from "react"

const STATUSES = ["Applied", "Screening", "Interview", "Offer", "Rejected"]
const SOURCES = ["LinkedIn", "Rozee.pk", "Indeed", "Company Website", "Email", "Referral"]

function ApplicationModal({ onClose, onSave, existingApp, darkMode }) {
  const [form, setForm] = useState({
    company: "",
    role: "",
    secondPreference: "",
    status: "Applied",
    dateApplied: "",
    interviewDate: "",
    interviewTime: "",
    jobLink: "",
    source: "",
    notes: "",
    ...existingApp
  })

  const [errors, setErrors] = useState({})

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: "" }))
  }

  function validate() {
    const newErrors = {}
    if (!form.company.trim()) newErrors.company = "Company name is required"
    else if (form.company.length > 50) newErrors.company = "Company name must be under 50 characters"
    if (form.role.length > 80) newErrors.role = "Role must be under 80 characters"
    if (form.secondPreference.length > 80) newErrors.secondPreference = "Second preference must be under 80 characters"
    if (form.dateApplied) {
      const date = new Date(form.dateApplied)
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      if (isNaN(date.getTime())) newErrors.dateApplied = "Invalid date format"
      else if (date > today) newErrors.dateApplied = "Date applied can't be in the future"
    }
    if (form.interviewDate) {
      const date = new Date(form.interviewDate)
      if (isNaN(date.getTime())) newErrors.interviewDate = "Invalid date format"
      if (form.dateApplied && form.interviewDate < form.dateApplied) newErrors.interviewDate = "Interview date can't be before date applied"
    }
    if (form.jobLink && !/^https?:\/\/.+/.test(form.jobLink)) newErrors.jobLink = "Link must start with http:// or https://"
    if (form.notes.length > 300) newErrors.notes = `Notes too long — ${form.notes.length}/300 characters`
    return newErrors
  }

  function handleSubmit() {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    onSave(form)
    onClose()
  }

  const isCustomSource = form.source !== "" && !SOURCES.includes(form.source)
  const modalBg = darkMode ? "bg-gray-900" : "bg-white"
  const labelColor = darkMode ? "text-gray-400" : "text-gray-500"
  const titleColor = darkMode ? "text-white" : "text-gray-800"
  const inputClass = darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"
  const errorInputClass = darkMode ? "bg-red-950 border-red-500 text-white placeholder-gray-500" : "bg-red-50 border-red-400 text-gray-800"
  const counterColor = darkMode ? "text-gray-600" : "text-gray-300"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${modalBg} rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-5">
          <h2 className={`text-lg font-bold ${titleColor}`}>{existingApp ? "Edit Application" : "Add Application"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300 text-xl">✕</button>
        </div>

        <div className="flex flex-col gap-4">

          <div>
            <label className={`text-xs font-medium mb-1 block ${labelColor}`}>Company Name *</label>
            <input name="company" value={form.company} onChange={handleChange} placeholder="e.g. Google"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.company ? errorInputClass : inputClass}`} />
            {errors.company && <p className="text-xs text-red-500 mt-1">⚠️ {errors.company}</p>}
            <p className={`text-xs mt-1 text-right ${counterColor}`}>{form.company.length}/50</p>
          </div>

          <div>
            <label className={`text-xs font-medium mb-1 block ${labelColor}`}>First Preference (Role)</label>
            <input name="role" value={form.role} onChange={handleChange} placeholder="e.g. Social Media Manager"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.role ? errorInputClass : inputClass}`} />
            {errors.role && <p className="text-xs text-red-500 mt-1">⚠️ {errors.role}</p>}
            <p className={`text-xs mt-1 text-right ${counterColor}`}>{form.role.length}/80</p>
          </div>

          <div>
            <label className={`text-xs font-medium mb-1 block ${labelColor}`}>Second Preference (Role)</label>
            <input name="secondPreference" value={form.secondPreference} onChange={handleChange} placeholder="e.g. Content Creator"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.secondPreference ? errorInputClass : inputClass}`} />
            {errors.secondPreference && <p className="text-xs text-red-500 mt-1">⚠️ {errors.secondPreference}</p>}
            <p className={`text-xs mt-1 text-right ${counterColor}`}>{form.secondPreference.length}/80</p>
          </div>

          <div>
            <label className={`text-xs font-medium mb-1 block ${labelColor}`}>Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${inputClass}`}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className={`text-xs font-medium mb-1 block ${labelColor}`}>Where did you find this job?</label>
            <select
              value={isCustomSource ? "Other" : form.source}
              onChange={e => {
                if (e.target.value === "Other") setForm(prev => ({ ...prev, source: "other_custom" }))
                else setForm(prev => ({ ...prev, source: e.target.value }))
              }}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${inputClass}`}
            >
              <option value="">Select source</option>
              {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              <option value="Other">Other</option>
            </select>
            {isCustomSource && (
              <input name="source" value={form.source === "other_custom" ? "" : form.source} onChange={handleChange}
                placeholder="Type where you found this job..."
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 mt-2 ${inputClass}`} autoFocus />
            )}
          </div>

          <div>
            <label className={`text-xs font-medium mb-1 block ${labelColor}`}>Date Applied</label>
            <input name="dateApplied" type="date" value={form.dateApplied} onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.dateApplied ? errorInputClass : inputClass}`} />
            {errors.dateApplied && <p className="text-xs text-red-500 mt-1">⚠️ {errors.dateApplied}</p>}
          </div>

          <div>
            <label className={`text-xs font-medium mb-1 block ${labelColor}`}>Interview Date</label>
            <input name="interviewDate" type="date" value={form.interviewDate} onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.interviewDate ? errorInputClass : inputClass}`} />
            {errors.interviewDate && <p className="text-xs text-red-500 mt-1">⚠️ {errors.interviewDate}</p>}
          </div>

          <div>
            <label className={`text-xs font-medium mb-1 block ${labelColor}`}>Interview Time</label>
            <input name="interviewTime" type="time" value={form.interviewTime || ""} onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${inputClass}`} />
          </div>

          <div>
            <label className={`text-xs font-medium mb-1 block ${labelColor}`}>Job Link</label>
            <input name="jobLink" value={form.jobLink} onChange={handleChange} placeholder="e.g. https://linkedin.com/jobs/..."
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.jobLink ? errorInputClass : inputClass}`} />
            {errors.jobLink && <p className="text-xs text-red-500 mt-1">⚠️ {errors.jobLink}</p>}
          </div>

          <div>
            <label className={`text-xs font-medium mb-1 block ${labelColor}`}>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Any notes about this application..." rows={3}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none ${errors.notes ? errorInputClass : inputClass}`} />
            {errors.notes && <p className="text-xs text-red-500 mt-1">⚠️ {errors.notes}</p>}
            <p className={`text-xs mt-1 text-right ${form.notes.length > 270 ? "text-red-400" : counterColor}`}>{form.notes.length}/300</p>
          </div>

        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className={`flex-1 border text-sm font-medium py-2 rounded-lg ${darkMode ? "border-gray-700 text-gray-400 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>Cancel</button>
          <button onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg">{existingApp ? "Save Changes" : "Add Application"}</button>
        </div>
      </div>
    </div>
  )
}

export default ApplicationModal