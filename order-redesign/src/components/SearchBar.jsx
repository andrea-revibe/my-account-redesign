import { Search } from 'lucide-react'

export default function SearchBar() {
  return (
    <div className="px-4 py-3 bg-white">
      <label className="flex items-center gap-2 bg-searchBg rounded-btn px-4 h-10">
        <input
          type="search"
          placeholder="What are you looking for...."
          className="flex-1 bg-transparent outline-none text-body placeholder:text-ink/70"
        />
        <button
          aria-label="Search"
          className="w-7 h-7 grid place-items-center rounded-full bg-ink text-white"
        >
          <Search size={14} strokeWidth={2.5} />
        </button>
      </label>
    </div>
  )
}
