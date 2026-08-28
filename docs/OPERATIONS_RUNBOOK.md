# Operations Runbook

## Daily

- Check `/api/health/ready` and integration health (`/api/integrations/health`).
- Review security dashboard (`/admin/security`) — failed logins, open incidents.
- Review failed integration jobs and webhook errors.

## Weekly

- Review open `SecurityIncident` records.
- Confirm backup completion with provider console.
- Review dependency audit (`npm audit`).

## Monthly

- Staging restore test → `BackupVerification`.
- Access review sampling (`AccessReview` records).
- Review retention policy versions.

## Common procedures

### Lock compromised account

1. Admin → Users → suspend user.
2. Revoke sessions (security API / admin tooling).
3. Create security incident.
4. Force password reset on re-enable.

### Disable integration

1. Admin → Integrations → disable feature flag or connection.
2. Rotate webhook secret if webhook abuse suspected.
3. Log security event.

### High error rate

1. Check application logs and `/api/health/ready`.
2. Check MongoDB and object storage status.
3. Consider rollback per `ROLLBACK.md`.

### Legal hold

1. Create `LegalHold` with scope (orgs, transactions, documents).
2. Deletion APIs call `assertDeletionAllowed`.
3. Release hold with authorized user and `releaseReason`.

## Monitoring endpoints

| Endpoint | Purpose |
|----------|---------|
| `/api/health` | Liveness |
| `/api/health/ready` | DB + production config |
| `/api/integrations/health` | Provider status (auth required) |
| `/api/security/dashboard` | Security metrics (auth required) |

## On-call contacts

Configure per environment in internal ops wiki (not in repository).

## Log redaction

Logs must not contain passwords, OTPs, tokens, full banking credentials, or signed URLs. Use `sanitizeSecurityMetadata` pattern for security events.
