# Initial build evidence manifest

This manifest separates evidence classes. A stronger class never inherits from a weaker one.

## Source blueprint

- Source: governed private application artifact; not copied into this public repository.
- SHA-256: `1E343DC7EAD63A69F31F76910F63343F787AD5EAF6D39D515DB486752CBF077F`.
- Public boundary: employer context was used as design input only and removed from product claims.

## Local truth

- Workspace: isolated task checkout on `dev/activation-proof-initial-build`.
- Base: `main@10a4c8e58c7626f6ae17ca1ac867e913a737a4f8`.
- Canonical authority root correction: original dispatch named absent `C:\MDS`; current `C:\AGI` canon explicitly superseded it. Corrected `GAP`, not a mirror substitution.
- Product-quality reference: Vedic Astro Studio local `main@fd397bddc18507728d4a2e33196b8d21b4621e85`, clean and aligned with GitHub at inspection. Its README status was stale, so only current registry, runtime-path, QA-gate, claim-ceiling, and release/recovery patterns were used.
- `npm.cmd audit --audit-level=high`: exit 0, `found 0 vulnerabilities`. Next 16.2.12's vulnerable transitive PostCSS/Sharp versions were replaced by bounded lockfile overrides and revalidated.
- `npm.cmd run typecheck`: exit 0.
- `npm.cmd run lint`: exit 0, zero warnings.
- `npm.cmd test`: exit 0, 5 files and 40 tests passed.
- Disabled critical detector: `ACTIVATIONPROOF_DISABLE_DETECTOR=CV-R4 npm.cmd run control:consent` equivalent PowerShell run exited 1; one of two tests failed because the opted-out fixture incorrectly returned `PASS` instead of `REJECT`.
- Restored critical detector: `npm.cmd run control:consent` ran twice; each run exited 0 with 2/2 tests passed.
- `npm.cmd run build`: exit 0; Next.js 16.2.12 compiled successfully and emitted nine routes, including the typed assurance API and six public product surfaces.
- `npm.cmd run e2e`: exit 0; 6/6 desktop/mobile journeys passed, including keyboard activation, 390px no-overflow, and serious/critical Axe checks on overview and completed workspace.
- `npm.cmd run e2e:update-screenshot`: exit 0; 2/2 screenshot journeys passed. Desktop overview and 390px completed-workflow images were inspected locally.
- Secret scan: known-positive pattern matched before the repository scan returned zero matches.
- Public-context scan: zero employer, application-package, or retired-brand references.
- Fresh-clone proof from pushed branch commit `2c3c822a0c483837b922dd0337394c43a3afcc1a`: `npm.cmd ci` installed the lockfile with zero vulnerabilities; 40/40 tests passed; the production build emitted nine routes; and the primary desktop/mobile browser journey passed 6/6. The first install attempt ran from the wrong working directory and exited 1 before installation; it is recorded as harness error and not counted as product proof.

## GitHub truth

- Repository: `shrishmanglik/activation-proof`.
- Visibility observed before clone: `PUBLIC`.
- Branch: `dev/activation-proof-initial-build`.
- Implementation commit: `2c3c822a0c483837b922dd0337394c43a3afcc1a`.
- Pull request: `https://github.com/shrishmanglik/activation-proof/pull/1`.
- Hosted CI: pending one authorized PR validation at the time of this manifest update. A workflow file is not proof that hosted steps ran.

## Provider truth

- Deployment: `UNKNOWN` and not authorized.
- Supabase project/schema/RLS installation: `UNKNOWN`; no provider mutation performed.
- Authentication, payment, billing, external integrations, customers, usage, reliability, cost, demand, and revenue: `UNKNOWN`.
