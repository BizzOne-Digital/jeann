# Go-Live Checklist

Do not approve go-live unless all items are checked or formally accepted with documented risk acceptance.

## Security

- [ ] Tenant-isolation tests pass (`tenant-isolation.test.ts`)
- [ ] Authentication tests pass (lockout, MFA for required roles)
- [ ] MFA works for Super Admin and privileged roles
- [ ] Signed-document immutability verified
- [ ] Posted-financial-entry immutability verified
- [ ] Private-file authorization verified
- [ ] Webhook signature verification verified
- [ ] `INTEGRATIONS_USE_MOCKS=false` in production
- [ ] No hardcoded secrets in repository (CI scan)
- [ ] `SESSION_SECRET` ≥ 32 characters
- [ ] Security dashboard operational
- [ ] Incident response contacts documented

## Data and operations

- [ ] Backup configured and recent
- [ ] Staging restore test succeeded (`BackupVerification`)
- [ ] Retention policies reviewed by legal/compliance
- [ ] Monitoring and alerting active
- [ ] Health/readiness endpoints monitored

## QA

- [ ] Critical/high defects resolved or accepted
- [ ] Role-based UAT signed off (`ReleaseRecord`)
- [ ] Production smoke tests pass (synthetic accounts)
- [ ] Cross-browser smoke on Chrome, Edge, Firefox, mobile

## Business and legal

- [ ] Contract templates reviewed by authorized professionals
- [ ] Tax configuration reviewed by accountant
- [ ] Bank workflows reviewed with advisers/banks
- [ ] Provider licences and credentials approved

## Release

- [ ] Rollback plan ready (`ROLLBACK.md`)
- [ ] `ReleaseRecord` approved (`release:approve`)
- [ ] Post-launch monitoring plan active

## External assessment

- [ ] Independent penetration test scheduled or completed (recommended before highly sensitive real data)

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Super Admin | | | |
| Security lead | | | |
| Operations | | | |
