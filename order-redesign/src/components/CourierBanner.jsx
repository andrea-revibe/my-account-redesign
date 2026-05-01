import { Truck, ExternalLink } from 'lucide-react'

// Prototype links — hardcoded to a known-good DHL Express shipment so the
// demo lands on a real tracking page regardless of the order's data.
const DHL_TRACKING_URL =
  'https://www.dhl.com/us-en/home/tracking/tracking-express.html?submit=1&tracking-id=3392654392'
const DHL_HELP_URL = 'https://www.dhl.com/us-en/home/customer-service.html'

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
          href={DHL_TRACKING_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 h-10 rounded-btn bg-brand text-white font-bold text-body w-full"
        >
          {delivered ? 'View tracking history' : 'Track order'}
          <ExternalLink size={14} strokeWidth={2.25} />
        </a>
      )}

      <a
        href={DHL_HELP_URL}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 h-10 rounded-btn bg-brand/10 text-brand font-bold text-body w-full"
      >
        Need help with delivery?
        <ExternalLink size={14} strokeWidth={2.25} />
      </a>
    </section>
  )
}
