# Finekarts — Testing Guide

Use **staging only** with **fake companies, documents, bank details, and transactions**. Never use real banking or customer PII in non-production.

## 1. Environments

| Environment | URL | Data |
|-------------|-----|------|
| Local | `http://localhost:3099` (or `npm run dev`) | Local Mongo or `.data/` fallback |
| Staging | `https://finekarts.vercel.app` (or dedicated staging) | Fake seed data |

**Setup:**

```bash
cp .env.example .env.local
# Set MONGODB_URI, SESSION_SECRET, APP_URL
npm run seed:phase5
npm run seed:phase6   # FK-SHP-2026-TEST-0001 / 0002
```

## 2. Test accounts (staging seed — Phase 2 will expand)

| Role | Email | Password | Notes |
|------|-------|----------|-------|
| Super Admin | `INITIAL_ADMIN_EMAIL` from env | `INITIAL_ADMIN_PASSWORD` | `/admin` |
| Demo buyer | `buyer@demo.finekarts.com` | `DemoBuyer123!` | Org **pending** until approved |

**Use separate browser profiles** for admin vs buyer vs supplier.

### Future seed accounts (Phase 2)

Trade Manager, Document Reviewer, Finance Manager, Shipping Manager, Banking Adviser, Buyer B, Supplier A — all fake companies.

### Phase 6 shipment tests

```bash
npm run test -- tests/phase6-shipment.test.ts
```

Covers workflow transitions, document validation, tracking normalization, isolation rules, and Mongo integration when `MONGODB_URI` is set.


- Companies: `Fake Buyer Trading Ltd`, `Atlas Global Foods Test Ltd`
- Banks: `TEST BANK IBAN 0000`
- PDF watermark: `TEST DOCUMENT — NOT VALID — FOR SOFTWARE QA ONLY`
- No real SGS/bank/government logos

## 4. What you can test TODAY

### 4.1 Public website

| Test ID | Action | Expected |
|---------|--------|----------|
| PUB-01 | Open all nav pages | No 404; header/footer links work |
| PUB-02 | Product category → product detail | CMS/seed content loads |
| PUB-03 | `/resources` payment table | Banking clause + structure table visible |
| PUB-04 | Mobile viewport | Menu usable |
| PUB-05 | `/trade` | Redirects to `/resources` |
| PUB-06 | Chatbot: ask for prices | No invented prices; trade desk disclaimer |

### 4.2 Buyer onboarding

| Test ID | Action | Expected |
|---------|--------|----------|
| BUY-01 | Register new fake buyer | Pending message; admin email (if Resend configured) |
| BUY-02 | Login before approve | Approval pending screen |
| BUY-03 | Admin approve at `/admin/buyers/[id]` | Buyer gets email; portal unlocks |
| BUY-04 | Duplicate company register | Review/duplicate handling, not silent duplicate |
| BUY-05 | CIS draft save | `/portal/buyer/cis` persists |

### 4.3 Buyer RFQ / edible oil order

| Test ID | Action | Expected |
|---------|--------|----------|
| RFQ-01 | Submit full edible oil form | Success + reference |
| RFQ-02 | Admin `/admin/purchase-requests` | Record with contract total, payment, ICC |
| RFQ-03 | Buyer `/portal/buyer/requests` | Listed |
| RFQ-04 | Empty required fields | Validation errors |
| RFQ-05 | Double submit click | No duplicate (or idempotent) |

### 4.4 Admin CMS

| Test ID | Action | Expected |
|---------|--------|----------|
| ADM-01 | Edit homepage section in `/admin/pages` | Public page updates |
| ADM-02 | Payment terms toggle | Buyer form shows only enabled terms |
| ADM-03 | Products CRUD | Admin list updates |

### 4.5 Security (basic)

| Test ID | Action | Expected |
|---------|--------|----------|
| SEC-01 | `/admin` without login | Redirect to login |
| SEC-02 | `/api/leads/purchase-request` without session | 401 |
| SEC-03 | Buyer opens `/admin` | Denied |

## 5. NOT testable yet (mark N/A in sheet)

| Module | Reason |
|--------|--------|
| `FK-S-2026-000001` transaction numbers | No generator |
| SCO/FCO → ICPO → SPA workflow | No APIs |
| Document upload/filter | No upload API |
| Banking instrument selection | No module |
| Shipment lots + BL tracking UI | Placeholder |
| Deal groups | Not built |
| Finance reports + HST rules | Placeholder |
| Supplier full 15-step workflow | Placeholder |
| Email/phone OTP on register | Partial |
| E2E automated buyer transaction | Phase 9 |

## 6. Automated tests (run locally)

```bash
npm run test        # Vitest unit tests
npm run typecheck
npm run build
```

**Existing unit coverage:** workflows, authorization helpers, money, validation, catalog.

**Missing:** API integration tests, Playwright E2E (Phase 9).

## 7. Testing sheet template

| Test ID | Module | Action | Expected | Actual | Pass/Fail | Screenshot | Bug notes |
|---------|--------|--------|----------|--------|-----------|------------|-----------|
| PUB-01 | Public | Open home | Loads hero | | | | |

## 8. Regression before release

1. `npm run test && npm run build`
2. Manual BUY-01 → BUY-03 → RFQ-01 path
3. `/api/health` → `databaseReady: true` on staging
4. Verify `EMAIL_PROVIDER` on staging for real notifications

## 9. Reporting bugs

Include: environment, browser, user role, URL, steps, expected vs actual, screenshot, console/network errors.

## 10. Relation to client mega-checklist

The long ChatGPT checklist describes the **full target platform**. Use **Section 4–5** of this guide to know what applies today. Track full checklist against `docs/IMPLEMENTATION_PLAN.md` phases.
