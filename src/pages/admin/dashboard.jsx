import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, FolderKanban, Users, Briefcase, LogOut, Shield, UsersIcon } from 'lucide-react';
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
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: Home,
  },
  {
    title: 'Projects',
    url: '/admin/projects',
    icon: FolderKanban,
  },
  { title: 'Users', url: '/admin/users', icon: Users },
  {
    title: 'Portfolio',
    url: '/admin/portfolio',
    icon: Briefcase,
  },
  { title: 'Roles & Permissions', url: '/admin/roles', icon: Shield },
  { title: 'Access Levels', url: '/admin/project-access-levels', icon: Shield },
  { title: 'Project Membership', url: '/admin/project-membership', icon: UsersIcon },

];

function AppSidebar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout(); // Wait for logout to complete (clears cookie and sets user to null)
    navigate('/login'); // Then navigate
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

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex-1 flex flex-col min-h-screen">
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[#172a45] bg-[#112240] px-4">
          <SidebarTrigger />
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold text-[#ccd6f6]">Dashboard</h1>
            <div className="text-sm text-[#8892b0]">
              Welcome, <span className="text-[#64ffda]">{user?.name || 'Admin'}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-[#0a192f] overflow-auto">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-[#172a45] bg-[#112240] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#8892b0]">Total Projects</p>
                    <p className="text-2xl font-bold text-[#ccd6f6]">12</p>
                  </div>
                  <FolderKanban className="h-8 w-8 text-[#64ffda]" />
                </div>
              </div>
              <div className="rounded-lg border border-[#172a45] bg-[#112240] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#8892b0]">Total Users</p>
                    <p className="text-2xl font-bold text-[#ccd6f6]">3</p>
                  </div>
                  <Users className="h-8 w-8 text-[#64ffda]" />
                </div>
              </div>
              <div className="rounded-lg border border-[#172a45] bg-[#112240] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#8892b0]">Work Experience</p>
                    <p className="text-2xl font-bold text-[#ccd6f6]">5</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-[#64ffda]" />
                </div>
              </div>
              <div className="rounded-lg border border-[#172a45] bg-[#112240] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#8892b0]">Education</p>
                    <p className="text-2xl font-bold text-[#ccd6f6]">2</p>
                  </div>
                  <Home className="h-8 w-8 text-[#64ffda]" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-lg border border-[#172a45] bg-[#112240] p-6">
              <h2 className="mb-4 text-lg font-semibold text-[#ccd6f6]">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#172a45] pb-4">
                  <div>
                    <p className="font-medium text-[#ccd6f6]">New project added</p>
                    <p className="text-sm text-[#8892b0]">2 hours ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between border-b border-[#172a45] pb-4">
                  <div>
                    <p className="font-medium text-[#ccd6f6]">Profile updated</p>
                    <p className="text-sm text-[#8892b0]">5 hours ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#ccd6f6]">User registered</p>
                    <p className="text-sm text-[#8892b0]">1 day ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg border border-[#172a45] bg-[#112240] p-6">
              <h2 className="mb-4 text-lg font-semibold text-[#ccd6f6]">Quick Actions</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" asChild className="h-auto flex-col py-4">
                  <Link to="/admin/projects">
                    <FolderKanban className="mb-2 h-8 w-8" />
                    <span>Add Project</span>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-auto flex-col py-4">
                  <Link to="/admin/portfolio">
                    <Briefcase className="mb-2 h-8 w-8" />
                    <span>Update Portfolio</span>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-auto flex-col py-4">
                  <Link to="/admin/users">
                    <Users className="mb-2 h-8 w-8" />
                    <span>Manage Users</span>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-auto flex-col py-4">
                  <Link to="/">
                    <Home className="mb-2 h-8 w-8" />
                    <span>View Site</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}