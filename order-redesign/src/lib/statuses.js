// Canonical fulfilment progression. Phase 2 can extend this list
// (e.g. add "Out for delivery" between "Shipped" and "Delivered")
// without touching the components — the timeline derives from this.
export const STATUSES = [
  { id: 'created', label: 'Order created' },
  { id: 'quality_check', label: 'At quality check' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
]

// Terminal / non-progression states shown as a chip and in the summary.
// Today's app uses "Close" as a chip on the order header and "Cancelled"
// in red in the summary. Keep them as standalone metadata so phase 2 can
// add returns / refunds the same way.
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
