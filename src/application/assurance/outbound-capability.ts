import type { OutboundCapability } from "@/domain/assurance";

export class DenyAllOutboundCapability implements OutboundCapability {
  private attempts = 0;

  get attemptCount() {
    return this.attempts;
  }

  get successfulCallCount(): 0 {
    return 0;
  }

  request(operation: string): never {
    this.attempts += 1;
    throw new Error(`OUTBOUND_CAPABILITY_DENIED:${operation}`);
  }
}
