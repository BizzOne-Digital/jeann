# Integrations — Phase 8

Provider-neutral integration layer for AI, market data, e-signature, screening, shipping, accounting, email, and SMS.

## Architecture

All external capabilities use adapter interfaces in `src/lib/integrations/providers/`. Domain services (`ai-execution-service`, `market-data-service`, etc.) orchestrate providers and persist results. Frontend and portals never call providers directly.

## Feature flags

`IntegrationFeatureFlag` controls capabilities per environment. Disabling a flag does not delete historical records.

## Health dashboard

`GET /api/integrations/health` — Admin only (`integrations:manage`). Shows provider status, job queue, webhook stats, and feature flags.

## Development mocks

Set `INTEGRATIONS_USE_MOCKS=true` in non-production. All mock responses include:

`DEVELOPMENT TEST RESPONSE — NOT FROM A REAL PROVIDER`

Mocks cannot be enabled in production (`NODE_ENV=production`).

## Audit

Integration connect, AI execution, webhook receipt, screening review, and sync attempts are audited via `writeAuditEvent`.

See also: `docs/PROVIDER_SETUP.md`, `docs/WEBHOOK_SECURITY.md`, `docs/AI_GOVERNANCE.md`.
