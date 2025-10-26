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
import { useAuth } from '@/contexts/AuthContext';

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

// Sample projects data
const DEFAULT_PROJECTS = [
    {
        id: 1,
        title: 'Project One',
        description: 'A sample featured project description that showcases your work.',
        technologies: ['React', 'Node.js', 'MongoDB'],
        github_url: 'https://github.com',
        live_url: 'https://example.com',
        featured: true,
        image: null,
    },
    {
        id: 2,
        title: 'Project Two',
        description: 'Another featured project with interesting technologies.',
        technologies: ['Python', 'FastAPI', 'PostgreSQL'],
        github_url: 'https://github.com',
        live_url: 'https://example.com',
        featured: true,
        image: null,
    },
    {
        id: 3,
        title: 'Small Project One',
        description: 'A smaller noteworthy project.',
        technologies: ['JavaScript', 'Express'],
        github_url: 'https://github.com',
        featured: false,
    },
    {
        id: 4,
        title: 'Small Project Two',
        description: 'Another interesting side project.',
        technologies: ['React', 'Firebase'],
        github_url: 'https://github.com',
        featured: false,
    },
];

export default function Home() {
    const { user, loading: authLoading } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [workExperience, setWorkExperience] = useState([]);
    const [education, setEducation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeWork, setActiveWork] = useState(null);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const calls = [
                    portfolioApi.getProfileInfo(),
                    portfolioApi.getWorkExperience(),
                    portfolioApi.getEducation(),
                ];

                const [profileRes, workRes, eduRes] = await Promise.allSettled(calls);

                const profile = profileRes.status === 'fulfilled' ? profileRes.value : null;
                const work = workRes.status === 'fulfilled' ? workRes.value : [];
                const edu = eduRes.status === 'fulfilled' ? eduRes.value : [];

                if (profileRes.status === 'rejected') console.warn('getProfileInfo failed', profileRes.reason);
                if (workRes.status === 'rejected') console.warn('getWorkExperience failed', workRes.reason);
                if (eduRes.status === 'rejected') console.warn('getEducation failed', eduRes.reason);

                setProfileData(profile);

                const sortedWorkExperience = work.sort((a, b) => b.sequence - a.sequence);
                setWorkExperience(sortedWorkExperience);

                const sortedEducation = edu.sort((a, b) => b.sequence - a.sequence);
                setEducation(sortedEducation);

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

    const featuredProjects = DEFAULT_PROJECTS.filter((p) => p.featured);
    const otherProjects = DEFAULT_PROJECTS.filter((p) => !p.featured);

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

                    {/* Experience Section - replaced with WorkExperience component */}
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
                    <section id="work" className="py-20">
                        <div className="flex items-center gap-4 mb-16">
                            <span className="text-[#64ffda] font-mono text-xl flex-shrink-0">04.</span>
                            <h2 className="text-[#ccd6f6] text-2xl md:text-3xl font-bold flex-shrink-0">
                                Some Things I've Built
                            </h2>
                            <div className="flex-1 h-px bg-[#233554] ml-4" />
                        </div>

                        <div className="space-y-32">
                            {featuredProjects.map((project, index) => (
                                <div key={project.id} className="relative min-h-[350px]">
                                    {index % 2 === 0 ? (
                                        <>
                                            <div className="absolute top-0 right-0 w-full md:w-[60%] h-[350px] rounded bg-[#112240] opacity-50 hover:opacity-100 transition-opacity hidden md:block">
                                                {project.image && (
                                                    <img
                                                        src={project.image}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover rounded"
                                                    />
                                                )}
                                            </div>
                                            <div className="relative z-10 md:max-w-[55%]">
                                                <p className="text-[#64ffda] font-mono text-sm mb-2">
                                                    Featured Project
                                                </p>
                                                <h3 className="text-[#ccd6f6] text-2xl md:text-3xl font-semibold mb-6 break-words">
                                                    {project.title}
                                                </h3>
                                                <div className="bg-[#112240] p-6 rounded mb-6 shadow-lg">
                                                    <p className="text-[#a8b2d1]">{project.description}</p>
                                                </div>
                                                <div className="flex flex-wrap gap-5 text-[#8892b0] font-mono text-sm mb-6">
                                                    {project.technologies.map((tech) => (
                                                        <span key={tech}>{tech}</span>
                                                    ))}
                                                </div>
                                                <div className="flex gap-5">
                                                    <a
                                                        href={project.github_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[#ccd6f6] hover:text-[#64ffda]"
                                                    >
                                                        <ExternalLink className="w-6 h-6" />
                                                    </a>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="absolute top-0 left-0 w-full md:w-[60%] h-[350px] rounded bg-[#112240] opacity-50 hover:opacity-100 transition-opacity hidden md:block">
                                                {project.image && (
                                                    <img
                                                        src={project.image}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover rounded"
                                                    />
                                                )}
                                            </div>
                                            <div className="relative z-10 md:max-w-[55%] ml-auto text-right">
                                                <p className="text-[#64ffda] font-mono text-sm mb-2">
                                                    Featured Project
                                                </p>
                                                <h3 className="text-[#ccd6f6] text-2xl md:text-3xl font-semibold mb-6 break-words">
                                                    {project.title}
                                                </h3>
                                                <div className="bg-[#112240] p-6 rounded mb-6 shadow-lg">
                                                    <p className="text-[#a8b2d1] text-right">
                                                        {project.description}
                                                    </p>
                                                </div>
                                                <div className="flex flex-wrap gap-5 justify-end text-[#8892b0] font-mono text-sm mb-6">
                                                    {project.technologies.map((tech) => (
                                                        <span key={tech}>{tech}</span>
                                                    ))}
                                                </div>
                                                <div className="flex gap-5 justify-end">
                                                    <a
                                                        href={project.github_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[#ccd6f6] hover:text-[#64ffda]"
                                                    >
                                                        <ExternalLink className="w-6 h-6" />
                                                    </a>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Other Projects */}
                    <section className="py-20">
                        <div className="text-center mb-12">
                            <h2 className="text-[#ccd6f6] text-2xl md:text-3xl font-bold mb-4">
                                Other Noteworthy Projects
                            </h2>
                            <a href="#" className="text-[#64ffda] hover:underline">
                                view the archive
                            </a>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {otherProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-[#112240] p-8 rounded hover:-translate-y-2 transition-transform group"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <Folder className="w-10 h-10 text-[#64ffda]" />
                                        <a
                                            href={project.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#a8b2d1] hover:text-[#64ffda]"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    </div>
                                    <h3 className="text-[#ccd6f6] text-xl font-semibold mb-4 group-hover:text-[#64ffda] break-words">
                                        {project.title}
                                    </h3>
                                    <p className="text-[#a8b2d1] text-sm mb-6">{project.description}</p>
                                    <div className="flex flex-wrap gap-4 text-[#8892b0] font-mono text-xs">
                                        {project.technologies.map((tech) => (
                                            <span key={tech}>{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

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