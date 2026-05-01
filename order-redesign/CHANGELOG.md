# Changelog

Internal demo project. Format roughly follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased] — phase 2

### Added

- **Shipping sub-statuses** in `src/lib/statuses.js`: `arrived_destination`, `cleared_customs`, `forwarded_to_agent`, `out_for_delivery`. Always all four, in order — international and domestic shipments render the same list for now.
- **`ShippingSubTimeline`** — vertical sub-timeline rendered inside `OrderCard` only while `statusId === 'shipped'`. Pattern adapted from Noon's tracking screen; colors kept in Revibe palette.
- **`CourierBanner`** — visible while `statusId` is `shipped` or `delivered`. Shows the carrier headline, an explanatory sentence about contacting the courier, and a primary "Track order" CTA linking to the courier site. Uses a filled brand-purple button — first filled CTA in the app, deliberately so the action stands out.
- Mock orders now cover every top-level stage plus a cancelled order: `created`, `quality_check`, `shipped` (with sub-status `out_for_delivery`), `delivered`, and a cancelled-at-QC order.
- `isCollapsedByDefault(order)` helper centralises the auto-collapse rule.

### Changed

- Auto-collapse delivered + cancelled orders by default. Wired in `App.jsx`.
- `OrderSummary` no longer carries the courier as a hyperlink (it now lives in `CourierBanner`); replaced with a static "Carrier" row, hidden when the order has no carrier yet.
- Courier across all mock orders switched from Quiqup to **DHL**.

### Notes

- `OrderCard` is getting tall when fully expanded for shipped orders (banner + horizontal timeline + vertical sub-timeline + summary). Acceptable for phase 2; flag for review if real users complain.

### Changed (rework after first review)

- **`OrderCard` collapsed header rebuilt** to match the Noon-style summary card: status icon + headline + state chip + chevron, divider, product image with name/variant/total, divider, order ID. The chip is now visible at-a-glance, so cancelled orders read as cancelled even when collapsed.
- New helpers in `lib/statuses.js` — `statusHeadline`, `statusSubline`, `statusIconFor` — drive the new header so adding a status keeps the card in sync.
- Expanded body trimmed to avoid duplicating what the header already shows: dropped the inline `ProductBlock`, dropped "Date & Time" and "Total Amount" rows from the detail block.
- **`StatusTimeline` filled with brand colour** for reached stages (circles + connectors). Connector thickness bumped to 2px for legibility. The current step's label is now bold so it stands out without changing the dot treatment.
- **`estimatedDelivery`** added to the order shape (optional — DHL doesn't always provide it). When present on a shipped order, the collapsed-card subline switches from "Updated [timestamp]" to "Delivery by [date]"; absent, it falls back. Mock order #89643 carries an example value.
- **Hide "Change address"** + its help button on delivered and cancelled orders. "Download receipt" and "Raise a claim" stay visible at every stage.

## [0.1.0] — 2026-05-01 — phase 1 baseline

### Added

- React + Vite + Tailwind 3 + lucide-react scaffold inside `order-redesign/`.
- Mock orders + canonical status model in `src/lib/statuses.js`, `src/data/orders.js`.
- Account-home + order-list components: `PromoBar`, `Header`, `SearchBar`, `FiltersRow`, `StoreCreditsCard`, `OrderFilters`, `OrderCard` (inline-expandable), `StatusTimeline`, `OrderSummary`, `ChatFab`.
- Local copies of Revibe logo + sample product image in `public/`.
- Inter loaded via Google Fonts as a Graphik substitute.
- `brief/design-system.md` updated with values inferred from the source screenshots.

### Removed

- Duplicate top-level `package.json`, `node_modules`, Tailwind/PostCSS configs that lived above `order-redesign/`.
- Vite/React starter assets and demo CSS.
