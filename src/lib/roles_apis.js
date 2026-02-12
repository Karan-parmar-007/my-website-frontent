import apiClient from './apiClient';

export const rolesApi = {
  // Roles CRUD
  getRoles: async () => {
    const response = await apiClient.get('/user/roles');
    return response.data;
  },

  getRole: async (roleId) => {
    const response = await apiClient.get(`/user/roles/${roleId}`);
    return response.data;
  },

  createRole: async (data) => {
    const response = await apiClient.post('/user/roles', data);
    return response.data;
  },

  updateRole: async (roleId, data) => {
    const response = await apiClient.put(`/user/roles/${roleId}`, data);
    return response.data;
  },

  deleteRole: async (roleId) => {
    await apiClient.delete(`/user/roles/${roleId}`);
  },

  // Permissions CRUD
  getPermissions: async () => {
    const response = await apiClient.get('/user/permissions');
    return response.data;
  },

  getPermission: async (permissionId) => {
    const response = await apiClient.get(`/user/permissions/${permissionId}`);
    return response.data;
  },

  createPermission: async (data) => {
    const response = await apiClient.post('/user/permissions', data);
    return response.data;
  },

  updatePermission: async (permissionId, data) => {
    const response = await apiClient.put(`/user/permissions/${permissionId}`, data);
    return response.data;
  },

  deletePermission: async (permissionId) => {
    await apiClient.delete(`/user/permissions/${permissionId}`);
  },

  // Role Permissions
  getRolePermissions: async (roleId) => {
    const response = await apiClient.get(`/user/roles/${roleId}/permissions`);
    return response.data;
  },

  assignPermissionToRole: async (roleId, permissionId) => {
    const response = await apiClient.post('/user/role-permissions', {
      role_id: roleId,
      permission_id: permissionId,
    });
    return response.data;
  },

  removePermissionFromRole: async (roleId, permissionId) => {
    await apiClient.delete('/user/role-permissions', {
      data: {
        role_id: roleId,
        permission_id: permissionId,
      },
    });
  },

  listRolePermissions: async () => {
    const response = await apiClient.get('/user/role-permissions');
    return response.data;
  },

  // Role Validator
  validateRole: async (requiredRoles) => {
    const response = await apiClient.post('/user/role-validator', {
      required_roles: requiredRoles,
    });
    return response.data;
  },
};