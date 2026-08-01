export type PersistenceAction =
  | "membership:read"
  | "contract:read"
  | "contract:create"
  | "contract:update"
  | "run:read"
  | "run:create"
  | "receipt:read"
  | "receipt:create";

export interface AuthorizationSubject {
  userId: string;
  tenantIds: string[];
}

export interface AuthorizationRecord {
  tenantId: string;
  userId?: string;
  ownerId?: string;
  createdBy?: string;
}

export function canAccessPersistence(subject: AuthorizationSubject, action: PersistenceAction, record: AuthorizationRecord): boolean {
  const isMember = subject.tenantIds.includes(record.tenantId);
  if (!isMember) return false;
  switch (action) {
    case "membership:read":
      return record.userId === subject.userId;
    case "contract:create":
    case "contract:update":
      return record.ownerId === subject.userId;
    case "run:create":
      return record.createdBy === subject.userId;
    case "contract:read":
    case "run:read":
    case "receipt:read":
    case "receipt:create":
      return true;
  }
}
