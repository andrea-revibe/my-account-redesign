import { useState } from 'react'
import { ChevronUp, ChevronDown, ShoppingBag, HelpCircle } from 'lucide-react'
import { ORDER_STATES } from '../lib/statuses'
import StatusTimeline from './StatusTimeline'
import OrderSummary from './OrderSummary'

// Inline-expandable order card. defaultExpanded prop lets phase 2 auto-collapse
// delivered orders without changing the component.
export default function OrderCard({ order, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const state = ORDER_STATES[order.state] ?? ORDER_STATES.open

  return (
    <article className="bg-surface rounded-card border border-line/60 overflow-hidden">
      <header className="p-4 flex items-start gap-3">
        <span className="w-7 h-7 rounded-full bg-brand/10 grid place-items-center text-brand shrink-0">
          <ShoppingBag size={14} strokeWidth={2.25} />
        </span>
        <div className="flex-1 text-body">
          <span className="font-bold text-ink">Order: </span>
          <span className="font-bold text-brand">{order.id}</span>
        </div>
        <button
          aria-label={expanded ? 'Collapse order' : 'Expand order'}
          onClick={() => setExpanded((v) => !v)}
          className="w-7 h-7 rounded-full border border-line/70 grid place-items-center text-ink/70"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </header>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          <DetailRows order={order} state={state} />

          <div className="flex items-center gap-2">
            <button className="flex-1 h-9 rounded-btn border border-line/70 text-body text-ink/70 px-3 text-left">
              Change address
            </button>
            <button
              aria-label="Address help"
              className="w-9 h-9 rounded-btn border border-line/70 grid place-items-center text-ink/60"
            >
              <HelpCircle size={14} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex-1 h-10 rounded-btn border border-brand text-brand font-bold text-body">
              Download receipt
            </button>
            <button className="flex-1 h-10 rounded-btn border border-line text-muted font-bold text-body">
              Raise a claim
            </button>
          </div>

          <ProductBlock product={order.product} />

          <StatusTimeline
            currentStatusId={order.statusId}
            timeline={formatTimeline(order.timeline)}
          />

          <button
            aria-label="Collapse details"
            onClick={() => setExpanded(false)}
            className="mx-auto flex w-7 h-7 rounded-full border border-line/70 items-center justify-center text-ink/70"
          >
            <ChevronUp size={14} />
          </button>

          <OrderSummary order={order} />
        </div>
      )}
    </article>
  )
}

function DetailRows({ order, state }) {
  return (
    <div className="space-y-2 text-body">
      <p>
        <span className="font-bold">Phone number:</span> {order.phone}
      </p>
      <p>
        <span className="font-bold">Address:</span> {order.address}
      </p>
      <p>
        <span className="font-bold">Date &amp; Time:</span> {order.placedAt}
      </p>
      <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
        <span>
          <span className="font-bold">Quantity:</span> {order.quantity}
        </span>
        <span>
          <span className="font-bold">Total Amount:</span> {order.currency}{' '}
          {order.total.toLocaleString()}
        </span>
        {state.chip && (
          <span
            className={`px-3 py-1 rounded-btn text-small font-semibold ${state.chip.bg} ${state.chip.fg}`}
          >
            {state.chip.text}
          </span>
        )}
      </div>
    </div>
  )
}

function ProductBlock({ product }) {
  return (
    <div className="flex items-center gap-3 pt-3 border-t border-line/60">
      <img
        src={product.image}
        alt={product.name}
        className="w-16 h-16 object-contain rounded-lg bg-white"
      />
      <div className="text-body">
        <a href="#" className="font-bold text-ink underline underline-offset-2">
          {product.name}
        </a>
        <p className="text-muted">{product.variant}</p>
      </div>
    </div>
  )
}

// Map raw timestamp string into the two-line "9 Apr 2026\n7:09 PM" form
// used in the screenshots, so the timeline labels stack neatly under each step.
function formatTimeline(timeline) {
  const out = {}
  for (const [k, v] of Object.entries(timeline)) {
    const parts = String(v).split(' ')
    if (parts.length >= 5) {
      out[k] = `${parts.slice(0, 3).join(' ')}\n${parts.slice(3).join(' ')}`
    } else {
      out[k] = v
    }
  }
  return out
}
