# Backup and Disaster Recovery

## Requirements

| Requirement | Target | Notes |
|-------------|--------|-------|
| RPO (recovery point) | ≤ 24h (configure with provider) | MongoDB PITR if available |
| RTO (recovery time) | ≤ 4h for DB restore | Document actual after test |
| Backup encryption | Required | Provider-managed or customer KMS |
| Restore test | Monthly in staging | `BackupVerification` record |

## Components

- **Database** — Automated MongoDB backups (Atlas or ops-managed).
- **Object storage** — Versioning + cross-region if approved.
- **Secrets** — Secrets manager backup separate from DB.
- **Configuration** — Env documented in deployment checklist.

## Restore procedure (staging)

1. Identify backup snapshot / PITR timestamp.
2. Restore to isolated recovery cluster (never destructive on production).
3. Run application smoke tests against recovery URL.
4. Record `BackupVerification` with `restoreTestResult`.
5. Document errors in `errorSummary`.

## Production

Do **not** run destructive restore tests against production. Use provider restore-to-new-cluster workflows.

## Verification record

Store in `BackupVerification`: source, backup date, encryption status, verification date, result, tester, recovery location.

## Background jobs

After DB restore, verify queue/worker state; replay or clear dead-letter per runbook.
