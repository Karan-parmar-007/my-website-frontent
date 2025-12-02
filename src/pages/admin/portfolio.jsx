import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, FolderKanban, Users, Briefcase, LogOut, Plus, Edit,UsersIcon, Trash2, Upload, X, Shield } from 'lucide-react';
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
import { portfolioAdminApi } from '@/lib/portfolio_admin_apis';

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
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
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

export default function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [education, setEducation] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skillCategories, setSkillCategories] = useState([]);
  
  // Dialog states
  const [educationDialog, setEducationDialog] = useState(false);
  const [workDialog, setWorkDialog] = useState(false);
  const [skillDialog, setSkillDialog] = useState(false);
  const [categoryDialog, setCategoryDialog] = useState(false);
  
  // Form states
  const [currentEducation, setCurrentEducation] = useState(null);
  const [currentWork, setCurrentWork] = useState(null);
  const [currentSkill, setCurrentSkill] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  
  // Work experience description state
  const [workDescriptions, setWorkDescriptions] = useState([]);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    headline: '',
    about: '',
    github_url: '',
    linkedin_url: '',
    instagram: '',
    profile_image: null,
    resume_file: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, eduRes, workRes, skillsRes, categoriesRes] = await Promise.allSettled([
        portfolioAdminApi.getProfileInfo(),
        portfolioAdminApi.getEducation(),
        portfolioAdminApi.getWorkExperience(),
        portfolioAdminApi.getSkills(),
        portfolioAdminApi.getSkillCategories(),
      ]);

      if (profileRes.status === 'fulfilled') {
        setProfileData(profileRes.value);
        setProfileForm({
          name: profileRes.value.name || '',
          email: profileRes.value.email || '',
          phone: profileRes.value.phone || '',
          headline: profileRes.value.headline || '',
          about: profileRes.value.about || '',
          github_url: profileRes.value.github_url || '',
          linkedin_url: profileRes.value.linkedin_url || '',
          instagram: profileRes.value.instagram || '',
          profile_image: null,
          resume_file: null,
        });
      }
      if (eduRes.status === 'fulfilled') setEducation(eduRes.value);
      if (workRes.status === 'fulfilled') setWorkExperience(workRes.value);
      if (skillsRes.status === 'fulfilled') setSkills(skillsRes.value);
      if (categoriesRes.status === 'fulfilled') setSkillCategories(categoriesRes.value);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(profileForm).forEach((key) => {
        if (profileForm[key] !== null && profileForm[key] !== '') {
          formData.append(key, profileForm[key]);
        }
      });

      if (profileData) {
        await portfolioAdminApi.updateProfileInfo(formData);
      } else {
        await portfolioAdminApi.createProfileInfo(formData);
      }
      
      await fetchData();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    }
  };

  const handleEducationSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const endYearValue = formData.get('end_year');
    const data = {
      school: formData.get('school'),
      degree: formData.get('degree'),
      start_year: parseInt(formData.get('start_year')),
      end_year: endYearValue && endYearValue.trim() !== '' ? parseInt(endYearValue) : null,
      Score: formData.get('Score') ? parseFloat(formData.get('Score')) : null,
      description: formData.get('description') || null,
      sequence: parseInt(formData.get('sequence')),
    };

    if (currentEducation) {
      data.id = currentEducation.id;
    }

    try {
      if (currentEducation) {
        await portfolioAdminApi.updateEducation(data);
      } else {
        await portfolioAdminApi.createEducation(data);
      }
      await fetchData();
      setEducationDialog(false);
      setCurrentEducation(null);
    } catch (error) {
      console.error('Error saving education:', error);
      alert('Failed to save education');
    }
  };

  const handleWorkSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const endDateValue = form.get('end_date');
    const data = {
      company: form.get('company'),
      position: form.get('position'),
      start_date: form.get('start_date'),
      end_date: endDateValue && endDateValue.trim() !== '' ? endDateValue : null,
      description: workDescriptions.filter(desc => desc.trim() !== ''),
      sequence: parseInt(form.get('sequence')),
    };

    try {
      if (currentWork) {
        await portfolioAdminApi.updateWorkExperience({ id: currentWork.id, ...data });
      } else {
        await portfolioAdminApi.createWorkExperience(data);
      }
      await fetchData();
      setWorkDialog(false);
      setCurrentWork(null);
      setWorkDescriptions([]);
    } catch (error) {
      console.error('Error saving work experience:', error);
      alert('Failed to save work experience');
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = {
      name: form.get('name')
    };

    try {
      if (currentCategory) {
        await portfolioAdminApi.updateSkillCategory({ id: currentCategory.id, ...data });
      } else {
        await portfolioAdminApi.createSkillCategory(data);
      }
      await fetchData();
      setCategoryDialog(false);
      setCurrentCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const formData = new FormData();
    
    formData.append('name', form.get('name'));
    formData.append('category_id', form.get('category_id'));
    if (currentSkill) {
      formData.append('id', currentSkill.id);
    }
    
    const imageFile = form.get('icon_image');
    if (imageFile && imageFile.size > 0) {
      formData.append('icon_image', imageFile);
    }

    try {
      if (currentSkill) {
        await portfolioAdminApi.updateSkill(formData);
      } else {
        await portfolioAdminApi.createSkill(formData);
      }
      await fetchData();
      setSkillDialog(false);
      setCurrentSkill(null);
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Failed to save skill');
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      switch (type) {
        case 'education':
          await portfolioAdminApi.deleteEducation(id);
          break;
        case 'work':
          await portfolioAdminApi.deleteWorkExperience(id);
          break;
        case 'skill':
          await portfolioAdminApi.deleteSkill(id);
          break;
        case 'category':
          await portfolioAdminApi.deleteSkillCategory(id);
          break;
      }
      await fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete item');
    }
  };

  const addWorkDescription = () => {
    setWorkDescriptions([...workDescriptions, '']);
  };

  const removeWorkDescription = (index) => {
    setWorkDescriptions(workDescriptions.filter((_, i) => i !== index));
  };

  const updateWorkDescription = (index, value) => {
    const newDescriptions = [...workDescriptions];
    newDescriptions[index] = value;
    setWorkDescriptions(newDescriptions);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Current';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex-1 flex items-center justify-center min-h-screen bg-[#0a192f]">
          <div className="text-[#64ffda]">Loading...</div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex-1 flex flex-col min-h-screen">
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[#172a45] bg-[#112240] px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold text-[#ccd6f6]">Portfolio Management</h1>
        </header>
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-[#0a192f] overflow-auto">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Profile Section */}
            <div className="rounded-lg border border-[#172a45] bg-[#112240] p-6">
              <h2 className="text-xl font-semibold text-[#ccd6f6] mb-6">Profile Information</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-[#ccd6f6]">Name</Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[#ccd6f6]">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-[#ccd6f6]">Phone</Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="headline" className="text-[#ccd6f6]">Headline</Label>
                    <Input
                      id="headline"
                      value={profileForm.headline}
                      onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                      className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="about" className="text-[#ccd6f6]">About</Label>
                  <Textarea
                    id="about"
                    value={profileForm.about}
                    onChange={(e) => setProfileForm({ ...profileForm, about: e.target.value })}
                    className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="github_url" className="text-[#ccd6f6]">GitHub URL</Label>
                    <Input
                      id="github_url"
                      value={profileForm.github_url}
                      onChange={(e) => setProfileForm({ ...profileForm, github_url: e.target.value })}
                      className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin_url" className="text-[#ccd6f6]">LinkedIn URL</Label>
                    <Input
                      id="linkedin_url"
                      value={profileForm.linkedin_url}
                      onChange={(e) => setProfileForm({ ...profileForm, linkedin_url: e.target.value })}
                      className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram" className="text-[#ccd6f6]">Instagram</Label>
                    <Input
                      id="instagram"
                      value={profileForm.instagram}
                      onChange={(e) => setProfileForm({ ...profileForm, instagram: e.target.value })}
                      className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="profile_image" className="text-[#ccd6f6]">Profile Image</Label>
                    <Input
                      id="profile_image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfileForm({ ...profileForm, profile_image: e.target.files[0] })}
                      className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="resume_file" className="text-[#ccd6f6]">Resume File</Label>
                    <Input
                      id="resume_file"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setProfileForm({ ...profileForm, resume_file: e.target.files[0] })}
                      className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="outline"
                  className="border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10"
                >
                  Save Profile
                </Button>
              </form>
            </div>

            {/* Education Section */}
            <div className="rounded-lg border border-[#172a45] bg-[#112240] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#ccd6f6]">Education</h2>
                <Button
                  onClick={() => {
                    setCurrentEducation(null);
                    setEducationDialog(true);
                  }}
                  size="sm"
                  variant="outline"
                  className="border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </div>
              <div className="space-y-4">
                {[...education].sort((a, b) => {
                  if (a.sequence !== b.sequence) {
                    return a.sequence - b.sequence;
                  }
                  return new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at);
                }).map((edu) => (
                  <div key={edu.id} className="p-4 bg-[#0a192f] rounded-lg border border-[#172a45]">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-[#ccd6f6]">{edu.degree}</h3>
                        <p className="text-[#8892b0]">{edu.institution}</p>
                        <p className="text-sm text-[#8892b0]">{edu.field_of_study}</p>
                        <p className="text-sm text-[#64ffda]">
                          {edu.start_year} - {edu.end_year ? edu.end_year : 'Current'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setCurrentEducation(edu);
                            setEducationDialog(true);
                          }}
                          className="p-2 text-[#64ffda] hover:bg-[#64ffda]/10 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('education', edu.id)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Experience Section */}
            <div className="rounded-lg border border-[#172a45] bg-[#112240] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#ccd6f6]">Work Experience</h2>
                <Button
                  onClick={() => {
                    setCurrentWork(null);
                    setWorkDescriptions(['']);
                    setWorkDialog(true);
                  }}
                  size="sm"
                  variant="outline"
                  className="border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </div>
              <div className="space-y-4">
                {[...workExperience].sort((a, b) => {
                  if (a.sequence !== b.sequence) {
                    return a.sequence - b.sequence;
                  }
                  return new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at);
                }).map((work) => (
                  <div key={work.id} className="p-4 bg-[#0a192f] rounded-lg border border-[#172a45]">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#ccd6f6]">{work.position}</h3>
                        <p className="text-[#8892b0]">{work.company}</p>
                        <p className="text-sm text-[#64ffda] mb-2">
                          {formatDate(work.start_date)} - {formatDate(work.end_date)}
                        </p>
                        {work.description && Array.isArray(work.description) && (
                          <ul className="list-disc list-inside space-y-1 text-sm text-[#8892b0] mt-2">
                            {work.description.map((desc, idx) => (
                              <li key={idx}>{desc}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setCurrentWork(work);
                            setWorkDescriptions(work.description || []);
                            setWorkDialog(true);
                          }}
                          className="p-2 text-[#64ffda] hover:bg-[#64ffda]/10 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('work', work.id)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Section */}
            <div className="rounded-lg border border-[#172a45] bg-[#112240] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#ccd6f6]">Skills</h2>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setCurrentCategory(null);
                      setCategoryDialog(true);
                    }}
                    size="sm"
                    variant="outline"
                    className="border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentSkill(null);
                      setSkillDialog(true);
                    }}
                    size="sm"
                    variant="outline"
                    className="border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                </div>
              </div>
              
              <div className="space-y-6">
                {skillCategories.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-[#64ffda]">{category.name}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setCurrentCategory(category);
                            setCategoryDialog(true);
                          }}
                          className="p-2 text-[#64ffda] hover:bg-[#64ffda]/10 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('category', category.id)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {skills
                        .filter((skill) => skill.category_id === category.id)
                        .map((skill) => (
                          <div
                            key={skill.id}
                            className="p-3 bg-[#0a192f] rounded-lg border border-[#172a45] flex items-center justify-between"
                          >
                            <span className="text-[#ccd6f6]">{skill.name}</span>
                            <div className="flex gap-1">
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => {
                                  setCurrentSkill(skill);
                                  setSkillDialog(true);
                                }}
                                className="p-2 text-[#64ffda] hover:bg-[#64ffda]/10 rounded transition-colors"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => handleDelete('skill', skill.id)}
                                className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>

      {/* Education Dialog */}
      <Dialog open={educationDialog} onOpenChange={setEducationDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentEducation ? 'Edit Education' : 'Add Education'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEducationSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[#ccd6f6]" htmlFor="school">School/Institution</Label>
              <Input
                id="school"
                name="school"
                defaultValue={currentEducation?.school}
                required
                className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#ccd6f6]" htmlFor="degree">Degree/Certification</Label>
              <Input
                id="degree"
                name="degree"
                defaultValue={currentEducation?.degree}
                required
                className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#ccd6f6]" htmlFor="start_year">Start Year</Label>
                <Input
                  id="start_year"
                  name="start_year"
                  type="number"
                  defaultValue={currentEducation?.start_year}
                  required
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#ccd6f6]" htmlFor="end_year">End Year (Optional)</Label>
                <Input
                  id="end_year"
                  name="end_year"
                  type="number"
                  defaultValue={currentEducation?.end_year}
                  placeholder="Leave empty for current"
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[#ccd6f6]" htmlFor="Score">Score/Grade (%)</Label>
              <Input
                id="Score"
                name="Score"
                type="number"
                step="0.01"
                defaultValue={currentEducation?.Score}
                className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#ccd6f6]" htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={currentEducation?.description}
                rows={3}
                className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#ccd6f6]" htmlFor="sequence">Sequence</Label>
              <Input
                id="sequence"
                name="sequence"
                type="number"
                defaultValue={currentEducation?.sequence || 1}
                required
                className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#64ffda] text-[#0a192f] hover:bg-[#64ffda]/90">
                {currentEducation ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Work Experience Dialog */}
      <Dialog open={workDialog} onOpenChange={setWorkDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentWork ? 'Edit' : 'Add'} Work Experience</DialogTitle>
            <DialogDescription>Fill in the work experience details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWorkSubmit} className="space-y-4">
            <div>
              <Label htmlFor="company" className="text-[#ccd6f6]">Company</Label>
              <Input
                id="company"
                name="company"
                defaultValue={currentWork?.company}
                required
                className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
              />
            </div>
            <div>
              <Label htmlFor="position" className="text-[#ccd6f6]">Position</Label>
              <Input
                id="position"
                name="position"
                defaultValue={currentWork?.position}
                required
                className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date" className="text-[#ccd6f6]">Start Date</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  defaultValue={currentWork?.start_date}
                  required
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6] [color-scheme:dark]"
                  style={{colorScheme: 'dark'}}
                />
              </div>
              <div>
                <Label htmlFor="end_date" className="text-[#ccd6f6]">End Date (Optional)</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  defaultValue={currentWork?.end_date}
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6] [color-scheme:dark]"
                  style={{colorScheme: 'dark'}}
                  placeholder="Leave empty for current"
                />
              </div>
            </div>
            <div>
              <Label className="text-[#ccd6f6]">Description (List)</Label>
              <div className="space-y-2 mt-2">
                {workDescriptions.map((desc, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={desc}
                      onChange={(e) => updateWorkDescription(index, e.target.value)}
                      className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
                      placeholder={`Description point ${index + 1}`}
                    />
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => removeWorkDescription(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addWorkDescription}
                  className="border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Description Point
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="sequence" className="text-[#ccd6f6]">Sequence</Label>
              <Input
                id="sequence"
                name="sequence"
                type="number"
                defaultValue={currentWork?.sequence || 0}
                required
                className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
              />
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setWorkDialog(false)}
                className="border-[#172a45] text-[#8892b0] hover:bg-[#172a45] hover:text-[#ccd6f6]"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="outline"
                className="border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Skill Category Dialog */}
      <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentCategory ? 'Edit' : 'Add'} Skill Category</DialogTitle>
            <DialogDescription>Fill in the category details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-[#ccd6f6]">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={currentCategory?.name}
                required
                className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
              />
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setCategoryDialog(false)}
                className="border-[#172a45] text-[#8892b0] hover:bg-[#172a45] hover:text-[#ccd6f6]"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="outline"
                className="border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Skill Dialog */}
      <Dialog open={skillDialog} onOpenChange={setSkillDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentSkill ? 'Edit' : 'Add'} Skill</DialogTitle>
            <DialogDescription>Fill in the skill details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSkillSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-[#ccd6f6]">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={currentSkill?.name}
                required
                className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
              />
            </div>
            <div>
              <Label htmlFor="category_id" className="text-[#ccd6f6]">Category</Label>
              <select
                id="category_id"
                name="category_id"
                defaultValue={currentSkill?.category_id}
                required
                className="w-full h-9 rounded-md border border-[#172a45] bg-[#0a192f] text-[#ccd6f6] px-3"
              >
                <option value="">Select a category</option>
                {skillCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="icon_image" className="text-[#ccd6f6]">Icon Image</Label>
              <Input
                id="icon_image"
                name="icon_image"
                type="file"
                accept="image/*"
                className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6]"
              />
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setSkillDialog(false)}
                className="border-[#172a45] text-[#8892b0] hover:bg-[#172a45] hover:text-[#ccd6f6]"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="outline"
                className="border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}