import { describe, expect, it } from "vitest";
import { canAccessPersistence, type AuthorizationSubject, type PersistenceAction } from "@/persistence/authorization";

const architect: AuthorizationSubject = { userId: "user_architect", memberships: [{ tenantId: "tenant_a", role: "architect" }] };
const reviewer: AuthorizationSubject = { userId: "user_reviewer", memberships: [{ tenantId: "tenant_a", role: "reviewer" }] };
const operator: AuthorizationSubject = { userId: "user_operator", memberships: [{ tenantId: "tenant_a", role: "operator" }] };
const approver: AuthorizationSubject = { userId: "user_approver", memberships: [{ tenantId: "tenant_a", role: "approver" }] };
const outsider: AuthorizationSubject = { userId: "user_outsider", memberships: [{ tenantId: "tenant_b", role: "architect" }] };
const anonymous: AuthorizationSubject = { userId: null, memberships: [] };

describe("executable persistence authorization matrix", () => {
  it.each([
    [architect, "contract:read", { tenantId: "tenant_a", ownerId: "user_architect" }, true],
    [reviewer, "contract:read", { tenantId: "tenant_a", ownerId: "user_architect" }, true],
    [approver, "contract:read", { tenantId: "tenant_a", ownerId: "user_architect" }, true],
    [outsider, "contract:read", { tenantId: "tenant_a", ownerId: "user_architect" }, false],
    [anonymous, "contract:read", { tenantId: "tenant_a", ownerId: "user_architect" }, false],
    [architect, "contract:update", { tenantId: "tenant_a", ownerId: "user_architect" }, true],
    [reviewer, "contract:update", { tenantId: "tenant_a", ownerId: "user_architect" }, false],
    [operator, "contract:update", { tenantId: "tenant_a", ownerId: "user_operator" }, false],
    [architect, "contract:update", { tenantId: "tenant_b", ownerId: "user_architect" }, false],
    [architect, "run:create", { tenantId: "tenant_a", createdBy: "user_architect" }, true],
    [operator, "run:create", { tenantId: "tenant_a", createdBy: "user_operator" }, true],
    [reviewer, "run:create", { tenantId: "tenant_a", createdBy: "user_reviewer" }, false],
    [operator, "receipt:create", { tenantId: "tenant_a" }, true],
    [reviewer, "receipt:create", { tenantId: "tenant_a" }, false],
    [outsider, "receipt:create", { tenantId: "tenant_a" }, false],
    [architect, "membership:read", { tenantId: "tenant_a", userId: "user_architect" }, true],
    [architect, "membership:read", { tenantId: "tenant_a", userId: "user_reviewer" }, false],
  ] as Array<[AuthorizationSubject, PersistenceAction, { tenantId: string; ownerId?: string; createdBy?: string; userId?: string }, boolean]>)
  ("evaluates %s for %s", (subject, action, record, expected) => {
    expect(canAccessPersistence(subject, action, record)).toBe(expected);
  });
});
