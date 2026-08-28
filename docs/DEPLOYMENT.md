# Deployment

## Pre-deployment checklist

1. Verify environment variables (see checklist below).
2. Confirm database backup completed.
3. Review migrations (`npm run build` includes validation in CI).
4. Build production artifacts (`npm run build`).
5. Run full test suite and phase9 production mock check.
6. Obtain release approval (`release:approve` permission).
7. Record `ReleaseRecord` with commit SHA and test summary.

## Deployment order

1. Deploy backend/workers (Next.js server + job workers).
2. Apply reviewed database migrations.
3. Deploy frontend/static assets.
4. Verify `/api/health` and `/api/health/ready`.
5. Run production smoke tests (synthetic data only).
6. Monitor errors and latency 24–48h.

## Environment variables (production)

| Variable | Required | Notes |
|----------|----------|-------|
| `NODE_ENV` | Yes | `production` |
| `MONGODB_URI` | Yes | Production cluster |
| `SESSION_SECRET` | Yes | ≥ 32 chars, rotated on compromise |
| `INTEGRATIONS_USE_MOCKS` | Yes | Must be `false` |
| `GEMINI_API_KEY` | If AI enabled | Server-side only |
| `VESPER_API_KEY` | If market data | Licensed use |
| `ESIGNATURE_*` | If e-sign live | DocuSign or approved provider |
| Storage credentials | Yes | Private bucket |
| Email/SMS | Yes | Production providers |

Never expose API secrets in `NEXT_PUBLIC_*` variables.

## Providers

Configure production credentials per `docs/PROVIDER_SETUP.md`. Disable development mocks.

## Smoke tests

See `docs/GO_LIVE_CHECKLIST.md` — homepage, login, MFA, protected routes, file auth, isolation.

## Post-deploy

- Watch security dashboard for failed logins and unauthorized attempts.
- Confirm backup job success.
- Remove or tag smoke-test records per retention policy.
