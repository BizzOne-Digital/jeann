# Finekarts — Implementation Plan

Ordered phases aligned with product requirements. **MongoDB retained.** **Next.js monolith retained.** No silent omissions — deferred items marked explicitly.

## Current baseline (2026-08-27)

| Area | Maturity |
|------|----------|
| Public marketing + CMS | **~85%** — pages, admin editors, products, FAQs, team, testimonials |
| Buyer registration + admin approval | **~70%** — emails, payment terms admin |
| Buyer RFQ / edible oil order | **~60%** — structured form, Mongo persist |
| CIS draft | **~40%** |
| Supplier onboarding | **~15%** — models only |
| Transactions workflow | **~10%** — models + library tests |
| Documents / filter / signatures | **~5%** — models only |
| Banking module | **~5%** |
| Shipments / tracking | **~10%** |
| Finance / reports | **~10%** |
| Deal groups | **0%** |
| Granular API permissions | **~20%** — matrix defined, not enforced |
| Audit logging | **~5%** — model unused |
| Automated E2E tests | **~15%** — unit tests only |

---

## Phase 0 — Documentation & audit ✅ (this commit)

- [x] `docs/ARCHITECTURE.md`
- [x] `docs/DATA_MODEL.md`
- [x] `docs/WORKFLOW.md`
- [x] `docs/PERMISSIONS.md`
- [x] `docs/IMPLEMENTATION_PLAN.md`
- [x] `docs/TESTING_GUIDE.md`
- [ ] State machine spec document (optional: `docs/STATE_MACHINES.md` in Phase 3)

---

## Phase 1 — Public website, CMS, intake, SEO, chatbot

**Goal:** Production-ready public face + intake paths. **Mostly complete.**

### Done

- [x] Corporate pages (home, about, products, resources, packaging, shipping, inspections, FAQ, team, testimonials, contact, legal)
- [x] Product categories + product detail routes (CMS + seed)
- [x] Admin CMS: pages, products, FAQs, team, testimonials, settings
- [x] Resources: banking clauses + payment structure table
- [x] AI chatbot shell (`/api/assistant`) with knowledge base
- [x] SEO: sitemap, robots, metadata on key pages
- [x] Buyer RFQ via portal (not public anonymous)
- [x] Payment terms admin + buyer dropdown

### Phase 1 remaining tasks

| ID | Task | Priority |
|----|------|----------|
| P1-1 | Public **Buyer Purchase Request** landing with sign-in/register CTA + guest education (or gated form with clear path) | High |
| P1-2 | Public **Supplier Trade Offer** page with invite-only messaging + staff contact | High |
| P1-3 | **Blog/News** admin CRUD for Insights (`BlogPost` model exists) | Medium |
| P1-4 | Category pages: Coffee, Nuts & Spices, Other Agricultural (seed + CMS) | Medium |
| P1-5 | Homepage YouTube hero (lazy, poster, muted) — config in SiteSettings | Medium |
| P1-6 | Open Graph + FAQ schema audit on all marketing pages | Medium |
| P1-7 | Cloudinary for **public/CMS images only** (optional provider) | Low |
| P1-8 | Core Web Vitals pass on mobile (image sizes, lazy chatbot) | Medium |
| P1-9 | Wire `writeAuditEvent` for CMS publish + settings changes | Low |

**Exit criteria:** All public pages responsive; products CMS-driven; buyer path documented; supplier path invite-only; chatbot bounded; no invented availability claims.

---

## Phase 2 — Auth, roles, onboarding, audit foundation

**Status (Aug 2026):** Core implementation complete. Buyer onboarding, invitations, CIS/KYB workflow, private file storage, audit foundation, and permission middleware are wired. Supplier/employee/banking portal onboarding UIs are partial. Full integration test suite against MongoDB is partial.

