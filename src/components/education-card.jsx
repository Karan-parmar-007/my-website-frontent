import { GraduationCap } from 'lucide-react';

const EducationCard = ({ education }) => {
  return (
    <div className="bg-[#112240] p-6 rounded hover:-translate-y-2 transition-transform duration-300">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-[#64ffda]/10 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-[#64ffda]" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-[#ccd6f6] text-xl font-semibold mb-1">
                {education.degree}
              </h3>
              <p className="text-[#64ffda] text-sm font-medium">
                {education.school}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[#a8b2d1] text-sm">
                {education.start_year} - {education.end_year}
              </p>
              {education.Score && (
                <p className="text-[#64ffda] text-sm font-medium mt-1">
                  Score: {education.Score}%
                </p>
              )}
            </div>
          </div>
          
          {education.description && (
            <p className="text-[#8892b0] text-sm mt-3 leading-relaxed">
              {education.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducationCard;