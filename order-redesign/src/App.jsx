import PromoBar from './components/PromoBar'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import FiltersRow from './components/FiltersRow'
import StoreCreditsCard from './components/StoreCreditsCard'
import OrderFilters from './components/OrderFilters'
import OrderCard from './components/OrderCard'
import ChatFab from './components/ChatFab'
import { ORDERS } from './data/orders'

export default function App() {
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

          <OrderFilters />

          <div className="space-y-3">
            {ORDERS.map((order, i) => (
              <OrderCard key={order.id} order={order} defaultExpanded={i === 0} />
            ))}
          </div>
        </main>

        <ChatFab />
      </div>
    </div>
  )
}
