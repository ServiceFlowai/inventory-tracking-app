import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_ROLES } from './constants';
import { createRole, deleteRole, fetchRoles, updateRole } from './api';
import { Permission, PermissionAction, PermissionResource, Role, RolePayload } from './types';

interface RbacContextValue {
  roles: Role[];
  isLoading: boolean;
  error?: string;
  createCustomRole: (payload: RolePayload) => Promise<void>;
  updateRolePermissions: (roleId: string, payload: RolePayload) => Promise<void>;
  deleteRole: (roleId: string) => Promise<void>;
  hasPermission: (roleId: string, resource: PermissionResource, action: PermissionAction) => boolean;
}

const RbacContext = createContext<RbacContextValue | undefined>(undefined);

const normalisePermissions = (permissions: Permission[]): Permission[] => {
  const map = new Map<PermissionResource, Set<PermissionAction>>();
  permissions.forEach((permission) => {
    if (!map.has(permission.resource)) {
      map.set(permission.resource, new Set(permission.actions));
    } else {
      const existing = map.get(permission.resource)!;
      permission.actions.forEach((action) => existing.add(action));
    }
  });

  return Array.from(map.entries()).map(([resource, actions]) => ({
    resource,
    actions: Array.from(actions.values()).sort(),
  }));
};

export const RbacProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchRoles()
      .then((remoteRoles) => {
        if (isMounted) {
          setRoles((prev) => {
            if (!remoteRoles.length) {
              return prev;
            }
            return remoteRoles.map((role) => ({
              ...role,
              permissions: normalisePermissions(role.permissions),
            }));
          });
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load roles');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const createCustomRole = useCallback(async (payload: RolePayload) => {
    setIsLoading(true);
    try {
      const created = await createRole({
        ...payload,
        permissions: normalisePermissions(payload.permissions),
      });
      setRoles((prev) => [...prev, created]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create role');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateRolePermissions = useCallback(async (roleId: string, payload: RolePayload) => {
    setIsLoading(true);
    try {
      const updated = await updateRole(roleId, {
        ...payload,
        permissions: normalisePermissions(payload.permissions),
      });
      setRoles((prev) => prev.map((role) => (role.id === roleId ? updated : role)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update role');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeRole = useCallback(async (roleId: string) => {
    setIsLoading(true);
    try {
      await deleteRole(roleId);
      setRoles((prev) => prev.filter((role) => role.id !== roleId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete role');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const hasPermission = useCallback(
    (roleId: string, resource: PermissionResource, action: PermissionAction) => {
      const role = roles.find((item) => item.id === roleId);
      if (!role) return false;
      return role.permissions.some((permission) => permission.resource === resource && permission.actions.includes(action));
    },
    [roles]
  );

  const value = useMemo<RbacContextValue>(
    () => ({
      roles,
      isLoading,
      error,
      createCustomRole,
      updateRolePermissions,
      deleteRole: removeRole,
      hasPermission,
    }),
    [roles, isLoading, error, createCustomRole, updateRolePermissions, removeRole, hasPermission]
  );

  return <RbacContext.Provider value={value}>{children}</RbacContext.Provider>;
};

export const useRbac = (): RbacContextValue => {
  const context = useContext(RbacContext);
  if (!context) {
    throw new Error('useRbac must be used within an RbacProvider');
  }
  return context;
};
