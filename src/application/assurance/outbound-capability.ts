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
    const guardedNames = ["fetch", "WebSocket", "EventSource", "XMLHttpRequest"] as const;
    const descriptors = guardedNames.map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)] as const);
    const deny = this.deny.bind(this);
    for (const name of guardedNames) {
      function guardedTransport() {
        return deny(`globalThis.${name}`);
      }
      Object.defineProperty(globalThis, name, { configurable: true, writable: true, value: guardedTransport });
    }
    try {
      return operation();
    } finally {
      for (const [name, descriptor] of descriptors) {
        if (descriptor) Object.defineProperty(globalThis, name, descriptor);
        else delete (globalThis as unknown as Record<string, unknown>)[name];
      }
    }
  }

  private deny(operation: string): never {
    this.attempts += 1;
    throw new Error(`OUTBOUND_CAPABILITY_DENIED:${operation}`);
  }
}
