function SearchBar({ search, setSearch, darkMode }) {
  const inputBg = darkMode
    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
    : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"

  return (
    <div className="relative">
      <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by company or role..."
        className={`w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${inputBg}`}
      />
      {search && (
        <button
          onClick={() => setSearch("")}
          className="absolute right-3 top-2.5 text-gray-300 hover:text-gray-500 text-sm"
        >✕</button>
      )}
    </div>
  )
}

export default SearchBar