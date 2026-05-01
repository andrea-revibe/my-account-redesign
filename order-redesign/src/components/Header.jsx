import { Menu, ChevronDown, User, Heart, ShoppingBag } from 'lucide-react'

export default function Header() {
  return (
    <header className="flex items-center gap-3 px-4 py-3 border-b border-line/60 bg-white">
      <button aria-label="Menu" className="p-1 -ml-1">
        <Menu size={22} strokeWidth={2} className="text-ink" />
      </button>

      <button className="flex items-center gap-1 text-small font-medium text-ink">
        <span
          aria-hidden
          className="inline-block w-5 h-3 rounded-sm overflow-hidden border border-line/40"
          style={{
            background:
              'linear-gradient(to bottom, #00732F 33%, #FFF 33% 66%, #000 66%)',
          }}
        />
        UAE
        <ChevronDown size={14} strokeWidth={2} />
      </button>

      <a
        href="#"
        className="ml-1 mr-auto flex items-center"
        aria-label="Revibe home"
      >
        <img src="/revibe-logo.svg" alt="Revibe" className="h-5" />
      </a>

      <a href="#" className="text-small text-ink whitespace-nowrap">
        العربية
      </a>
      <button aria-label="Account" className="p-1">
        <User size={20} strokeWidth={1.75} className="text-ink" />
      </button>
      <button aria-label="Wishlist" className="p-1">
        <Heart size={20} strokeWidth={1.75} className="text-ink" />
      </button>
      <button aria-label="Bag" className="p-1 -mr-1">
        <ShoppingBag size={20} strokeWidth={1.75} className="text-ink" />
      </button>
    </header>
  )
}
