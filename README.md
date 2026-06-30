# Snappy × Capital One Rewards — Integration Prototype

A clickable React prototype showing how **Snappy** plugs into **Capital One's**
points-redemption flow. Demo for a partner conversation — **not production**.
All data is mocked; there is no backend, no real API/auth, and no real fulfillment.

> Snappy wears Capital One's chrome. The interface stays clean and utilitarian;
> the warmth comes from the gifts themselves. Every value is shown both ways —
> `$100 · 10,000 miles` — at the illustrative demo rate of **1 mile = $0.01**.

## The three flows

| # | Flow | Direction | Entry point |
|---|------|-----------|-------------|
| 1 | **Send a gift collection** — spend miles to send a gift someone else chooses | Outbound (spend) | New row in the Redeem list |
| 2 | **Shop a gift for yourself** — spend miles on a gift for yourself | Outbound (spend) | New row in the Redeem list |
| 3 | **Reward for signing up** — claim a Capital One–funded gift | Inbound (funded) | Card in the Offers tab |

Flows 1 & 2 deduct miles. Flow 3 spends **nothing** — it's funded by Capital One
and carries a "Funded by Capital One" badge with no miles deduction anywhere.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL. The app renders inside a ~390px phone frame.

- **Home** has a demo flow-picker to jump straight into any of the three flows.
- The natural path is **Rewards → Redeem → Select account → Redeem list**, where
  the two Snappy gifting rows sit alongside Capital One's existing options.
- **Offers** holds the funded welcome-gift card (Flow 3).

```bash
npm run build    # production build to dist/
npm run preview  # preview the build
```

## How it's built

- **Stack:** React + Vite. No router — a simple screen-state machine in `src/App.jsx`.
- **Theme-agnostic embed:** components read semantic CSS tokens (`--color-surface`,
  `--color-accent`, …) defined in `src/styles.css`. The current values are the
  Capital One theme; the same components could re-skin for another partner.
- **Reusable components** (`src/components/`): `PhoneFrame`, `StatusBar`, `TabBar`,
  `ListRow`, `GiftCard`, `BottomSheet`, `MilesBadge`, `ConfirmationScreen`, `Headers`.
- **Flows** (`src/flows/`): `SendGift`, `ShopForSelf`, `FundedReward`.
- **Mock data** (`src/data/mock.js`): fictional cardholder ("Alex Rivera"),
  46,763-mile balance, gift collections, catalog, and one funded offer. No real
  names, card numbers, or data from the source screenshots.
- **Product photography** (`public/products/`): real photos from
  [Unsplash](https://unsplash.com) (free to use under the Unsplash License),
  bundled locally so the demo works fully offline. Each gift card falls back to
  an emoji + gradient if an image is ever missing.

## Out of scope

Real Capital One API/auth, real Snappy fulfillment, the full recipient
browse-and-choose experience (a static preview communicates it), a real
miles ledger, accessibility audit, and localization.
