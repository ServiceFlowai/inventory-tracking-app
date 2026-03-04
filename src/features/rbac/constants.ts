import { Permission, Role } from './types';

const basePermissions: Record<string, Permission[]> = {
  Admin: [
    { resource: 'inventory', actions: ['view', 'create', 'update', 'delete', 'export'] },
    { resource: 'orders', actions: ['view', 'create', 'update', 'delete', 'approve'] },
    { resource: 'alerts', actions: ['view', 'create', 'update', 'delete'] },
    { resource: 'reports', actions: ['view', 'export'] },
  ],
  'Warehouse Manager': [
    { resource: 'inventory', actions: ['view', 'update', 'export'] },
    { resource: 'orders', actions: ['view', 'create', 'update', 'approve'] },
    { resource: 'alerts', actions: ['view', 'update'] },
    { resource: 'reports', actions: ['view', 'export'] },
  ],
  'Warehouse Staff': [
    { resource: 'inventory', actions: ['view', 'update'] },
    { resource: 'orders', actions: ['view', 'create'] },
    { resource: 'alerts', actions: ['view'] },
    { resource: 'reports', actions: ['view'] },
  ],
  Viewer: [
    { resource: 'inventory', actions: ['view'] },
    { resource: 'orders', actions: ['view'] },
    { resource: 'alerts', actions: ['view'] },
    { resource: 'reports', actions: ['view', 'export'] },
  ],
};

export const DEFAULT_ROLES: Role[] = Object.entries(basePermissions).map(([name, permissions]) => ({
  id: name.toLowerCase().replace(/\s+/g, '-'),
  name,
  permissions,
  isCustom: false,
  description: `${name} default role`,
}));

export const PERMISSION_RESOURCES: Permission['resource'][] = ['inventory', 'orders', 'alerts', 'reports'];
export const PERMISSION_ACTIONS: Permission['actions'] = ['view', 'create', 'update', 'delete', 'approve', 'export'];
