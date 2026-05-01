import { Wallet, Copy } from 'lucide-react'

export default function StoreCreditsCard({
  region = 'UAE',
  amount = 384,
  currency = 'AED',
  voucherCode = 'X644CM72BLPZEGLT',
}) {
  return (
    <section className="bg-surface rounded-card border border-line/60 p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-section font-bold text-ink">
            {region} Store Credits
          </h2>
          <p className="mt-0.5 text-page font-bold leading-tight bg-gradient-to-r from-[rgb(115,65,186)] to-accent bg-clip-text text-transparent">
            {currency} {amount}
          </p>
        </div>
        <Wallet size={28} className="text-brand" strokeWidth={1.75} />
      </div>

      <div className="flex items-center gap-2 pt-1">
        <p className="flex-1 text-small text-muted">
          Voucher code:{' '}
          <span className="font-bold text-ink">{voucherCode}</span>
        </p>
        <button
          aria-label="Copy voucher code"
          className="w-8 h-8 rounded-btn border border-line/70 grid place-items-center text-ink/70 hover:text-brand hover:border-brand"
        >
          <Copy size={14} strokeWidth={2} />
        </button>
      </div>
    </section>
  )
}
