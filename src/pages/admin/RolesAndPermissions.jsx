import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, FolderKanban, Users, Briefcase, LogOut, Trash2, Shield, Plus } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { rolesApi } from '@/lib/roles_apis';

const menuItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: Home },
  { title: 'Projects', url: '/admin/projects', icon: FolderKanban },
  { title: 'Users', url: '/admin/users', icon: Users },
  { title: 'Portfolio', url: '/admin/portfolio', icon: Briefcase },
  { title: 'Roles & Permissions', url: '/admin/roles', icon: Shield },
];

function AppSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#172a45] text-[#64ffda]">
                  <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
                    <path
                      d="M 50, 5 L 11, 27 L 11, 72 L 50, 95 L 89, 73 L 89, 28 z"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                    />
                    <text
                      x="36"
                      y="66"
                      fill="currentColor"
                      fontSize="50"
                      fontWeight="400"
                      fontFamily="system-ui, Calibre-Medium, Calibre, sans-serif"
                    >
                      K
                    </text>
                  </svg>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-[#ccd6f6]">Admin Panel</span>
                  <span className="truncate text-xs text-[#8892b0]">Portfolio Management</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default function RolesAndPermissions() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissionsMap, setRolePermissionsMap] = useState(new Map());

  // Dialog states
  const [roleDialog, setRoleDialog] = useState(false);
  const [permissionDialog, setPermissionDialog] = useState(false);

  // Form states
  const [roleForm, setRoleForm] = useState({ name: '', description: '' });
  const [permissionForm, setPermissionForm] = useState({ name: '', description: '' });
  const [editingRole, setEditingRole] = useState(null);
  const [editingPermission, setEditingPermission] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      fetchRolePermissions(selectedRole.id);
    }
  }, [selectedRole]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesData, permissionsData] = await Promise.all([
        rolesApi.getRoles(),
        rolesApi.getPermissions(),
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
      if (rolesData.length > 0 && !selectedRole) {
        setSelectedRole(rolesData[0]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRolePermissions = async (roleId) => {
    try {
      const data = await rolesApi.getRolePermissions(roleId);
      console.log('Fetched role permissions:', data);
      
      // Create a map of permission_id -> have status
      const permMap = new Map();
      if (data.permissions && Array.isArray(data.permissions)) {
        data.permissions.forEach(item => {
          if (item.permission && item.permission.id) {
            permMap.set(item.permission.id, item.have);
          }
        });
      }
      
      setRolePermissionsMap(permMap);
    } catch (error) {
      console.error('Failed to fetch role permissions:', error);
      setRolePermissionsMap(new Map());
    }
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await rolesApi.updateRole(editingRole.id, roleForm);
      } else {
        await rolesApi.createRole(roleForm);
      }
      await fetchData();
      setRoleDialog(false);
      setRoleForm({ name: '', description: '' });
      setEditingRole(null);
    } catch (error) {
      console.error('Failed to save role:', error);
    }
  };

  const handlePermissionSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPermission) {
        await rolesApi.updatePermission(editingPermission.id, permissionForm);
      } else {
        await rolesApi.createPermission(permissionForm);
      }
      await fetchData();
      setPermissionDialog(false);
      setPermissionForm({ name: '', description: '' });
      setEditingPermission(null);
    } catch (error) {
      console.error('Failed to save permission:', error);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    try {
      await rolesApi.deleteRole(roleId);
      await fetchData();
      if (selectedRole?.id === roleId) {
        setSelectedRole(roles[0] || null);
      }
    } catch (error) {
      console.error('Failed to delete role:', error);
    }
  };

  const handleDeletePermission = async (permissionId) => {
    if (!confirm('Are you sure you want to delete this permission?')) return;
    try {
      await rolesApi.deletePermission(permissionId);
      await fetchData();
    } catch (error) {
      console.error('Failed to delete permission:', error);
    }
  };

  const handleTogglePermission = async (permission, currentlyHas) => {
    if (!selectedRole) return;
    
    try {
      if (currentlyHas) {
        // Remove permission
        await rolesApi.removePermissionFromRole(selectedRole.id, permission.id);
      } else {
        // Add permission
        await rolesApi.assignPermissionToRole(selectedRole.id, permission.id);
      }
      // Refresh the permissions for this role
      await fetchRolePermissions(selectedRole.id);
    } catch (error) {
      console.error('Failed to toggle permission:', error);
    }
  };

  const hasPermission = (permissionId) => {
    return rolePermissionsMap.get(permissionId) === true;
  };

  const openEditRole = (role) => {
    setEditingRole(role);
    setRoleForm({ name: role.name, description: role.description || '' });
    setRoleDialog(true);
  };

  const openEditPermission = (permission) => {
    setEditingPermission(permission);
    setPermissionForm({ name: permission.name, description: permission.description || '' });
    setPermissionDialog(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a192f]">
        <div className="text-[#64ffda]">Loading...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex-1 flex flex-col min-h-screen">
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[#172a45] bg-[#112240] px-4">
          <SidebarTrigger />
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold text-[#ccd6f6]">Roles & Permissions</h1>
            <div className="text-sm text-[#8892b0]">
              Welcome, <span className="text-[#64ffda]">{user?.preferred_name || 'Admin'}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-[#0a192f] overflow-auto">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Roles Section */}
            <div className="rounded-lg border border-[#172a45] bg-[#112240] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-[#ccd6f6]">Roles</h2>
                  <p className="text-sm text-[#8892b0]">System roles</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingRole(null);
                    setRoleForm({ name: '', description: '' });
                    setRoleDialog(true);
                  }}
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedRole?.id === role.id
                        ? 'border-[#64ffda] bg-[#64ffda]/10'
                        : 'border-[#172a45] hover:border-[#64ffda]/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Shield className="h-8 w-8 text-[#64ffda]" />
                      <div>
                        <h3 className="font-medium text-[#ccd6f6]">{role.name}</h3>
                        <p className="text-sm text-[#8892b0]">{role.description || 'No description'}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRole(role.id);
                      }}
                      className="text-[#8892b0] hover:text-red-400"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Permissions Section */}
            {selectedRole && (
              <div className="rounded-lg border border-[#172a45] bg-[#112240] p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-[#ccd6f6]">
                      Permissions for {selectedRole.name}
                    </h2>
                    <p className="text-sm text-[#8892b0]">Toggle permissions for this role</p>
                  </div>
                  <Button
                    onClick={() => {
                      setEditingPermission(null);
                      setPermissionForm({ name: '', description: '' });
                      setPermissionDialog(true);
                    }}
                    size="sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Permission
                  </Button>
                </div>

                <div className="space-y-2">
                  {permissions.map((permission) => {
                    const enabled = hasPermission(permission.id);
                    return (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-[#172a45]"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-[#ccd6f6]">{permission.name}</h3>
                          <p className="text-sm text-[#8892b0]">{permission.description || 'No description'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTogglePermission(permission, enabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              enabled ? 'bg-[#64ffda]' : 'bg-[#172a45]'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                enabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => handleDeletePermission(permission.id)}
                            className="text-[#8892b0] hover:text-red-400"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
      </SidebarInset>

      {/* Role Dialog */}
      <Dialog open={roleDialog} onOpenChange={setRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Edit Role' : 'Add Role'}</DialogTitle>
            <DialogDescription>
              {editingRole ? 'Update role details' : 'Create a new role'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRoleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="role-name">Name</Label>
                <Input
                  id="role-name"
                  value={roleForm.name}
                  onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="role-description">Description</Label>
                <Textarea
                  id="role-description"
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="ghost" onClick={() => setRoleDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingRole ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Permission Dialog */}
      <Dialog open={permissionDialog} onOpenChange={setPermissionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPermission ? 'Edit Permission' : 'Add Permission'}</DialogTitle>
            <DialogDescription>
              {editingPermission ? 'Update permission details' : 'Create a new permission'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePermissionSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="permission-name">Name</Label>
                <Input
                  id="permission-name"
                  value={permissionForm.name}
                  onChange={(e) => setPermissionForm({ ...permissionForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="permission-description">Description</Label>
                <Textarea
                  id="permission-description"
                  value={permissionForm.description}
                  onChange={(e) => setPermissionForm({ ...permissionForm, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="ghost" onClick={() => setPermissionDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingPermission ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}