export type PermissionResource = 'inventory' | 'orders' | 'alerts' | 'reports';
export type PermissionAction = 'view' | 'create' | 'update' | 'delete' | 'approve' | 'export';

export interface Permission {
  resource: PermissionResource;
  actions: PermissionAction[];
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  isCustom?: boolean;
  permissions: Permission[];
}

export interface UserRoleAssignment {
  userId: string;
  roleId: string;
  assignedAt: string;
  assignedBy: string;
}

export interface AuditEvent {
  id: string;
  occurredAt: string;
  actorId: string;
  actorName: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}

export interface AuditEventFilters {
  resourceType?: string;
  actorId?: string;
  start?: string;
  end?: string;
}

export interface RolePayload {
  name: string;
  description?: string;
  permissions: Permission[];
}
