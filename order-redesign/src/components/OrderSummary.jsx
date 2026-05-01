import { ORDER_STATES } from '../lib/statuses'

export default function OrderSummary({ order }) {
  const state = ORDER_STATES[order.state] ?? ORDER_STATES.open

  return (
    <section className="space-y-3 pt-4 border-t border-line/60">
      <h3 className="text-section font-bold text-ink">Order summary</h3>

      <Row label="Order Status">
        <span className={`font-semibold ${state.summaryClass}`}>
          {state.label}
        </span>
      </Row>
      <Row label="Order Date">{order.placedAt}</Row>
      <Row label="Customer Name">{order.customerName}</Row>
      {order.trackingNumber && (
        <Row label="Tracking Number">{order.trackingNumber}</Row>
      )}
      {order.courier && <Row label="Carrier">{order.courier}</Row>}
      <Row label="Order Price" emphasised>
        <span className="font-bold">
          {order.currency} {order.total.toLocaleString()}
        </span>
      </Row>
    </section>
  )
}

function Row({ label, children, emphasised = false }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${
        emphasised ? 'pt-3 border-t border-line/60' : ''
      }`}
    >
      <span className="text-body text-ink">{label}</span>
      <span className="text-body text-ink text-right">{children}</span>
    </div>
  )
}
