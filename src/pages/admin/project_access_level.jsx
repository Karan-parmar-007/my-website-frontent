import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, FolderKanban, Users, UsersIcon, Briefcase, LogOut, Trash2, Shield, Plus, Pencil } from 'lucide-react';
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
import { accessLevelsApi } from '@/lib/access_levels_apis';

const menuItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: Home },
  { title: 'Projects', url: '/admin/projects', icon: FolderKanban },
  { title: 'Users', url: '/admin/users', icon: Users },
  { title: 'Portfolio', url: '/admin/portfolio', icon: Briefcase },
  { title: 'Roles & Permissions', url: '/admin/roles', icon: Shield },
  { title: 'Access Levels', url: '/admin/project-access-levels', icon: Shield },
  { title: 'Project Membership', url: '/admin/project-membership', icon: UsersIcon },

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

export default function ProjectAccessLevelPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [accessLevels, setAccessLevels] = useState([]);
  const [accessLevelDialog, setAccessLevelDialog] = useState(false);
  const [editingAccessLevel, setEditingAccessLevel] = useState(null);
  const [accessLevelForm, setAccessLevelForm] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchAccessLevels();
  }, []);

  const fetchAccessLevels = async () => {
    try {
      setLoading(true);
      const data = await accessLevelsApi.getAllAccessLevels();
      setAccessLevels(data);
    } catch (error) {
      console.error('Failed to fetch access levels:', error);
      alert('Failed to load access levels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccessLevelSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAccessLevel) {
        await accessLevelsApi.updateAccessLevel(editingAccessLevel.id, accessLevelForm);
      } else {
        await accessLevelsApi.createAccessLevel(accessLevelForm);
      }
      setAccessLevelDialog(false);
      resetForm();
      await fetchAccessLevels();
    } catch (error) {
      console.error('Failed to save access level:', error);
      alert(error.response?.data?.detail || 'Failed to save access level. Please try again.');
    }
  };

  const handleDeleteAccessLevel = async (accessLevelId) => {
    if (!confirm('Are you sure you want to delete this access level? Projects using this access level will become public.')) return;
    
    try {
      await accessLevelsApi.deleteAccessLevel(accessLevelId);
      await fetchAccessLevels();
    } catch (error) {
      console.error('Failed to delete access level:', error);
      alert(error.response?.data?.detail || 'Failed to delete access level. Please try again.');
    }
  };

  const openEditAccessLevel = (accessLevel) => {
    setEditingAccessLevel(accessLevel);
    setAccessLevelForm({
      name: accessLevel.name,
      description: accessLevel.description || '',
    });
    setAccessLevelDialog(true);
  };

  const resetForm = () => {
    setEditingAccessLevel(null);
    setAccessLevelForm({
      name: '',
      description: '',
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });
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
            <h1 className="text-lg font-semibold text-[#ccd6f6]">Project Access Levels</h1>
            <div className="text-sm text-[#8892b0]">
              Welcome, <span className="text-[#64ffda]">{user?.preferred_name || 'Admin'}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-[#0a192f] overflow-auto">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#ccd6f6]">Project Access Levels</h2>
                <p className="text-sm text-[#8892b0]">Manage project visibility and access control</p>
              </div>
              <Button
                onClick={() => {
                  resetForm();
                  setAccessLevelDialog(true);
                }}
                size="sm"
                variant="outline"
                className="border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Access Level
              </Button>
            </div>

            {/* Access Levels Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {accessLevels.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <div className="text-[#8892b0]">No access levels found.</div>
                </div>
              ) : (
                accessLevels.map((level) => (
                  <div
                    key={level.id}
                    className="rounded-lg border border-[#172a45] bg-[#112240] overflow-hidden hover:border-[#64ffda]/50 transition-colors"
                  >
                    <div className="p-6 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[#ccd6f6] mb-1">{level.name}</h3>
                          <span className="inline-flex items-center rounded-full bg-[#64ffda]/20 px-2.5 py-0.5 text-xs font-medium text-[#64ffda]">
                            Access Level
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      {level.description && (
                        <p className="text-sm text-[#8892b0] line-clamp-3">{level.description}</p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#172a45]">
                        <span className="text-xs text-[#8892b0]">
                          Created: {formatDate(level.created_at)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditAccessLevel(level)}
                            className="p-2 text-[#64ffda] hover:bg-[#64ffda]/10 rounded transition-colors"
                            title="Edit access level"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAccessLevel(level.id)}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                            title="Delete access level"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </SidebarInset>

      {/* Access Level Dialog */}
      <Dialog open={accessLevelDialog} onOpenChange={setAccessLevelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#ccd6f6]">
              {editingAccessLevel ? 'Edit Access Level' : 'Add Access Level'}
            </DialogTitle>
            <DialogDescription className="text-[#8892b0]">
              {editingAccessLevel ? 'Update access level details' : 'Create a new project access level'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAccessLevelSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="access-level-name" className="text-[#ccd6f6]">Name *</Label>
                <Input
                  id="access-level-name"
                  value={accessLevelForm.name}
                  onChange={(e) => setAccessLevelForm({ ...accessLevelForm, name: e.target.value })}
                  required
                  placeholder="e.g., Premium, VIP, Members Only"
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                />
              </div>
              <div>
                <Label htmlFor="access-level-description" className="text-[#ccd6f6]">Description</Label>
                <Textarea
                  id="access-level-description"
                  value={accessLevelForm.description}
                  onChange={(e) => setAccessLevelForm({ ...accessLevelForm, description: e.target.value })}
                  placeholder="Describe who can access projects with this level..."
                  rows={4}
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setAccessLevelDialog(false);
                  resetForm();
                }}
                className="text-[#8892b0] hover:text-[#ccd6f6] hover:bg-[#172a45]"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="outline"
                className="border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10"
              >
                {editingAccessLevel ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}