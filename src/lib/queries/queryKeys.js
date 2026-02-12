/**
 * Centralized query keys for React Query
 * Using array format for hierarchical cache invalidation
 */
export const queryKeys = {
  // User & Auth
  user: ['user'],
  currentUser: ['user', 'current'],

  // Portfolio data (public)
  portfolio: ['portfolio'],
  profileInfo: ['portfolio', 'profile'],
  education: ['portfolio', 'education'],
  workExperience: ['portfolio', 'work-experience'],
  skills: ['portfolio', 'skills'],
  skillCategories: ['portfolio', 'skill-categories'],
  socialMedia: ['portfolio', 'social-media'],

  // Projects
  projects: ['projects'],
  featuredProjects: ['projects', 'featured'],
  latestProjects: ['projects', 'latest'],
  allProjects: ['projects', 'all'],
  projectById: (id) => ['projects', 'detail', id],
}
