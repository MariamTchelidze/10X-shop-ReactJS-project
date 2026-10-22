# 10X Shop Project Plan

## Goal and scope

Deliver the complete CORE requirements for a responsive single-page shop. FULL and BONUS features are deferred until CORE is complete.

## Three-week milestones

| Week | Dates | CORE milestones |
| --- | --- | --- |
| 1 | Oct 17–23, 2026 | Configure Vite, React 19, strict TypeScript, Tailwind CSS v4, and routing; define core types; build shared layout, login, and catalog. |
| 2 | Oct 24–30, 2026 | Build product details and shared cart state; implement cart quantity, removal, and totals; build controlled checkout and local order confirmation. |
| 3 | Oct 31–Nov 6, 2026 | Finish responsive and interaction states; verify the CORE user flow, loading/error/empty states, and debugging requirements; complete typecheck/build, README and REPORT; deploy and check direct route refresh. |

## CORE definition of done

- Routes work for `/`, `/login`, `/products/:id`, `/cart`, `/checkout`, and `*`, with a shared layout and protected checkout redirect.
- Catalog and product details load typed DummyJSON data; loading, error, and empty states are understandable.
- Login and checkout use controlled forms with basic validation. Login is a local React Context simulation; checkout is a local confirmation, with no real authentication or payment.
- Products can be added to the shared cart; quantity, removal, badge, and totals stay in sync.
- CORE pages work at 375px without horizontal scrolling; Tailwind utilities, responsive layout, and interaction states are used.
- Strict TypeScript reports zero errors, `npm run build` succeeds, and the app is deployed with SPA route refresh working.
- README, this plan, REPORT, meaningful Git history, and the required CORE debugging documentation are present by hand-in.

## Deferred scope

Search, category and sort filters, pagination, URL-synced catalog state, reviews, related products, promo codes, Orders, Profile, themes, advanced optimization, and other FULL/BONUS work start only after CORE is complete.
