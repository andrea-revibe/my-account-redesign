# My Account — Orders Flow

> **Living document.** Update this when the order shape, status model,
> auto-collapse rules, or component structure changes. See
> [`CHANGELOG.md`](../CHANGELOG.md) for the change history.

This document describes how the orders area of the My Account page works in the
prototype. It is written for both product and engineering. Shared context is up
front; deeper architecture sits in the later sections — skim or skip as needed.

---

## 1. Overview

The orders area lives inside the customer's My Account page. It shows every
order the customer has placed, communicates the current shipment status at a
glance, and lets the customer drill into a single order for full details and
post-purchase actions (download receipt, raise a claim, change address while
the order is still actionable, track the parcel via the courier).

This prototype is intentionally narrow: only the orders list and the
expand/collapse interactions are functional. Everything around it (search,
filters, store credits, profile menu, language toggle) is decorative — present
for visual fidelity but not wired up.

**In scope**

- Order list with five demo orders, one per top-level state plus a cancelled order.
- Per-order collapsed summary card.
- Per-order expanded view with full timeline, courier banner, sub-timeline, and order summary.
- Auto-collapse rules for terminal states.

**Out of scope (faked or stubbed)**

- Authentication, real backend, real customer data.
- Search and filter logic in the orders area.
- The store-credits card (purely visual).
- Right-to-left and Arabic localisation.
- Address-change flow, receipt-download flow, claims flow.
- Real courier tracking — the "Track order" button links to DHL's generic tracking page.

---

## 2. User flow

### 2.1 What the customer sees

A vertical list of orders, newest first. Each order is rendered as a card. The
card always shows a compact summary header so the customer can scan the list
and understand the state of each order without expanding anything.

When a card is **collapsed**, the customer sees:

- A status icon + headline (e.g. "Out for delivery", "At quality check", "Delivered", "Cancelled").
- A subline with the most relevant timestamp (forward-looking ETA when DHL provides one, otherwise the most recent status timestamp).
- A state chip on the right when the order has a special state (Close, Cancelled).
- The product image, name, and variant.
- The amount paid.
- The order ID.

When a card is **expanded**, everything above remains visible at the top, and
below it the customer sees:

- Phone, address, and quantity.
- "Change address" (only while the order can still be redirected — see §2.3).
- "Download receipt" and "Raise a claim" (always available).
- The courier banner (only while the order is shipped or delivered).
- The four-step horizontal status timeline.
- The vertical shipping sub-timeline (only while the order is shipped).
- The order summary table.

### 2.2 Auto-collapse rules

```mermaid
flowchart TD
    Land[Customer lands on My Account] --> Render[Render order list]
    Render --> Decide{Is order delivered<br/>or cancelled?}
    Decide -->|Yes| C[Render collapsed]
    Decide -->|No| E[Render expanded]
    C --> Tap[Customer can tap header to expand]
    E --> TapClose[Customer can tap header to collapse]
```

Terminal-state orders (delivered or cancelled) do not need attention by
default, so they start collapsed to keep the list scannable. In-progress
orders (created, quality check, shipped) start expanded so the customer
sees what's happening without an extra tap.

### 2.3 Top-level state machine

```mermaid
stateDiagram-v2
    [*] --> created
    created --> quality_check
    quality_check --> shipped
    shipped --> delivered
    created --> cancelled
    quality_check --> cancelled
    shipped --> cancelled
    delivered --> [*]
    cancelled --> [*]
```

`cancelled` is modelled as a separate **state** on the order, not a top-level
status — see §4.2. This is so a cancelled order can carry the status it was in
when cancellation happened, which informs the timeline rendering.

### 2.4 Shipping sub-state machine

While the top-level status is `shipped`, the order also carries a
**sub-status** describing where the parcel is in DHL's pipeline:

```mermaid
stateDiagram-v2
    [*] --> arrived_destination: enters shipped
    arrived_destination --> cleared_customs
    cleared_customs --> forwarded_to_agent
    forwarded_to_agent --> out_for_delivery
    out_for_delivery --> [*]: top-level transitions to delivered
```

There is intentionally no `delivered` sub-status. When the parcel is delivered,
the order's top-level status moves to `delivered` and the sub-status is no
longer relevant. This avoids having "delivered" in two places at once.

