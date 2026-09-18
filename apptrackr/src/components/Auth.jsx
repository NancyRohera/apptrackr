import { useState } from "react"
import { supabase } from "../supabase"

function Auth({ darkMode }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const bg = darkMode ? "bg-gray-950" : "bg-[#F4F6F9]"
  const cardBg = darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
  const titleColor = darkMode ? "text-white" : "text-gray-800"
  const labelColor = darkMode ? "text-gray-400" : "text-gray-500"
  const inputClass = darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"

  async function handleSubmit() {
    setError("")
    setLoading(true)

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      })
      if (error) setError(error.message)
      else setError("Check your email to confirm your account!")
    }
    setLoading(false)
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${bg}`}>
      <div className={`w-full max-w-md border rounded-2xl p-8 ${cardBg}`}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-lg">📋</span>
          </div>
          <div>
            <h1 className={`text-xl font-bold ${titleColor}`}>AppTrackr</h1>
            <p className={`text-xs ${labelColor}`}>Your job hunt, organised</p>
          </div>
        </div>

        <h2 className={`text-lg font-semibold mb-6 ${titleColor}`}>
          {isLogin ? "Welcome back" : "Create your account"}
        </h2>

        <div className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className={`text-xs font-medium mb-1 block ${labelColor}`}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nancy Rohera"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${inputClass}`}
              />
            </div>
          )}

          <div>
            <label className={`text-xs font-medium mb-1 block ${labelColor}`}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${inputClass}`}
            />
          </div>

          <div>
            <label className={`text-xs font-medium mb-1 block ${labelColor}`}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${inputClass}`}
            />
          </div>

          {error && (
            <p className={`text-xs px-3 py-2 rounded-lg ${error.includes("Check") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl text-sm transition"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>

          <p className={`text-center text-xs ${labelColor}`}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => { setIsLogin(!isLogin); setError("") }}
              className="text-indigo-500 font-medium ml-1"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth