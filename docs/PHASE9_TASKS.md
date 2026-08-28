# Phase 9 Task List (Ordered)

## Audit and inventory (completed)
1. Repository inspection — Phases 1–8 modules present (auth, transactions, procurement, banking, shipments, finance, integrations).
2. Test baseline — `npm run test` (101+ tests across phases).
3. Feature inventory — see `docs/SECURITY_CONTROLS.md` and `docs/IMPLEMENTATION_PLAN.md`.
4. Gap identification — mock provider fallbacks, per-process rate limits, partial UAT automation.

## Security hardening
5. Threat model — `docs/THREAT_MODEL.md`.
6. Security controls matrix — `docs/SECURITY_CONTROLS.md`.
7. Security models — `SecurityEvent`, `SecurityIncident`, `AccessReview`, `RetentionPolicy`, `LegalHold`, `BackupVerification`, `UATTestCase`, `ReleaseRecord`.
8. Production guards — `src/lib/security/production-guards.ts`; unconfigured providers in production.
9. Security permissions — `security:*`, `deployment:*`, `uat:manage`, `release:approve`.
10. Security dashboard — `/admin/security`, `/api/security/dashboard`.
11. Auth hardening — MFA for sensitive roles, lockout, no `devCode` in production login.
12. API security logging — unauthorized API access → security events.

## Operations and compliance
13. Incident response — `docs/INCIDENT_RESPONSE.md`.
14. Data retention — `docs/DATA_RETENTION.md`, default policies seeded.
15. Legal hold — model + `assertDeletionAllowed`.
16. Backup/DR — `docs/BACKUP_RECOVERY.md`.
17. Health endpoints — `/api/health`, `/api/health/ready`.

## QA and release
18. UAT plan — `docs/UAT_PLAN.md`, scaffold test cases in DB.
19. CI release gates — `.github/workflows/ci.yml`.
20. Phase 9 automated tests — `tests/phase9-security.test.ts`.
21. Deployment — `docs/DEPLOYMENT.md`.
22. Rollback — `docs/ROLLBACK.md`.
23. Operations runbook — `docs/OPERATIONS_RUNBOOK.md`.
24. Go-live checklist — `docs/GO_LIVE_CHECKLIST.md`.

## Remaining (post-Phase 9 / pre-launch)
25. Independent penetration test (external).
26. Staging restore test with real backup provider.
27. Full role-based UAT execution and sign-off.
28. Live provider credentials (Vesper, DocuSign, screening, accounting).
29. Redis-backed rate limiting for multi-instance production.
30. Accessibility remediation from automated axe/pa11y runs.
