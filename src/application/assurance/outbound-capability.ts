import type { OutboundCapability } from "@/domain/assurance";

export class DenyAllOutboundCapability implements OutboundCapability {
  private attempts = 0;
  private completedCalls = 0;

  get attemptCount() {
    return this.attempts;
  }

  get successfulCallCount() {
    return this.completedCalls;
  }

  request(operation: string): never {
    return this.deny(operation);
  }

  runGuarded<T>(operation: () => T): T {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, "fetch");
    const guardedFetch = (() => this.deny("globalThis.fetch")) as typeof fetch;
    Object.defineProperty(globalThis, "fetch", { configurable: true, writable: true, value: guardedFetch });
    try {
      return operation();
    } finally {
      if (descriptor) Object.defineProperty(globalThis, "fetch", descriptor);
      else delete (globalThis as { fetch?: typeof fetch }).fetch;
    }
  }

  private deny(operation: string): never {
    this.attempts += 1;
    throw new Error(`OUTBOUND_CAPABILITY_DENIED:${operation}`);
  }
}
