import { useProfileInfo } from '@/lib/queries/usePortfolioQueries';
import { useSocialMedia } from '@/lib/queries/usePortfolioQueries';
import icons from './social-icons';

const Footer = () => {
    const { data: profileData } = useProfileInfo();
    const { data: socialLinks = [] } = useSocialMedia();

    // Filter out links that don't have a URL or a matching icon
    const visibleLinks = socialLinks.filter(
        (link) => link.link && icons[link.name.toLowerCase()]
    );

    return (
        <footer className="w-full flex flex-col items-center pt-24 pb-8 text-[#8892b0] text-sm">
            {/* Mobile Social Icons */}
            <div className="flex md:hidden gap-4 mb-2 pb-4">
                {visibleLinks.map((link) => {
                    const IconComponent = icons[link.name.toLowerCase()];
                    return (
                        <a
                            key={link.id || link.name}
                            href={link.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8892b0] hover:text-[#64ffda] transition-colors"
                            aria-label={link.name}
                        >
                            <IconComponent className="w-5 h-5" />
                        </a>
                    );
                })}
            </div>
            <div>Designed & Built by {profileData?.name || 'Karan Parmar'}</div>
        </footer>
    );
};

export default Footer;