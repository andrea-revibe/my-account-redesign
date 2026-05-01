import { Wallet, Info } from 'lucide-react'

export default function StoreCreditsCard({
  region = 'UAE',
  amount = 384,
  currency = 'AED',
  voucherCode = 'X644CM72BLPZEGLT',
}) {
  return (
    <section className="bg-surface rounded-card border border-line/60 p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-section font-bold text-ink">
            {region} Store Credits
          </h2>
          <p className="mt-1 text-page font-bold text-brand">
            {currency} {amount}
          </p>
        </div>
        <Wallet size={28} className="text-brand" strokeWidth={1.75} />
      </div>

      <div className="flex items-center gap-2">
        <button className="flex-1 h-9 rounded-btn border border-brand text-brand font-bold text-body px-3">
          Copy voucher code
        </button>
        <button
          aria-label="Voucher info"
          className="w-8 h-8 rounded-full border border-line/70 grid place-items-center text-ink/70"
        >
          <Info size={14} strokeWidth={2} />
        </button>
      </div>

      <p className="text-small text-muted">
        Voucher code:{' '}
        <span className="font-bold text-ink">{voucherCode}</span>
      </p>
    </section>
  )
}
