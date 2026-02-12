import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Folder, ExternalLink, Github, ArrowUpDown } from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { publicProjectsApi } from '@/lib/public_projects_apis';
import { useSkills, useSkillCategories } from '@/lib/queries/usePortfolioQueries';
import { HierarchicalSkillSelector } from '@/components/HierarchicalSkillSelector';

const Docker = ({ className }) => (
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
    <path d="M3 8h3v3H3zm4 0h3v3H7zm4 0h3v3h-3zm4 0h3v3h-3zm-8-4h3v3H7zm4 0h3v3h-3z"></path>
    <path d="M2 15c0 3.5 2.5 6.5 6 7 .5.1 1 .1 1.5.1 4.4 0 8-2.5 9-6 .3-.8.4-1.7.5-2.5.1-1.2.1-2.4 0-3.6-.1-.7-.2-1.4-.4-2-.4-1.1-1.1-2-2-2.8"></path>
  </svg>
);

const Users = ({ className }) => (
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
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const Shield = ({ className }) => (
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
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [sortByDate, setSortByDate] = useState(null); // null | 'asc' | 'desc'

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [hasMorePages, setHasMorePages] = useState(false);

  const searchTimeoutRef = useRef(null);
  const suggestionTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);

  // Fetch available skills for the filter dropdown
  const { data: availableSkills = [] } = useSkills();
  const { data: skillCategories = [] } = useSkillCategories();

  // Helper function to extract skill names from SkillRead objects
  const parseSkills = (skillsArray) => {
    if (!Array.isArray(skillsArray)) return [];
    return skillsArray.map((skill) => {
      if (typeof skill === 'object' && skill !== null) return skill.name;
      if (typeof skill === 'string') return skill;
      return String(skill);
    }).filter(Boolean);
  };

  useEffect(() => {
    fetchProjects();
  }, [currentPage, selectedSkillIds, sortByDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const hasFilters = searchQuery || selectedSkillIds.length > 0 || sortByDate;
      const projectsData = hasFilters
        ? await publicProjectsApi.searchProjects(searchQuery || null, {
            page: currentPage,
            size: pageSize,
            skillIds: selectedSkillIds,
            sortByDate: sortByDate,
          })
        : await publicProjectsApi.getAllProjects(currentPage, pageSize);

      setProjects(projectsData);
      setHasMorePages(projectsData.length === pageSize);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setProjects([]);
      setHasMorePages(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInput = (value) => {
    setSearchQuery(value);

    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }

    if (value.length >= 2) {
      suggestionTimeoutRef.current = setTimeout(async () => {
        try {
          const suggestionData = await publicProjectsApi.getProjectSuggestions(value);
          setSuggestions(suggestionData);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Failed to fetch suggestions:', error);
          setSuggestions([]);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      clearSearch();
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsSearching(true);
    setCurrentPage(1);
    setShowSuggestions(false);

    searchTimeoutRef.current = setTimeout(async () => {
      await fetchProjects();
    }, 500);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setIsSearching(true);
    setCurrentPage(1);

    setTimeout(async () => {
      try {
        setLoading(true);
        const projectsData = await publicProjectsApi.searchProjects(suggestion, {
          page: 1,
          size: pageSize,
          skillIds: selectedSkillIds,
          sortByDate: sortByDate,
        });
        setProjects(projectsData);
        setHasMorePages(projectsData.length === pageSize);
      } catch (error) {
        console.error('Failed to search projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }, 0);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedSkillIds([]);
    setSortByDate(null);
    setCurrentPage(1);
    
    setTimeout(async () => {
      try {
        setLoading(true);
        const projectsData = await publicProjectsApi.getAllProjects(1, pageSize);
        setProjects(projectsData);
        setHasMorePages(projectsData.length === pageSize);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }, 0);
  };

  const renderPagination = () => {
    const pages = [];

    pages.push(
      <PaginationItem key={1}>
        <PaginationLink onClick={() => setCurrentPage(1)} isActive={currentPage === 1}>
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (currentPage > 3) {
      pages.push(<PaginationEllipsis key="ellipsis-start" />);
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(currentPage + 1, currentPage + (hasMorePages ? 1 : 0));
      i++
    ) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6]">
      <Navbar />

      <main className="pt-32 px-6 md:px-12 lg:px-24 xl:px-32 pb-20">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#ccd6f6] mb-4">All Projects</h1>
            <p className="text-lg text-[#8892b0]">
              Explore all my projects and side ventures
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8" ref={searchInputRef}>
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8892b0]" />
            <Input
              placeholder="Search projects by name..."
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-12 pr-32 h-12 bg-[#112240] border-[#172a45] text-[#ccd6f6] text-base"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="p-1.5 text-[#8892b0] hover:text-[#ccd6f6] rounded transition-colors"
                  title="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <Button
                onClick={handleSearch}
                size="sm"
                className="h-8 bg-[#64ffda]/10 text-[#64ffda] hover:bg-[#64ffda]/20 border border-[#64ffda]/30"
              >
                Search
              </Button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#112240] border border-[#172a45] rounded-md shadow-xl z-10 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left text-sm text-[#ccd6f6] hover:bg-[#172a45] transition-colors flex items-center gap-3"
                  >
                    <Search className="h-4 w-4 text-[#8892b0]" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <HierarchicalSkillSelector
              skills={availableSkills}
              categories={skillCategories}
              selectedSkillIds={selectedSkillIds}
              onSkillSelect={(skillId) => {
                if (!selectedSkillIds.includes(skillId)) {
                  setSelectedSkillIds((prev) => [...prev, skillId]);
                  setIsSearching(true);
                  setCurrentPage(1);
                }
              }}
              placeholder="Add skill filter…"
            />

            {/* Sort by Date */}
            <button
              onClick={() => {
                const next = sortByDate === null ? 'desc' : sortByDate === 'desc' ? 'asc' : null;
                setSortByDate(next);
                setIsSearching(true);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 h-9 px-3 rounded-md border text-sm transition-colors ${
                sortByDate
                  ? 'border-[#64ffda]/50 text-[#64ffda] bg-[#64ffda]/10'
                  : 'border-[#172a45] text-[#8892b0] bg-[#0a192f] hover:border-[#64ffda]/30'
              }`}
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortByDate === 'desc' ? 'Newest First' : sortByDate === 'asc' ? 'Oldest First' : 'Sort by Date'}
            </button>
          </div>

          {/* Active Filter Chips */}
          {selectedSkillIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {selectedSkillIds.map((id) => {
                const skill = availableSkills.find((s) => s.id === id);
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#172a45] text-xs text-[#ccd6f6] border border-[#64ffda]/20"
                  >
                    {skill?.name || id}
                    <button
                      onClick={() => {
                        setSelectedSkillIds((prev) => prev.filter((sid) => sid !== id));
                        setIsSearching(true);
                        setCurrentPage(1);
                      }}
                      className="ml-0.5 hover:text-red-400 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
              <button
                onClick={() => {
                  setSelectedSkillIds([]);
                  setIsSearching(true);
                  setCurrentPage(1);
                }}
                className="text-xs text-[#8892b0] hover:text-[#ccd6f6] underline ml-1 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Search Info */}
          {isSearching && searchQuery && (
            <div className="flex items-center justify-between px-4 py-3 mb-8 bg-[#112240] border border-[#172a45] rounded-md">
              <span className="text-sm text-[#8892b0]">
                Showing results for: <span className="text-[#64ffda] font-medium">"{searchQuery}"</span>
              </span>
              <button
                onClick={clearSearch}
                className="text-sm text-[#8892b0] hover:text-[#ccd6f6] transition-colors"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Projects Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#112240] rounded-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-[#172a45]" />
                  <div className="p-6 space-y-4">
                    <div className="h-5 bg-[#172a45] rounded w-3/4" />
                    <div className="space-y-2">
                      <div className="h-3 bg-[#172a45] rounded w-full" />
                      <div className="h-3 bg-[#172a45] rounded w-5/6" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-5 bg-[#172a45] rounded-full w-16" />
                      <div className="h-5 bg-[#172a45] rounded-full w-12" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <Folder className="w-16 h-16 text-[#8892b0] mx-auto mb-4 opacity-50" />
              <div className="text-[#8892b0] text-lg">
                {isSearching ? 'No projects found matching your search.' : 'No projects available.'}
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {projects.map((project) => {
                const skills = parseSkills(project.skills);
                const hasBackend = project.github_link_backend;
                const hasFrontend = project.github_link_frontend;
                const hasDockerBackend = project.docker_image_link_backend;
                const hasDockerFrontend = project.docker_image_link_frontend;
                const contributors = project.contributors || {};
                const hasContributors = Object.keys(contributors).length > 0;

                return (
                  <div
                    key={project.id}
                    className="bg-[#112240] rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-[#64ffda]/10 transition-all duration-300 group"
                  >
                    {/* Project Image */}
                    <div className="relative h-48 overflow-hidden bg-[#0a192f]">
                      {project.project_image_base_six_four ? (
                        <img
                          src={`data:image/jpeg;base64,${project.project_image_base_six_four}`}
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Folder className="w-16 h-16 text-[#64ffda]/20" />
                        </div>
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {project.access_level && (
                          <span className="flex items-center gap-1.5 text-[#64ffda] text-xs font-mono bg-[#0a192f]/90 backdrop-blur-sm px-2 py-1 rounded border border-[#64ffda]/30">
                            <Shield className="w-3 h-3" />
                            {project.access_level.name}
                          </span>
                        )}
                        {project.is_live && (
                          <span className="flex items-center gap-1.5 text-green-400 text-xs font-mono bg-[#0a192f]/90 backdrop-blur-sm px-2 py-1 rounded border border-green-400/30">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            Live
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-[#ccd6f6] group-hover:text-[#64ffda] transition-colors line-clamp-1">
                        {project.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-[#8892b0] line-clamp-3">
                        {project.short_description}
                      </p>

                      {/* Skills */}
                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {skills.slice(0, 5).map((tech, i) => (
                            <span
                              key={i}
                              className="text-[#64ffda] text-xs font-mono bg-[#64ffda]/10 px-2 py-1 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                          {skills.length > 5 && (
                            <span className="text-[#8892b0] text-xs font-mono bg-[#172a45] px-2 py-1 rounded">
                              +{skills.length - 5}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Contributors */}
                      {hasContributors && (
                        <div className="border-t border-[#172a45] pt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-[#64ffda]" />
                            <span className="text-[#64ffda] text-xs font-mono">Contributors</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(contributors).slice(0, 3).map(([name, username]) => (
                              <span key={name} className="text-xs bg-[#0a192f] px-2 py-1 rounded border border-[#172a45]">
                                <span className="text-[#ccd6f6]">{name}</span>
                              </span>
                            ))}
                            {Object.keys(contributors).length > 3 && (
                              <span className="text-xs text-[#8892b0] bg-[#0a192f] px-2 py-1 rounded border border-[#172a45]">
                                +{Object.keys(contributors).length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Links */}
                      <div className="flex items-center gap-3 pt-2 border-t border-[#172a45]">
                        {hasFrontend && (
                          <a
                            href={project.github_link_frontend}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#ccd6f6] hover:text-[#64ffda] transition-colors"
                            title="Frontend Repository"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                        {hasBackend && (
                          <a
                            href={project.github_link_backend}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#ccd6f6] hover:text-[#64ffda] transition-colors"
                            title="Backend Repository"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                        {hasDockerFrontend && (
                          <a
                            href={project.docker_image_link_frontend}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#ccd6f6] hover:text-[#64ffda] transition-colors"
                            title="Frontend Docker"
                          >
                            <Docker className="w-5 h-5" />
                          </a>
                        )}
                        {hasDockerBackend && (
                          <a
                            href={project.docker_image_link_backend}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#ccd6f6] hover:text-[#64ffda] transition-colors"
                            title="Backend Docker"
                          >
                            <Docker className="w-5 h-5" />
                          </a>
                        )}
                        {project.is_live && project.ngrok_url && (
                          <a
                            href={project.ngrok_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto text-[#64ffda] hover:text-[#64ffda]/80 transition-colors"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && projects.length > 0 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={
                      currentPage === 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer hover:bg-[#112240]'
                    }
                  />
                </PaginationItem>
                {renderPagination()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className={
                      !hasMorePages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer hover:bg-[#112240]'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}