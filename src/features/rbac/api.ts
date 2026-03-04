import { AuditEvent, AuditEventFilters, Role, RolePayload } from './types';

const RBAC_BASE_URL = '/api/rbac';
const AUDIT_BASE_URL = '/api/audit';

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message ?? 'Request failed');
  }

  return response.json() as Promise<T>;
}

export async function fetchRoles(): Promise<Role[]> {
  return request<Role[]>(`${RBAC_BASE_URL}/roles`);
}

export async function createRole(payload: RolePayload): Promise<Role> {
  return request<Role>(`${RBAC_BASE_URL}/roles`, { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateRole(roleId: string, payload: RolePayload): Promise<Role> {
  return request<Role>(`${RBAC_BASE_URL}/roles/${roleId}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function deleteRole(roleId: string): Promise<void> {
  await request(`${RBAC_BASE_URL}/roles/${roleId}`, { method: 'DELETE' });
}

export async function fetchAuditEvents(filters: AuditEventFilters): Promise<AuditEvent[]> {
  const query = new URLSearchParams();
  if (filters.resourceType) query.set('resourceType', filters.resourceType);
  if (filters.actorId) query.set('actorId', filters.actorId);
  if (filters.start) query.set('start', filters.start);
  if (filters.end) query.set('end', filters.end);
  return request<AuditEvent[]>(`${AUDIT_BASE_URL}/events?${query.toString()}`);
}
