export type PersistenceAction =
  | "membership:read"
  | "contract:read"
  | "contract:create"
  | "contract:update"
  | "run:read"
  | "run:create"
  | "receipt:read"
  | "receipt:create";

export type MembershipRole = "architect" | "reviewer" | "approver" | "operator";

export interface AuthorizationSubject {
  userId: string | null;
  memberships: Array<{ tenantId: string; role: MembershipRole }>;
}

export interface AuthorizationRecord {
  tenantId: string;
  userId?: string;
  ownerId?: string;
  createdBy?: string;
}

export function canAccessPersistence(subject: AuthorizationSubject, action: PersistenceAction, record: AuthorizationRecord): boolean {
  if (!subject.userId) return false;
  const membership = subject.memberships.find((entry) => entry.tenantId === record.tenantId);
  if (!membership) return false;
  switch (action) {
    case "membership:read":
      return record.userId === subject.userId;
    case "contract:create":
    case "contract:update":
      return membership.role === "architect" && record.ownerId === subject.userId;
    case "run:create":
      return ["architect", "operator"].includes(membership.role) && record.createdBy === subject.userId;
    case "receipt:create":
      return membership.role === "operator";
    case "contract:read":
    case "run:read":
    case "receipt:read":
      return true;
  }
}
