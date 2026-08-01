# Operator runbook

## Local start

```powershell
npm.cmd ci
npm.cmd run dev
```

Open `http://localhost:3000/workspace`, run the 24 controls, and inspect the bad and clean receipts. The expected result is 24/24 expectations met, zero external calls, and one stable run digest.

## Verification

```powershell
npm.cmd run control:consent
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run e2e
```

Run the complete corpus twice and compare `evidenceDigest`. The test suite enforces the equality.

## Critical mutation control

The consent detector is the critical authority boundary. Its disabled-detector run must fail:

```powershell
$env:ACTIVATIONPROOF_DISABLE_DETECTOR='CV-R4'
npm.cmd run control:consent
Remove-Item Env:ACTIVATIONPROOF_DISABLE_DETECTOR
npm.cmd run control:consent
```

Expected: the first command exits non-zero because the opted-out bad fixture escapes; the restored command exits zero.

## Recovery

- UI request failure: no result is promoted; retry preserves the prior completed receipt.
- Cancelled run: partial results are discarded.
- Detector unhealthy: keep promotion blocked and repair the named detector.
- Digest drift or missing rollback: retain the last accepted contract; do not authorize sandbox action.
- Indeterminate provider state in a future adapter: query by stable operation key; never blind retry.
- Persistence rollback: review `supabase/rollback/202608010001_activation_proof.down.sql`, preserve evidence first, and require separate provider authority. It is not an automatic recovery command.

## Production boundary

There is no deployment runbook because deployment is not authorized. A future release must add authentication, tenancy, applied and verified RLS, provider security review, environment-shape validation without values, exact deployed-commit proof, smoke tests, and an operator-owned rollback.
