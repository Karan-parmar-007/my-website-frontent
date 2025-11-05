import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

// Get all roles
export const getRoles = async () => {
  try {
    const response = await api.get('/v1/user/roles');
    return response.data;
  } catch (error) {
    console.error('getRoles failed', error);
    throw error;
  }
};

// Get role by ID
export const getRole = async (roleId) => {
  try {
    const response = await api.get(`/v1/user/roles/${roleId}`);
    return response.data;
  } catch (error) {
    console.error('getRole failed', error);
    throw error;
  }
};

// Create role
export const createRole = async (data) => {
  try {
    const response = await api.post('/v1/user/roles', data);
    return response.data;
  } catch (error) {
    console.error('createRole failed', error);
    throw error;
  }
};

// Update role
export const updateRole = async (roleId, data) => {
  try {
    const response = await api.put(`/v1/user/roles/${roleId}`, data);
    return response.data;
  } catch (error) {
    console.error('updateRole failed', error);
    throw error;
  }
};

// Delete role
export const deleteRole = async (roleId) => {
  try {
    await api.delete(`/v1/user/roles/${roleId}`);
  } catch (error) {
    console.error('deleteRole failed', error);
    throw error;
  }
};

// Get all permissions
export const getPermissions = async () => {
  try {
    const response = await api.get('/v1/user/permissions');
    return response.data;
  } catch (error) {
    console.error('getPermissions failed', error);
    throw error;
  }
};

// Get permission by ID
export const getPermission = async (permissionId) => {
  try {
    const response = await api.get(`/v1/user/permissions/${permissionId}`);
    return response.data;
  } catch (error) {
    console.error('getPermission failed', error);
    throw error;
  }
};

// Create permission
export const createPermission = async (data) => {
  try {
    const response = await api.post('/v1/user/permissions', data);
    return response.data;
  } catch (error) {
    console.error('createPermission failed', error);
    throw error;
  }
};

// Update permission
export const updatePermission = async (permissionId, data) => {
  try {
    const response = await api.put(`/v1/user/permissions/${permissionId}`, data);
    return response.data;
  } catch (error) {
    console.error('updatePermission failed', error);
    throw error;
  }
};

// Delete permission
export const deletePermission = async (permissionId) => {
  try {
    await api.delete(`/v1/user/permissions/${permissionId}`);
  } catch (error) {
    console.error('deletePermission failed', error);
    throw error;
  }
};

// Get role permissions
export const getRolePermissions = async (roleId) => {
  try {
    const response = await api.get(`/v1/user/roles/${roleId}/permissions`);
    return response.data;
  } catch (error) {
    console.error('getRolePermissions failed', error);
    throw error;
  }
};

// Assign permission to role
export const assignPermissionToRole = async (roleId, permissionId) => {
  try {
    const response = await api.post('/v1/user/role-permissions', {
      role_id: roleId,
      permission_id: permissionId,
    });
    return response.data;
  } catch (error) {
    console.error('assignPermissionToRole failed', error);
    throw error;
  }
};

// Remove permission from role
export const removePermissionFromRole = async (roleId, permissionId) => {
  try {
    await api.delete('/v1/user/role-permissions', {
      data: {
        role_id: roleId,
        permission_id: permissionId,
      },
    });
  } catch (error) {
    console.error('removePermissionFromRole failed', error);
    throw error;
  }
};

// List role permissions
export const listRolePermissions = async () => {
  try {
    const response = await api.get('/v1/user/role-permissions');
    return response.data;
  } catch (error) {
    console.error('listRolePermissions failed', error);
    throw error;
  }
};

// Validate role
export const validateRole = async (requiredRoles) => {
  try {
    const response = await api.post('/v1/user/role-validator', {
      required_roles: requiredRoles,
    });
    return response.data;
  } catch (error) {
    console.error('validateRole failed', error);
    throw error;
  }
};