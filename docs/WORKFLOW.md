# Finekarts — Trade Workflow

This document describes **target workflows** and **current implementation status**.

Finekarts coordinates trade information and documents. It is **not a bank** and must not claim to issue, authenticate, or guarantee LC/SBLC or other banking instruments.

## 1. Portal map

| Portal | Audience | Purpose |
|--------|----------|---------|
| Public website | World | Marketing, education, intake CTAs |
| Buyer portal | Approved buyers | RFQs, transactions, CIS, documents |
| Supplier portal | Invited suppliers | Procurement transactions, offers |
| Employee workspace | Finekarts staff | Assigned deals, suppliers, tasks |
| Admin | GM / Super Admin | Full control, approvals, settings |
| Banking workspace | External advisers | Assigned instrument review only |

## 2. Company onboarding (target)

### Buyer

```
Register → Email verify → Phone verify → Terms accept → Company create/join
    → Duplicate check → CIS/KYB draft → Submit docs → Admin review
    → Approved | Rejected | Changes requested → (if approved) Transaction access
```

**Current implementation:**

| Step | Status |
|------|--------|
| Self-register | ✅ `POST /api/auth/register/buyer` |
| Email verify | ⚠️ `emailVerifiedAt` set on create; `/verify-email` UI shell |
| Phone verify | ❌ `REQUIRE_PHONE_OTP` optional; UI shell |
| Terms accept | ✅ on registration / forms |
| Duplicate company | ✅ name/country check → review message |
| CIS/KYB | ⚠️ draft save API + form |
| Admin approve | ✅ `/admin/buyers/[id]` |
| Approved → portal | ✅ verified org check in layout |

### Supplier

```
Admin invitation (expiring) → Open link → Verify email/phone → Terms → CIS/KYB
    → Admin approve → Portal access
```

**Current:** Invitation model exists; **no token validation API**; supplier portal is placeholder; trade-offer public API returns 403.

## 3. Buyer sale workflow (target)

### Stage A — Purchase request

- Buyer or Trade Manager creates RFQ/LOI
- System assigns `FK-S-YYYY-NNNNNN`
- Qualification: qualified | changes requested | declined | on hold

**Current:** `PurchaseRequest` + edible oil order form; **no Transaction record**; no `FK-S` number.

### Stage B — SCO/FCO

- Generate from approved commercial data
- Internal review → approve → send → immutable sent version
- Skip requires authorized reason + audit

**Current:** `DocumentTemplate` seeded; **no generation API**; workflow library tested but not bound.

### Stage C — ICPO

- Buyer draft/upload → submit locks version → Finekarts review → reopen = new revision

**Current:** Not implemented.

### Stage D — SPA + proposed LC wording

- Generate from same data source; cross-document consistency checks

**Current:** Not implemented.

### Stage E — Signatures

- E-sign or controlled upload; countersign; signed immutable; amendments only

**Current:** Not implemented.

### Stage F — Banking instrument

- **Admin only** selects instrument type
- Portal records metadata (banks, dates, references) — **does not issue LC**
- Banking adviser reviews assigned deals only

**Current:** Banking portal placeholder; no `BankInstrument` model.

### Stage G — Fulfilment

- Shipment lots per monthly delivery
- Document checklist (locked)
- Upload shipping docs → deterministic filter → human review
- Presentation status, payment, delivery, reconciliation, close

**Current:** `Shipment` model; admin list only; no lots UI, no filter execution API.

## 4. Supplier procurement workflow (target)

Mirror of buyer flow with Finekarts as buyer; `FK-P-YYYY-NNNNNN`; supplier cannot see buyer or sales price.

**Current:** Not implemented end-to-end.

## 5. Deal groups (target)

Internal `FK-DG-YYYY-NNNNNN` links buyer sale + supplier purchase(s). Buyer and supplier see **only their side**.

**Current:** `Transaction.linkedTransactionId` field exists; **no DealGroup entity**; no UI.

## 6. Workflow engine

**Library:** `src/lib/workflows/transitions.ts`

- Step prerequisites
- Skip with minimum reason length
- Status: not_started → … → approved | skipped | completed

**Templates seeded:** buyer 6-step, supplier 6-step.

**Gap:** No service persists step transitions on `Transaction` + `WorkflowStep` from API handlers.

## 7. Document lifecycle (target)

```
Draft → Under Review → Changes Requested → Approved → Sent → Viewed → Signed → Superseded → Archived
```

Submitted and signed revisions are **immutable**. Reopen creates new `DocumentVersion`.

**Current:** Models exist; no upload or PDF generation pipeline.

## 8. Banking statuses (target)

Issued → Advised → Active → Presented → Complying/Discrepant → Honoured/Refused → Closed

Portal records status; does not simulate SWIFT or bank authentication.

## 9. Shipment statuses (target)

Planned → Booking Confirmed → Loaded → Departed → Arrived → Customs Released → Delivered → Closed

Estimated events must be labeled **estimated**.

## 10. Payment terms (implemented)

- Full catalog in `src/lib/content/payment-terms.ts` with ICC codes (UCP 600, ISP98, etc.)
- Admin enables structures at `/admin/payment-terms`
- Buyer edible oil form loads enabled terms from `/api/payment-terms`

## 11. State machine rules (engineering)

1. **Never** rely on hiding UI buttons alone — validate transitions server-side.
2. Invalid transition → 409 with audit log entry.
3. Skip SCO/FCO → requires permission + reason + actor + timestamp.
4. Close master contract only when all lots paid/delivered and documents resolved.

## 12. Reference diagram (target)

```
PurchaseRequest ──qualify──► Transaction (FK-S)
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
    WorkflowSteps      Documents            BankInstrument
         │                    │                    │
         ▼                    ▼                    ▼
    SCO/FCO→ICPO→SPA    Versions/Reviews    Adviser review
         │                    │
         ▼                    ▼
    ShipmentLots         Document filter
         │
         ▼
    FinanceEntries → Reports
```

**DealGroup (internal only):** links FK-S transaction(s) to FK-P transaction(s).