### 2.5 Per-state behaviour cheat sheet

| Top-level state | Collapsed by default | Headline copy | Courier banner | Sub-timeline | Change address shown |
|---|---|---|---|---|---|
| created | No | "Order placed" | No | No | Yes |
| quality_check | No | "At quality check" | No | No | Yes |
| shipped | No | sub-status label (e.g. "Out for delivery") | Yes | Yes | Yes |
| delivered | Yes | "Delivered" | Yes (with completed copy) | No | No |
| cancelled (any prior status) | Yes | "Cancelled" | No | No | No |

---

## 3. UX decisions and rationale

These decisions came out of phase-2 review and are worth preserving so future
contributors understand why the prototype looks the way it does.

**Two-tier status model.** We considered flattening the four shipping
sub-statuses into the top-level timeline, which would have produced a
nine-step horizontal timeline. On a 430px-wide mobile column this is
unreadable. Instead the top timeline always shows the four high-level stages
(created → quality check → shipped → delivered), and the shipping sub-statuses
are exposed as a vertical sub-timeline that only appears when relevant.

**Courier banner elevated out of the order summary.** Previously the courier
name was a small hyperlink buried inside the summary table. It is now a
dedicated banner with explanatory copy ("Have a question about your delivery?
Contact the courier directly...") and a primary "Track order" CTA. The CTA is
the only filled brand-purple button in the app — a deliberate departure from
the otherwise-outlined button language, because we wanted the action to read
as a primary call-to-action.

**Auto-collapse on terminal states.** Delivered and cancelled orders rarely
need attention. Keeping them collapsed shortens the list visually and pushes
in-progress orders to the customer's attention.

**"Change address" hidden on delivered and cancelled orders.** It cannot be
acted on, so it would only confuse. ("Hide on shipped" is parked — see §8.)

**No fake "On time" chips.** The Noon-style green "On time" pill is
attractive but it implies an SLA. We do not have an SLA model; presenting
"On time" without one would set incorrect expectations. We will revisit this
once an SLA contract exists.

**Filled brand-purple horizontal timeline for reached stages.** Reached
stages and the connectors between them are filled with brand purple, not
gray. The current step's label is bold so it remains identifiable without
changing the dot treatment. Future stages stay outlined and gray.

**Forward-looking subline when ETA is available.** DHL provides an estimated
delivery date sometimes, not always. When present, the collapsed-card subline
reads "Delivery by [date]" — a customer-facing, future-tense answer to "when
is it coming." When absent it falls back to "Updated [timestamp]".

**Whole header is the tap target.** The chevron is decorative — tapping
anywhere on the collapsed-card header expands the card. Larger tap targets
are friendlier on mobile, and there is currently no rival action competing
for the same area.

---

## 4. Data model

The orders array (`src/data/orders.js`) is mock data today. Production will
swap it for an API response of the same shape.

### 4.1 Top-level fields

Each order object carries:

- **`id`** — the human-readable order number shown in the header (string).
- **`phone`** — the customer's phone number on the order (string).
- **`address`** — the delivery address on the order (string, free text).
- **`placedAt`** — the order timestamp shown on the summary screen (string, formatted).
- **`quantity`** — number of items in the order (integer).
- **`total`** — total amount paid (number, no currency symbol).
- **`currency`** — three-letter currency code (string, e.g. "AED").
- **`customerName`** — the recipient's full name (string).

### 4.2 Status fields

Two parallel fields describe where the order is.

- **`statusId`** drives the four-step progression timeline. Valid values: `created`, `quality_check`, `shipped`, `delivered`.
- **`subStatusId`** is only meaningful while `statusId` is `shipped`. Valid values: `arrived_destination`, `cleared_customs`, `forwarded_to_agent`, `out_for_delivery`. May be omitted on a shipped order if DHL has not yet returned a sub-status.
- **`state`** is a parallel "header state" used for chips and the auto-collapse rule. Valid values: `open` (default), `close`, `cancelled`. State is independent of progression — for example, a cancelled order keeps the `statusId` it had at cancellation.

### 4.3 Tracking and courier fields (only present once shipped)

- **`courier`** — name of the carrier shown in the banner (string). Today this is always `"DHL"`; the field exists so we can support multiple carriers later.
- **`trackingNumber`** — courier-issued tracking number, shown in the order summary (string).
- **`trackingUrl`** — deep link to the courier's tracking page, used by the banner CTA (string).
- **`estimatedDelivery`** — DHL's forward-looking ETA, used as the collapsed-card subline when present (string, free-text date). **Optional** — DHL doesn't always communicate this. Code paths must handle absence gracefully.

### 4.4 Timeline fields

Two related objects record when each milestone happened.

- **`timeline`** is keyed by top-level status id. It carries the timestamp at which the order entered each top-level stage. Keys are populated as the order progresses, not all at once. A `created` order will have only `timeline.created`; a delivered order will have all four.
- **`subTimeline`** is keyed by sub-status id. It carries the timestamp at which the parcel entered each sub-stage during the shipped phase. Only present on shipped (and later delivered) orders, and only as DHL emits each sub-status.

### 4.5 Product fields

Today an order has one product. The `product` object carries:

- **`name`** — display name (string).
- **`variant`** — variant string (e.g. "Black / 32 GB / Good").
- **`image`** — path to the product image asset.

Multi-item orders are out of scope for the prototype.

---

## 5. Component architecture

### 5.1 File layout

```
src/
├── App.jsx                       Page composition + auto-collapse wiring
├── main.jsx                      Vite entry point
├── index.css                     Tailwind directives + base styles
├── data/
│   └── orders.js                 Mock orders array
├── lib/
│   └── statuses.js               Top-level + sub-status definitions, helpers
└── components/
    ├── PromoBar.jsx              Magenta promo strip at the top
    ├── Header.jsx                Logo, language, profile, wishlist, bag
    ├── SearchBar.jsx             Site-wide search field (decorative)
    ├── FiltersRow.jsx            Filters icon + profile chip
    ├── StoreCreditsCard.jsx      Wallet balance card (decorative)
    ├── OrderFilters.jsx          Date / status / search filters (decorative)
    ├── OrderCard.jsx             The expandable order card
    ├── StatusTimeline.jsx        Horizontal 4-step timeline
    ├── ShippingSubTimeline.jsx   Vertical sub-status timeline
    ├── CourierBanner.jsx         Tracking banner with carrier CTA
    ├── OrderSummary.jsx          Summary table inside the expanded card
    └── ChatFab.jsx               Floating chat-with-support button
```

### 5.2 Component tree

```mermaid
graph TD
    App --> PromoBar
    App --> Header
    App --> SearchBar
    App --> FiltersRow
    App --> StoreCreditsCard
    App --> OrderFilters
    App --> OrderCard
    App --> ChatFab
    OrderCard --> SummaryHeader[SummaryHeader<br/>status icon + headline + chip]
    OrderCard --> ProductRow
    OrderCard --> OrderIdRow
    OrderCard --> Body[Expanded body — when open]
    Body --> DetailRows[DetailRows<br/>phone, address, quantity]
    Body --> ChangeAddress[Change address<br/>conditional]
    Body --> Actions[Receipt + Claim buttons]
    Body --> CourierBanner[CourierBanner<br/>shipped or delivered only]
    Body --> StatusTimeline
    Body --> ShippingSubTimeline[ShippingSubTimeline<br/>shipped only]
    Body --> OrderSummary
```

`SummaryHeader`, `ProductRow`, and `OrderIdRow` are inner sub-components of
`OrderCard` (defined in the same file) — they are not separately exported.

### 5.3 Where API integration lands

When the backend is ready, the swap is small. `App.jsx` currently imports
the static `ORDERS` array from `src/data/orders.js`. Replace that import
with a fetch (or a hook) that returns an array of objects matching the shape
in §4. No component below `App` needs to change as long as the response shape
is preserved.

The auto-collapse decision is centralised in `isCollapsedByDefault(order)`
(`src/lib/statuses.js`), which `App.jsx` calls when mapping the order list.

---

## 6. Extension points

These are the common changes a future contributor will want to make. Each is
intentionally cheap to do.

**Add a new top-level status.** Add an entry to the `STATUSES` array in
`src/lib/statuses.js`. The horizontal `StatusTimeline` is data-driven and will
render the new step automatically. Update `statusHeadline` and
`statusIconFor` to give the new status a customer-facing label and icon.

**Add a new shipping sub-status.** Add an entry to `SHIPPING_SUB_STATUSES` in
the same file. Pick a Lucide icon and import it next to the existing ones.
The vertical `ShippingSubTimeline` will render the new row automatically.

**Add a new order state.** Extend `ORDER_STATES` with a key, label, chip
treatment, and summary text class. The chip will appear in the collapsed-card
header and the order summary will pick up the colour treatment.

**Add a new courier.** Set `order.courier` to the new name and provide
`trackingUrl`. The `CourierBanner` displays whatever name the order carries.
If the courier needs different copy, branch on `order.courier` inside
`CourierBanner.jsx`.

**Change the auto-collapse rule.** Edit `isCollapsedByDefault` in
`src/lib/statuses.js`. There is one source of truth for the rule — `App.jsx`
calls this helper.

---

## 7. Mocked vs production gap

What looks real in the prototype but is faked:

- **Order data.** Five hand-written orders in `src/data/orders.js`. Production needs a fetch endpoint returning the same shape.
- **Authentication.** No login, no session, no per-customer scoping.
- **DHL integration.** The "Track order" button always links to `https://www.dhl.com/track`. Production should use the order's specific tracking URL with carrier credentials handled server-side.
- **`estimatedDelivery` format.** Currently a freeform string (`"Wed, 29 Apr 2026"`). DHL's real shape may include time windows and structured data; we'll need to revisit when integrating.
- **Single carrier.** Code is generalised but mock data uses DHL only. Adding a second carrier requires no code change.
- **Single-item orders.** The product object is a single entry. Multi-item orders need a `products[]` array and a layout adjustment.
- **Change address, Download receipt, Raise a claim.** Buttons are present but do nothing. Each needs its own flow / page.
- **Search, filters, store-credits card.** Visual placeholders, no logic.
- **Inter font.** Production is Graphik; we substituted Inter via Google Fonts because Graphik is licensed.
- **Brand assets.** Local copies in `public/` rather than CDN-served.
- **No analytics or instrumentation.** No event tracking on expand/collapse, track-clicks, etc.

---

## 8. Open questions and future work

Items deliberately parked rather than built.

- **Hide "Change address" on shipped orders too.** Today it's only hidden when delivered or cancelled. Once a parcel is in DHL's hands, the address can't realistically be redirected.
- **Domestic vs international sub-status branching.** All shipped orders show all four sub-statuses (arrived in destination country → cleared customs → forwarded to third-party agent → out for delivery). For a domestic UAE shipment, "cleared customs" doesn't apply. Worth adding an `isInternational` flag and conditionally rendering.
- **Real DHL ETA shape.** Today `estimatedDelivery` is a freeform string. Real DHL responses may carry structured date + time windows + multiple datapoints; the helper `statusSubline` and the collapsed-card UI will need updating.
- **"On time" SLA chips.** Skipped because we have no SLA model. Worth revisiting once one exists.
- **Returned and refunded states.** Not modelled. Likely additions to `ORDER_STATES` plus their own banner copy.
- **Re-order CTA on delivered orders.** Common pattern; not currently present.
- **Forward-looking ETA inside `CourierBanner`.** Currently the banner copy is generic; the ETA shows in the collapsed-card subline only. Could surface in both places.
- **Address-change flow, claim flow, receipt download.** Each is a stubbed button today.
- **Multi-item orders.** Layout change needed to render multiple `ProductRow`s.
- **Order list grouping ("In progress" / "Completed" sections).** Considered, set aside in favour of a flat list. Worth revisiting if the list gets long enough that scanning becomes painful.

---

## 9. How to keep this doc current

This is a living document. When making one of the changes below, update the
named section here as part of the same commit:

- Adding/removing a status or sub-status → §2.3, §2.4, §4.2, §6.
- Changing the order shape → §4.
- Changing auto-collapse, banner visibility, or sub-timeline visibility rules → §2.5, §3.
- Adding or removing a component → §5.1, §5.2.
- Resolving an item from §8 → move it out of §8 and integrate the description into the relevant earlier section.

Reference [`CHANGELOG.md`](../CHANGELOG.md) for change history; this document
describes only the current state of the prototype.
