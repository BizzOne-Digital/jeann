# Finekarts — Client testing guide

## Public website

1. Open the homepage — hero should be **light**, nav links **visible** at top.
2. Browse **Products**, **Resources**, **Packaging**, **Shipping**, **Inspections**, **Insights**, **About**, **FAQ**, **Contact**.
3. `/trade` should redirect to **Resources**.
4. There are **no public RFQ / contact / booking forms** — only buyer sign-in CTAs.
5. Footer links to **Buyer portal** sign-in / register (no public newsletter form).

## Buyer portal (after sign-in)

Register at `/register/buyer` or use demo: `buyer@demo.finekarts.com` / `DemoBuyer123!`

| Action | Path |
|--------|------|
| New RFQ (multi-line + packaging) | `/portal/buyer/new-request` |
| Contact trade desk | `/portal/buyer/contact` |
| Book consultation | `/portal/buyer/booking` |
| View submitted RFQs | `/portal/buyer/requests` |

Forms should **prefill** your name, email, phone, and company from your account.

## Admin

Sign in with `INITIAL_ADMIN_EMAIL` from `.env.local`.

| Area | Path |
|------|------|
| Purchase requests / leads | `/admin/purchase-requests`, `/admin/leads` |
| Packaging catalogue | `/admin/packaging` |
| Supplier orgs (list) | `/admin/suppliers` |

## Employee workspace

| Area | Path |
|------|------|
| Supplier organizations | `/workspace/suppliers` |

## API behaviour (production)

- `POST /api/leads/purchase-request` — **401** without buyer session
- `POST /api/leads/contact` — **401** without buyer session
- `POST /api/leads/booking` — **401** without buyer session
- `POST /api/leads/trade-offer` — **403** (supplier invite-only)
- `POST /api/leads/newsletter` — **403** (use buyer portal)

Successful submissions return `{ ok: true, id: "..." }` and appear in Mongo + admin lists when `MONGODB_URI` is set.

## Before go-live

1. Set `MONGODB_URI`, `SESSION_SECRET`, `APP_URL` on Vercel.
2. Run `npm run seed` once against production MongoDB.
3. Upload `public/videos/shipping.mp4` (optional hero video).
4. Deploy and test one full RFQ flow end-to-end.
