import { statusDescription } from '../lib/statuses'

const TONES = {
  brand: { box: 'bg-brand/5 border-brand/20', lead: 'text-brand' },
  success: { box: 'bg-success/10 border-success/30', lead: 'text-success' },
  warn: { box: 'bg-progress/10 border-progress/40', lead: 'text-progress' },
  danger: { box: 'bg-chip-danger/10 border-chip-danger/30', lead: 'text-chip-danger' },
}

export default function StatusBanner({ order }) {
  const { tone, lead, body } = statusDescription(order)
  const t = TONES[tone] ?? TONES.brand
  return (
    <section className={`rounded-card border p-4 ${t.box}`}>
      <p className="text-body leading-snug">
        <span className={`font-bold ${t.lead}`}>{lead}</span>{' '}
        <span className="text-ink/80">{body}</span>
      </p>
    </section>
  )
}
