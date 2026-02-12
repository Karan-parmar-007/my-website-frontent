import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient, { apiClientFormData } from '../apiClient'
import { queryKeys } from './queryKeys'

// ==========================================
// PUBLIC PROJECT QUERIES (No auth required)
// ==========================================

export const useFeaturedProjects = () => {
  return useQuery({
    queryKey: queryKeys.featuredProjects,
    queryFn: async () => {
      const { data } = await apiClient.get('/project/projects/featured')
      return data
    },
  })
}

export const useLatestProjects = () => {
  return useQuery({
    queryKey: queryKeys.latestProjects,
    queryFn: async () => {
      const { data } = await apiClient.get('/project/projects/latest')
      return data
    },
  })
}

export const useAllProjects = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.allProjects,
    queryFn: async () => {
      const { data } = await apiClient.get('/project/projects')
      return data
    },
    ...options,
  })
}

export const useProjectById = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.projectById(id),
    queryFn: async () => {
      const { data } = await apiClient.get(`/project/projects/${id}`)
      return data
    },
    enabled: !!id,
    ...options,
  })
}

// ==========================================
// ADMIN PROJECT MUTATIONS (Auth required)
// ==========================================

export const useCreateProject = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await apiClientFormData.post('/project/admin/projects', formData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects })
    },
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, formData }) => {
      const { data } = await apiClientFormData.put(`/project/admin/projects/${id}`, formData)
      return data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects })
      queryClient.invalidateQueries({ queryKey: queryKeys.projectById(id) })
    },
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/project/admin/projects/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects })
    },
  })
}

// Toggle project featured status
export const useToggleProjectFeatured = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, featured }) => {
      const { data } = await apiClient.patch(`/project/admin/projects/${id}/featured`, { featured })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects })
      queryClient.invalidateQueries({ queryKey: queryKeys.featuredProjects })
    },
  })
}
