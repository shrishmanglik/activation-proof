-- Proposed persistence boundary. Not applied to any provider by this repository.
create extension if not exists pgcrypto;

create table public.tenant_memberships (
  tenant_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('architect', 'reviewer', 'approver', 'operator')),
  created_at timestamptz not null default now(),
  primary key (tenant_id, user_id)
);

create table public.journey_contracts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  contract_key text not null,
  version integer not null check (version > 0),
  state text not null check (state in ('DRAFT', 'REVIEW_READY', 'ACCEPTED', 'SUPERSEDED', 'REVOKED')),
  contract_digest text not null check (contract_digest like 'sha256:%'),
  contract_json jsonb not null,
  owner_id uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  unique (tenant_id, contract_key, version),
  unique (tenant_id, id)
);

create table public.assurance_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  journey_contract_id uuid not null,
  corpus_digest text not null check (corpus_digest like 'sha256:%'),
  engine_version text not null,
  terminal_state text not null check (terminal_state in ('QUEUED', 'RUNNING', 'BLOCKED', 'INDETERMINATE', 'PASSED', 'FAILED', 'CANCELLED')),
  evidence_digest text check (evidence_digest is null or evidence_digest like 'sha256:%'),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  unique (tenant_id, journey_contract_id, corpus_digest, engine_version),
  unique (tenant_id, id),
  foreign key (tenant_id, journey_contract_id) references public.journey_contracts(tenant_id, id)
);

create table public.decision_receipts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  assurance_run_id uuid not null,
  fixture_id text not null,
  requirement_id text not null,
  detector_id text not null,
  decision text not null check (decision in ('PASS', 'REJECT', 'UNKNOWN')),
  detector_health text not null check (detector_health in ('HEALTHY', 'UNHEALTHY', 'UNKNOWN')),
  evidence_digest text not null check (evidence_digest like 'sha256:%'),
  receipt_json jsonb not null,
  created_at timestamptz not null default now(),
  unique (tenant_id, assurance_run_id, fixture_id),
  foreign key (tenant_id, assurance_run_id) references public.assurance_runs(tenant_id, id)
);

alter table public.tenant_memberships enable row level security;
alter table public.journey_contracts enable row level security;
alter table public.assurance_runs enable row level security;
alter table public.decision_receipts enable row level security;

create policy tenant_memberships_select_self on public.tenant_memberships
  for select using (user_id = auth.uid());

create policy journey_contracts_tenant_read on public.journey_contracts
  for select using (tenant_id in (select tenant_id from public.tenant_memberships where user_id = auth.uid()));
create policy journey_contracts_owner_write on public.journey_contracts
  for insert with check (owner_id = auth.uid() and tenant_id in (select tenant_id from public.tenant_memberships where user_id = auth.uid()));
create policy journey_contracts_owner_update on public.journey_contracts
  for update
  using (owner_id = auth.uid() and tenant_id in (select tenant_id from public.tenant_memberships where user_id = auth.uid()))
  with check (owner_id = auth.uid() and tenant_id in (select tenant_id from public.tenant_memberships where user_id = auth.uid()));

create policy assurance_runs_tenant_read on public.assurance_runs
  for select using (tenant_id in (select tenant_id from public.tenant_memberships where user_id = auth.uid()));
create policy assurance_runs_creator_write on public.assurance_runs
  for insert with check (created_by = auth.uid() and tenant_id in (select tenant_id from public.tenant_memberships where user_id = auth.uid()));

create policy decision_receipts_tenant_read on public.decision_receipts
  for select using (tenant_id in (select tenant_id from public.tenant_memberships where user_id = auth.uid()));
create policy decision_receipts_creator_write on public.decision_receipts
  for insert with check (tenant_id in (select tenant_id from public.tenant_memberships where user_id = auth.uid()));

revoke all on public.tenant_memberships, public.journey_contracts, public.assurance_runs, public.decision_receipts from anon;
grant select, insert, update on public.journey_contracts to authenticated;
grant select, insert on public.assurance_runs, public.decision_receipts to authenticated;
grant select on public.tenant_memberships to authenticated;
