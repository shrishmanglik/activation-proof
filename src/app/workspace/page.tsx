import { ActivationProofWorkspace } from "@/components/activation-proof-workspace";
import { PageHeading } from "@/components/page-heading";

export default function WorkspacePage() {
  return <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><PageHeading eyebrow="PRIMARY WORKFLOW" title="Prove the control before trusting the clean result." description="Run one complete, synthetic CDP-to-lifecycle renewal journey. The engine challenges every detector with a bad fixture, then accepts the clean control only when the deterministic contract holds." /><ActivationProofWorkspace /></section>;
}
