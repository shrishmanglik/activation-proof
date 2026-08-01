# Security and privacy boundary

## Implemented controls

- Synthetic and tokenized fixtures only.
- Exactly zero external calls in every detector receipt.
- No credential entry UI, production adapter, webhook, or customer contact path.
- Typed API allowlist for the one repository-owned fixture corpus.
- Restricted handoff-field detector covering raw email and access-token field classes.
- Optional Supabase schema enables RLS on every application table and revokes anonymous access.
- CI and local tests inspect the table-to-RLS mapping.

## Deliberately absent

- Authentication and tenant creation.
- Secret storage or provider OAuth.
- Production connectors and webhooks.
- Customer PII or client configuration.
- Live Supabase project or applied migration.
- Production security review or compliance acceptance.

## Threat model for a future connected version

The primary risks are cross-tenant access, secret or PII leakage, consent bypass, unsafe identity merge, duplicate provider effects, evidence tampering, and prompt injection from imported source material. Connecting a provider requires a separately reviewed adapter contract, least-privilege credentials, idempotency and reconciliation proof, redaction, tenancy tests, and an explicit human authority record.

## Reporting a vulnerability

Do not include a secret, credential, customer record, or exploit payload in a public issue. Contact the repository owner through the security-reporting channel listed on the GitHub profile and provide only the minimum reproduction metadata needed to coordinate a private report.
