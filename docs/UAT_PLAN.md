# User Acceptance Testing Plan

## Scope

Validate Phases 1–8 functionality under role-based access with **synthetic test data only**. No real client, bank, passport, shipping, or payment data.

## Test data

- Use seed accounts: `buyer-a@test.finekarts.local`, `buyer-b@...`, `supplier-a@...`, `trade@test.finekarts.local`, `finance@test.finekarts.local`.
- Password: `PHASE2_SEED_PASSWORD` from env (development/staging only).
- Mark all UAT documents as test documents.

## Roles and scripts

| Role | Focus |
|------|--------|
| Public visitor | Public pages, forms, chatbot, SEO, responsive |
| Buyer A | Full buyer transaction workflow |
| Buyer B | Isolation from Buyer A |
| Supplier A | Supplier workflow + isolation |
| Trade Manager | Transactions, deal groups, assignments |
| Document Reviewer | Approvals, packages |
| Banking Adviser | Assigned instruments only |
| Shipping Manager | Schedules, lots, tracking |
| Finance Manager | Invoices, payments, profitability |
| Administrator | Orgs, users, templates, audit |
| Super Admin | Security, integrations, settings |

## Automated scaffold

`UATTestCase` records seeded via `npm run seed:phase9`. Update `actualResult`, `status`, `testerUserId`, `evidenceRef` as tests execute.

## Full E2E transaction (synthetic)

Execute 40-step flow from Phase 9 spec: buyer registration → signed SPA → supplier procurement → shipment → finance → close → audit verification → cross-tenant denial attempts.

## Defect process

1. Failed UAT → `defectReference` on test case.
2. Fix → retest same `testId`.
3. Sign-off when all critical/high UAT cases `passed`.

## Sign-off

UAT status recorded on `ReleaseRecord.uatStatus` before production deploy.

## Tools

- Manual scripted testing per role.
- Automated: `npm run test`, tenant-isolation and authorization tests.
- Accessibility: keyboard navigation + axe/pa11y on major flows (staging).
