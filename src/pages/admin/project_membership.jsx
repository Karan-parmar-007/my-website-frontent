import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, FolderKanban, Users as UsersIcon, Briefcase, LogOut, Shield, Search, X, UserPlus, UserMinus } from 'lucide-react';
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useAuth } from '@/contexts/AuthContext';
import { projectsApi } from '@/lib/projects_apis';
import { usersApi } from '@/lib/users_apis';
import { projectMembershipApi } from '@/lib/project_membership_apis';

const menuItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: Home },
  { title: 'Projects', url: '/admin/projects', icon: FolderKanban },
  { title: 'Users', url: '/admin/users', icon: UsersIcon },
  { title: 'Project Members', url: '/admin/project-membership', icon: UsersIcon },
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

export default function ProjectMembershipPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Projects state
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [projectSuggestions, setProjectSuggestions] = useState([]);
  const [showProjectSuggestions, setShowProjectSuggestions] = useState(false);
  const [isProjectSearching, setIsProjectSearching] = useState(false);
  const [projectCurrentPage, setProjectCurrentPage] = useState(1);
  const [projectPageSize] = useState(10);
  const [hasMoreProjects, setHasMoreProjects] = useState(false);

  // Members state
  const [members, setMembers] = useState([]);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [memberSearchResults, setMemberSearchResults] = useState([]);
  const [showMemberSearch, setShowMemberSearch] = useState(false);

  // Available users state
  const [availableUsers, setAvailableUsers] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [isUserSearching, setIsUserSearching] = useState(false);
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [userPageSize] = useState(10);
  const [hasMoreUsers, setHasMoreUsers] = useState(false);

  const projectSearchTimeoutRef = useRef(null);
  const projectSuggestionTimeoutRef = useRef(null);
  const projectSearchInputRef = useRef(null);
  
  const memberSearchTimeoutRef = useRef(null);
  const memberSearchInputRef = useRef(null);
  
  const userSearchTimeoutRef = useRef(null);
  const userSuggestionTimeoutRef = useRef(null);
  const userSearchInputRef = useRef(null);

  useEffect(() => {
    fetchProjects();
  }, [projectCurrentPage]);

  useEffect(() => {
    if (selectedProject) {
      fetchMembers();
    }
  }, [selectedProject]);

  useEffect(() => {
    fetchUsers();
  }, [userCurrentPage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (projectSearchInputRef.current && !projectSearchInputRef.current.contains(event.target)) {
        setShowProjectSuggestions(false);
      }
      if (memberSearchInputRef.current && !memberSearchInputRef.current.contains(event.target)) {
        setShowMemberSearch(false);
      }
      if (userSearchInputRef.current && !userSearchInputRef.current.contains(event.target)) {
        setShowUserSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Project functions
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsData = isProjectSearching && projectSearchQuery
        ? await projectsApi.searchProjects(projectSearchQuery, projectCurrentPage, projectPageSize)
        : await projectsApi.getAllProjects(projectCurrentPage, projectPageSize);
      
      setProjects(projectsData);
      setHasMoreProjects(projectsData.length === projectPageSize);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSearchInput = (value) => {
    setProjectSearchQuery(value);

    if (projectSuggestionTimeoutRef.current) {
      clearTimeout(projectSuggestionTimeoutRef.current);
    }

    if (value.length >= 2) {
      projectSuggestionTimeoutRef.current = setTimeout(async () => {
        try {
          const suggestions = await projectsApi.getProjectSuggestions(value);
          setProjectSuggestions(suggestions);
          setShowProjectSuggestions(true);
        } catch (error) {
          console.error('Failed to fetch project suggestions:', error);
        }
      }, 300);
    } else {
      setProjectSuggestions([]);
      setShowProjectSuggestions(false);
    }
  };

  const handleProjectSearch = async () => {
    if (!projectSearchQuery.trim()) {
      clearProjectSearch();
      return;
    }

    if (projectSearchTimeoutRef.current) {
      clearTimeout(projectSearchTimeoutRef.current);
    }

    setIsProjectSearching(true);
    setProjectCurrentPage(1);
    setShowProjectSuggestions(false);

    projectSearchTimeoutRef.current = setTimeout(async () => {
      await fetchProjects();
    }, 500);
  };

  const handleProjectSuggestionClick = (suggestion) => {
    setProjectSearchQuery(suggestion);
    setShowProjectSuggestions(false);
    setIsProjectSearching(true);
    setProjectCurrentPage(1);
    
    setTimeout(async () => {
      try {
        setLoading(true);
        const projectsData = await projectsApi.searchProjects(suggestion, 1, projectPageSize);
        setProjects(projectsData);
        setHasMoreProjects(projectsData.length === projectPageSize);
      } catch (error) {
        console.error('Failed to search projects:', error);
      } finally {
        setLoading(false);
      }
    }, 0);
  };

  const clearProjectSearch = () => {
    setProjectSearchQuery('');
    setIsProjectSearching(false);
    setProjectSuggestions([]);
    setShowProjectSuggestions(false);
    setProjectCurrentPage(1);
    
    setTimeout(async () => {
      try {
        setLoading(true);
        const projectsData = await projectsApi.getAllProjects(1, projectPageSize);
        setProjects(projectsData);
        setHasMoreProjects(projectsData.length === projectPageSize);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    }, 0);
  };

  // Member functions
  const fetchMembers = async () => {
    if (!selectedProject) return;
    
    try {
      const membersData = await projectMembershipApi.getMembershipsByProject(selectedProject.id);
      setMembers(membersData);
      // Refresh available users to filter out current members
      if (availableUsers.length > 0 || userCurrentPage > 1) {
        await fetchUsers();
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  };

  const handleMemberSearch = async (value) => {
    setMemberSearchQuery(value);

    if (memberSearchTimeoutRef.current) {
      clearTimeout(memberSearchTimeoutRef.current);
    }

    if (value.length >= 2 && selectedProject) {
      memberSearchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await projectMembershipApi.searchUsersInProject(selectedProject.id, value);
          setMemberSearchResults(results);
          setShowMemberSearch(true);
        } catch (error) {
          console.error('Failed to search members:', error);
        }
      }, 300);
    } else {
      setMemberSearchResults([]);
      setShowMemberSearch(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!selectedProject || !confirm('Are you sure you want to remove this member?')) return;

    try {
      await projectMembershipApi.removeMembership(userId, selectedProject.id);
      await fetchMembers();
    } catch (error) {
      console.error('Failed to remove member:', error);
      alert('Failed to remove member. Please try again.');
    }
  };

  // User functions
  const fetchUsers = async () => {
    try {
      const usersData = isUserSearching && userSearchQuery
        ? await usersApi.searchUsers(userSearchQuery, userCurrentPage, userPageSize)
        : await usersApi.getAllUsers(userCurrentPage, userPageSize);
      
      setAvailableUsers(usersData);
      setHasMoreUsers(usersData.length === userPageSize);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleUserSearchInput = (value) => {
    setUserSearchQuery(value);

    if (userSuggestionTimeoutRef.current) {
      clearTimeout(userSuggestionTimeoutRef.current);
    }

    if (value.length >= 2) {
      userSuggestionTimeoutRef.current = setTimeout(async () => {
        try {
          const suggestions = await usersApi.getUserSuggestions(value);
          setUserSuggestions(suggestions);
          setShowUserSuggestions(true);
        } catch (error) {
          console.error('Failed to fetch user suggestions:', error);
        }
      }, 300);
    } else {
      setUserSuggestions([]);
      setShowUserSuggestions(false);
    }
  };

  const handleUserSearch = async () => {
    if (!userSearchQuery.trim()) {
      clearUserSearch();
      return;
    }

    if (userSearchTimeoutRef.current) {
      clearTimeout(userSearchTimeoutRef.current);
    }

    setIsUserSearching(true);
    setUserCurrentPage(1);
    setShowUserSuggestions(false);

    userSearchTimeoutRef.current = setTimeout(async () => {
      await fetchUsers();
    }, 500);
  };

  const handleUserSuggestionClick = (suggestion) => {
    setUserSearchQuery(suggestion);
    setShowUserSuggestions(false);
    setIsUserSearching(true);
    setUserCurrentPage(1);
    
    setTimeout(async () => {
      try {
        const usersData = await usersApi.searchUsers(suggestion, 1, userPageSize);
        setAvailableUsers(usersData);
        setHasMoreUsers(usersData.length === userPageSize);
      } catch (error) {
        console.error('Failed to search users:', error);
      }
    }, 0);
  };

  const clearUserSearch = () => {
    setUserSearchQuery('');
    setIsUserSearching(false);
    setUserSuggestions([]);
    setShowUserSuggestions(false);
    setUserCurrentPage(1);
    
    setTimeout(async () => {
      try {
        const usersData = await usersApi.getAllUsers(1, userPageSize);
        setAvailableUsers(usersData);
        setHasMoreUsers(usersData.length === userPageSize);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    }, 0);
  };

  const handleAddMember = async (userId) => {
    if (!selectedProject) {
      alert('Please select a project first');
      return;
    }

    try {
      await projectMembershipApi.createMembership({
        user_id: userId,
        project_id: selectedProject.id,
      });
      await fetchMembers();
      // Don't refresh available users - keep them visible
    } catch (error) {
      console.error('Failed to add member:', error);
      alert('Failed to add member. They may already be a member of this project.');
    }
  };

  if (loading && projectCurrentPage === 1) {
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
            <h1 className="text-lg font-semibold text-[#ccd6f6]">Project Members</h1>
            <div className="text-sm text-[#8892b0]">
              Welcome, <span className="text-[#64ffda]">{user?.preferred_name || 'Admin'}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-[#0a192f] overflow-auto">
          <div className="mx-auto max-w-[1800px]">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#ccd6f6]">Project Members</h2>
              <p className="text-sm text-[#8892b0]">Manage user assignments to projects</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Projects Section */}
              <div className="lg:col-span-1 space-y-4">
                <div className="rounded-lg border border-[#172a45] bg-[#112240] p-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-[#ccd6f6] mb-2">Projects</h3>
                    <p className="text-xs text-[#8892b0]">Select a project to manage its members</p>
                  </div>

                  {/* Project Search */}
                  <div className="relative mb-4" ref={projectSearchInputRef}>
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8892b0]" />
                    <Input
                      placeholder="Search projects..."
                      value={projectSearchQuery}
                      onChange={(e) => handleProjectSearchInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleProjectSearch()}
                      className="pl-9 pr-20 bg-[#0a192f] border-[#172a45] text-[#ccd6f6] text-sm"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {projectSearchQuery && (
                        <button
                          onClick={clearProjectSearch}
                          className="p-1 text-[#8892b0] hover:text-[#ccd6f6] rounded transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {/* Project Suggestions */}
                    {showProjectSuggestions && projectSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-[#0a192f] border border-[#172a45] rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                        {projectSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleProjectSuggestionClick(suggestion)}
                            className="w-full px-3 py-2 text-left text-xs text-[#ccd6f6] hover:bg-[#172a45] transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Projects List */}
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {projects.length === 0 ? (
                      <div className="text-center py-8 text-sm text-[#8892b0]">
                        No projects found
                      </div>
                    ) : (
                      projects.map((project) => (
                        <button
                          key={project.id}
                          onClick={() => setSelectedProject(project)}
                          className={`w-full text-left p-3 rounded-md transition-colors ${
                            selectedProject?.id === project.id
                              ? 'bg-[#64ffda]/20 border border-[#64ffda]'
                              : 'bg-[#0a192f] border border-[#172a45] hover:border-[#64ffda]/50'
                          }`}
                        >
                          <div className="font-medium text-sm text-[#ccd6f6] mb-1">{project.name}</div>
                          <div className="text-xs text-[#8892b0] line-clamp-1">{project.short_description}</div>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Project Pagination */}
                  {projects.length > 0 && (
                    <div className="mt-4 flex items-center justify-between">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setProjectCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={projectCurrentPage === 1}
                        className="text-[#64ffda] hover:bg-[#64ffda]/10 text-xs"
                      >
                        Previous
                      </Button>
                      <span className="text-xs text-[#8892b0]">Page {projectCurrentPage}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setProjectCurrentPage((p) => p + 1)}
                        disabled={!hasMoreProjects}
                        className="text-[#64ffda] hover:bg-[#64ffda]/10 text-xs"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Members and Available Users Sections */}
              <div className="lg:col-span-2 space-y-6">
                {/* Current Members */}
                <div className="rounded-lg border border-[#172a45] bg-[#112240] p-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-[#ccd6f6] mb-2">
                      Current Members {selectedProject && `(${members.length})`}
                    </h3>
                    {selectedProject ? (
                      <p className="text-xs text-[#8892b0]">Managing: {selectedProject.name}</p>
                    ) : (
                      <p className="text-xs text-[#8892b0]">Select a project to view members</p>
                    )}
                  </div>

                  {selectedProject && (
                    <>
                      {/* Member Search */}
                      <div className="relative mb-4" ref={memberSearchInputRef}>
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8892b0]" />
                        <Input
                          placeholder="Search members..."
                          value={memberSearchQuery}
                          onChange={(e) => handleMemberSearch(e.target.value)}
                          className="pl-9 bg-[#0a192f] border-[#172a45] text-[#ccd6f6] text-sm"
                        />

                        {/* Member Search Results */}
                        {showMemberSearch && memberSearchResults.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-[#0a192f] border border-[#172a45] rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                            {memberSearchResults.map((result) => (
                              <div
                                key={result.user_id}
                                className="px-3 py-2 hover:bg-[#172a45] transition-colors"
                              >
                                <div className="text-sm text-[#ccd6f6]">{result.user?.preferred_name || 'Unknown'}</div>
                                <div className="text-xs text-[#8892b0]">{result.user?.email || ''}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Members List */}
                      <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '252px' }}>
                        {members.length === 0 ? (
                          <div className="text-center py-8 text-sm text-[#8892b0]">
                            No members in this project
                          </div>
                        ) : (
                          members.map((member) => (
                            <div
                              key={member.user_id}
                              className="flex items-center justify-between p-3 rounded-md bg-[#0a192f] border border-[#172a45]"
                            >
                              <div className="flex-1">
                                <div className="font-medium text-sm text-[#ccd6f6]">
                                  {member.user_preferred_name || 'Unknown User'}
                                </div>
                                <div className="text-xs text-[#8892b0]">{member.user_email || ''}</div>
                              </div>
                              <button
                                onClick={() => handleRemoveMember(member.user_id)}
                                className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                title="Remove member"
                              >
                                <UserMinus className="h-4 w-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  )}

                  {!selectedProject && (
                    <div className="text-center py-12 text-sm text-[#8892b0]">
                      Select a project from the left to manage its members
                    </div>
                  )}
                </div>

                {/* Available Users */}
                {selectedProject && (
                  <div className="rounded-lg border border-[#172a45] bg-[#112240] p-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-[#ccd6f6] mb-2">Add Members</h3>
                      <p className="text-xs text-[#8892b0]">Users not yet in this project</p>
                    </div>

                    {/* User Search */}
                    <div className="relative mb-4" ref={userSearchInputRef}>
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8892b0]" />
                      <Input
                        placeholder="Search users..."
                        value={userSearchQuery}
                        onChange={(e) => handleUserSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUserSearch()}
                        className="pl-9 pr-32 bg-[#0a192f] border-[#172a45] text-[#ccd6f6] text-sm"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {userSearchQuery && (
                          <button
                            onClick={clearUserSearch}
                            className="p-1 text-[#8892b0] hover:text-[#ccd6f6] rounded transition-colors"
                            title="Clear search"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                        <Button
                          onClick={handleUserSearch}
                          size="sm"
                          variant="ghost"
                          className="h-7 text-[#64ffda] hover:text-[#64ffda] hover:bg-[#64ffda]/10 text-xs"
                        >
                          Search
                        </Button>
                      </div>

                      {/* User Suggestions */}
                      {showUserSuggestions && userSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-[#0a192f] border border-[#172a45] rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                          {userSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleUserSuggestionClick(suggestion)}
                              className="w-full px-3 py-2 text-left text-xs text-[#ccd6f6] hover:bg-[#172a45] transition-colors flex items-center gap-2"
                            >
                              <Search className="h-3 w-3 text-[#8892b0]" />
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Search Info */}
                    {isUserSearching && userSearchQuery && (
                      <div className="flex items-center justify-between px-3 py-2 mb-2 bg-[#0a192f] border border-[#172a45] rounded-md">
                        <span className="text-xs text-[#8892b0]">
                          Results for: <span className="text-[#64ffda]">"{userSearchQuery}"</span>
                        </span>
                        <button
                          onClick={clearUserSearch}
                          className="text-xs text-[#8892b0] hover:text-[#ccd6f6] transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    )}

                    {/* Available Users List */}
                    <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '252px' }}>
                      {availableUsers.length === 0 ? (
                        <div className="text-center py-8 text-sm text-[#8892b0]">
                          {isUserSearching ? 'No users found' : 'No users available'}
                        </div>
                      ) : (
                        availableUsers.map((availableUser) => {
                          const isMember = members.some(m => m.user_id === availableUser.id);
                          return (
                            <div
                              key={availableUser.id}
                              className={`flex items-center justify-between p-3 rounded-md transition-colors ${
                                isMember
                                  ? 'bg-[#64ffda]/10 border border-[#64ffda]/30'
                                  : 'bg-[#0a192f] border border-[#172a45] hover:border-[#64ffda]/50'
                              }`}
                            >
                              <div className="flex-1">
                                <div className="font-medium text-sm text-[#ccd6f6]">
                                  {availableUser.preferred_name}
                                  {isMember && (
                                    <span className="ml-2 text-xs text-[#64ffda]">(Member)</span>
                                  )}
                                </div>
                                <div className="text-xs text-[#8892b0]">{availableUser.email}</div>
                              </div>
                              <button
                                onClick={() => handleAddMember(availableUser.id)}
                                disabled={isMember}
                                className={`p-2 rounded transition-colors ${
                                  isMember
                                    ? 'text-[#8892b0] cursor-not-allowed opacity-50'
                                    : 'text-[#64ffda] hover:bg-[#64ffda]/10'
                                }`}
                                title={isMember ? 'Already a member' : 'Add member'}
                              >
                                <UserPlus className="h-4 w-4" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* User Pagination */}
                    {availableUsers.length > 0 && (
                      <div className="mt-4 flex items-center justify-between">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setUserCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={userCurrentPage === 1}
                          className="text-[#64ffda] hover:bg-[#64ffda]/10 text-xs"
                        >
                          Previous
                        </Button>
                        <span className="text-xs text-[#8892b0]">Page {userCurrentPage}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setUserCurrentPage((p) => p + 1)}
                          disabled={!hasMoreUsers}
                          className="text-[#64ffda] hover:bg-[#64ffda]/10 text-xs"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}