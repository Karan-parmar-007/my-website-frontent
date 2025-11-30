import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, FolderKanban, Users, UsersIcon, Briefcase, LogOut, Trash2, Shield, Plus, Search, Pencil, X, KeyRound } from 'lucide-react';
import SimpleLoader from '@/components/SimpleLoader';
import { useToast } from '@/components/ui/toast';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useAuth } from '@/contexts/AuthContext';
import { usersApi } from '@/lib/users_apis';
import { rolesApi } from '@/lib/roles_apis';
import { adminResetPassword } from '@/lib/user_apis';

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

export default function UsersPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [userDialog, setUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    preferred_name: '',
    email: '',
    password: '',
    role_id: '',
    email_verified: false,
  });
  const [resetPasswordDialog, setResetPasswordDialog] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);

  const searchTimeoutRef = useRef(null);
  const suggestionTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        isSearching && searchQuery 
          ? usersApi.searchUsers(searchQuery, currentPage, pageSize)
          : usersApi.getAllUsers(currentPage, pageSize),
        rolesApi.getRoles(),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
      // Check if there are more pages
      setHasMorePages(usersData.length === pageSize);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInput = (value) => {
    setSearchQuery(value);

    // Clear existing timeouts
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }

    if (value.length >= 2) {
      // Fetch suggestions after 300ms delay
      suggestionTimeoutRef.current = setTimeout(async () => {
        try {
          const suggestions = await usersApi.getUserSuggestions(value, 5);
          setSuggestions(suggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Failed to fetch suggestions:', error);
          setSuggestions([]);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // Reset to normal mode
      setIsSearching(false);
      setCurrentPage(1);
      await fetchData();
      return;
    }

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsSearching(true);
    setCurrentPage(1);
    setShowSuggestions(false);

    searchTimeoutRef.current = setTimeout(async () => {
      await fetchData();
    }, 500);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setIsSearching(true);
    setCurrentPage(1);
    
    // Trigger search immediately
    setTimeout(async () => {
      try {
        setLoading(true);
        const usersData = await usersApi.searchUsers(suggestion, 1, pageSize);
        setUsers(usersData);
        setHasMorePages(usersData.length === pageSize);
      } catch (error) {
        console.error('Failed to search users:', error);
      } finally {
        setLoading(false);
      }
    }, 0);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSuggestions([]);
    setShowSuggestions(false);
    setCurrentPage(1);
    fetchData();
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // For editing, exclude password field entirely
        const updateData = {
          preferred_name: userForm.preferred_name,
          email: userForm.email.toLowerCase(),
          role_id: userForm.role_id,
          email_verified: userForm.email_verified,
        };
        await usersApi.updateUser(editingUser.id, updateData);
        addToast({
          title: 'Success',
          description: 'User updated successfully.',
          variant: 'success',
        });
      } else {
        const createData = {
          ...userForm,
          email: userForm.email.toLowerCase()
        };
        await usersApi.createUser(createData);
        addToast({
          title: 'Success',
          description: 'User created successfully.',
          variant: 'success',
        });
      }
      await fetchData();
      setUserDialog(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save user:', error);
      addToast({
        title: 'Error',
        description: error.message || 'Failed to save user.',
        variant: 'error',
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await usersApi.deleteUser(userId);
      await fetchData();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    }
  };

  const openEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      preferred_name: user.preferred_name,
      email: user.email,
      password: '',
      role_id: user.role_id || '',
      email_verified: user.email_verified,
    });
    setUserDialog(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setUserForm({
      preferred_name: '',
      email: '',
      password: '',
      role_id: '',
      email_verified: false,
    });
  };

  const openResetPassword = (user) => {
    setResetPasswordUser(user);
    setNewPassword('');
    setConfirmNewPassword('');
    setResetPasswordDialog(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      addToast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'error',
      });
      return;
    }

    if (newPassword.length < 8) {
      addToast({
        title: 'Error',
        description: 'Password must be at least 8 characters long.',
        variant: 'error',
      });
      return;
    }

    setResettingPassword(true);

    try {
      await adminResetPassword(resetPasswordUser.id, resetPasswordUser.email, newPassword);
      addToast({
        title: 'Success',
        description: `Password reset successfully for ${resetPasswordUser.email}.`,
        variant: 'success',
      });
      setResetPasswordDialog(false);
      setResetPasswordUser(null);
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Failed to reset password:', error);
      addToast({
        title: 'Error',
        description: error.message || 'Failed to reset password.',
        variant: 'error',
      });
    } finally {
      setResettingPassword(false);
    }
  };

  const getStatusBadge = (isVerified) => {
    return isVerified ? (
      <span className="inline-flex items-center rounded-full bg-[#64ffda]/20 px-2.5 py-0.5 text-xs font-medium text-[#64ffda]">
        Verified
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full bg-[#8892b0]/20 px-2.5 py-0.5 text-xs font-medium text-[#8892b0]">
        Unverified
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderPagination = () => {
    const maxVisiblePages = 5;
    const pages = [];
    
    // Always show first page
    pages.push(
      <PaginationItem key={1}>
        <PaginationLink
          onClick={() => setCurrentPage(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      pages.push(<PaginationEllipsis key="ellipsis-start" />);
    }

    // Show current page and neighbors
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, currentPage + (hasMorePages ? 1 : 0)); i++) {
      if (i !== 1) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return pages;
  };

  if (loading && currentPage === 1) {
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
          <div className="flex flex-1 items-center justify-between min-w-0">
            <h1 className="text-lg font-semibold text-[#ccd6f6]">Users</h1>
            <div className="hidden sm:block text-sm text-[#8892b0]">
              Welcome, <span className="text-[#64ffda]">{user?.preferred_name || 'Admin'}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-[#0a192f] overflow-auto">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#ccd6f6]">Users</h2>
                <p className="text-sm text-[#8892b0]">Manage user accounts and permissions</p>
              </div>
              <Button
                onClick={() => {
                  resetForm();
                  setUserDialog(true);
                }}
                size="sm"
                variant="outline"
                className="border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative" ref={searchInputRef}>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8892b0]" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9 pr-20 bg-[#112240] border-[#172a45] text-[#ccd6f6]"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="p-1 text-[#8892b0] hover:text-[#ccd6f6] rounded transition-colors"
                    title="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <Button
                  onClick={handleSearch}
                  size="sm"
                  variant="ghost"
                  className="h-7 text-[#64ffda] hover:text-[#64ffda] hover:bg-[#64ffda]/10"
                >
                  Search
                </Button>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#112240] border border-[#172a45] rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-2 text-left text-sm text-[#ccd6f6] hover:bg-[#172a45] transition-colors flex items-center gap-2"
                    >
                      <Search className="h-3 w-3 text-[#8892b0]" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Info */}
            {isSearching && searchQuery && (
              <div className="flex items-center justify-between px-4 py-2 bg-[#112240] border border-[#172a45] rounded-md">
                <span className="text-sm text-[#8892b0]">
                  Showing results for: <span className="text-[#64ffda]">"{searchQuery}"</span>
                </span>
                <button
                  onClick={clearSearch}
                  className="text-xs text-[#8892b0] hover:text-[#ccd6f6] transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* Users List - Mobile Cards */}
            <div className="block md:hidden space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-[#64ffda]">Loading...</div>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-[#8892b0]">
                    {isSearching ? 'No users found matching your search.' : 'No users found.'}
                  </div>
                </div>
              ) : (
                users.map((u) => (
                  <div
                    key={u.id}
                    className="rounded-lg border border-[#172a45] bg-[#112240] p-4 space-y-3"
                  >
                    {/* User Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-[#ccd6f6] truncate">{u.preferred_name}</h3>
                        <p className="text-sm text-[#8892b0] truncate">{u.email}</p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={() => openEditUser(u)}
                          className="p-2 text-[#64ffda] hover:bg-[#64ffda]/10 rounded transition-colors"
                          title="Edit user"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openResetPassword(u)}
                          className="p-2 text-yellow-400 hover:bg-yellow-400/10 rounded transition-colors"
                          title="Reset password"
                        >
                          <KeyRound className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* User Details */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-[#64ffda]/20 px-2.5 py-0.5 text-xs font-medium text-[#64ffda]">
                        {u.role?.name || 'User'}
                      </span>
                      {getStatusBadge(u.email_verified)}
                    </div>
                    
                    {/* Joined Date */}
                    <div className="text-xs text-[#8892b0]">
                      Joined: {formatDate(u.created_at)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Users Table - Desktop */}
            <div className="hidden md:block rounded-lg border border-[#172a45] bg-[#112240] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#172a45]">
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#8892b0] uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#8892b0] uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#8892b0] uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#8892b0] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#8892b0] uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-[#8892b0] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#172a45]">
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center">
                          <div className="text-[#64ffda]">Loading...</div>
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center">
                          <div className="text-[#8892b0]">
                            {isSearching ? 'No users found matching your search.' : 'No users found.'}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="hover:bg-[#172a45]/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-[#ccd6f6]">{u.preferred_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-[#8892b0]">{u.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center rounded-full bg-[#64ffda]/20 px-2.5 py-0.5 text-xs font-medium text-[#64ffda]">
                              {u.role?.name || 'User'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(u.email_verified)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-[#8892b0]">{formatDate(u.created_at)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditUser(u)}
                                className="p-2 text-[#64ffda] hover:bg-[#64ffda]/10 rounded transition-colors"
                                title="Edit user"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openResetPassword(u)}
                                className="p-2 text-yellow-400 hover:bg-yellow-400/10 rounded transition-colors"
                                title="Reset password"
                              >
                                <KeyRound className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                title="Delete user"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {!loading && users.length > 0 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {renderPagination()}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className={!hasMorePages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </main>
      </SidebarInset>

      {/* User Dialog */}
      <Dialog open={userDialog} onOpenChange={setUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#ccd6f6]">{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
            <DialogDescription className="text-[#8892b0]">
              {editingUser ? 'Update user details and permissions' : 'Create a new user account'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUserSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="user-name" className="text-[#ccd6f6]">Name</Label>
                <Input
                  id="user-name"
                  value={userForm.preferred_name}
                  onChange={(e) => setUserForm({ ...userForm, preferred_name: e.target.value })}
                  required
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                />
              </div>
              <div>
                <Label htmlFor="user-email" className="text-[#ccd6f6]">Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  required
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                />
              </div>
              {!editingUser && (
                <div>
                  <Label htmlFor="user-password" className="text-[#ccd6f6]">
                    Password
                  </Label>
                  <Input
                    id="user-password"
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    required
                    className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                  />
                </div>
              )}
              {editingUser && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/50 rounded text-blue-400 text-sm">
                  To reset this user's password, use the "Reset Password" button in the user list.
                </div>
              )}
              <div>
                <Label htmlFor="user-role" className="text-[#ccd6f6]">Role</Label>
                <select
                  id="user-role"
                  value={userForm.role_id}
                  onChange={(e) => setUserForm({ ...userForm, role_id: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-[#172a45] bg-[#0a192f] px-3 py-1 text-sm text-[#ccd6f6] shadow-xs transition-colors focus-visible:border-[#64ffda] focus-visible:ring-[#64ffda]/20 focus-visible:ring-[3px] outline-none"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="user-verified"
                  checked={userForm.email_verified}
                  onChange={(e) => setUserForm({ ...userForm, email_verified: e.target.checked })}
                  className="h-4 w-4 rounded border-[#172a45] bg-[#0a192f] text-[#64ffda] focus:ring-[#64ffda]"
                />
                <Label htmlFor="user-verified" className="font-normal text-[#ccd6f6]">
                  Email verified
                </Label>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setUserDialog(false);
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
                {editingUser ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialog} onOpenChange={setResetPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#ccd6f6]">Reset User Password</DialogTitle>
            <DialogDescription className="text-[#8892b0]">
              Reset password for {resetPasswordUser?.email}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword}>
            <div className="space-y-4">
              <div className="p-3 bg-[#0a192f] rounded-lg border border-[#172a45]">
                <p className="text-xs text-[#8892b0] mb-1">User</p>
                <p className="text-sm font-medium text-[#ccd6f6]">{resetPasswordUser?.preferred_name}</p>
                <p className="text-xs text-[#8892b0]">{resetPasswordUser?.email}</p>
              </div>
              <div>
                <Label htmlFor="new-password" className="text-[#ccd6f6]">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  disabled={resettingPassword}
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                />
              </div>
              <div>
                <Label htmlFor="confirm-new-password" className="text-[#ccd6f6]">Confirm Password</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  disabled={resettingPassword}
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setResetPasswordDialog(false);
                  setResetPasswordUser(null);
                  setNewPassword('');
                  setConfirmNewPassword('');
                }}
                disabled={resettingPassword}
                className="text-[#8892b0] hover:text-[#ccd6f6] hover:bg-[#172a45]"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="outline"
                disabled={resettingPassword}
                className="border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10"
              >
                {resettingPassword ? <SimpleLoader className="justify-center" /> : 'Reset Password'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}