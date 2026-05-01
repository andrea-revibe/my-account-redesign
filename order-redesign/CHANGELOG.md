# Changelog

Internal demo project. Format roughly follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased] — phase 2

### Added

- **Two-tier status model.** Top-level `STATUSES` (`created → quality_check → shipped → delivered`) is unchanged; new `SHIPPING_SUB_STATUSES` (`arrived_destination → cleared_customs → forwarded_to_agent → out_for_delivery`) apply only while `statusId === 'shipped'`. All four sub-statuses render in order today — international/domestic branching is parked.
- **`ShippingSubTimeline`** — vertical sub-timeline rendered inside `OrderCard` only while `statusId === 'shipped'`. Pattern adapted from Noon's tracking screen; colours kept in Revibe palette.
- **`CourierBanner`** — visible while `statusId` is `shipped` or `delivered`. Carrier headline, explanatory sentence about contacting the courier, primary "Track order" CTA. Uses a filled brand-purple button — first filled CTA in the app, deliberately so the action stands out.
- Mock orders now cover every top-level stage plus a cancelled order: `created`, `quality_check`, `shipped` (with sub-status `out_for_delivery` and an `estimatedDelivery` ETA), `delivered`, and a cancelled-at-QC order.
- New helpers in `src/lib/statuses.js`: `isCollapsedByDefault`, `statusHeadline`, `statusSubline`, `statusIconFor`, `subProgressIndex`. The collapsed-card header is driven by these so new statuses stay in sync.
- **`estimatedDelivery`** field on the order shape (optional — DHL doesn't always provide it). When present on a shipped order the collapsed-card subline reads "Delivery by [date]"; absent, it falls back to "Updated [timestamp]".
- `docs/my-account-flow.md` — living documentation of the orders flow for product + engineering audiences (Mermaid diagrams, data model, extension points, mocked-vs-production gap).

### Changed

- **Collapsed card rebuilt** in Noon-summary style: status icon + headline + state chip + chevron, divider, product image with name/variant/total, divider, order ID. The chip is now visible at-a-glance, so cancelled orders read as cancelled even when collapsed.
- **`StatusTimeline` filled with brand colour** for reached stages (circles + 2px connectors). The current step's label is bold so it stands out without changing the dot treatment.
- **Auto-collapse** delivered + cancelled orders by default, wired through `isCollapsedByDefault` in `App.jsx`.
- **Expanded body deduped** — dropped the inline `ProductBlock` and the "Date & Time" + "Total Amount" detail rows since the new header carries them.
- **`OrderSummary`** no longer renders the courier as a hyperlink (the `CourierBanner` owns that); replaced with a static "Carrier" row that hides when the order has no carrier yet.
- **"Change address"** hidden on delivered and cancelled orders. "Download receipt" and "Raise a claim" stay visible at every stage.
- Courier across all mock orders switched from Quiqup to **DHL**.
- README rewritten — replaced the Vite starter boilerplate with a project-specific overview.

### Known trade-offs

- `OrderCard` is tall when fully expanded for shipped orders (header + banner + horizontal timeline + vertical sub-timeline + summary). Acceptable for phase 2; flag for review if real users complain.
- All shipping sub-statuses always render, even on shipments that wouldn't realistically clear customs. Intentional for the demo; see `docs/my-account-flow.md` § 8.

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
