# Threat Model — Finekarts Platform

**Version:** Phase 9  
**Scope:** Commodity trading platform (public site, buyer/supplier portals, workspace, admin).  
**Method:** STRIDE-oriented asset and threat analysis for production deployment.

## Assets

| Asset | Sensitivity | Storage |
|-------|-------------|---------|
| User identities | High | MongoDB `User`, sessions |
| Company identities | High | `Organization`, CIS/KYB |
| CIS/KYB data | Critical | `CisProfile`, `KybDocument` |
| Buyer transactions | High | `Transaction`, documents |
| Supplier transactions | High | Procurement transactions |
| Signed contracts | Critical | `Document`, object storage |
| Banking instruments | Critical | Banking models |
| Shipping documents | High | Shipment/document storage |
| Payment records | Critical | Finance models |
| Profitability data | Critical | `ProfitabilitySnapshot` |
| Screening results | Critical | `ScreeningCase` |
| API credentials | Critical | Environment / secrets manager |
| Audit logs | High | `AuditEvent` (append-only) |

## Threat register (representative)

| Threat | Asset | Attack path | Existing control | Missing / residual | Severity | Remediation | Owner | Verification |
|--------|-------|-------------|------------------|-------------------|----------|-------------|-------|--------------|
| Account takeover | User | Stolen password | bcrypt hashing, MFA for privileged roles | Redis rate limit at scale | High | MFA enforcement, session revocation | Security | Auth tests, UAT-AUTH-001 |
| Credential stuffing | User | Automated login | Failed-login lockout, generic errors | Distributed rate limit | High | WAF + Redis rate limit | Ops | Load test staging |
| Brute-force login | User | Repeated passwords | `MAX_FAILED_LOGINS`, lockout | Per-process limiter | Medium | Central rate limit | Security | phase9 + login tests |
| Session theft | Session | XSS / theft | HttpOnly session cookie, CSP | CSP allows unsafe-inline | High | Tighten CSP over time | Engineering | Header review |
| MFA bypass | Admin | Skip MFA step | MFA required roles, token verification | — | Critical | Block if tests fail | Security | MFA integration tests |
| IDOR | Transactions | Change URL/API ID | `requireApiAuth`, transaction scoping | Full matrix audit ongoing | Critical | Default-deny services | Engineering | tenant-isolation tests |
| Cross-tenant access | All tenant data | ID manipulation | Org-scoped queries | — | Critical | Isolation tests | Security | `tenant-isolation.test.ts` |
| Buyer/supplier leakage | Counterparty data | Portal/API | Separate portals, role permissions | — | Critical | UAT isolation scripts | QA | UAT-ISO-001 |
| Banking data leakage | Instruments | API export | Transaction-scoped banking access | Masking in UI | Critical | Banking access tests | Compliance | phase5 tests |
| Malicious upload | Documents | Upload executable | Size/type limits, quarantine architecture | Live malware scanner | High | Enable scan provider | Security | Upload security tests |
| Webhook replay | Integrations | Replay POST | HMAC + idempotency `WebhookEvent` | Timestamp window | High | Replay tests | Engineering | phase8 webhook tests |
| Secret exposure | Credentials | Repo/logs | Env vars, CI secret scan | Manual review | Critical | Secret manager, scanning | Ops | CI gate |
| Mock provider in prod | Business state | Misconfig | `allowDevelopmentMock()`, unconfigured providers | — | Critical | Production validation | Engineering | phase9-security tests |
| Log data leakage | PII | Verbose logs | Generic API errors, metadata sanitization | Full log audit | Medium | Redaction policy | Ops | Log review |
| Backup loss | All data | No backup | Provider-dependent | Restore test required | Critical | Verified restore | Ops | BACKUP_RECOVERY.md |

## Residual risk

Automated tests and internal review do **not** replace an independent penetration test before handling real banking and identity data at scale. Schedule external assessment prior to high-sensitivity production workloads.

## Review cadence

- Quarterly threat model review
- After major feature releases (new integrations, new external portals)
- After any security incident
