# Finekarts Incorporated Platform

Production-oriented corporate website and modular commodity-trading management platform for **Finekarts Incorporated** — global agricultural commodity trading.

Public site generates qualified buyer/supplier leads and RFQs. Pricing is negotiated (no public fixed prices, no retail checkout). The secure platform manages organizations, transactions, documents, messages, approvals, and audit history.

## Architecture

| Area | Routes | Audience |
|------|--------|----------|
| Marketing | `/`, `/about`, `/products`, `/trade`, `/booking`, `/insights`, `/contact` + support pages | Public |
| Auth | `/login`, `/register/buyer`, `/invite/[token]`, verify routes | Buyers / invitees |
| Buyer portal | `/portal/buyer/*` | Buyer organizations |
| Supplier portal | `/portal/supplier/*` | Invite-only suppliers |
| Banking | `/portal/banking/*` | Scoped banking advisors |
| Workspace | `/workspace/*` | Employees / managers |
| Admin / CMS | `/admin/*` | Platform administration |

Domain logic lives under `src/lib/*` (auth, authorization, storage, AI, finance, workflows, tracking). UI stays in `src/components/*` and `src/app/*`. Mongoose models are in `src/models/*`.

## Prerequisites

- Node.js 20+
- MongoDB 7+ (required for full persistence, seed, and portal data)
- npm 10+

Without MongoDB, the public catalog and forms still run using the in-code seed catalog and `.data/` lead store.

## Setup

```bash
cp .env.example .env.local
# edit secrets and MONGODB_URI
npm install
npm run dev
```

### Seed

```bash
npm run seed
```

Creates CMS content, packaging, workflows, draft buyer terms, example HST tax config (editable, not legal advice), integration placeholders, and optionally the initial admin when `INITIAL_ADMIN_*` is set.

### Create administrator

```bash
# ensure INITIAL_ADMIN_EMAIL / INITIAL_ADMIN_PASSWORD / INITIAL_ADMIN_NAME in .env.local
npm run create-admin
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript `--noEmit` |
| `npm test` | Vitest unit tests |
| `npm run seed` | Idempotent Mongo seed |
| `npm run create-admin` | Secure first admin |

## Demo logins (after `npm run seed`)

| Role | Email | Password |
|------|-------|----------|
| Admin | value of `INITIAL_ADMIN_EMAIL` | value of `INITIAL_ADMIN_PASSWORD` |
| Demo buyer | `buyer@demo.finekarts.com` | `DemoBuyer123!` |

Buyer registration (`/register/buyer`) creates a Mongo user + buyer org when `MONGODB_URI` is set. Public RFQs/contact/booking/trade offers dual-write to Mongo and `.data/leads.json`. Use the same email as the buyer account on RFQs so requests appear under `/portal/buyer/requests`.

## Brand assets

Client letterhead logo is in `public/brand/finekarts-logo.png`. See `public/brand/BRAND_ASSETS.md`.

## Environment

See `.env.example` for:

- MongoDB, `APP_URL`, session secrets
- Initial admin values
- Email / SMS OTP providers
- Private object storage
- Malware scan adapter
- Gemini (server-side only)
- CRM, newsletter, shipment tracking
- Feature flags

Missing integrations must show **unconfigured** states — never fake success.

## Gemini / AI assistant

- Controlled by `GEMINI_ENABLED` + `GEMINI_API_KEY` and admin kill switch
- Server-side only; public assistant falls back to deterministic approved-content answers
- Never binding quotes, legal opinions, or private portal data

## Organization isolation

- Every query/file access enforces membership and permissions server-side
- Buyers see only their organization
- Suppliers see only assigned supplier-side transactions
- Banking advisors see only explicitly shared packages
- Browser-supplied organization IDs are never trusted alone

## Roles (summary)

CEO/Super Admin, General Manager, Trade Manager, Employee/Operations, Finance, Compliance/Reviewer, Buyer Org Admin/Member, Supplier Org Admin/Member, Banking Advisor, Read-only Auditor — with granular permissions in `src/lib/authorization/permissions.ts`.

## Storage

Private documents use the storage provider abstraction (`local` writes under `.data/private`, outside the public web root). Signed/short-lived access after authorization. Public marketing images may use `next/image` optimization; private trade docs must not.

## Deployment notes

- Set strong `SESSION_SECRET` / `AUTH_SECRET` (32+ chars)
- Configure MongoDB, object storage, email domain, and HTTPS
- Run seed once per environment
- Configure background jobs/webhooks for email, malware scan, CRM sync, and shipment providers when available
- Back up MongoDB and private object storage; define retention/legal hold with counsel

## Production-readiness checklist

- [ ] Legal review of all terms, privacy, buyer/supplier terms, AI disclosures
- [ ] Banking/trade counsel review of LC/SCO/ICPO/PSA templates
- [ ] Accounting review of tax configuration (HST example is not authoritative)
- [ ] Privacy review (PIPEDA/GDPR applicability, retention, DPIA as needed)
- [ ] Security review (MFA for staff, malware scanning, CSP, dependency audit)
- [ ] Replace temporary brand mark with final logo
- [ ] Confirm ownership/licensing of product imagery
- [ ] Provider credentials tested in staging
- [ ] Cross-tenant isolation tests passing in CI

## Known limitations

- A web app cannot guarantee prevention of screenshots or all copying of documents
- AI drafts are never final legal/bank-approved documents
- Tax and finance figures are estimates until accountant-approved rules/providers exist
- Shipment tracking does not fabricate live vessel positions when no provider is configured
- Formal PCI/SOC2/ISO/sanctions/AML claims are **not** made by this software alone

## Demo flow (non-sensitive)

1. Browse `/products` and open Canola oil
2. Submit RFQ on `/trade` (terms acceptance required)
3. Register buyer at `/register/buyer`
4. Sign in and explore `/portal/buyer` (CIS, transactions stepper)
5. Staff explore `/workspace` and `/admin` after admin seed
