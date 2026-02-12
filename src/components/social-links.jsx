import { useSocialMedia } from '@/lib/queries/usePortfolioQueries';
import icons from './social-icons';

const SocialLinks = () => {
    const { data: socialLinks = [] } = useSocialMedia();

    // Filter out links that don't have a URL or a matching icon
    // Also ensuring unique keys if the API returns duplicates, though ideally API shouldn't
    const visibleLinks = socialLinks.filter(
        (link) => link.link && icons[link.name.toLowerCase()]
    );

    if (visibleLinks.length === 0) return null;

    return (
        <div className="hidden md:flex fixed left-12 bottom-0 flex-col items-center gap-6 z-0">
            {visibleLinks.map((link) => {
                const IconComponent = icons[link.name.toLowerCase()];
                return (
                    <a
                        key={link.id || link.name}
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8892b0] hover:text-[#64ffda] hover:-translate-y-1 transition-all"
                        aria-label={link.name}
                    >
                        <IconComponent className="w-5 h-5" />
                    </a>
                );
            })}
            <div className="w-px h-28 bg-[#8892b0] mt-4" />
        </div>
    );
};

export default SocialLinks;