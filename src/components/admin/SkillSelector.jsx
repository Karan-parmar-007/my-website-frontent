import React, { useState, useEffect } from 'react';

export function SkillSelector({ skills, categories, selectedSkillIds, onSkillSelect }) {
  const [selectedCategory, setSelectedCategory] = useState('');

  // Listen for the custom event from the parent's category dropdown
  useEffect(() => {
    const handleCategoryChange = (e) => {
      setSelectedCategory(e.detail);
    };
    window.addEventListener('category-filter-change', handleCategoryChange);
    return () => window.removeEventListener('category-filter-change', handleCategoryChange);
  }, []);

  const filteredSkills = selectedCategory
    ? skills.filter(s => s.category_id === selectedCategory)
    : skills;

  return (
    <select
      id="skill-selector-dropdown"
      className="flex h-10 w-full rounded-md border border-[#172a45] bg-[#112240] px-3 py-2 text-sm text-[#ccd6f6] outline-none focus:border-[#64ffda]"
      onChange={(e) => {
        if (e.target.value) {
          onSkillSelect(e.target.value);
          e.target.value = ""; // Reset selection
        }
      }}
      value=""
    >
      <option value="">Select a skill...</option>
      {filteredSkills
        .filter(s => !selectedSkillIds.includes(s.id))
        .map(skill => (
          <option key={skill.id} value={skill.id} data-category={skill.category_id}>
            {skill.name}
          </option>
        ))}
    </select>
  );
}
