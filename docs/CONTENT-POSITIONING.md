# Finekarts marketing copy — mandatory positioning

Read this before writing or editing any public-facing text.

## Who Finekarts is

**Finekarts Incorporated is a bulk agricultural commodity distributor and trader.** We **sell** edible oils, sugar, rice, beans, and related cargoes to qualified international buyers.

We are **not**:

- An inspection company  
- A verification or credit agency  
- A freight forwarder, carrier, or logistics operator  
- An insurance company  
- A shipment-tracking SaaS vendor  

## How to describe inspection, verification, logistics, insurance, tracking

| Say | Avoid |
|-----|--------|
| We **use** / **coordinate** / **appoint** independent firms and carriers **where the PSA requires** | We **provide** inspection, verification, logistics, insurance, or tracking **services** |
| Tools to **safeguard** Finekarts and buyer interests on trades we sell | Finekarts **Verification Services**, **Global Shipping & Logistics** as if we are the vendor |
| Independent SGS / Intertek / carriers / insurers perform the work | “Our inspection team”, “our logistics division” |

Canonical strings live in `src/lib/content/trader-positioning.ts`. Reuse `TraderRoleNotice` on trade-education pages.

## Where copy lives (admin cannot edit everything)

| Source | What it controls |
|--------|------------------|
| `src/lib/content/*.ts`, `marketing-pages.ts` | Hubs, product pages, legal-adjacent marketing bodies |
| `src/lib/content/page-registry.ts` + `page-registry-bodies.ts` | CMS defaults for heroes and long sections |
| MongoDB `Page` documents | Overrides registry when fields are **non-empty** |
| `npm run refresh:marketing-pages` | Pushes registry defaults into Mongo after messaging updates |

If the live site disagrees with the repo, run refresh on the environment that serves production, or clear stale CMS fields in Admin → Pages.

## Photos

Transport/packaging images must match the mode described (bulk truck, railcar, vessel, etc.). Paths: `src/lib/content/packaging-images.ts`, `logistics-images.ts`.

## When unsure

Ask the client: *“Should this read as something Finekarts sells, or something we coordinate on a commodity sale?”* Default to **coordinate on a sale**.
