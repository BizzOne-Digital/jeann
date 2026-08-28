# Finekarts — System Architecture

**Last updated:** 2026-08-27  
**Stack decision:** Retain MongoDB + Mongoose (already implemented). Do not migrate to PostgreSQL unless a future phase proves relational constraints cannot be met with strict schemas, transactions, and tenant-scoped repositories.

## 1. Overview

Finekarts is a **Next.js monolith** (App Router) that serves:

- Public marketing website
- Buyer, supplier, banking, employee workspace, and admin portals
- REST-style API routes under `/api`

There is **no separate Express/Nest backend**. Server logic lives in Next.js route handlers, server components, and `src/lib/`.

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js 16 (App Router)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │ Marketing    │  │ Portals      │  │ API Routes       │ │
│  │ (public)     │  │ buyer/sup/   │  │ auth, leads,     │ │
│  │              │  │ admin/workspace│ │ admin, assistant │ │
│  └──────────────┘  └──────────────┘  └──────────────────┘ │
│                          │                                  │
│              src/lib (auth, workflows, finance, email…)     │
└──────────────────────────┼──────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │ MongoDB (Mongoose)      │
              │ Optional: .data/ dev    │
              └─────────────────────────┘
```

## 2. Technology stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Tailwind CSS 4 |
| Framework | Next.js 16.3 (Turbopack build) |
| Database | MongoDB via Mongoose 9 |
| Auth | JWT in cookie (`jose`), bcrypt passwords, `Session` model |
| Validation | Zod 4, react-hook-form |
| Money | decimal.js |
| Tests | Vitest |
| Email | Provider abstraction: `console`, Resend (implemented), SMTP (not implemented) |
| SMS/OTP | `VerificationChallenge` model; Twilio-ready |
| Storage | Local `.data/private`; S3 provider stub (not wired to routes) |
| AI | Groq / Gemini via `src/lib/ai/`; public chatbot at `/api/assistant` |
| Images (public/CMS) | Static `public/` + Sharp; Cloudinary not integrated |
| Trade documents | **Target:** private S3-compatible storage with signed URLs |

## 3. Application layers

### 3.1 Marketing (`src/app/(marketing)/`)

Static and CMS-driven pages: home, products, resources, packaging, shipping, inspections, insights, FAQ, team, testimonials, contact, legal pages.

CMS content: `Page`, `Faq`, `Testimonial`, `TeamMember`, `BlogPost` models + admin editors.

### 3.2 Portals

| Portal | Path prefix | Access gate |
|--------|-------------|-------------|
| Buyer | `/portal/buyer` | `requirePortalAccess("buyer")` + org `verified` |
| Supplier | `/portal/supplier` | `requirePortalAccess("supplier")` |
| Banking | `/portal/banking` | `requirePortalAccess("banking")` |
| Workspace | `/workspace` | `requirePortalAccess("workspace")` |
| Admin | `/admin` | `requirePortalAccess("admin")` |

### 3.3 API (`src/app/api/`)

- **Auth:** login, logout, register/buyer
- **Leads:** purchase-request, edible-oil-order, contact, booking (buyer session required)
- **Admin:** CRUD for CMS modules, buyers approval, payment terms, settings
- **Portal:** buyer CIS save
- **Health, payment-terms (public enabled list), assistant**

## 4. Provider abstractions

| Domain | Interface location | Status |
|--------|-------------------|--------|
| Email | `src/lib/email/` | Console + Resend |
| SMS | env + OTP lib | Schema only |
| Storage | `src/lib/storage/` | Not used in upload paths |
| AI | `src/lib/ai/` | Groq/Gemini + knowledge base |
| Shipment tracking | `ManualTrackingProvider` | Model + manual only |
| Malware scan | env flag | Console stub |

## 5. Security architecture (target)

- **Tenant isolation:** organization-scoped queries (partially implemented in helpers, not enforced on all APIs)
- **Transaction isolation:** `TransactionParticipant` model exists; enforcement deferred
- **Authorization:** granular `Permission` matrix in `permissions.ts`; production routes mostly use coarse role lists
- **Audit:** `AuditEvent` model + `writeAuditEvent()` — **not yet called from handlers**
- **Sessions:** HTTP-only cookie, `SESSION_SECRET` required in production
- **Files:** MIME/size validation required when upload APIs are built; private storage + expiring URLs

## 6. Deployment

- **Primary:** Vercel (serverless Next.js)
- **Database:** MongoDB Atlas (recommended)
- **Env:** see `.env.example` and `src/lib/config/env.ts`

## 7. Deferred / not in monolith

- Separate `backend/` service (not used — requirements allow single Next.js app)
- PostgreSQL/Prisma (deferred — MongoDB retained)
- SWIFT simulation, bank issuance, electronic presentation
- Background job queue (notifications, document generation at scale)

## 8. Key directories

| Path | Purpose |
|------|---------|
| `src/app/` | Routes and pages |
| `src/components/` | UI components |
| `src/lib/` | Business logic, auth, workflows, finance |
| `src/models/` | Mongoose schemas |
| `src/scripts/` | seed, create-admin |
| `tests/` | Vitest unit tests |
| `docs/` | Architecture and workflow documentation |
