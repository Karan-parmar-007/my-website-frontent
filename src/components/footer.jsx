import { Github, Instagram, Linkedin } from 'lucide-react';
import { useProfileData } from '@/hooks/usePortfolioData';

const Footer = () => {
  const { profileData } = useProfileData();

  const socialLinks = [
    { icon: Github, url: profileData?.github_url, label: 'GitHub' },
    { icon: Instagram, url: profileData?.instagram, label: 'Instagram' },
    { icon: Linkedin, url: profileData?.linkedin_url, label: 'LinkedIn' },
  ].filter(link => link.url);

  return (
    <footer className="w-full flex flex-col items-center pt-24 pb-8 text-[#8892b0] text-sm">
      {/* Mobile Social Icons */}
      <div className="flex md:hidden gap-4 mb-2 pb-4">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8892b0] hover:text-[#64ffda] transition-colors"
            aria-label={link.label}
          >
            <link.icon className="w-5 h-5" />
          </a>
        ))}
      </div>
      <div>Designed & Built by {profileData?.name || 'Karan Parmar'}</div>
    </footer>
  );
};

export default Footer;