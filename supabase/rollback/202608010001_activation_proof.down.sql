-- Destructive rollback plan for review only. Never run against a provider without explicit authority and preservation proof.
drop table if exists public.decision_receipts;
drop table if exists public.assurance_runs;
drop table if exists public.journey_contracts;
drop table if exists public.tenant_memberships;
