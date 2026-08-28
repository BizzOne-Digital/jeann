# Data Retention

## Principles

- Retention periods are configurable via `RetentionPolicy` and require legal review for production.
- Legal hold (`LegalHold`) overrides normal deletion.
- User account deletion does not erase transaction records required for compliance.
- Deletion actions must be audited.

## Default categories (seeded)

| Category | Default retention | Trigger | Legal review |
|----------|-------------------|---------|--------------|
| audit_logs | 2555 days (~7y) | created | Yes |
| signed_contracts | 3650 days (~10y) | signed | Yes |
| financial_records | 2555 days | posted | Yes |
| cis_kyb | 1825 days (~5y) | submitted | Yes |
| temporary_uploads | 30 days | uploaded | No |
| security_incidents | 2555 days | created | Yes |

## Workflows

1. **Configure** — Super Admin / `security.retention.manage`.
2. **Archive** — Move to cold storage per `archiveBehavior` (provider-specific).
3. **Delete** — Approved workflow; `assertDeletionAllowed` checks legal hold.
4. **Export** — Data export requests logged; no automatic legal compliance claim.

## Object storage

Database retention decisions must drive object lifecycle. Orphan detection should run as scheduled job (operations).

## Temporary files

Quarantine and draft uploads should expire per `temporary_uploads` policy.
