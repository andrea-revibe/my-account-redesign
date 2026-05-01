# Design System Reference

> Updated during phase-1 prototype build. Values that were missing or
> looked incorrect in the source dump are flagged with `// noted:`.

## Fonts

- Body font: Graphik (prototype substitute: **Inter**)
- Heading font: Graphik (prototype substitute: **Inter**)
- Button font: Graphik (prototype substitute: **Inter**)

## Font sizes (in pixels)

- Body text: 14px
- Small/secondary text: 12px
- Page heading: 20px
- Section heading: 14px
- Button label: 14px

## Colors (hex / rgb)

- Page background: `#FFFFFF` // noted: source said rgb(33,43,54) but the
  screenshots clearly show a near-white page; the dark slate is the
  primary text colour.
- Card / container background: `#FFFFFF`
- Primary text: `rgb(33, 43, 54)`
- Secondary text: `rgb(167, 169, 171)`
- Brand primary (CTA background): `transparent` (the main CTA in the app
  is an outlined button, not filled)
- Brand primary text: `rgb(80, 25, 160)`
- Success / delivered green: `rgb(0, 182, 122)`
- In-progress / shipped: `rgb(255, 153, 31)` // noted: not present in the
  source dump; chosen to match the orange chip on the "Close" pill so the
  shipped step reads as in-progress.
- Border / divider: `rgb(192, 192, 192)`
- Link colour: `rgb(26, 13, 171)`
- Promo bar / chat FAB accent: `rgb(217, 26, 122)` (magenta)
- Search field background: `rgb(244, 240, 250)` (light lilac)
- "Close" chip background / text: `rgb(255, 213, 153)` / `rgb(180, 95, 6)`
- "Cancelled" text: `rgb(220, 38, 38)`

## Spacing & shape

- Card border-radius: 16px
- Button border-radius: 8px
- Common padding inside cards: 16px
- Common gap between sections: 8px
- Card box-shadow: none in app; using a 1px `rgb(192,192,192)` border at
  ~60% opacity to define edges. // noted

## Buttons

- Height: 36px (primary CTA), 40px (full-width brand actions)
- Horizontal padding: 12px
- Font weight: 700
- Hover/pressed: not specified in source — prototype uses Tailwind defaults.
- Secondary button: outlined, `rgb(192,192,192)` border, muted text. // noted

## Icons

- Source: lucide-react in the prototype (visually close to the source app's
  outlined icon set). Logo and product image kept as local copies in `public/`.
- Common icon size: 18–22px
- Stroke width: 1.75–2

## Existing order states (faithful recreation reference)

Top-level progression statuses (horizontal timeline, always 4 steps):

- Order created
- At quality check
- Shipped
- Delivered

Shipping sub-statuses (vertical sub-timeline, only while top status is
`shipped`):

- Arrived in destination country
- Cleared customs
- Forwarded to third-party agent
- Out for delivery

Note: there is intentionally no "delivered" sub-status — when the package
is delivered, the order transitions to the top-level Delivered stage.

Header / summary states (chips and labels):

- Open (no chip)
- Close — orange chip on the order header
- Cancelled — red text in the order summary; auto-collapses the card

Phase-2+ candidates noted but not yet wired: Returned, Refunded, Out for
delivery time-window pickers.

## Notes / oddities

- The order card uses inline expand/collapse rather than a navigation
  push — the chevron on the header toggles the body, and there's a second
  chevron mid-card that acts as a quick-collapse handle. The prototype
  preserves both.
- The status timeline in the source app shows all four steps with the
  same gray treatment even after the order is marked Cancelled. The
  prototype gives "current" a brand-purple fill and "reached" a darker
  gray fill to make phase-2 status work easier to read.
- The chat FAB is anchored to the mobile frame (not the viewport), so on
  desktop preview it sits inside the 430px-wide column.
