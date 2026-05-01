import { useMemo, useState } from 'react'
import PromoBar from './components/PromoBar'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import FiltersRow from './components/FiltersRow'
import StoreCreditsCard from './components/StoreCreditsCard'
import OrderFilters from './components/OrderFilters'
import OrderCard from './components/OrderCard'
import ChatFab from './components/ChatFab'
import { ORDERS } from './data/orders'
import { pickActiveOrderId } from './lib/statuses'

const RANGE_DAYS = { '30d': 30, '3m': 90, '1y': 365, all: Infinity }

// Parses 'DD/MM/YYYY HH:MM AM/PM' → epoch ms.
function parsePlacedAt(s) {
  const [datePart, timePart, ampm] = s.split(' ')
  const [d, m, y] = datePart.split('/').map(Number)
  let [hh, mm] = timePart.split(':').map(Number)
  if (ampm === 'PM' && hh !== 12) hh += 12
  if (ampm === 'AM' && hh === 12) hh = 0
  return new Date(y, m - 1, d, hh, mm).getTime()
}

function matchesStatus(order, status) {
  if (status === 'all') return true
  if (status === 'cancelled') return order.state === 'cancelled'
  if (status === 'delivered')
    return order.statusId === 'delivered' && order.state !== 'cancelled'
  if (status === 'in_progress')
    return order.state !== 'cancelled' && order.statusId !== 'delivered'
  return true
}

function matchesRange(order, rangeId, now) {
  const days = RANGE_DAYS[rangeId] ?? Infinity
  if (days === Infinity) return true
  const cutoff = now - days * 24 * 60 * 60 * 1000
  return parsePlacedAt(order.placedAt) >= cutoff
}

export default function App() {
  const [activeStatus, setActiveStatus] = useState('all')
  const [activeRange, setActiveRange] = useState('3m')

  const filtered = useMemo(() => {
    const now = Date.now()
    return ORDERS.filter(
      (o) => matchesStatus(o, activeStatus) && matchesRange(o, activeRange, now),
    )
  }, [activeStatus, activeRange])

  const activeId = useMemo(() => pickActiveOrderId(filtered), [filtered])

  return (
    <div className="min-h-full flex justify-center">
      <div className="w-full max-w-mobile bg-white shadow-sm relative pb-24">
        <PromoBar />
        <Header />
        <SearchBar />
        <FiltersRow />

        <main className="px-4 py-4 space-y-4">
          <StoreCreditsCard />

          <h1 className="text-page font-bold text-ink">Orders</h1>

          <OrderFilters
            activeStatus={activeStatus}
            onStatusChange={setActiveStatus}
            activeRange={activeRange}
            onRangeChange={setActiveRange}
          />

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <p className="text-small text-muted text-center py-8">
                No orders match the selected filters.
              </p>
            ) : (
              filtered.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  defaultExpanded={order.id === activeId}
                />
              ))
            )}
          </div>
        </main>

        <ChatFab />
      </div>
    </div>
  )
}
