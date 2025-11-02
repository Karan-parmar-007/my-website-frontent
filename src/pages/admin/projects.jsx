import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { projectsApi } from '@/lib/projects_apis';
import { rolesApi } from '@/lib/roles_apis';
import { accessLevelsApi } from '@/lib/access_levels_apis';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Home, UsersIcon, FolderKanban, Users, Briefcase, Shield, LogOut, Plus, Pencil, Trash2, Search, X, ExternalLink } from 'lucide-react';

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

export default function ProjectsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [accessLevels, setAccessLevels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [projectDialog, setProjectDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [projectForm, setProjectForm] = useState({
    name: '',
    short_description: '',
    long_description: '',
    skills_used: [],
    github_link_backend: '',
    github_link_frontend: '',
    docker_image_link_backend: '',
    docker_image_link_frontend: '',
    contributors: {},  // Changed to object
    is_interesting_project: false,
    is_live: false,
    access_level_id: '',
    ngrok_url: '',
  });
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentContributorName, setCurrentContributorName] = useState('');  // Changed
  const [currentContributorUsername, setCurrentContributorUsername] = useState('');  // Added

  const searchTimeoutRef = useRef(null);
  const suggestionTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
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
      const [projectsData, accessLevelsData] = await Promise.all([
        isSearching && searchQuery
          ? projectsApi.searchProjects(searchQuery, currentPage, pageSize)
          : projectsApi.getAllProjects(currentPage, pageSize),
        accessLevelsApi.getAllAccessLevels(),
      ]);

      setProjects(projectsData);
      setHasMorePages(projectsData.length === pageSize);
      setAccessLevels(accessLevelsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInput = (value) => {
    setSearchQuery(value);

    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }

    if (value.length >= 2) {
      suggestionTimeoutRef.current = setTimeout(async () => {
        try {
          const suggestions = await projectsApi.getProjectSuggestions(value);
          setSuggestions(suggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Failed to fetch suggestions:', error);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      clearSearch();
      return;
    }

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
    
    // Trigger search immediately with the suggestion
    setTimeout(async () => {
      try {
        setLoading(true);
        const projectsData = await projectsApi.searchProjects(suggestion, 1, pageSize);
        setProjects(projectsData);
        setHasMorePages(projectsData.length === pageSize);
      } catch (error) {
        console.error('Failed to search projects:', error);
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
    
    // Fetch all projects after clearing search state
    setTimeout(async () => {
      try {
        setLoading(true);
        const projectsData = await projectsApi.getAllProjects(1, pageSize);
        setProjects(projectsData);
        setHasMorePages(projectsData.length === pageSize);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    }, 0);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(projectForm).forEach((key) => {
        if (key === 'skills_used') {
          // Don't append if empty
          if (projectForm[key].length === 0) return;
          
          // Append skills as JSON array
          formData.append('skills_used', JSON.stringify(projectForm[key]));
        } else if (key === 'contributors') {
          formData.append(key, JSON.stringify(projectForm[key]));
        } else if (typeof projectForm[key] === 'boolean') {
          formData.append(key, projectForm[key]);
        } else if (projectForm[key] !== '' && projectForm[key] !== null) {
          formData.append(key, projectForm[key]);
        }
      });

      // Append image if selected (use correct field name 'project_image')
      if (imageFile) {
        formData.append('project_image', imageFile);
      }

      if (editingProject) {
        await projectsApi.updateProject(editingProject.id, formData);
      } else {
        await projectsApi.createProject(formData);
      }

      setProjectDialog(false);
      resetForm();
      await fetchData();
    } catch (error) {
      console.error('Failed to save project:', error);
      alert(error.response?.data?.detail || 'Failed to save project. Please try again.');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await projectsApi.deleteProject(projectId);
      fetchData();
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const openEditProject = (project) => {
    setEditingProject(project);
    
    // Parse skills_used properly - handle various formats from backend
    let skills = [];
    if (Array.isArray(project.skills_used)) {
      skills = project.skills_used.map(skill => {
        if (typeof skill === 'string') {
          try {
            // Try to parse if it's a JSON-encoded string
            const parsed = JSON.parse(skill);
            return parsed;
          } catch {
            // If parsing fails, use the string as-is
            return skill;
          }
        }
        return skill;
      }).flat(); // Flatten the nested array
    } else if (typeof project.skills_used === 'string') {
      try {
        skills = JSON.parse(project.skills_used);
      } catch {
        skills = [project.skills_used];
      }
    }
    
    // Parse contributors properly
    let contributors = {};
    if (project.contributors) {
      if (typeof project.contributors === 'string') {
        try {
          contributors = JSON.parse(project.contributors);
        } catch {
          contributors = {};
        }
      } else if (typeof project.contributors === 'object') {
        contributors = project.contributors;
      }
    }
    
    setProjectForm({
      name: project.name,
      short_description: project.short_description,
      long_description: project.long_description,
      skills_used: skills,
      github_link_backend: project.github_link_backend || '',
      github_link_frontend: project.github_link_frontend || '',
      docker_image_link_backend: project.docker_image_link_backend || '',
      docker_image_link_frontend: project.docker_image_link_frontend || '',
      contributors: contributors,
      is_interesting_project: project.is_interesting_project,
      is_live: project.is_live,
      access_level_id: project.access_level_id || '',
      ngrok_url: project.ngrok_url || '',
    });
    
    // Clear the file input and set preview if image exists
    setImageFile(null);
    if (project.project_image_base_six_four) {
      setImagePreview(`data:image/jpeg;base64,${project.project_image_base_six_four}`);
    } else {
      setImagePreview(null);
    }
    
    setProjectDialog(true);
  };

  const resetForm = () => {
    setEditingProject(null);
    setProjectForm({
      name: '',
      short_description: '',
      long_description: '',
      skills_used: [],
      github_link_backend: '',
      github_link_frontend: '',
      docker_image_link_backend: '',
      docker_image_link_frontend: '',
      contributors: {},  // Changed
      is_interesting_project: false,
      is_live: false,
      access_level_id: '',
      ngrok_url: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setCurrentSkill('');
    setCurrentContributorName('');  // Changed
    setCurrentContributorUsername('');  // Added
  };

  const addSkill = () => {
    if (currentSkill.trim() && !projectForm.skills_used.includes(currentSkill.trim())) {
      setProjectForm({
        ...projectForm,
        skills_used: [...projectForm.skills_used, currentSkill.trim()],
      });
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill) => {
    setProjectForm({
      ...projectForm,
      skills_used: projectForm.skills_used.filter((s) => s !== skill),
    });
  };

  const addContributor = () => {
    const name = currentContributorName.trim();
    const username = currentContributorUsername.trim();
    
    if (name && username && !projectForm.contributors[name]) {
      setProjectForm({
        ...projectForm,
        contributors: {
          ...projectForm.contributors,
          [name]: username,
        },
      });
      setCurrentContributorName('');
      setCurrentContributorUsername('');
    }
  };

  const removeContributor = (name) => {
    const newContributors = { ...projectForm.contributors };
    delete newContributors[name];
    setProjectForm({
      ...projectForm,
      contributors: newContributors,
    });
  };

  const getStatusBadge = (isLive) => {
    return isLive ? (
      <span className="inline-flex items-center rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-400">
        Live
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full bg-[#8892b0]/20 px-2.5 py-0.5 text-xs font-medium text-[#8892b0]">
        Draft
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
    const pages = [];
    
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

    if (currentPage > 3) {
      pages.push(<PaginationEllipsis key="ellipsis-start" />);
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, currentPage + (hasMorePages ? 1 : 0)); i++) {
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
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold text-[#ccd6f6]">Projects</h1>
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
                <h2 className="text-2xl font-bold text-[#ccd6f6]">Projects</h2>
                <p className="text-sm text-[#8892b0]">Manage your project portfolio</p>
              </div>
              <Button
                onClick={() => {
                  resetForm();
                  setProjectDialog(true);
                }}
                size="sm"
                variant="outline"
                className="border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative" ref={searchInputRef}>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8892b0]" />
              <Input
                placeholder="Search projects by name..."
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

            {/* Projects Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <div className="col-span-full text-center py-8">
                  <div className="text-[#64ffda]">Loading...</div>
                </div>
              ) : projects.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <div className="text-[#8892b0]">
                    {isSearching ? 'No projects found matching your search.' : 'No projects found.'}
                  </div>
                </div>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-lg border border-[#172a45] bg-[#112240] overflow-hidden hover:border-[#64ffda]/50 transition-colors"
                  >
                    {/* Project Image */}
                    {project.project_image_base_six_four && (
                      <div className="w-full h-48 bg-[#0a192f] flex items-center justify-center overflow-hidden">
                        <img
                          src={`data:image/jpeg;base64,${project.project_image_base_six_four}`}
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="p-6 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[#ccd6f6] mb-1">{project.name}</h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            {getStatusBadge(project.is_live)}
                            {project.is_interesting_project && (
                              <span className="inline-flex items-center rounded-full bg-[#64ffda]/20 px-2.5 py-0.5 text-xs font-medium text-[#64ffda]">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-[#8892b0] line-clamp-2">{project.short_description}</p>

                      {/* Skills */}
                      {project.skills_used && project.skills_used.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.skills_used.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-full bg-[#172a45] px-2 py-1 text-xs text-[#8892b0]"
                            >
                              {skill}
                            </span>
                          ))}
                          {project.skills_used.length > 3 && (
                            <span className="inline-flex items-center rounded-full bg-[#172a45] px-2 py-1 text-xs text-[#8892b0]">
                              +{project.skills_used.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Links */}
                      <div className="flex items-center gap-2 text-xs">
                        {project.github_link_frontend && (
                          <a
                            href={project.github_link_frontend}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#64ffda] hover:underline flex items-center gap-1"
                          >
                            Frontend <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {project.github_link_backend && (
                          <a
                            href={project.github_link_backend}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#64ffda] hover:underline flex items-center gap-1"
                          >
                            Backend <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#172a45]">
                        <span className="text-xs text-[#8892b0]">
                          Updated: {formatDate(project.updated_at)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditProject(project)}
                            className="p-2 text-[#64ffda] hover:bg-[#64ffda]/10 rounded transition-colors"
                            title="Edit project"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                            title="Delete project"
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

            {/* Pagination */}
            {!loading && projects.length > 0 && (
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

      {/* Project Dialog */}
      <Dialog open={projectDialog} onOpenChange={setProjectDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#ccd6f6]">
              {editingProject ? 'Edit Project' : 'Add Project'}
            </DialogTitle>
            <DialogDescription className="text-[#8892b0]">
              {editingProject ? 'Update project details' : 'Create a new project'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProjectSubmit}>
            <div className="space-y-4">
              {/* Basic Info */}
              <div>
                <Label htmlFor="project-name" className="text-[#ccd6f6]">Project Name *</Label>
                <Input
                  id="project-name"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  required
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                />
              </div>

              <div>
                <Label htmlFor="project-short-desc" className="text-[#ccd6f6]">Short Description *</Label>
                <Input
                  id="project-short-desc"
                  value={projectForm.short_description}
                  onChange={(e) => setProjectForm({ ...projectForm, short_description: e.target.value })}
                  required
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                />
              </div>

              <div>
                <Label htmlFor="project-long-desc" className="text-[#ccd6f6]">Long Description *</Label>
                <Textarea
                  id="project-long-desc"
                  value={projectForm.long_description}
                  onChange={(e) => setProjectForm({ ...projectForm, long_description: e.target.value })}
                  required
                  rows={4}
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                />
              </div>

              {/* Skills Used */}
              <div>
                <Label className="text-[#ccd6f6]">Skills Used</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill..."
                    className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                  />
                  <Button
                    type="button"
                    onClick={addSkill}
                    variant="outline"
                    size="sm"
                    className="border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {projectForm.skills_used.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 rounded-full bg-[#172a45] px-3 py-1 text-sm text-[#ccd6f6]"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Contributors */}
              <div>
                <Label className="text-[#ccd6f6]">Contributors</Label>
                <div className="space-y-2 mb-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={currentContributorName}
                      onChange={(e) => setCurrentContributorName(e.target.value)}
                      placeholder="Contributor name..."
                      className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                    />
                    <Input
                      value={currentContributorUsername}
                      onChange={(e) => setCurrentContributorUsername(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addContributor())}
                      placeholder="GitHub username..."
                      className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={addContributor}
                    variant="outline"
                    size="sm"
                    className="w-full border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contributor
                  </Button>
                </div>
                <div className="space-y-2">
                  {Object.entries(projectForm.contributors).map(([name, username]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between rounded-md bg-[#172a45] px-3 py-2"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-[#ccd6f6]">{name}</div>
                        <div className="text-xs text-[#8892b0]">@{username}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeContributor(name)}
                        className="p-1 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                        title="Remove contributor"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {Object.keys(projectForm.contributors).length === 0 && (
                    <div className="text-center py-4 text-sm text-[#8892b0]">
                      No contributors added yet
                    </div>
                  )}
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="github-frontend" className="text-[#ccd6f6]">GitHub Frontend</Label>
                  <Input
                    id="github-frontend"
                    value={projectForm.github_link_frontend}
                    onChange={(e) => setProjectForm({ ...projectForm, github_link_frontend: e.target.value })}
                    className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                  />
                </div>
                <div>
                  <Label htmlFor="github-backend" className="text-[#ccd6f6]">GitHub Backend</Label>
                  <Input
                    id="github-backend"
                    value={projectForm.github_link_backend}
                    onChange={(e) => setProjectForm({ ...projectForm, github_link_backend: e.target.value })}
                    className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="docker-frontend" className="text-[#ccd6f6]">Docker Frontend</Label>
                  <Input
                    id="docker-frontend"
                    value={projectForm.docker_image_link_frontend}
                    onChange={(e) => setProjectForm({ ...projectForm, docker_image_link_frontend: e.target.value })}
                    className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                  />
                </div>
                <div>
                  <Label htmlFor="docker-backend" className="text-[#ccd6f6]">Docker Backend</Label>
                  <Input
                    id="docker-backend"
                    value={projectForm.docker_image_link_backend}
                    onChange={(e) => setProjectForm({ ...projectForm, docker_image_link_backend: e.target.value })}
                    className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="ngrok-url" className="text-[#ccd6f6]">Ngrok URL</Label>
                <Input
                  id="ngrok-url"
                  value={projectForm.ngrok_url}
                  onChange={(e) => setProjectForm({ ...projectForm, ngrok_url: e.target.value })}
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                />
              </div>

              {/* Access Level */}
              <div>
                <Label htmlFor="access-level" className="text-[#ccd6f6]">Access Level</Label>
                <select
                  id="access-level"
                  value={projectForm.access_level_id}
                  onChange={(e) => setProjectForm({ ...projectForm, access_level_id: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-[#172a45] bg-[#0a192f] px-3 py-1 text-sm text-[#ccd6f6] shadow-xs transition-colors focus-visible:border-[#64ffda] focus-visible:ring-[#64ffda]/20 focus-visible:ring-[3px] outline-none"
                >
                  <option value="">Public</option>
                  {accessLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <Label htmlFor="project-image" className="text-[#ccd6f6]">Project Image</Label>
                <Input
                  id="project-image"
                  key={editingProject?.id || 'new'} // Add key to force re-render
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-md border border-[#172a45]"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="mt-2 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      Remove Image
                    </Button>
                  </div>
                )}
              </div>

              {/* Checkboxes */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is-live"
                    checked={projectForm.is_live}
                    onChange={(e) => setProjectForm({ ...projectForm, is_live: e.target.checked })}
                    className="h-4 w-4 rounded border-[#172a45] bg-[#0a192f] text-[#64ffda] focus:ring-[#64ffda]"
                  />
                  <Label htmlFor="is-live" className="font-normal text-[#ccd6f6]">
                    Is Live
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is-interesting"
                    checked={projectForm.is_interesting_project}
                    onChange={(e) => setProjectForm({ ...projectForm, is_interesting_project: e.target.checked })}
                    className="h-4 w-4 rounded border-[#172a45] bg-[#0a192f] text-[#64ffda] focus:ring-[#64ffda]"
                  />
                  <Label htmlFor="is-interesting" className="font-normal text-[#ccd6f6]">
                    Featured Project
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setProjectDialog(false);
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
                {editingProject ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}