| ID | Task | Status |
|----|------|--------|
| P2-1 | Email verification flow (send code, verify, block until verified) | Done |
| P2-2 | Phone OTP flow (console adapter; Twilio deferred) | Partial |
| P2-3 | Versioned terms acceptance on login if terms updated | Done (API + registration) |
| P2-4 | Onboarding state field on Organization | Done |
| P2-5 | CIS/KYB submit → Under Review + document uploads (private storage) | Done |
| P2-6 | Supplier invitation: create, expire, accept API + UI | Done |
| P2-7 | Seed staging accounts (`npm run seed:phase2`) | Done |
| P2-8 | Enforce `requireApiAuth` on admin/onboarding APIs | Partial (CMS routes still use legacy admin gate) |
| P2-9 | Audit login, approval, invitation, file events | Partial (core auth + onboarding audited) |
| P2-10 | Rate limiting + brute-force on auth routes | Partial (lockout implemented; edge rate limit deferred) |

**Key API routes:** `/api/auth/*`, `/api/terms`, `/api/onboarding/*`, `/api/invite/[token]`, `/api/admin/invitations`, `/api/admin/users`, `/api/admin/audit`, `/api/admin/organizations/[id]/review`, `/api/storage/local`.

**Deferred to Phase 3+:** Transaction workflows, MFA app authenticator, Twilio SMS production, malware scanning integration, full admin dashboard metrics widget.

---

## Phase 3 — Buyer portal MVP (transaction core)

**Status (Aug 2026):** Core buyer transaction foundation implemented — numbering, requests, workflow transitions, commercial terms, document generation/review/signing, banking handoff API, buyer portal workspace. Employee workspace transaction detail UI and full message/task modules remain partial.

| ID | Task | Status |
|----|------|--------|
| P3-1 | `TransactionNumberService` → `FK-S-YYYY-NNNNNN` | Done |
| P3-2 | Create Transaction from qualified PurchaseRequest | Done |
| P3-3 | WorkflowStep persistence + transition API | Done |
| P3-4 | Commercial terms editor (Trade Manager) | API done; workspace UI partial |
| P3-5 | Product specification version link | Model + seed |
| P3-6 | SCO/FCO generate PDF from template + structured fields | Done (pdf-lib) |
| P3-7 | ICPO buyer draft/submit/lock | API done |
| P3-8 | SPA + LC wording generate + internal review | API done |
| P3-9 | Document upload API (private storage) + versioning | Done |
| P3-10 | Signature upload / e-sign provider interface | Controlled upload done |
| P3-11 | Buyer transaction workspace UI | Dashboard + list + detail |
| P3-12 | Seed `FK-S-2026-TEST-0001` | `npm run seed:phase3` |

**Key routes:** `/api/portal/buyer/requests`, `/api/portal/buyer/transactions`, `/api/transactions/[id]/*`, `/admin/buyer-requests`.

---

## Phase 4 — Supplier portal + deal groups ✅ (core delivered)

| ID | Task | Status |
|----|------|--------|
| P4-1 | `FK-P-YYYY-NNNNNN` + `FK-DG-YYYY-NNNNNN` generators | Done |
| P4-2 | Supplier procurement workflow (`procurement-workflow.ts`) | Done |
| P4-3 | `SupplierOffer`, `ProcurementTerms`, `DealGroup`, `DealGroupTransaction`, `DealAllocation` | Done |
| P4-4 | Tenant isolation (buyer_sale vs supplier_purchase queries, deal group 403) | Done |
| P4-5 | Supplier portal UI + admin sections (supplier-offers, procurement, deal-groups) | Done |
| P4-6 | Public trade-offer lead intake (`/api/leads/trade-offer`) | Done |
| P4-7 | Seed `FK-P-2026-TEST-0001` + `FK-DG-2026-TEST-0001` | `npm run seed:phase4` |
| P4-8 | Automated tests (`tests/phase4-procurement.test.ts`) | 41 tests pass |

**Key routes:** `/api/portal/supplier/*`, `/api/admin/procurement`, `/api/admin/deal-groups`, `/api/admin/supplier-offers`.

