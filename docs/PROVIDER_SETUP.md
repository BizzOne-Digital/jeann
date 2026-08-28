# Provider Setup — Phase 8

Configure integrations via environment variables. Secrets are never stored in MongoDB provider records.

## Required for production

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | Database |
| `SESSION_SECRET` | Auth (min 32 chars) |

## AI (Gemini)

| Variable | Example |
|----------|---------|
| `GEMINI_API_KEY` | API key |
| `GEMINI_ENABLED` | `true` |
| `GEMINI_MODEL` | `gemini-2.0-flash` |

Alternatively `GROQ_API_KEY` + `GROQ_ENABLED=true`.

## Development mocks

| Variable | Value |
|----------|-------|
| `INTEGRATIONS_USE_MOCKS` | `true` |
| `NODE_ENV` | `development` or `test` |

## Vesper market data

| Variable | Purpose |
|----------|---------|
| `VESPER_API_KEY` | Licensed API key |
| `VESPER_ENABLED` | `true` |

Do not scrape the Vesper website. Use only authorized API access.

## E-signature

| Variable | Purpose |
|----------|---------|
| `ESIGNATURE_PROVIDER` | e.g. `docusign` |
| `ESIGNATURE_API_KEY` | Provider API key |
| `ESIGNATURE_WEBHOOK_SECRET` | Webhook HMAC secret |

## Accounting

| Variable | Purpose |
|----------|---------|
| `ACCOUNTING_PROVIDER` | `development_mock` or future provider |
| `ACCOUNTING_PROVIDER_CONFIGURED` | `true` enables mock sync success in dev only |

## Shipping webhooks

| Variable | Purpose |
|----------|---------|
| `SHIPMENT_WEBHOOK_SECRET` | HMAC secret for tracking webhooks |

## Email / SMS

| Variable | Purpose |
|----------|---------|
| `EMAIL_PROVIDER` | `console`, `resend`, or `smtp` |
| `SMS_PROVIDER` | `none`, `console`, or `twilio` |

## Seed

```bash
npm run seed:phase8
```

Requires `seed:phase2` minimum. Sets feature flags and test integration records marked `DEVELOPMENT TEST RESPONSE — NOT FROM A REAL PROVIDER`.
