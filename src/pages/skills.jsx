import { useMemo } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { useSkills, useSkillCategories } from '@/lib/queries/usePortfolioQueries';

// Rotating accent palette for category cards
const CATEGORY_COLORS = [
  { bg: 'rgba(100,255,218,0.08)', border: 'rgba(100,255,218,0.25)', text: '#64ffda', chipBg: 'rgba(100,255,218,0.12)' },
  { bg: 'rgba(130,170,255,0.08)', border: 'rgba(130,170,255,0.25)', text: '#82aaff', chipBg: 'rgba(130,170,255,0.12)' },
  { bg: 'rgba(199,146,234,0.08)', border: 'rgba(199,146,234,0.25)', text: '#c792ea', chipBg: 'rgba(199,146,234,0.12)' },
  { bg: 'rgba(255,203,107,0.08)', border: 'rgba(255,203,107,0.25)', text: '#ffcb6b', chipBg: 'rgba(255,203,107,0.12)' },
  { bg: 'rgba(240,113,120,0.08)', border: 'rgba(240,113,120,0.25)', text: '#f07178', chipBg: 'rgba(240,113,120,0.12)' },
  { bg: 'rgba(137,221,255,0.08)', border: 'rgba(137,221,255,0.25)', text: '#89ddff', chipBg: 'rgba(137,221,255,0.12)' },
];

export default function SkillsPage() {
  const { data: skills = [], isLoading: skillsLoading } = useSkills();
  const { data: categories = [], isLoading: categoriesLoading } = useSkillCategories();

  const loading = skillsLoading || categoriesLoading;

  // Group skills by category
  const groupedSkills = useMemo(() => {
    const groups = [];

    for (const cat of categories) {
      const catSkills = skills.filter((s) => s.category_id === cat.id);
      if (catSkills.length > 0) {
        groups.push({ id: cat.id, name: cat.name, skills: catSkills });
      }
    }

    // Uncategorized skills
    const uncategorized = skills.filter(
      (s) => !s.category_id || !categories.some((c) => c.id === s.category_id)
    );
    if (uncategorized.length > 0) {
      groups.push({ id: 'uncategorized', name: 'Other', skills: uncategorized });
    }

    return groups;
  }, [skills, categories]);

  return (
    <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6]">
      <Navbar />

      <main className="pt-32 px-6 md:px-12 lg:px-24 xl:px-32 pb-20">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#ccd6f6] mb-4">
              Skills & Technologies
            </h1>
            <p className="text-lg text-[#8892b0] max-w-2xl mx-auto">
              A collection of tools, languages, and frameworks I work with — organized by domain.
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-[#112240] border border-[#172a45] p-6 animate-pulse"
                >
                  <div className="h-6 bg-[#172a45] rounded w-1/2 mb-6" />
                  <div className="flex flex-wrap gap-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-8 bg-[#172a45] rounded-full w-20" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : groupedSkills.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-[#8892b0] text-lg">No skills available yet.</div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedSkills.map((group, groupIndex) => {
                const palette = CATEGORY_COLORS[groupIndex % CATEGORY_COLORS.length];

                return (
                  <div
                    key={group.id}
                    className="rounded-xl border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    style={{
                      backgroundColor: palette.bg,
                      borderColor: palette.border,
                    }}
                  >
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-5">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: palette.text }}
                      />
                      <h2 className="text-xl font-bold" style={{ color: palette.text }}>
                        {group.name}
                      </h2>
                      <span className="text-xs font-mono ml-auto opacity-60" style={{ color: palette.text }}>
                        {group.skills.length}
                      </span>
                    </div>

                    {/* Skill Chips */}
                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-mono transition-all duration-200 hover:scale-105 cursor-default"
                          style={{
                            backgroundColor: palette.chipBg,
                            color: palette.text,
                            border: `1px solid ${palette.border}`,
                          }}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
