# Rollback Plan

## When to rollback

- Critical security defect (cross-tenant access, auth bypass, secret leak).
- Data-loss migration.
- Sustained error rate > threshold after deploy.
- Failed production smoke tests.

## Rollback steps

1. **Stop release** — Pause further migrations and deploys.
2. **Record** — Update `ReleaseRecord` status to `rolled_back`; note `rollbackReference` (previous version/commit).
3. **Application** — Redeploy previous known-good build artifact (container image or Vercel deployment pin).
4. **Database** — If migration was applied:
   - Prefer forward-fix if safe and faster.
   - Otherwise restore DB from pre-migration backup to recovery cluster, or run reviewed down migration (only if tested).
5. **Workers** — Roll back worker version to match application.
6. **Secrets** — Revert only if new secrets caused failure; rotate if compromised.
7. **Verify** — Health endpoints, smoke tests, tenant isolation tests on rolled-back version.
8. **Communicate** — Incident record per `INCIDENT_RESPONSE.md`.

## Prevention

- Blue/green or canary where infrastructure supports it.
- Migration review gate in CI/CD.
- Backup before every production migration.

## Rollback owners

Requires `deployment:approve` or Super Admin for production rollback authorization.
