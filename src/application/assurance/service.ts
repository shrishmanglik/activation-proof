import type { AssuranceRun } from "@/domain/assurance";

export interface RunAssuranceRequest {
  fixtureCorpus: "synthetic-renewal-v1";
}

export interface AssuranceService {
  run(request: RunAssuranceRequest): Promise<AssuranceRun>;
}
