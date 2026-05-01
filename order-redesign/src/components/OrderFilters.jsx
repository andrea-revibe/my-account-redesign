import { Calendar, ChevronDown, Search } from 'lucide-react'

// Visual filters card matching the existing app: date picker, status dropdown,
// search field. Non-functional in this prototype.
export default function OrderFilters() {
  return (
    <section className="bg-surface rounded-card border border-line/60 p-4 space-y-3">
      <FilterField icon={<Calendar size={16} className="text-ink/70" />}>
        Select Date
      </FilterField>
      <FilterField icon={<ChevronDown size={16} className="text-ink/70" />} iconRight>
        Order Status
      </FilterField>
      <FilterField icon={<Search size={16} className="text-ink/70" />}>
        Search...
      </FilterField>
    </section>
  )
}

function FilterField({ icon, iconRight = false, children }) {
  return (
    <div className="flex items-center gap-2 h-10 px-3 rounded-btn border border-line/70 bg-white">
      {!iconRight && icon}
      <span className="flex-1 text-body text-ink/60">{children}</span>
      {iconRight && icon}
    </div>
  )
}