**Remaining polish (post-MVP):** full employee procurement workspace UI, supplier message/task APIs, Mongo integration isolation tests, procurement document consistency extension.

---

## Phase 5 — Banking coordination ✅ (core delivered)

| ID | Task | Status |
|----|------|--------|
| P5-1 | `BankingInstrument` lifecycle + separate buyer/supplier records | Done |
| P5-2 | Bank parties, wording versions, reviews, amendments, deadlines | Models + services |
| P5-3 | Adviser assignment + `/portal/banking` workspace | Done |
| P5-4 | Contract-instrument consistency checker | Done |
| P5-5 | Admin banking dashboard + APIs | Done |
| P5-6 | Seed buyer/supplier test instruments | `npm run seed:phase5` |
| P5-7 | Tests `tests/phase5-banking.test.ts` | Done |

**Key routes:** `/api/banking/instruments`, `/api/banking/instruments/[id]`, `/portal/banking`.

**Remaining polish:** full amendment/presentation/discrepancy UI, Mongo integration isolation tests, background reminder job runner.

---

## Phase 5 (original checklist) — Banking coordination

| ID | Task |
|----|------|
| P5-1 | `BankInstrument` + amendment models |
| P5-2 | Admin-only instrument selection UI |
| P5-3 | Banking adviser assigned-transaction workspace |
| P5-4 | Status timeline (Issued → Presented → Complying/Discrepant) |
| P5-5 | **No** SWIFT simulation; clear disclaimers |

---

## Phase 6 — Shipments + document checklist ✅ (implemented)

| ID | Task | Status |
|----|------|--------|
| P6-1 | Shipment schedules + buyer/supplier `ShipmentLot` records (`FK-SHP-YYYY-NNNNNN`) | Done |
| P6-2 | Internal `ShipmentLotAllocation` via Deal Groups | Done |
| P6-3 | Freight bookings, transport units, inspections | Done |
| P6-4 | LC-linked `ShipmentDocumentChecklist` + requirements | Done |
| P6-5 | Shipping document validation (deterministic) | Done |
| P6-6 | Internal `PresentationPackage` → Phase 5 `BankPresentation` link | Done |
| P6-7 | Provider-neutral tracking (`TrackingReference`, `ShipmentTrackingEvent`) | Done |
| P6-8 | Customs, delivery, incidents, trade claims | Models + APIs (actions route) |
| P6-9 | Buyer/supplier/workspace shipment portals | Done |
| P6-10 | `npm run seed:phase6` + `tests/phase6-shipment.test.ts` | Done |

Seed: `FK-SHP-2026-TEST-0001` (buyer) + `FK-SHP-2026-TEST-0002` (supplier), internally allocated.

APIs under `/api/shipments/*`. Portal routes: `/portal/buyer/shipments`, `/portal/supplier/shipments`, `/workspace/shipments`.

---

## Phase 7 — Finance + reporting

| ID | Task |
|----|------|
| P7-1 | Finance entry UI per transaction/lot |
| P7-2 | Profit calculation (`decimal.js`) + reports |
| P7-3 | Configurable tax rules (no auto 13% HST everywhere) |
| P7-4 | Export CSV/PDF reports |
| P7-5 | Accounting integration interface (stub) |

---

## Phase 8 — AI + integrations

| ID | Task |
|----|------|
| P8-1 | AI document comparison (assist only, human review required) |
| P8-2 | `AIProcessingRecord` audit |
| P8-3 | E-signature provider (DocuSign/HelloSign abstraction) |
| P8-4 | Shipping provider webhooks |
| P8-5 | Market data (Vesper) interface — read-only |

---

## Phase 9 — Security, performance, UAT, production

| ID | Task |
|----|------|
| P9-1 | Full authorization integration test suite |
| P9-2 | E2E Playwright: buyer happy path |
| P9-3 | E2E: supplier path |
| P9-4 | Upload security tests |
| P9-5 | Accessibility audit |
| P9-6 | Production readiness checklist (see WORKFLOW spec §26) |
| P9-7 | MFA for sensitive roles |

