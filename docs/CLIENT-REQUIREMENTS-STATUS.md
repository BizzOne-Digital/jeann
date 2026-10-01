# Jean Joseph requirements — developer status (Finekarts.com)

## Positioning & content (A)

| Item | Status |
|------|--------|
| Trader / due-diligence wording | Done in code + `npm run refresh:marketing-pages`. Jean to confirm or mark up live site. |
| Photo corrections | Packaging truck/rail updated. Further swaps: file + section name from Jean. |
| Team headshots | `/team` — upload via Admin when team module supports photos, or replace `public/images/team/*.jpg`. |
| Partner pages (SGS, etc.) | Copy still in `src/lib/content/partners-catalog.ts` — **not** in Admin → Pages. Needs CMS or admin UI (future). |

## Downloads vs CIS (B)

| Item | Status |
|------|--------|
| Commodity checklist on Resources | **Educational / dummy reference** — copy updated to say so. |
| Official CIS PDF | Hosted: `/Buyer_CIS-Corporate_Information_Sheet_CIS.pdf` — Resources + buyer CIS + buyer Documents. |
| Same form all buyers? | **Pending Jean confirmation** (one global vs regional). |
| ICPO pre-filled editable PDF in buyer portal | **Partial** — transaction `Documents` + `generateDocumentPdf` exists; buyer-facing editable ICPO wizard is next phase. LOI upload live; ICPO via transaction when desk creates deal. |

## Shipment tracking (C) — production Finekarts.com

Set on server (not in git):

```env
APP_URL=https://finekarts.com
SHIPMENT_TRACKING_PROVIDER=multi
TERMINAL49_API_KEY=...
TERMINAL49_WEBHOOK_SECRET=...
# Webhook URL: https://finekarts.com/api/webhooks/terminal49
EASYPOST_API_KEY=...
EASYPOST_WEBHOOK_SECRET=...
# Webhook URL: https://finekarts.com/api/webhooks/easypost
```

## Internal KYB / TIC (D)

Integrated at `/api/internal/verification` — **staff only**. Set `KYB_*` and `TIC_*` in production env. Not shown on buyer/supplier portals.

## Operations (E)

| # | Item | Action |
|---|------|--------|
| 11 | Messenger duplicates | Branding/Meta — not code. |
| 12 | Production URL | **finekarts.com** — set `APP_URL` and webhooks accordingly. |
| 13 | Admin edit all content | **Admin → Website Pages** — all registry slugs; long pages use **Jump to section** + expand `<details>`. **Also:** Admin → Products, Packaging, Payment Terms, Team, Testimonials. **Not in Pages editor:** partners list, some hub defaults in TS until mirrored as CMS sections. **Photos:** hero `heroImage` upload per page; packaging images in `public/images/packaging/` or Admin → Packaging. |

## UI fixes

| Issue | Fix |
|-------|-----|
| Resources text blurry | Removed blur from scroll-in animation (`globals.css`). |
| Large empty areas on logistics | Paired photo + text rows (done). Scan other pages as Jean reports URLs. |

## Developer must read

`docs/CONTENT-POSITIONING.md` — Finekarts is a **commodity distributor**, not a provider of inspection, verification, logistics, or insurance services.
