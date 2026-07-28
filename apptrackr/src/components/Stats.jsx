function Stats({ applications, darkMode }) {
  const total = applications.length
  const interviews = applications.filter(app => app.status === "Interview").length
  const offers = applications.filter(app => app.status === "Offer").length
  const rejected = applications.filter(app => app.status === "Rejected").length
  const responseRate = total > 0 ? Math.round(((interviews + offers) / total) * 100) : 0

  const stats = [
    { label: "Total Applied", value: total, color: "text-blue-600", bg: darkMode ? "bg-blue-950 border border-blue-900" : "bg-blue-50 border border-blue-100" },
    { label: "Interviews", value: interviews, color: "text-purple-600", bg: darkMode ? "bg-purple-950 border border-purple-900" : "bg-purple-50 border border-purple-100" },
    { label: "Offers", value: offers, color: "text-green-600", bg: darkMode ? "bg-green-950 border border-green-900" : "bg-green-50 border border-green-100" },
    { label: "Rejected", value: rejected, color: "text-red-500", bg: darkMode ? "bg-red-950 border border-red-900" : "bg-red-50 border border-red-100" },
    { label: "Response Rate", value: `${responseRate}%`, color: "text-yellow-600", bg: darkMode ? "bg-yellow-950 border border-yellow-900" : "bg-yellow-50 border border-yellow-100" },
  ]

 function getMotivation(total) {
  if (total === 0) return "Add your first application and start your journey! 💪"
  if (total < 5) return `${total} applications in — the grind has started, don't stop now!`
  if (total < 10) return `${total} applications! Early days but you're showing up every day 🙌`
  if (total < 20) return `${total} applications! The right one is closer than you think ✨`
  if (total < 30) return `${total} applications! You're putting in real work, it will pay off 🔥`
  if (total < 40) return `${total} applications! Most people give up way before this. You didn't 💛`
  if (total < 50) return `${total} applications! Honestly? This level of consistency is rare. Keep going 🚀`
  if (total < 60) return `${total} applications! You've applied more than most people ever will. Your offer is coming ⭐`
  return `${total} applications! You are built different. Don't you dare stop now 👑`
}

  return (
    <div className="mb-6">
      <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600 border border-gray-100 shadow-sm"}`}>
        {getMotivation(total)}
      </div>
      <div className="flex gap-4">
        {stats.map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-4 text-center flex flex-col items-center justify-center min-w-[260px] flex-1`}>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className={`text-xs mt-1 font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Stats