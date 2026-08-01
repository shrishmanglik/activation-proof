import { syntheticFixtures } from "@/domain/fixtures";
import { PageHeading } from "@/components/page-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function RecordsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <PageHeading eyebrow="SOURCE RECORDS" title="A fixture ledger that cannot be mistaken for customer data." description="Every bundled record is repository-owned, tokenized, synthetic, and paired with an expected decision. No imported company, employer, provider, or customer dataset is present." />
      <div className="mt-10 grid gap-3 md:grid-cols-2">
        {syntheticFixtures.map((fixture) => <Card key={fixture.fixtureId}><CardContent className="p-5"><div className="flex flex-wrap items-center justify-between gap-3"><span className="font-mono text-sm font-bold">{fixture.fixtureId}</span><div className="flex gap-2"><Badge tone="neutral">SYNTHETIC</Badge><Badge tone={fixture.controlKind === "NEGATIVE" ? "fail" : "pass"}>{fixture.controlKind}</Badge></div></div><p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">{fixture.scenario}</p><p className="mt-4 text-xs font-semibold tracking-wide text-[var(--text-muted)]">EXPECTED: {fixture.expectedDecision} · {fixture.detectorId}</p></CardContent></Card>)}
      </div>
    </section>
  );
}
