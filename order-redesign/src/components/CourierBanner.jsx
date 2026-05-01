import { Truck, ExternalLink } from 'lucide-react'

// Elevates the courier + tracking link out of the order summary so customers
// can see it without scrolling. Adopts Noon's banner pattern, in Revibe palette.
export default function CourierBanner({ order }) {
  if (!order.courier) return null
  const delivered = order.statusId === 'delivered'

  const headline = delivered
    ? `Delivered by ${order.courier}`
    : `Tracked by ${order.courier}`

  const body = delivered
    ? 'Questions about this delivery? Contact the courier directly.'
    : 'Have a question about your delivery? Contact the courier directly for the latest updates.'

  return (
    <section className="rounded-card border border-brand/30 bg-brand/5 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <span className="w-9 h-9 rounded-full bg-brand text-white grid place-items-center shrink-0">
          <Truck size={18} strokeWidth={2} />
        </span>
        <div className="flex-1">
          <p className="text-body font-bold text-ink">{headline}</p>
          <p className="text-small text-ink/70 mt-0.5">{body}</p>
        </div>
      </div>

      {order.trackingUrl && (
        <a
          href={order.trackingUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 h-10 rounded-btn bg-brand text-white font-bold text-body w-full"
        >
          {delivered ? 'View tracking history' : 'Track order'}
          <ExternalLink size={14} strokeWidth={2.25} />
        </a>
      )}
    </section>
  )
}
