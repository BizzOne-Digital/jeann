# Finekarts — Data Model

**Database:** MongoDB  
**ODM:** Mongoose  
**Tenant key:** `organizationId` on most operational records

## 1. Entity map (current)

### Identity & access

| Entity | Model | Notes |
|--------|-------|-------|
| User | `User` | email, passwordHash, status |
| Session | `Session` | server-side session rows |
| Organization | `Organization` | buyer \| supplier \| internal; status pending/verified/… |
| OrganizationMembership | `OrganizationMembership` | roles[], customPermissions[] |
| Invitation | `Invitation` | hashed tokens — **accept flow incomplete** |
| VerificationChallenge | `VerificationChallenge` | email/phone OTP |
| TermsDocument | `TermsDocument` | versioned legal text |
| TermsAcceptance | `TermsAcceptance` | acceptance audit |

### Onboarding

| Entity | Model | Notes |
|--------|-------|-------|
| CIS/KYB | `CisProfile` | versioned; draft save via API |
| Approval | `Approval` | generic decisions (buyer org today) |

### Catalog

| Entity | Model | Notes |
|--------|-------|-------|
| ProductCategory | `ProductCategory` | slug, name |
| Product | `Product` | linked to category; CMS-managed |
| PackagingType | `PackagingType` | catalogue |
| ProductPackagingCompatibility | join table |

### Intake (pre-transaction)

| Entity | Model | Notes |
|--------|-------|-------|
| PurchaseRequest | `PurchaseRequest` | RFQ / edible oil order fields |
| TradeOffer | `TradeOffer` | supplier intake model |
| Lead | `Lead` | CRM pipeline |
| ContactSubmission | `ContactSubmission` | |
| BookingRequest | `BookingRequest` | |
| NewsletterSubscriber | `NewsletterSubscriber` | |

### Transactions (schema ready, **minimal runtime use**)

| Entity | Model | Notes |
|--------|-------|-------|
| Transaction | `Transaction` | side buyer/supplier; `transactionNumber`; simple status enum |
| TransactionParticipant | `TransactionParticipant` | scoped users per deal |
| WorkflowTemplate | `WorkflowTemplate` | seeded 6-step templates |
| WorkflowStep | `WorkflowStep` | per-transaction step state |
| Task | `Task` | assignable — no UI |

**Missing entities (pre-Phase 6):**

| Entity | Status |
|--------|--------|
| AIProcessingRecord | Not implemented |

### Phase 6 — Shipment operations (implemented)

| Entity | Model | Notes |
|--------|-------|-------|
| Shipment schedule | `ShipmentSchedule` | Versioned contract delivery plans |
| Shipment lot | `ShipmentLot` | `FK-SHP-YYYY-NNNNNN`; buyer_sale / supplier_purchase |
| Shipment allocation | `ShipmentLotAllocation` | Internal only — links buyer/supplier lots via Deal Group |
| Freight booking | `FreightBooking` | Vessel, voyage, containers |
| Transport unit | `TransportUnit` | Container/tank/seal |
| Inspection | `InspectionRecord` | Unverified by default |
| Document checklist | `ShipmentDocumentChecklist` | LC-linked, lock workflow |
| Checklist requirement | `ShipmentDocumentRequirement` | Per-document item |
| Requirement template | `DocumentRequirementTemplate` | Guidance only |
| Tracking reference | `TrackingReference` | Provider-neutral |
| Tracking event | `ShipmentTrackingEvent` | confirmed vs estimated |
| Customs | `CustomsClearanceRecord` | Manual/broker source tagged |
| Delivery | `DeliveryRecord` | Proof required for Delivered status |
| Incident | `ShipmentIncident` | Internal workflow |
| Trade claim | `TradeClaim` | Settlement deferred to Phase 7 |
| Presentation package | `PresentationPackage` | Links to `BankPresentation` |

Shipping documents reuse `Document` + `DocumentVersion` with `shipmentLotId`, `shippingDocumentType`, visibility flags.

**Still missing (later phases):**

### Documents

| Entity | Model | Notes |
|--------|-------|-------|
| Document | `Document` | metadata |
| DocumentVersion | `DocumentVersion` | checksum, immutability intent |
| DocumentTemplate | `DocumentTemplate` | SCO/FCO/ICPO/SPA blocks seeded |
| DocumentReview | `DocumentReview` | |
| ValidationRuleSet | `ValidationRuleSet` | deterministic rules seeded |

**No upload/download API yet.**

### Logistics & finance

| Entity | Model | Notes |
|--------|-------|-------|
| Shipment | `Shipment` | linked to transactionId |
| FinanceEntry | `FinanceEntry` | invoice/payment/fee lines |
| TaxConfiguration | `TaxConfiguration` | jurisdiction rules (example seed) |

### Comms & audit

| Entity | Model | Notes |
|--------|-------|-------|
| MessageThread / Message | messaging models | no UI |
| Notification | `Notification` | no delivery worker |
| AuditEvent | `AuditEvent` | **helper unused** |

### CMS & config

| Entity | Model | Notes |
|--------|-------|-------|
| Page, BlogPost, Faq, Testimonial, TeamMember | marketing CMS |
| SiteSettings | feature flags, paymentTermsConfig |
| AiKnowledgeEntry | chatbot knowledge |
| IntegrationConfiguration | provider status rows |

## 2. Transaction numbering (target)

| Type | Format | Implementation status |
|------|--------|----------------------|
| Buyer sale | `FK-S-YYYY-NNNNNN` | **Not implemented** — no generator |
| Supplier purchase | `FK-P-YYYY-NNNNNN` | **Not implemented** |
| Deal group | `FK-DG-YYYY-NNNNNN` | **Not implemented** |

Current `Transaction.transactionNumber` is a string field with no allocation service.

## 3. Indexes & integrity

- Unique: `PurchaseRequest.reference`, `Transaction.transactionNumber`, `User.email` (partial unique on deletedAt)
- Organization duplicate detection: `normalizedLegalName` + country on register
- **MongoDB transactions (multi-document):** not yet used for financial writes

## 4. Status enums (current vs target)

### Transaction (`Transaction.status` today)

`draft | active | on_hold | completed | cancelled`

**Target (spec):** 25+ statuses from Qualification through Closed — requires schema migration + state machine service.

### Organization (`Organization.status`)

`pending | verified | rejected | suspended`

**Target onboarding states:** Invited, Email/Phone verification pending, CIS states, etc. — needs `onboardingState` field or sub-document.

## 5. File storage model (target)

```
Document → DocumentVersion → storageKey (private bucket)
                           → checksum SHA-256
                           → mimeType, sizeBytes
                           → immutable after submit/sign
```

Public website images remain on CDN/static assets, not mixed with trade documents.

## 6. Seed data

`npm run seed` — CMS, products, workflow templates, demo buyer, sample purchase request, tax example.

`npm run create-admin` — admin user from env.

**Staging-only test transaction `FK-S-2026-TEST-0001`:** planned in Phase 3 seed extension.
