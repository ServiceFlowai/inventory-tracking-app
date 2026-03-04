import React, { useMemo, useState } from 'react';
import { PERMISSION_ACTIONS, PERMISSION_RESOURCES } from '../constants';
import { useRbac } from '../RbacContext';
import { Permission, PermissionAction, PermissionResource, Role } from '../types';

interface EditableRole extends Role {
  isDirty?: boolean;
}

const createPermissionMatrix = (permissions: Permission[]): Record<PermissionResource, Set<PermissionAction>> => {
  return permissions.reduce<Record<PermissionResource, Set<PermissionAction>>>((matrix, permission) => {
    if (!matrix[permission.resource]) {
      matrix[permission.resource] = new Set(permission.actions);
    } else {
      permission.actions.forEach((action) => matrix[permission.resource].add(action));
    }
    return matrix;
  }, {} as Record<PermissionResource, Set<PermissionAction>>);
};

const RoleManagement: React.FC = () => {
  const { roles, isLoading, error, updateRolePermissions, createCustomRole, deleteRole } = useRbac();
  const [editingRoleId, setEditingRoleId] = useState<string>();
  const [draftPermissions, setDraftPermissions] = useState<Record<string, Record<PermissionResource, Set<PermissionAction>>>>({});
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');

  const getDraftMatrix = (role: Role) => {
    if (!draftPermissions[role.id]) {
      draftPermissions[role.id] = createPermissionMatrix(role.permissions);
    }
    return draftPermissions[role.id];
  };

  const isDirty = (role: Role) => {
    const matrix = getDraftMatrix(role);
    return PERMISSION_RESOURCES.some((resource) => {
      const original = role.permissions.find((permission) => permission.resource === resource)?.actions ?? [];
      const draft = Array.from(matrix[resource] ?? []);
      return original.length !== draft.length || original.some((action) => !draft.includes(action));
    });
  };

  const togglePermission = (role: Role, resource: PermissionResource, action: PermissionAction) => {
    setDraftPermissions((prev) => {
      const currentMatrix = { ...prev };
      const roleMatrix = currentMatrix[role.id] ? { ...currentMatrix[role.id] } : createPermissionMatrix(role.permissions);
      const actionSet = new Set(roleMatrix[resource] ?? []);
      if (actionSet.has(action)) {
        actionSet.delete(action);
      } else {
        actionSet.add(action);
      }
      roleMatrix[resource] = actionSet;
      currentMatrix[role.id] = roleMatrix;
      return currentMatrix;
    });
  };

  const persistChanges = async (role: Role) => {
    const matrix = draftPermissions[role.id] ?? createPermissionMatrix(role.permissions);
    const permissions: Permission[] = PERMISSION_RESOURCES.map((resource) => ({
      resource,
      actions: Array.from(matrix[resource] ?? []),
    }));
    await updateRolePermissions(role.id, {
      name: role.name,
      description: role.description,
      permissions,
    });
    setEditingRoleId(undefined);
    setDraftPermissions((prev) => {
      const next = { ...prev };
      delete next[role.id];
      return next;
    });
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;
    await createCustomRole({
      name: newRoleName.trim(),
      description: newRoleDescription.trim(),
      permissions: PERMISSION_RESOURCES.map((resource) => ({ resource, actions: [] })),
    });
    setNewRoleName('');
    setNewRoleDescription('');
  };

  const handleDeleteRole = async (role: Role) => {
    if (!role.isCustom) return;
    if (window.confirm(`Delete custom role “${role.name}”? This cannot be undone.`)) {
      await deleteRole(role.id);
    }
  };

  const sortedRoles = useMemo(() => roles.slice().sort((a, b) => a.name.localeCompare(b.name)), [roles]);

  return (
    <section className="panel" aria-label="Role management">
      <header className="panel__header">
        <div>
          <h2>Role-Based Access Control</h2>
          <p>Configure granular permissions by role.</p>
        </div>
      </header>
      <div className="panel__body">
        {error && <div className="alert alert--error">{error}</div>}
        {isLoading && <div className="panel__empty">Syncing roles…</div>}
        <div className="role-management__create">
          <h3>Create custom role</h3>
          <div className="role-management__create-form">
            <input
              type="text"
              placeholder="Role name"
              value={newRoleName}
              onChange={(event) => setNewRoleName(event.target.value)}
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newRoleDescription}
              onChange={(event) => setNewRoleDescription(event.target.value)}
            />
            <button className="btn btn-primary" type="button" onClick={handleCreateRole} disabled={!newRoleName.trim()}>
              Create Role
            </button>
          </div>
        </div>

        <div className="table-wrapper role-management__table">
          <table className="table" role="grid">
            <thead>
              <tr>
                <th scope="col">Role</th>
                <th scope="col">Description</th>
                {PERMISSION_RESOURCES.map((resource) => (
                  <th scope="col" key={resource}>
                    {resource}
                  </th>
                ))}
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedRoles.map((role) => (
                <tr key={role.id}>
                  <td>{role.name}</td>
                  <td>{role.description ?? '—'}</td>
                  {PERMISSION_RESOURCES.map((resource) => (
                    <td key={`${role.id}-${resource}`}>
                      <div className="permission-grid">
                        {PERMISSION_ACTIONS.map((action) => {
                          const matrix = getDraftMatrix(role);
                          const isChecked = matrix[resource]?.has(action) ?? false;
                          const isDisabled = !role.isCustom && action === 'delete';
                          return (
                            <label key={action} className="permission-grid__item">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                disabled={!role.isCustom && !['view', 'export', 'update', 'approve', 'create'].includes(action) ? true : isDisabled}
                                onChange={() => togglePermission(role, resource, action)}
                              />
                              <span>{action}</span>
                            </label>
                          );
                        })}
                      </div>
                    </td>
                  ))}
                  <td className="role-management__actions">
                    {editingRoleId === role.id ? (
                      <>
                        <button className="btn btn-primary" type="button" onClick={() => persistChanges(role)} disabled={isLoading}>
                          Save
                        </button>
                        <button className="btn" type="button" onClick={() => setEditingRoleId(undefined)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn" type="button" onClick={() => setEditingRoleId(role.id)}>
                          Edit
                        </button>
                        {role.isCustom && (
                          <button className="btn btn-danger" type="button" onClick={() => handleDeleteRole(role)}>
                            Delete
                          </button>
                        )}
                      </>
                    )}
                    {editingRoleId === role.id && !isDirty(role) && <span className="role-management__note">No changes</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default RoleManagement;