---

## Definition of complete

Platform is **not** complete until all items in spec §26 pass with automated test evidence. See `docs/TESTING_GUIDE.md`.

## Risk register

| Risk | Mitigation |
|------|------------|
| Permission matrix not enforced | Phase 2 P2-8 before Phase 3 APIs |
| Document storage on local disk in prod | Phase 3 P3-9 private S3 |
| Workflow UI-only | State machine service mandatory |
| Scope creep | One phase at a time; defer to plan |

## Next action

**Phase 9 — Security, performance, UAT, production readiness**. Phase 8 automated tests pass (`101` total across 13 files).

---

## Phase 8 — Integrations, AI, market data, e-signature ✅ (Aug 2026)

| Area | Status |
|------|--------|
| Provider-neutral integration framework | Done |
| Feature flags (`IntegrationFeatureFlag`) | Done |
| AI provider (Gemini + mock) + human review | Done |
| Public chatbot feature flag | Done |
| Internal assistant (role-scoped) | Done |
| Vesper market-data adapter (mock + stub) | Done |
| Market alerts | Done |
| E-signature adapter + webhook verification | Done |
| Screening adapter + human match review | Done |
| Shipping/accounting webhook security | Done |
| Integration jobs + usage tracking | Done |
| Admin integrations health dashboard | Done |
| Seed `seed:phase8` | Done |
| Tests `phase8-integrations.test.ts` | Done |
| Docs INTEGRATIONS, AI_GOVERNANCE, WEBHOOK_SECURITY, PROVIDER_SETUP | Done |

Deferred / partial:

- Live Vesper, DocuSign, real screening provider adapters (interfaces ready)
- Full admin CRUD for prompt templates and knowledge chunks UI
- SEO/social content assistant screens
- SMS production Twilio adapter implementation
- Workspace market-data page for internal users

---

## Phase 7 — Finance, ledger, invoices, payments ✅ (Aug 2026)

| Area | Status |
|------|--------|
| Operational ledger (`FinancialEntry`) | Done |
| Buyer invoices + supplier bills | Done |
| Payments, allocations, verification | Done |
| Costs, commissions, bank fees | Done |
| Tax codes + FX rates (models) | Done |
| Profitability (transaction, deal group) | Done |
| Financial periods close/reopen | Done |
| Accounting provider interface + mock | Done |
| Finance dashboard + portal lists | Done |
| Seed `seed:phase7` | Done |
| Tests `phase7-finance.test.ts` | Done |
| Docs `FINANCE_RULES.md`, `ACCOUNTING_INTEGRATION.md` | Done |

Deferred / partial:

- Full finance workspace CRUD screens for every entity type (entries, commissions UI, tax admin)
- Transaction/shipment finance tabs
- Finance notification emails
- Dedicated tax/FX CRUD APIs
- CSV/XLSX report export endpoint
- Credit note workflow API

---

## Phase 9 — Security, QA, deployment readiness ✅ (Aug 2026)

| Area | Status |
|------|--------|
| Threat model + security controls docs | Done |
| Security/ops models (events, incidents, retention, legal hold, UAT, release) | Done |
| Production guards + unconfigured providers in prod | Done |
| Security permissions + dashboard API/UI | Done |
| Health / readiness endpoints | Done |
| CI release gates (`.github/workflows/ci.yml`) | Done |
| Incident response + retention + backup docs | Done |
| UAT scaffold + `seed:phase9` | Done |
| Deployment, rollback, go-live checklist | Done |
| Tests `phase9-security.test.ts` | Done |

Deferred / pre-launch:

- Full role-based UAT execution and sign-off (manual)
- Staging backup restore verification record
- Redis-backed distributed rate limiting
- Independent penetration test
- Live provider production credentials (Vesper, DocuSign, screening)
- Accessibility automated remediation pass

