# Changelog

Internal demo project. Format roughly follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased] — phase 5 (post-handoff iteration)

### Added

- **Hero card secondary action row.** Beneath the primary `Track package` + `Help` CTAs, the hero now carries two ghost pill actions (transparent bg, soft white-70 text on the gradient): `Cancel order` flush-left, `Raise a claim` flush-right. Tapping `Cancel order` toggles a small dark tooltip — *"You cannot cancel the order at this stage"* — that dismisses on outside-click. Cancellation eligibility logic is prototype-only.
- **Past-delivered "Raise a claim" pill.** Delivered `PastOrderCard` now renders both `Download receipt` **and** `Raise a claim`, right-aligned with a small gap.

### Changed

- **In-progress timeline dedup.** For `created` and `quality_check` orders, the in-card dot timeline (`DotBar`) no longer renders above the product strip — the same progression was being shown twice. The four-step Full timeline now sits **above** Order details / Cancel / Get help inside the expanded view. Shipped orders are unchanged: in-card dot timeline + Full timeline at the bottom.

### Removed

- **"Raise a claim" on cancelled past orders.** Cancelled `PastOrderCard` no longer renders an action area at all (no border-top, no button row).

## [Unreleased] — phase 4 (My Account redesign handoff)

### Added

- **`HeroCard`** — full-bleed gradient (purple → magenta) hero pulled to the top of the orders list for the single most-in-flight order. Live "Active order · #id" eyebrow with a pulsing green dot, status headline, frosted product strip, light-on-dark dot timeline, and a primary "Track package" / ghost "Help" CTA pair.
- **Detailed-tracking expand inside `HeroCard`.** Visible only while `statusId === 'shipped'`. Renders a DHL courier strip (badge, courier name, tracking number, copy-to-clipboard) and the vertical sub-timeline restyled for the dark gradient.
- **`PastOrderCard`** — compact one-row card for delivered + cancelled orders, with a status pill, placement date, order id, total, and a single contextual action (`Download receipt` for delivered, `Raise a claim` for cancelled).
- **`GreetRow`** — "My orders" page title + count line + tight gradient credits pill, replacing the old full-width `StoreCreditsCard`.
- **Section labels** — `In progress` / `Other open orders` / `Past orders` headings with item counts, so delivered/cancelled history sits below the live list instead of mixed in.
- **Chip count badges** — each status chip in `OrderFilters` now carries a small numeric badge (computed from the date-range-filtered set).
- **"Delivery by [date]" eta block** in the collapsed `OrderCard` header for `created` and `quality_check` orders. Large headline + a muted sentence (colored "On track" / "Taking longer than expected" lead phrase + body), placed above the dot timeline.
- **Order details collapse** inside expanded `OrderCard` — `<details>` block with delivery address, phone number, and order date. While `statusId === 'created'`, the card also exposes subtle pill buttons for `Change address` and `Change phone number`.
- **`placedAtFull`** field on every mock order — long-form date used inside the Order details collapse.
- **`STATUSES[].short`** — short labels (`Placed / QC / Shipped / Delivered`) used by the compact dot timelines.

### Changed

- **Top chrome condensed.** The four-row stack (`PromoBar + Header + SearchBar + FiltersRow`) collapses into a single sticky `Header` (menu / logo / search / bell / avatar) plus the new `GreetRow` and a search-inline `OrderFilters` row.
- **`OrderCard` rebuilt.** Collapsed view: status badge + headline + chevron → eta block (in-progress only) → dot timeline → product strip with price. Expanded body: status banner → shipping sub-timeline (when shipped) → courier card → Order details collapse → Cancel/Receipt + Get help action row → full timeline.
- **Header action buttons.** Old "Download receipt / Raise a claim" pair replaced with state-aware actions: `Cancel order` (red ghost) for in-progress orders, `Receipt` for past orders, paired with a primary `Get help`.
- **"In progress" chip** renamed to **"Open"** to match the chip label set used in the design.
- **Page background** is now the warm off-white `canvas` token (`#f7f5fb`) so cards feel elevated without shadows.
- **Brand palette extended.** Added nested tokens: `brand-bg`, `brand-bg2`, `success-bg`, `warn`, `warn-bg`, `danger`, `danger-bg`, `line-2`, `ink-2`. Plus `bg-hero-gradient` / `bg-credits-pill` background-image utilities and `slideDown` / `heroPulse` keyframe animations.
- **Card radius** bumped from 16px to 18px; button radius from 8px to 10px to match the prototype.
- **Status headline copy.** `STATUSES.created` is now `Order placed` and `STATUSES.quality_check` is now `Quality check` (was `Order created` / `At quality check`), matching the design.

