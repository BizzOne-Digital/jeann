# Incident Response

## Roles

| Role | Responsibility |
|------|----------------|
| Incident commander | Super Admin or designated security lead |
| Responder | Security/operations with `security:manage` |
| Communications | General Manager (external notifications per policy) |
| Engineering | Containment patches, rollback |

## Workflow

1. **Detect** — Security event, monitoring alert, or user report.
2. **Create incident** — `/api/security/incidents` or admin security UI; record `INC-*` number.
3. **Classify severity** — critical / high / medium / low.
4. **Assign responder** — `assignedResponderIds` on `SecurityIncident`.
5. **Preserve evidence** — Do not delete logs, webhook payloads, or audit entries during containment.
6. **Contain** — Lock account, revoke sessions (`security.sessions.revoke`), disable integration.
7. **Revoke** — Compromised sessions, API keys, webhook secrets.
8. **Disable provider** — Feature flag or connection disable if provider compromised.
9. **Investigate** — `investigationNotes`, `evidenceReferences`.
10. **Recover** — Deploy fix, restore from backup if needed (non-prod test first).
11. **Validate** — Smoke tests, isolation tests.
12. **Notify** — Per legal/policy requirements (not automated).
13. **Close** — Status `closed`, `resolution`, `closedAt`.
14. **Post-incident review** — `postIncidentReview`, corrective actions in backlog.
15. **Corrective actions** — Track in release/incident records.

## Statuses

`open` → `investigating` → `contained` → `recovering` → `resolved` → `closed`

## Escalation

- **Critical** — Immediate commander + engineering; consider rollback.
- **High** — Within 4 hours.
- **Medium** — Within 1 business day.

## Contacts (configure per deployment)

Document in operations runbook: on-call phone, email, backup contact, provider support lines.
