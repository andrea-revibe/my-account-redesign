import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import {
  ORDER_STATES,
  statusHeadline,
  statusSubline,
  statusIconFor,
} from '../lib/statuses'
import StatusTimeline from './StatusTimeline'
import OrderSummary from './OrderSummary'
import CourierBanner from './CourierBanner'
import ShippingSubTimeline from './ShippingSubTimeline'

// Inline-expandable order card. The header is always visible and now carries
// status, product and price (Noon-style). The body adds the long-form details.
export default function OrderCard({ order, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const state = ORDER_STATES[order.state] ?? ORDER_STATES.open

  return (
    <article className="bg-surface rounded-card border border-line/60 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="w-full text-left p-4 space-y-3"
      >
        <SummaryHeader order={order} state={state} expanded={expanded} />
        <ProductRow order={order} />
        <OrderIdRow id={order.id} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-line/60 pt-4">
          <DetailRows order={order} />

          <div className="flex items-center gap-3">
            <button className="flex-1 h-10 rounded-btn border border-brand text-brand font-bold text-body">
              Download receipt
            </button>
            <button className="flex-1 h-10 rounded-btn border border-line text-muted font-bold text-body">
              Raise a claim
            </button>
          </div>

          <CourierBanner order={order} />

          <StatusTimeline
            currentStatusId={order.statusId}
            timeline={formatTimeline(order.timeline)}
          />

          {order.statusId === 'shipped' && (
            <ShippingSubTimeline
              subStatusId={order.subStatusId}
              subTimeline={order.subTimeline}
            />
          )}

          <OrderSummary order={order} />
        </div>
      )}
    </article>
  )
}

function SummaryHeader({ order, state, expanded }) {
  const subline = statusSubline(order)
  const { Icon, bg, fg } = statusIconFor(order)
  // Delivered orders carry state:'close' in the data, but the user-facing
  // chip should read "Delivered" in green to match the status, not "Close".
  const chip =
    order.statusId === 'delivered' && order.state !== 'cancelled'
      ? { text: 'Delivered', bg: 'bg-green-50', fg: 'text-success' }
      : state.chip
  return (
    <div className="flex items-start gap-3">
      <span className={`w-9 h-9 rounded-full grid place-items-center shrink-0 ${bg} ${fg}`}>
        <Icon size={18} strokeWidth={2.25} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-ink">{statusHeadline(order)}</p>
        {subline && <p className="text-small text-muted mt-0.5">{subline}</p>}
      </div>
      {chip && (
        <span
          className={`px-2.5 py-1 rounded-btn text-small font-semibold whitespace-nowrap ${chip.bg} ${chip.fg}`}
        >
          {chip.text}
        </span>
      )}
      <span
        aria-hidden
        className="w-7 h-7 rounded-full border border-line/70 grid place-items-center text-ink/70 shrink-0"
      >
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </span>
    </div>
  )
}

function ProductRow({ order }) {
  const { product } = order
  return (
    <div className="pt-3 border-t border-line/60 flex items-center gap-3">
      <img
        src={product.image}
        alt={product.name}
        className="w-14 h-14 object-contain rounded-lg bg-white border border-line/40 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-ink truncate">{product.name}</p>
        <p className="text-small text-muted truncate">{product.variant}</p>
      </div>
      <p className="font-bold text-ink whitespace-nowrap">
        {order.currency} {order.total.toLocaleString()}
      </p>
    </div>
  )
}

function OrderIdRow({ id }) {
  return (
    <div className="pt-3 border-t border-line/60 text-small text-muted">
      Order ID <span className="font-bold text-ink">{id}</span>
    </div>
  )
}

function DetailRows({ order }) {
  return (
    <div className="space-y-2 text-body">
      <p>
        <span className="font-bold">Phone number:</span> {order.phone}
      </p>
      <p>
        <span className="font-bold">Address:</span> {order.address}
      </p>
      <p>
        <span className="font-bold">Quantity:</span> {order.quantity}
      </p>
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
