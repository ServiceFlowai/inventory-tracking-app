import { useMemo } from 'react';
import { PermissionAction, PermissionResource } from './types';
import { useRbac } from './RbacContext';

export const useCan = (roleId: string | undefined, resource: PermissionResource, action: PermissionAction): boolean => {
  const { hasPermission } = useRbac();
  return useMemo(() => {
    if (!roleId) return false;
    return hasPermission(roleId, resource, action);
  }, [roleId, resource, action, hasPermission]);
};
