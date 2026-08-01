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
- Initial branch proof: `npm.cmd test` exited 0 with 5 files and 40 tests passed.
- First remediation proof at `bd2b761de0d0b6fd46f728211d1244ddf9e50dd3`: `npm.cmd test` exited 0 with 8 files and 63 tests passed. A second distinct review rejected that commit because global member fetch remained a bypass, release authority was synthesized from role slots, mutation coverage was indirect, and the authorization matrix was not actually role-aware.
- Second remediation proof: `npm.cmd test` exited 0 with 9 files and 79 tests passed. It adds a runtime global-fetch guard, static bypass mutations, explicit `UNKNOWN` human authority, proof that the compiler manufactures no approval/recovery receipts, independent data/scenario/trace/contract digest mutations, and role-aware SQL plus executable authorization decisions.
- Disabled critical detector: `ACTIVATIONPROOF_DISABLE_DETECTOR=CV-R4 npm.cmd run control:consent` equivalent PowerShell run exited 1; one of two tests failed because the opted-out fixture incorrectly returned `PASS` instead of `REJECT`.
- Restored critical detector: `npm.cmd run control:consent` ran twice; each run exited 0 with 2/2 tests passed.
- `npm.cmd run build`: exit 0; Next.js 16.2.12 compiled successfully and emitted eleven routes, including journey-contract, assurance-run, and handoff-replay APIs plus six public product surfaces.
- `npm.cmd run e2e`: exit 0; 6/6 desktop/mobile journeys passed, including contract sealing, 24-control execution, handoff replay, keyboard activation, 390px no-overflow, and serious/critical Axe checks.
- `npm.cmd run e2e:update-screenshot`: exit 0; 2/2 screenshot journeys passed. Desktop overview and 390px completed-workflow images were inspected locally.
- Secret scan: known-positive pattern matched before the repository scan returned zero matches.
- Public-context scan: zero employer, application-package, or retired-brand references.
- Fresh-clone proof from pushed branch commit `2c3c822a0c483837b922dd0337394c43a3afcc1a`: `npm.cmd ci` installed the lockfile with zero vulnerabilities; 40/40 tests passed; the production build emitted nine routes; and the primary desktop/mobile browser journey passed 6/6. The first install attempt ran from the wrong working directory and exited 1 before installation; it is recorded as harness error and not counted as product proof.

## Distinct review and remediation

- First distinct reviewer verdict: `REVISE`.
- Finding 1: receipts omitted semantic fixture input and full decision trace. Remediation: normalized input, scenario, trace, and contract digests are now receipt fields; a same-shape semantic mutation must change receipt and run digests.
- Finding 2: zero external calls was asserted rather than enforced. Remediation: every detector receives a deny-all outbound capability; an attempted call increments a counter, fails the run, performs zero calls, and prevents receipt sealing. Detector lint rules reject direct network globals/imports.
- Finding 3: the fixed corpus was not an operator handoff. Remediation: the workspace now authors and seals a bounded synthetic contract, compiles it into the controls, exports a digest-bound handoff, and replays it through a typed API.
- Finding 4: child persistence references were not provably tenant-consistent. Remediation: composite tenant/parent foreign keys plus an executable authorization matrix.
- Second distinct reviewer verdict on `bd2b761de0d0b6fd46f728211d1244ddf9e50dd3`: `REVISE`. The reviewer independently passed 63 tests, typecheck, lint, an eleven-route build, 6/6 E2E, audit, and the critical detector mutation, but proved the adjacent-check gaps above.
- Second remediation: synchronous runtime interception and lint mutations block direct/global/dynamic outbound surfaces; CV-R10 returns `UNKNOWN` without real human receipts; direct mutations cover scenario, full trace, and contract binding; SQL and pure authorization tests enforce named membership roles.
- A new distinct review is required on the exact second-remediation commit before push; the builder does not self-review.

## GitHub truth

- Repository: `shrishmanglik/activation-proof`.
- Visibility observed before clone: `PUBLIC`.
- Branch: `dev/activation-proof-initial-build`.
- Implementation commit: `2c3c822a0c483837b922dd0337394c43a3afcc1a`.
- Pull request: `https://github.com/shrishmanglik/activation-proof/pull/1`.
- Authorized hosted CI run: `30700760250`, `success`, exact head `530b6d80a2ea266ee7ec2930b723d1196eb93932`. The `validate` job executed checkout, locked install, typecheck, lint, 40 tests, a nine-route production build, Chromium install, and 6/6 desktop/mobile journeys. This proves that historical PR head only.
- Corrective hosted CI for the remediation head: not run at this point. Local remediation proof does not inherit the historical hosted result.

## Provider truth

- Deployment: `UNKNOWN` and not authorized.
- Supabase project/schema/RLS installation: `UNKNOWN`; no provider mutation performed.
- Authentication, payment, billing, external integrations, customers, usage, reliability, cost, demand, and revenue: `UNKNOWN`.
