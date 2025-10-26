import { useProfileData } from '@/hooks/usePortfolioData';

const SocialLinks = () => {
  const { profileData } = useProfileData();
  
  const icons = {
    GitHub: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-github">
        <title>GitHub</title>
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
      </svg>
    ),
    LinkedIn: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-linkedin">
        <title>LinkedIn</title>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    ),
    Instagram: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-instagram">
        <title>Instagram</title>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
  };

  const github = profileData?.github_url || 'https://github.com/Karan-parmar-007';
  const linkedin = profileData?.linkedin_url || 'https://www.linkedin.com/in/karan-parmar-715ab7225';
  const instagram = profileData?.instagram || 'https://www.instagram.com/karan_parmar014';

  const socialLinks = [
    { key: 'github', svg: icons.GitHub, url: github, label: 'GitHub' },
    { key: 'linkedin', svg: icons.LinkedIn, url: linkedin, label: 'LinkedIn' },
    { key: 'instagram', svg: icons.Instagram, url: instagram, label: 'Instagram' },
  ].filter(link => link.url);

  return (
    <div className="hidden md:flex fixed left-12 bottom-0 flex-col items-center gap-6 z-0">
      {socialLinks.map((link) => (
        <a
          key={link.key}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#8892b0] hover:text-[#64ffda] hover:-translate-y-1 transition-all"
          aria-label={link.label}
        >
          {link.svg}
        </a>
      ))}
      <div className="w-px h-28 bg-[#8892b0] mt-4" />
    </div>
  );
};

export default SocialLinks;