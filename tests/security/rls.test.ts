import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const schema = readFileSync("supabase/migrations/202608010001_activation_proof.sql", "utf8");

describe("proposed Supabase persistence boundary", () => {
  const tables = [...schema.matchAll(/create table public\.(\w+)/g)].map((match) => match[1]);
  const rlsTables = [...schema.matchAll(/alter table public\.(\w+) enable row level security/g)].map((match) => match[1]);

  it("enables RLS on every declared table", () => {
    expect(tables).toEqual(["tenant_memberships", "journey_contracts", "assurance_runs", "decision_receipts"]);
    expect(rlsTables.sort()).toEqual([...tables].sort());
  });

  it.each(["tenant_memberships", "journey_contracts", "assurance_runs", "decision_receipts"])("declares a policy for %s", (table) => {
    expect(schema).toMatch(new RegExp(`create policy [\\s\\S]+? on public\\.${table}`));
  });

  it("revokes anonymous access to all application tables", () => {
    expect(schema).toContain("revoke all on public.tenant_memberships, public.journey_contracts, public.assurance_runs, public.decision_receipts from anon");
  });

  it("binds every child relationship to the same tenant", () => {
    expect(schema).toContain("foreign key (tenant_id, journey_contract_id) references public.journey_contracts(tenant_id, id)");
    expect(schema).toContain("foreign key (tenant_id, assurance_run_id) references public.assurance_runs(tenant_id, id)");
  });

  it("requires tenant membership on both sides of a contract update", () => {
    for (const checkoutShape of [schema.replace(/\r?\n/g, "\n"), schema.replace(/\r?\n/g, "\r\n")]) {
      const updatePolicy = checkoutShape.match(/create policy journey_contracts_owner_update[\s\S]+?;\r?\n/)?.[0] ?? "";
      expect(updatePolicy.match(/tenant_memberships/g)).toHaveLength(2);
    }
  });

  it("uses membership roles for every persistence write boundary", () => {
    expect(schema).toContain("role = 'architect'");
    expect(schema).toContain("role in ('architect', 'operator')");
    expect(schema).toContain("role = 'operator'");
  });
});
