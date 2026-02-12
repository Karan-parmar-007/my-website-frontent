import { useState } from 'react';

/**
 * Two-tiered skill filter: Category → Skill.
 *
 * Props:
 *   skills          – full skills array (SkillRead objects with id, name, category_id)
 *   categories      – skill categories array (id, name)
 *   onSkillSelect   – callback(skillId) when a skill is picked
 *   selectedSkillIds – array of already-selected skill IDs (excluded from dropdown)
 *   placeholder     – placeholder text for the skill dropdown
 *   className       – optional wrapper className
 */
export function HierarchicalSkillSelector({
  skills = [],
  categories = [],
  onSkillSelect,
  selectedSkillIds = [],
  placeholder = 'Select skill…',
  className = '',
}) {
  const [selectedCategory, setSelectedCategory] = useState('');

  // Filter by category, then exclude already-selected
  const filteredSkills = (
    selectedCategory
      ? skills.filter((s) => s.category_id === selectedCategory)
      : skills
  ).filter((s) => !selectedSkillIds.includes(s.id));

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Category */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="h-9 rounded-md border border-[#172a45] bg-[#0a192f] px-3 text-sm text-[#ccd6f6] outline-none focus:border-[#64ffda]/50 transition-colors w-[160px]"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Skill */}
      <select
        value=""
        onChange={(e) => {
          if (e.target.value) onSkillSelect(e.target.value);
        }}
        className="h-9 rounded-md border border-[#172a45] bg-[#0a192f] px-3 text-sm text-[#ccd6f6] outline-none focus:border-[#64ffda]/50 transition-colors w-[180px]"
      >
        <option value="">{placeholder}</option>
        {filteredSkills.map((skill) => (
          <option key={skill.id} value={skill.id}>
            {skill.name}
          </option>
        ))}
      </select>
    </div>
  );
}
