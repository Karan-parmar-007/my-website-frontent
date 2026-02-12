import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient, { apiClientFormData } from '../apiClient'
import { queryKeys } from './queryKeys'

// ==========================================
// PUBLIC PORTFOLIO QUERIES (No auth required)
// ==========================================

export const useProfileInfo = () => {
  return useQuery({
    queryKey: queryKeys.profileInfo,
    queryFn: async () => {
      const { data } = await apiClient.get('/portfolio/profile-info')
      return data
    },
    staleTime: 10 * 60 * 1000, // Profile is stable, cache for 10 mins
  })
}

export const useEducation = () => {
  return useQuery({
    queryKey: queryKeys.education,
    queryFn: async () => {
      const { data } = await apiClient.get('/portfolio/education')
      return data
    },
  })
}

export const useWorkExperience = () => {
  return useQuery({
    queryKey: queryKeys.workExperience,
    queryFn: async () => {
      const { data } = await apiClient.get('/portfolio/work-experience')
      return data
    },
  })
}

export const useSkillCategories = () => {
  return useQuery({
    queryKey: queryKeys.skillCategories,
    queryFn: async () => {
      const { data } = await apiClient.get('/portfolio/skill-categories')
      return data
    },
  })
}

export const useSkills = () => {
  return useQuery({
    queryKey: queryKeys.skills,
    queryFn: async () => {
      const { data } = await apiClient.get('/portfolio/skills')
      return data
    },
  })
}

export const useSocialMedia = () => {
  return useQuery({
    queryKey: queryKeys.socialMedia,
    queryFn: async () => {
      const { data } = await apiClient.get('/portfolio/social-media')
      return data
    },
  })
}

// ==========================================
// ADMIN PORTFOLIO MUTATIONS (Auth required)
// ==========================================

// Profile mutations
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (formData) => {
      // Extract files
      const profileImage = formData.get('profile_image')
      const resumeFile = formData.get('resume_file')
      
      // Convert remaining formData to JSON object for the main update
      const jsonPayload = {}
      for (const [key, value] of formData.entries()) {
        if (key !== 'profile_image' && key !== 'resume_file') {
          jsonPayload[key] = value
        }
      }

      // 1. Update text info (JSON)
      const { data } = await apiClient.put('/portfolio/profile-info', jsonPayload)

      // 2. Upload Profile Image if present
      if (profileImage instanceof File) {
        const imageFormData = new FormData()
        imageFormData.append('profile_image', profileImage)
        await apiClientFormData.put('/portfolio/profile-info/image', imageFormData)
      }

      // 3. Upload Resume if present
      if (resumeFile instanceof File) {
        const resumeFormData = new FormData()
        resumeFormData.append('resume_file', resumeFile)
        await apiClientFormData.put('/portfolio/profile-info/resume', resumeFormData)
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profileInfo })
    },
  })
}

export const useCreateProfile = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (formData) => {
      // Extract files
      const profileImage = formData.get('profile_image')
      const resumeFile = formData.get('resume_file')
      
      // Convert remaining formData to JSON object
      const jsonPayload = {}
      for (const [key, value] of formData.entries()) {
        if (key !== 'profile_image' && key !== 'resume_file') {
          jsonPayload[key] = value
        }
      }

      // 1. Create profile text info (JSON)
      const { data } = await apiClient.post('/portfolio/profile-info', jsonPayload)

      // 2. Upload Profile Image if present
      if (profileImage instanceof File) {
        const imageFormData = new FormData()
        imageFormData.append('profile_image', profileImage)
        await apiClientFormData.put('/portfolio/profile-info/image', imageFormData)
      }

      // 3. Upload Resume if present
      if (resumeFile instanceof File) {
        const resumeFormData = new FormData()
        resumeFormData.append('resume_file', resumeFile)
        await apiClientFormData.put('/portfolio/profile-info/resume', resumeFormData)
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profileInfo })
    },
  })
}

// Education mutations
export const useCreateEducation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (educationData) => {
      const { data } = await apiClient.post('/portfolio/education', educationData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.education })
    },
  })
}

export const useUpdateEducation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (educationData) => {
      const { data } = await apiClient.put('/portfolio/education', educationData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.education })
    },
  })
}

export const useDeleteEducation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/portfolio/education/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.education })
    },
  })
}

// Work Experience mutations
export const useCreateWorkExperience = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (workData) => {
      const { data } = await apiClient.post('/portfolio/work-experience', workData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workExperience })
    },
  })
}

export const useUpdateWorkExperience = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (workData) => {
      const { data } = await apiClient.put('/portfolio/work-experience', workData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workExperience })
    },
  })
}

export const useDeleteWorkExperience = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/portfolio/work-experience/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workExperience })
    },
  })
}

// Skill Category mutations
export const useCreateSkillCategory = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (categoryData) => {
      const { data } = await apiClient.post('/portfolio/skill-categories', categoryData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skillCategories })
    },
  })
}

export const useUpdateSkillCategory = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (categoryData) => {
      const { data } = await apiClient.put('/portfolio/skill-categories', categoryData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skillCategories })
    },
  })
}

export const useDeleteSkillCategory = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/portfolio/skill-categories/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skillCategories })
      queryClient.invalidateQueries({ queryKey: queryKeys.skills }) // Skills may be affected
    },
  })
}

// Skill mutations
export const useCreateSkill = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await apiClientFormData.post('/portfolio/skills', formData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills })
    },
  })
}

export const useUpdateSkill = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await apiClientFormData.put('/portfolio/skills', formData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills })
    },
  })
}

export const useDeleteSkill = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/portfolio/skills/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills })
    },
  })
}

// Social Media mutations
export const useCreateSocialMedia = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (socialData) => {
      const { data } = await apiClient.post('/portfolio/social-media', socialData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.socialMedia })
    },
  })
}

export const useUpdateSocialMedia = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...socialData }) => {
      const { data } = await apiClient.put(`/portfolio/social-media/${id}`, socialData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.socialMedia })
    },
  })
}

export const useDeleteSocialMedia = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/portfolio/social-media/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.socialMedia })
    },
  })
}
