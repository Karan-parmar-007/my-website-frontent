import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import SocialLinks from '@/components/social-links';
import EmailLink from '@/components/email-link';
import WorkExperience from '@/components/work-experience';
import EducationCard from '@/components/education-card';
import Footer from '@/components/footer';
import Loader from '@/components/loader';
import { Button } from '@/components/ui/button';
import { portfolioApi } from '@/lib/portfolio_apis';
import { publicProjectsApi } from '@/lib/public_projects_apis';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Icon components
const ExternalLink = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
);

const Github = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
);

const Folder = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
);

const Docker = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M3 8h3v3H3zm4 0h3v3H7zm4 0h3v3h-3zm4 0h3v3h-3zm-8-4h3v3H7zm4 0h3v3h-3z"></path>
        <path d="M2 15c0 3.5 2.5 6.5 6 7 .5.1 1 .1 1.5.1 4.4 0 8-2.5 9-6 .3-.8.4-1.7.5-2.5.1-1.2.1-2.4 0-3.6-.1-.7-.2-1.4-.4-2-.4-1.1-1.1-2-2-2.8"></path>
    </svg>
);

const Users = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

const Shield = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);

export default function Home() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [workExperience, setWorkExperience] = useState([]);
    const [education, setEducation] = useState([]);
    const [featuredProjects, setFeaturedProjects] = useState([]);
    const [otherProjects, setOtherProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeWork, setActiveWork] = useState(null);
    const [showContent, setShowContent] = useState(false);

    // Helper function to parse skills
    const parseSkills = (skillsArray) => {
        if (!Array.isArray(skillsArray)) return [];
        return skillsArray
            .map((skill) => {
                if (typeof skill === 'string') {
                    try {
                        const parsed = JSON.parse(skill);
                        return Array.isArray(parsed) ? parsed : [parsed];
                    } catch {
                        return [skill];
                    }
                }
                return [skill];
            })
            .flat();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const calls = [
                    portfolioApi.getProfileInfo(),
                    portfolioApi.getWorkExperience(),
                    portfolioApi.getEducation(),
                    publicProjectsApi.getFeaturedProjects(),
                    publicProjectsApi.getLatestProjects(),
                ];

                const [profileRes, workRes, eduRes, featuredRes, latestRes] = await Promise.allSettled(calls);

                const profile = profileRes.status === 'fulfilled' ? profileRes.value : null;
                const work = workRes.status === 'fulfilled' ? workRes.value : [];
                const edu = eduRes.status === 'fulfilled' ? eduRes.value : [];
                const featured = featuredRes.status === 'fulfilled' ? featuredRes.value : [];
                const latest = latestRes.status === 'fulfilled' ? latestRes.value : [];

                if (profileRes.status === 'rejected') console.warn('getProfileInfo failed', profileRes.reason);
                if (workRes.status === 'rejected') console.warn('getWorkExperience failed', workRes.reason);
                if (eduRes.status === 'rejected') console.warn('getEducation failed', eduRes.reason);
                if (featuredRes.status === 'rejected') console.warn('getFeaturedProjects failed', featuredRes.reason);
                if (latestRes.status === 'rejected') console.warn('getLatestProjects failed', latestRes.reason);

                setProfileData(profile);

                const sortedWorkExperience = work.sort((a, b) => b.sequence - a.sequence);
                setWorkExperience(sortedWorkExperience);

                const sortedEducation = edu.sort((a, b) => b.sequence - a.sequence);
                setEducation(sortedEducation);

                setFeaturedProjects(featured);
                setOtherProjects(latest);

                if (sortedWorkExperience.length > 0) {
                    setActiveWork(sortedWorkExperience[0].id);
                }
            } catch (error) {
                console.error('Unexpected error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Wait for both auth and data loading
    if (loading || !showContent || authLoading) {
        return <Loader onLoadComplete={() => setShowContent(true)} />;
    }

    return (
        <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6]">
            <Navbar />
            <SocialLinks />
            <EmailLink />

            {/* Main Content Container with proper spacing for fixed side elements */}
            <main className="pt-32 px-6 md:pl-[140px] md:pr-[140px] lg:pl-[180px] lg:pr-[180px] xl:pl-[230px] xl:pr-[230px]">
                {/* Content wrapper with max-width to prevent overflow */}
                <div className="max-w-[1000px] mx-auto w-full">
                    {/* Hero Section */}
                    <section className="min-h-[calc(100vh-8rem)] flex flex-col justify-center">
                        <p className="text-[#64ffda] mb-4 text-base">Hi, my name is</p>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#ccd6f6] mb-4 break-words">
                            {profileData?.name || 'Karan Parmar'}.
                        </h1>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#8892b0] mb-8 break-words">
                            {profileData?.headline || 'I build things that solves real word problems.'}
                        </h2>
                        {profileData?.resume_file_base64 && (
                            <Button
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = `data:application/pdf;base64,${profileData.resume_file_base64}`;
                                    link.download = 'resume.pdf';
                                    link.click();
                                }}
                                className="w-fit px-7 py-5 border border-[#64ffda] text-[#64ffda] bg-transparent hover:bg-[#64ffda]/10 rounded text-base"
                            >
                                Get Resume
                            </Button>
                        )}
                    </section>

                    {/* About Section */}
                    <section id="about" className="py-20">
                        <div className="flex items-center gap-4 mb-10">
                            <span className="text-[#64ffda] font-mono text-xl flex-shrink-0">01.</span>
                            <h2 className="text-[#ccd6f6] text-2xl md:text-3xl font-bold flex-shrink-0">About Me</h2>
                            <div className="flex-1 h-px bg-[#233554] ml-4" />
                        </div>

                        <div className="grid md:grid-cols-5 gap-12 mt-12">
                            <div className="md:col-span-3">
                                <div className="text-[#8892b0] text-base lg:text-lg space-y-4">
                                    <p>
                                        {profileData?.about ||
                                            "I'm a software engineer focused on building reliable systems and ML-powered products."}
                                    </p>
                                    <p className="text-[#ccd6f6]">
                                        Here are a few technologies I've been working with recently:
                                    </p>
                                    <ul className="grid grid-cols-2 gap-2 mt-6">
                                        {['Python', 'JavaScript', 'React', 'FastAPI', 'PyTorch', 'Docker'].map(
                                            (skill) => (
                                                <li
                                                    key={skill}
                                                    className="relative pl-5 text-[#8892b0] font-mono text-sm"
                                                >
                                                    <span className="absolute left-0 text-[#64ffda]">▹</span>
                                                    {skill}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <div className="relative w-full max-w-[310px] h-[310px] mx-auto">
                                    <div className="relative group">
                                        <div className="relative w-full h-full rounded border-[#64ffda]">
                                            {profileData?.profile_image_base64 ? (
                                                <img
                                                    src={`data:image/jpeg;base64,${profileData.profile_image_base64}`}
                                                    alt="Profile"
                                                    className="rounded w-full h-full object-cover transition-all duration-200"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-[#112240] rounded" />
                                            )}
                                        </div>
                                        <div className="absolute top-4 left-4 w-full h-full border-2 border-[#64ffda] rounded -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-200" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Experience Section */}
                    <WorkExperience
                        workExperience={workExperience}
                        activeWork={activeWork}
                        setActiveWork={setActiveWork}
                    />

                    {/* Education Section */}
                    {education.length > 0 && (
                        <section id="education" className="py-20">
                            <div className="flex items-center gap-4 mb-10">
                                <span className="text-[#64ffda] font-mono text-xl flex-shrink-0">03.</span>
                                <h2 className="text-[#ccd6f6] text-2xl md:text-3xl font-bold flex-shrink-0">Education</h2>
                                <div className="flex-1 h-px bg-[#233554] ml-4" />
                            </div>

                            <div className="grid gap-6 mt-12">
                                {education.map((edu) => (
                                    <EducationCard key={edu.id} education={edu} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Featured Projects */}
                    {featuredProjects.length > 0 && (
                        <section id="work" className="py-20">
                            <div className="flex items-center gap-4 mb-16">
                                <span className="text-[#64ffda] font-mono text-xl flex-shrink-0">04.</span>
                                <h2 className="text-[#ccd6f6] text-2xl md:text-3xl font-bold flex-shrink-0">
                                    Featured Projects
                                </h2>
                                <div className="flex-1 h-px bg-[#233554] ml-4" />
                            </div>

                            <div className="space-y-24">
                                {featuredProjects.map((project, index) => {
                                    const skills = parseSkills(project.skills_used);
                                    const hasBackend = project.github_link_backend;
                                    const hasFrontend = project.github_link_frontend;
                                    const hasDockerBackend = project.docker_image_link_backend;
                                    const hasDockerFrontend = project.docker_image_link_frontend;
                                    const contributors = project.contributors || {};
                                    const hasContributors = Object.keys(contributors).length > 0;

                                    return (
                                        <div 
                                            key={project.id} 
                                            className="group relative bg-[#112240] rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-[#64ffda]/10 transition-all duration-300"
                                        >
                                            <div className="grid md:grid-cols-2 gap-0">
                                                {/* Image Section */}
                                                <div className={`relative h-[400px] overflow-hidden ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                                                    {project.project_image_base_six_four ? (
                                                        <img
                                                            src={`data:image/jpeg;base64,${project.project_image_base_six_four}`}
                                                            alt={project.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-[#0a192f] to-[#112240] flex items-center justify-center">
                                                            <Folder className="w-24 h-24 text-[#64ffda]/20" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#112240] via-[#112240]/50 to-transparent opacity-60" />
                                                    
                                                    {/* Badges on Image */}
                                                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                                        {project.access_level && (
                                                            <span className="flex items-center gap-1.5 text-[#64ffda] text-xs font-mono bg-[#0a192f]/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#64ffda]/30">
                                                                <Shield className="w-3 h-3" />
                                                                {project.access_level.name}
                                                            </span>
                                                        )}
                                                        {project.is_live && (
                                                            <span className="flex items-center gap-1.5 text-green-400 text-xs font-mono bg-[#0a192f]/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-green-400/30">
                                                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                                                Live
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Content Section */}
                                                <div className={`p-8 md:p-10 flex flex-col justify-center ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                                                    <div className="space-y-6">
                                                        {/* Title */}
                                                        <div>
                                                            <p className="text-[#64ffda] font-mono text-sm mb-2">Featured Project</p>
                                                            <h3 className="text-[#ccd6f6] text-3xl font-bold group-hover:text-[#64ffda] transition-colors">
                                                                {project.name}
                                                            </h3>
                                                        </div>

                                                        {/* Description */}
                                                        <p className="text-[#8892b0] leading-relaxed">
                                                            {project.long_description}
                                                        </p>

                                                        {/* Skills */}
                                                        <div className="flex flex-wrap gap-2">
                                                            {skills.map((tech, i) => (
                                                                <span 
                                                                    key={i}
                                                                    className="text-[#64ffda] text-xs font-mono bg-[#64ffda]/10 px-3 py-1 rounded-full border border-[#64ffda]/20"
                                                                >
                                                                    {tech}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        {/* Contributors */}
                                                        {hasContributors && (
                                                            <div className="border-t border-[#233554] pt-4">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <Users className="w-4 h-4 text-[#64ffda]" />
                                                                    <span className="text-[#64ffda] text-sm font-mono">Contributors</span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-3">
                                                                    {Object.entries(contributors).map(([key, value]) => (
                                                                        <div key={key} className="text-xs bg-[#0a192f] px-3 py-1.5 rounded border border-[#233554]">
                                                                            <span className="text-[#ccd6f6] font-medium">{key}</span>
                                                                            <span className="text-[#8892b0] mx-1">•</span>
                                                                            <span className="text-[#8892b0]">{value}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Links */}
                                                        <div className="flex items-center gap-4 pt-2">
                                                            {hasBackend && (
                                                                <a
                                                                    href={project.github_link_backend}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-2 text-[#ccd6f6] hover:text-[#64ffda] transition-colors group/link"
                                                                    title="Backend Repository"
                                                                >
                                                                    <Github className="w-5 h-5" />
                                                                    <span className="text-xs font-mono opacity-0 group-hover/link:opacity-100 transition-opacity">Backend</span>
                                                                </a>
                                                            )}
                                                            {hasFrontend && (
                                                                <a
                                                                    href={project.github_link_frontend}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-2 text-[#ccd6f6] hover:text-[#64ffda] transition-colors group/link"
                                                                    title="Frontend Repository"
                                                                >
                                                                    <Github className="w-5 h-5" />
                                                                    <span className="text-xs font-mono opacity-0 group-hover/link:opacity-100 transition-opacity">Frontend</span>
                                                                </a>
                                                            )}
                                                            {hasDockerBackend && (
                                                                <a
                                                                    href={project.docker_image_link_backend}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-2 text-[#ccd6f6] hover:text-[#64ffda] transition-colors group/link"
                                                                    title="Backend Docker Image"
                                                                >
                                                                    <Docker className="w-5 h-5" />
                                                                    <span className="text-xs font-mono opacity-0 group-hover/link:opacity-100 transition-opacity">Docker</span>
                                                                </a>
                                                            )}
                                                            {hasDockerFrontend && (
                                                                <a
                                                                    href={project.docker_image_link_frontend}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-2 text-[#ccd6f6] hover:text-[#64ffda] transition-colors group/link"
                                                                    title="Frontend Docker Image"
                                                                >
                                                                    <Docker className="w-5 h-5" />
                                                                    <span className="text-xs font-mono opacity-0 group-hover/link:opacity-100 transition-opacity">Docker</span>
                                                                </a>
                                                            )}
                                                            {project.is_live && project.ngrok_url && (
                                                                <a
                                                                    href={project.ngrok_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-2 px-4 py-2 bg-[#64ffda]/10 text-[#64ffda] hover:bg-[#64ffda]/20 rounded border border-[#64ffda]/30 transition-colors ml-auto"
                                                                >
                                                                    <ExternalLink className="w-4 h-4" />
                                                                    <span className="text-xs font-mono font-medium">View Live</span>
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Other Projects */}
                    {otherProjects.length > 0 && (
                        <section className="py-20">
                            <div className="text-center mb-12">
                                <h2 className="text-[#ccd6f6] text-2xl md:text-3xl font-bold mb-4">
                                    Other Noteworthy Projects
                                </h2>
                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {otherProjects.map((project) => {
                                    const skills = parseSkills(project.skills_used);
                                    const hasBackend = project.github_link_backend;
                                    const hasFrontend = project.github_link_frontend;
                                    const hasDockerBackend = project.docker_image_link_backend;
                                    const hasDockerFrontend = project.docker_image_link_frontend;

                                    return (
                                        <div
                                            key={project.id}
                                            className="bg-[#112240] p-8 rounded hover:-translate-y-2 transition-transform group relative overflow-hidden"
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <Folder className="w-10 h-10 text-[#64ffda]" />
                                                <div className="flex gap-3 flex-wrap justify-end">
                                                    {hasBackend && (
                                                        <a
                                                            href={project.github_link_backend}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[#a8b2d1] hover:text-[#64ffda] transition-colors"
                                                            title="Backend Repository"
                                                        >
                                                            <Github className="w-5 h-5" />
                                                        </a>
                                                    )}
                                                    {hasFrontend && (
                                                        <a
                                                            href={project.github_link_frontend}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[#a8b2d1] hover:text-[#64ffda] transition-colors"
                                                            title="Frontend Repository"
                                                        >
                                                            <Github className="w-5 h-5" />
                                                        </a>
                                                    )}
                                                    {hasDockerBackend && (
                                                        <a
                                                            href={project.docker_image_link_backend}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[#a8b2d1] hover:text-[#64ffda] transition-colors"
                                                            title="Backend Docker"
                                                        >
                                                            <Docker className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                    {hasDockerFrontend && (
                                                        <a
                                                            href={project.docker_image_link_frontend}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[#a8b2d1] hover:text-[#64ffda] transition-colors"
                                                            title="Frontend Docker"
                                                        >
                                                            <Docker className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                    {project.is_live && project.ngrok_url && (
                                                        <a
                                                            href={project.ngrok_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[#a8b2d1] hover:text-[#64ffda] transition-colors"
                                                            title="Live Demo"
                                                        >
                                                            <ExternalLink className="w-5 h-5" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mb-4">
                                                {project.access_level && (
                                                    <span className="text-[#64ffda] text-xs font-mono bg-[#64ffda]/10 px-2 py-1 rounded">
                                                        {project.access_level.name}
                                                    </span>
                                                )}
                                                {project.is_live && (
                                                    <span className="text-green-400 text-xs font-mono bg-green-400/10 px-2 py-1 rounded">
                                                        Live
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-[#ccd6f6] text-xl font-semibold mb-4 group-hover:text-[#64ffda] break-words transition-colors">
                                                {project.name}
                                            </h3>
                                            <p className="text-[#a8b2d1] text-sm mb-6 line-clamp-3">{project.short_description}</p>
                                            <div className="flex flex-wrap gap-3 text-[#8892b0] font-mono text-xs">
                                                {skills.slice(0, 6).map((tech, i) => (
                                                    <span key={i}>{tech}</span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* View All Projects Button */}
                            <div className="flex justify-center mt-12">
                                <Button
                                    onClick={() => navigate('/projects')}
                                    variant="outline"
                                    className="border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10 px-8 py-6 text-base"
                                >
                                    View All Projects
                                </Button>
                            </div>
                        </section>
                    )}

                    {/* Contact Section */}
                    <section id="contact" className="py-20 text-center max-w-[600px] mx-auto">
                        <div className="text-[#64ffda] font-mono text-lg mb-4">05. What's Next?</div>
                        <h2 className="text-[#ccd6f6] text-4xl md:text-5xl font-bold mb-8">Get In Touch</h2>
                        <p className="text-[#8892b0] text-base md:text-lg mb-12 leading-relaxed">
                            I'm currently looking for new opportunities and my inbox is always open.
                            Whether you have a question or just want to say hi, I'll try my best to get
                            back to you!
                        </p>
                        <a href={`mailto:${profileData?.email || 'karan.ai.engineer@gmail.com'}`}>
                            <Button className="px-8 py-6 border border-[#64ffda] text-[#64ffda] bg-transparent hover:bg-[#64ffda]/10 rounded font-mono">
                                Say Hello
                            </Button>
                        </a>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}