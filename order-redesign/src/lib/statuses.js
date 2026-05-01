// Top-level fulfilment progression. Always 4 steps in the horizontal
// timeline regardless of how shipping decomposes underneath.
export const STATUSES = [
  { id: 'created', label: 'Order created' },
  { id: 'quality_check', label: 'At quality check' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
]

// Sub-statuses that apply only while the order is in the `shipped` stage.
// "delivered" is intentionally NOT here — when the package is delivered,
// the order transitions to the top-level `delivered` stage instead.
import {
  Plane,
  ShieldCheck,
  ArrowRightLeft,
  Truck,
  Package,
  PackageCheck,
  XCircle,
} from 'lucide-react'

export const SHIPPING_SUB_STATUSES = [
  {
    id: 'arrived_destination',
    label: 'Arrived in destination country',
    icon: Plane,
  },
  {
    id: 'cleared_customs',
    label: 'Cleared customs',
    icon: ShieldCheck,
  },
  {
    id: 'forwarded_to_agent',
    label: 'Forwarded to third-party agent',
    icon: ArrowRightLeft,
  },
  {
    id: 'out_for_delivery',
    label: 'Out for delivery',
    icon: Truck,
  },
]

// Header / summary states. Independent of the progression — an order can be
// "open" while at quality_check or "cancelled" while shipped.
export const ORDER_STATES = {
  open: { label: 'Open', chip: null, summaryClass: 'text-ink' },
  close: {
    label: 'Close',
    chip: { text: 'Close', bg: 'bg-chip-warn', fg: 'text-chip-warnInk' },
    summaryClass: 'text-ink',
  },
  cancelled: {
    label: 'Cancelled',
    chip: { text: 'Cancelled', bg: 'bg-red-100', fg: 'text-chip-danger' },
    summaryClass: 'text-chip-danger',
  },
}

export function progressIndex(currentStatusId) {
  const i = STATUSES.findIndex((s) => s.id === currentStatusId)
  return i === -1 ? STATUSES.length - 1 : i
}

export function subProgressIndex(currentSubStatusId) {
  const i = SHIPPING_SUB_STATUSES.findIndex((s) => s.id === currentSubStatusId)
  return i // -1 if not provided — caller handles
}

// Picks the single "most in-flight" order to auto-expand by default — the
// non-delivered, non-cancelled order furthest along the fulfilment pipeline
// (sub-status counts as a finer-grained tiebreaker within `shipped`). Returns
// null when nothing in the list is in flight (e.g. only delivered orders).
export function pickActiveOrderId(orders) {
  const inFlight = orders.filter(
    (o) => o.statusId !== 'delivered' && o.state !== 'cancelled',
  )
  if (inFlight.length === 0) return null
  const rank = (o) =>
    progressIndex(o.statusId) * 10 + Math.max(0, subProgressIndex(o.subStatusId))
  const sorted = [...inFlight].sort((a, b) => rank(b) - rank(a))
  return sorted[0].id
}

// Headline shown in the collapsed-card header. Sub-status takes precedence
// while shipping so the customer sees "Out for delivery" instead of "Shipped".
export function statusHeadline(order) {
  if (order.state === 'cancelled') return 'Cancelled'
  if (order.statusId === 'delivered') return 'Delivered'
  if (order.statusId === 'shipped') {
    const sub = SHIPPING_SUB_STATUSES.find((s) => s.id === order.subStatusId)
    if (sub) return sub.label
    return 'Shipped'
  }
  if (order.statusId === 'created') return 'Order placed'
  const top = STATUSES.find((s) => s.id === order.statusId)
  return top ? top.label : 'Order'
}

// Smaller line under the headline — most recent timeline timestamp,
// phrased to fit the state.
export function statusSubline(order) {
  if (order.state === 'cancelled') {
    const keys = Object.keys(order.timeline || {})
    const last = keys[keys.length - 1]
    return last ? `Last update ${order.timeline[last]}` : null
  }
  if (order.statusId === 'delivered' && order.timeline?.delivered) {
    return order.timeline.delivered
  }
  if (order.statusId === 'shipped') {
    // Forward-looking ETA wins when DHL provides it; otherwise fall back
    // to the most recent sub-status timestamp.
    if (order.estimatedDelivery) return `Delivery by ${order.estimatedDelivery}`
    const ts = order.subTimeline?.[order.subStatusId] || order.timeline?.shipped
    return ts ? `Updated ${ts}` : null
  }
  if (order.statusId === 'quality_check' && order.timeline?.quality_check) {
    return `Since ${order.timeline.quality_check}`
  }
  if (order.statusId === 'created' && order.timeline?.created) {
    return order.timeline.created
  }
  return null
}

// Icon + colour scheme for the status bubble in the collapsed-card header.
// Cancelled goes red, delivered green, everything in-progress is brand purple.
export function statusIconFor(order) {
  if (order.state === 'cancelled') {
    return { Icon: XCircle, bg: 'bg-red-50', fg: 'text-chip-danger' }
  }
  if (order.statusId === 'delivered') {
    return { Icon: PackageCheck, bg: 'bg-green-50', fg: 'text-success' }
  }
  if (order.statusId === 'shipped') {
    return { Icon: Truck, bg: 'bg-brand/10', fg: 'text-brand' }
  }
  if (order.statusId === 'quality_check') {
    return { Icon: ShieldCheck, bg: 'bg-brand/10', fg: 'text-brand' }
  }
  return { Icon: Package, bg: 'bg-brand/10', fg: 'text-brand' }
}
