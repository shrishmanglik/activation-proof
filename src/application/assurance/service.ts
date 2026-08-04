import type { AssuranceRun } from "@/domain/assurance";
import type { JourneyContract } from "@/domain/journey-contract";

export interface RunAssuranceRequest {
  fixtureCorpus: "synthetic-renewal-v1";
  contract: JourneyContract;
}

export interface AssuranceService {
  run(request: RunAssuranceRequest): Promise<AssuranceRun>;
}
