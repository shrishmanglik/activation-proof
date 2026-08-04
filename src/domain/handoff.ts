import type { AssuranceRun, EvidenceReceipt } from "@/domain/assurance";
import type { JourneyContract } from "@/domain/journey-contract";
import { verifyJourneyContract } from "@/domain/journey-contract";
import { digest } from "@/evidence/receipt";
import { compileSyntheticFixtures } from "@/application/assurance/compiler";
import { executeSyntheticCorpus } from "@/application/assurance/engine";

export interface HandoffBundle {
  schemaVersion: "HandoffBundle.v1";
  dataClass: "SYNTHETIC";
  authority: "LOCAL_REPLAY_ONLY";
  contract: JourneyContract;
  runEvidenceDigest: string;
  receipts: EvidenceReceipt[];
  exceptions: Array<{ code: string; ownerRole: string }>;
  replayInstructions: string[];
  recoveryProcedure: string;
  bundleDigest: string;
}

export interface ReplayReceipt {
  schemaVersion: "ReplayReceipt.v1";
  decision: "MATCH" | "REJECT";
  originalRunDigest: string;
  replayRunDigest: string | null;
  contractDigest: string;
  reason: string;
}

export function createHandoffBundle(contract: JourneyContract, run: AssuranceRun): HandoffBundle {
  const unsigned = {
    schemaVersion: "HandoffBundle.v1" as const,
    dataClass: "SYNTHETIC" as const,
    authority: "LOCAL_REPLAY_ONLY" as const,
    contract,
    runEvidenceDigest: run.evidenceDigest,
    receipts: run.results.flatMap((result) => result.receipt ? [result.receipt] : []),
    exceptions: [] as Array<{ code: string; ownerRole: string }>,
    replayInstructions: [
      "Verify the bundle digest before execution.",
      "Verify the embedded contract digest and local-only authority.",
      "Compile the repository-owned synthetic corpus from the embedded contract.",
      "Run all bad and clean controls and compare the complete run digest.",
    ],
    recoveryProcedure: contract.rollbackProcedure,
  };
  return { ...unsigned, bundleDigest: digest(unsigned) };
}

export function replayHandoffBundle(bundle: HandoffBundle): ReplayReceipt {
  const { bundleDigest, ...unsigned } = bundle;
  if (digest(unsigned) !== bundleDigest) return { schemaVersion: "ReplayReceipt.v1", decision: "REJECT", originalRunDigest: bundle.runEvidenceDigest, replayRunDigest: null, contractDigest: bundle.contract.contractDigest, reason: "BUNDLE_DIGEST_MISMATCH" };
  if (!verifyJourneyContract(bundle.contract)) return { schemaVersion: "ReplayReceipt.v1", decision: "REJECT", originalRunDigest: bundle.runEvidenceDigest, replayRunDigest: null, contractDigest: bundle.contract.contractDigest, reason: "CONTRACT_DIGEST_MISMATCH" };
  const replay = executeSyntheticCorpus(compileSyntheticFixtures(bundle.contract), { contractDigest: bundle.contract.contractDigest });
  return {
    schemaVersion: "ReplayReceipt.v1",
    decision: replay.evidenceDigest === bundle.runEvidenceDigest ? "MATCH" : "REJECT",
    originalRunDigest: bundle.runEvidenceDigest,
    replayRunDigest: replay.evidenceDigest,
    contractDigest: bundle.contract.contractDigest,
    reason: replay.evidenceDigest === bundle.runEvidenceDigest ? "DETERMINISTIC_REPLAY_MATCH" : "REPLAY_DIGEST_MISMATCH",
  };
}
