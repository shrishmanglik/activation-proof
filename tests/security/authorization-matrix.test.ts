import { describe, expect, it } from "vitest";
import { canAccessPersistence, type AuthorizationSubject, type PersistenceAction } from "@/persistence/authorization";

const owner: AuthorizationSubject = { userId: "user_owner", tenantIds: ["tenant_a"] };
const reviewer: AuthorizationSubject = { userId: "user_reviewer", tenantIds: ["tenant_a"] };
const outsider: AuthorizationSubject = { userId: "user_outsider", tenantIds: ["tenant_b"] };

describe("executable persistence authorization matrix", () => {
  it.each([
    [owner, "contract:read", { tenantId: "tenant_a", ownerId: "user_owner" }, true],
    [reviewer, "contract:read", { tenantId: "tenant_a", ownerId: "user_owner" }, true],
    [outsider, "contract:read", { tenantId: "tenant_a", ownerId: "user_owner" }, false],
    [owner, "contract:update", { tenantId: "tenant_a", ownerId: "user_owner" }, true],
    [reviewer, "contract:update", { tenantId: "tenant_a", ownerId: "user_owner" }, false],
    [owner, "contract:update", { tenantId: "tenant_b", ownerId: "user_owner" }, false],
    [owner, "run:create", { tenantId: "tenant_a", createdBy: "user_owner" }, true],
    [reviewer, "run:create", { tenantId: "tenant_a", createdBy: "user_owner" }, false],
    [reviewer, "receipt:create", { tenantId: "tenant_a" }, true],
    [outsider, "receipt:create", { tenantId: "tenant_a" }, false],
    [owner, "membership:read", { tenantId: "tenant_a", userId: "user_owner" }, true],
    [owner, "membership:read", { tenantId: "tenant_a", userId: "user_reviewer" }, false],
  ] as Array<[AuthorizationSubject, PersistenceAction, { tenantId: string; ownerId?: string; createdBy?: string; userId?: string }, boolean]>)
  ("evaluates %s for %s", (subject, action, record, expected) => {
    expect(canAccessPersistence(subject, action, record)).toBe(expected);
  });
});
