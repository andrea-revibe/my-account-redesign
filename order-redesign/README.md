# Order Redesign

Internal-demo prototype of the My Account → Orders area for the Revibe
mobile site. Built to evaluate functional and visual changes (additional
shipment statuses, collapsing delivered orders, elevated courier tracking)
before specifying them for production.

## Stack

- React 19 + Vite
- Tailwind CSS 3
- lucide-react for icons
- Inter (Google Fonts) substituted for Graphik

## Run it

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
```

## Where things live

- `src/App.jsx` — page composition.
- `src/components/` — UI components, one per file.
- `src/data/orders.js` — mock orders. Swap for an API call to ship for real.
- `src/lib/statuses.js` — single source of truth for top-level statuses, shipping sub-statuses, header chips, and the auto-collapse rule.
- `public/` — Revibe logo and product image (local copies, not hotlinked).
- `brief/` — source material (screenshots and the design-system reference).
- `docs/my-account-flow.md` — living documentation of how the orders area works (product + engineering audience).
- `CHANGELOG.md` — change history, phase by phase.

## Scope reminder

Functional: the orders list, expand/collapse interactions, status communication.

Decorative (visual placeholder, no logic): search, filters, store credits, profile menu, language toggle, address-change / receipt / claim flows.

See `docs/my-account-flow.md` § "Mocked vs production gap" for the full list of fakes.
