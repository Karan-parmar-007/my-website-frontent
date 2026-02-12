import { useProfileInfo } from '@/lib/queries/usePortfolioQueries';

const EmailLink = () => {
  const { data: profileData } = useProfileInfo();
  const email = profileData?.email || 'karan.ai.engineer@gmail.com';

  return (
    <div className="hidden md:flex fixed right-12 bottom-0 flex-col items-center gap-6 z-0">
      <a
        href={`mailto:${email}`}
        className="text-[#8892b0] hover:text-[#64ffda] hover:-translate-y-1 transition-all"
        style={{ writingMode: 'vertical-rl' }}
      >
        {email}
      </a>
      <div className="w-px h-28 bg-[#8892b0] mt-4" />
    </div>
  );
};

export default EmailLink;