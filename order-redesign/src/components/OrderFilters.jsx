import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Search, Check } from 'lucide-react'

export const STATUS_CHIPS = [
  { id: 'all', label: 'All' },
  { id: 'in_progress', label: 'In progress' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
]

export const DATE_RANGES = [
  { id: '30d', label: 'Last 30 days' },
  { id: '3m', label: 'Last 3 months' },
  { id: '1y', label: 'Last year' },
  { id: 'all', label: 'All time' },
]

// Compact filters: search + date-range preset side by side, with a status
// chip row underneath. State is owned by the parent so the order list can
// respond to changes.
export default function OrderFilters({
  activeStatus,
  onStatusChange,
  activeRange,
  onRangeChange,
}) {
  const [rangeOpen, setRangeOpen] = useState(false)
  const rangeRef = useRef(null)

  useEffect(() => {
    if (!rangeOpen) return
    function handle(e) {
      if (rangeRef.current && !rangeRef.current.contains(e.target)) {
        setRangeOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [rangeOpen])

  const activeRangeLabel =
    DATE_RANGES.find((r) => r.id === activeRange)?.label ?? DATE_RANGES[1].label

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="flex-1 flex items-center gap-2 h-10 px-3 rounded-btn border border-line/70 bg-white">
          <Search size={16} className="text-ink/70" />
          <input
            type="search"
            placeholder="Find items"
            className="flex-1 min-w-0 bg-transparent outline-none text-body placeholder:text-ink/60"
          />
        </label>

        <div ref={rangeRef} className="relative">
          <button
            type="button"
            onClick={() => setRangeOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={rangeOpen}
            className="flex items-center gap-2 h-10 px-3 rounded-btn border border-line/70 bg-white text-body text-ink"
          >
            <span>{activeRangeLabel}</span>
            <ChevronDown
              size={16}
              className={`text-ink/70 transition-transform ${rangeOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {rangeOpen && (
            <ul
              role="listbox"
              className="absolute right-0 top-11 z-10 w-44 bg-white border border-line/60 rounded-btn shadow-md py-1"
            >
              {DATE_RANGES.map((r) => {
                const active = r.id === activeRange
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        onRangeChange?.(r.id)
                        setRangeOpen(false)
                      }}
                      className={
                        'w-full flex items-center justify-between px-3 h-9 text-body text-left hover:bg-searchBg ' +
                        (active ? 'text-brand font-bold' : 'text-ink')
                      }
                    >
                      <span>{r.label}</span>
                      {active && <Check size={14} className="text-brand" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto -mx-4 px-4 pb-1">
        {STATUS_CHIPS.map((chip) => {
          const active = chip.id === activeStatus
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => onStatusChange?.(chip.id)}
              className={
                'shrink-0 h-8 px-3 rounded-full border text-small font-bold transition-colors ' +
                (active
                  ? 'bg-brand text-white border-brand'
                  : 'bg-white text-ink/80 border-line/70')
              }
            >
              {chip.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}