### Removed

- **`PromoBar`, `SearchBar`, `FiltersRow`, `StoreCreditsCard`, `StatusBanner`, `OrderSummary`, `CourierBanner`** components — superseded by the new `Header` / `GreetRow` / `OrderFilters` / `HeroCard` / `OrderCard` / `PastOrderCard` set. Their behaviors are folded into the new components.
- **`fontSize.page` token** (only ever used by `text-page` on the old "Orders" heading; no longer needed).

## [Unreleased] — phase 3

### Added

- **`StatusBanner`** — tinted box rendered inside the always-visible card header (above the product row). A colored leading phrase describes *condition* (`On track`, `Arriving today`, `All done`, `Refund in progress`, `Taking longer than expected`) and a sentence describes the current step. Four tones: brand / success / warn / danger.
- **`statusDescription(order)`** in `src/lib/statuses.js` — returns `{ tone, lead, body }` resolved in this order: cancelled state → delayed flag → status defaults. `order.statusMessage` overrides the body string in any branch.
- New optional order fields: `delayed: true` flips the banner to the warn tone with a delay-flavored body keyed by `statusId`; `statusMessage: '…'` overrides the banner body. The iPhone 11 quality-check order is marked `delayed: true` for the demo.
- **`pickActiveOrderId(orders)`** in `src/lib/statuses.js` — returns the id of the single most-in-flight order (highest `progressIndex × 10 + subProgressIndex`, in-flight only). Returns `null` when nothing is in flight.
- **Order filter chips** (`All / In progress / Delivered / Cancelled`) actually filter the rendered list. State is owned by `App.jsx`; `OrderFilters` is now controlled.
- **Date-range dropdown** with four presets (`Last 30 days / 3 months / 1 year / All time`), open/close, click-outside-to-close, active-option checkmark. Plumbed to `App.jsx` and applied via `placedAt` parsing — visibly inert today because all mock orders fall inside every range.
- **Empty state** in the order list when filters yield zero results.
- **"Need help with delivery?"** secondary CTA inside `CourierBanner`, soft-filled (`bg-brand/10 text-brand`), links to DHL customer service.
- **CLAUDE.md** at the repo root — collaboration guide for future sessions.

### Changed

- **Auto-expand replaces auto-collapse.** Everything collapses by default; `App.jsx` auto-expands only the single most-in-flight card via `pickActiveOrderId`. Old `isCollapsedByDefault` removed.
- **Delivered chip is green.** When `statusId === 'delivered'`, `OrderCard` overrides the data's `state: 'close'` chip and renders a green "Delivered" pill instead of the orange "Close" one.
- **`StoreCreditsCard` redesigned.** AED amount now renders with a purple→magenta gradient (`from-[rgb(115,65,186)] to-accent`, `bg-clip-text`). Voucher row collapsed to a single line: code + clipboard icon button. Info button removed. Section spacing tightened.
- **`OrderFilters` flattened.** Card wrapper dropped; search field + range dropdown side-by-side; status chip row underneath.
- **`CourierBanner` "Track order"** URL hardcoded to a known-good DHL Express test shipment (`tracking-id=3392654392`) so the demo always lands on a real tracking page.
- **"Raise a claim"** outlined-purple on delivered orders (matches "Download receipt"); muted gray on every other state.
- **"Orders" heading** now renders correctly. Removed the unused `colors.page` token from `tailwind.config.js` to fix a `text-page` color/font-size collision that had been making the heading white-on-white.

### Removed

- **"Change address" button + its help icon.** Customer-service contact for delivery now lives in the new "Need help with delivery?" CTA inside `CourierBanner`.
- **`isCollapsedByDefault`** in `src/lib/statuses.js` — superseded by `pickActiveOrderId`.

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
