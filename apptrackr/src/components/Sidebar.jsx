import { supabase } from "../supabase"
{!collapsed && (
  <div className="px-4 py-4 border-t border-gray-100 flex flex-col gap-2">
    <ExportButton applications={applications} />
    <button
      onClick={() => supabase.auth.signOut()}
      className={`w-full flex items-center gap-2 text-sm px-3 py-2 rounded-xl transition ${darkMode ? "text-gray-500 hover:bg-gray-800" : "text-gray-400 hover:bg-gray-50"}`}
    >
      <span>↩️</span> Sign out
    </button>
  </div>
)}