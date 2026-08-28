# Security Controls

## Authentication

| Control | Implementation | Status |
|---------|----------------|--------|
| Password hashing | bcrypt via `verifyPassword` | Implemented |
| Password complexity | `loginSchema` / registration validation | Implemented |
| Account lockout | 5 failures / 15 min (`login-policy.ts`) | Implemented |
| MFA (privileged roles) | `rolesRequireMfa`, email OTP | Implemented |
| Generic login errors | No user enumeration | Implemented |
| Session cookies | HttpOnly, secure in production | Verify env |
| Session rotation | On login | Implemented |
| Logout | Session destroy | Implemented |
| Password reset tokens | Single-use, expiry | Verify in auth services |
| Invitation tokens | Single-use, expiry | Phase 2 |

## Authorization

| Control | Implementation | Status |
|---------|----------------|--------|
| Default deny | `requireApiAuth` + service checks | Implemented |
| Role permissions | `permissions.ts`, `ROLE_PERMISSIONS` | Implemented |
| Tenant isolation | Org-scoped queries, isolation tests | Implemented |
| Security permissions | `security:read`, `security:manage`, etc. | Phase 9 |
| Audit on deny | `access.denied` audit + security event | Phase 9 |

## API security

| Control | Implementation | Status |
|---------|----------------|--------|
| Input validation | Zod schemas on routes | Partial — audit per route |
| Rate limiting | In-memory (`rate-limit.ts`) | Staging OK; Redis for prod scale |
| CORS | Next.js defaults | Review for API-only origins |
| CSRF | Session + same-site cookies | Review for state-changing forms |
| Security headers | CSP, X-Frame-Options, nosniff | `next.config.ts` |
| Safe errors | `handleApiError` — no stack to client | Implemented |
| Correlation IDs | Request meta / audit | Partial |

## Document security

| Control | Implementation | Status |
|---------|----------------|--------|
| Private storage | Object storage abstraction | Architecture |
| Authorized download | Permission checks on download APIs | Implemented |
| Signed URL expiry | Provider configuration | Verify per env |
| Upload limits | Server action 4mb, route limits | Implemented |
| Malware scan | Integration architecture | Provider pending |

## Integrations

| Control | Implementation | Status |
|---------|----------------|--------|
| Mock blocked in production | `allowDevelopmentMock`, unconfigured providers | Phase 9 |
| Webhook HMAC | `webhook-security.ts` | Implemented |
| Webhook idempotency | `WebhookEvent` | Implemented |
| AI human review | `AIExecution` pending_review | Implemented |
| No AI auto-approve | Service layer | Implemented |

## Monitoring

| Control | Implementation | Status |
|---------|----------------|--------|
| Security events | `SecurityEvent` model + dashboard | Phase 9 |
| Security incidents | `SecurityIncident` + API | Phase 9 |
| Audit log | `AuditEvent` append-only | Implemented |
| Health checks | `/api/health`, `/api/health/ready` | Phase 9 |

## Data lifecycle

| Control | Implementation | Status |
|---------|----------------|--------|
| Retention policies | `RetentionPolicy` + defaults | Phase 9 |
| Legal hold | `LegalHold`, deletion guard | Phase 9 |
| Financial immutability | Model hooks on posted entries | Phase 7 |

## Production boundaries

Production must reject: test OTP, seed scripts, `INTEGRATIONS_USE_MOCKS=true`, debug routes, dev login codes (`devCode` hidden in production login response).
