import { SlidersHorizontal, User } from 'lucide-react'

// Compact secondary nav row visible just above the main account content.
export default function FiltersRow() {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-line/40">
      <button aria-label="Filters" className="p-1">
        <SlidersHorizontal size={18} strokeWidth={2} className="text-ink" />
      </button>
      <button
        aria-label="Account"
        className="w-9 h-9 rounded-full bg-brand grid place-items-center text-white"
      >
        <User size={18} strokeWidth={2} />
      </button>
    </div>
  )
}
