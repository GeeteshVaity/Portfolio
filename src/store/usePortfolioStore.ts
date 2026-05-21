import { create } from 'zustand'
import { apiClient } from '@/lib/api-client'

// Types
export interface Project {
  id: string
  title: string
  description: string
  image?: string
  link?: string
  githubLink?: string
  tags: string[]
  order: number
  published: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface Skill {
  id: string
  name: string
  category: string
  proficiency: string
  years: number
  order: number
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface User {
  id: string
  email: string
  name?: string
  role: string
  isAdmin: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface LoadingState {
  projects: boolean
  skills: boolean
  login: boolean
  createProject: boolean
  updateProject: boolean
  deleteProject: boolean
  createSkill: boolean
  updateSkill: boolean
  deleteSkill: boolean
}

export interface ErrorState {
  projects?: string
  skills?: string
  login?: string
  general?: string
}

export interface PortfolioStore {
  // UI State
  isDarkMode: boolean
  toggleDarkMode: () => void
  activeSection: string
  setActiveSection: (section: string) => void
  isMobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void

  // Auth State
  isLoggedIn: boolean
  currentUser: User | null
  adminEmail: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>

  // Data State
  projects: Project[]
  skills: Skill[]
  
  // Loading & Error States
  loading: LoadingState
  errors: ErrorState
  clearError: (key: keyof ErrorState) => void

  // Data Fetching
  fetchProjects: () => Promise<void>
  fetchSkills: () => Promise<void>
  startRealTimeUpdates: (interval?: number) => void
  stopRealTimeUpdates: () => void

  // Project Management (Admin)
  createProject: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => Promise<void>
  updateProject: (id: string, data: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>

  // Skill Management (Admin)
  createSkill: (data: Omit<Skill, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => Promise<void>
  updateSkill: (id: string, data: Partial<Skill>) => Promise<void>
  deleteSkill: (id: string) => Promise<void>

  // Real-time Update Polling
  _pollInterval: ReturnType<typeof setTimeout> | null
  _pollIntervalMs: number
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => {
  let pollInterval: ReturnType<typeof setTimeout> | null = null
  let pollIntervalMs = 30000 // Default 30 seconds

  const setError = (key: keyof ErrorState, message: string) => {
    set((state) => ({
      errors: { ...state.errors, [key]: message },
    }))
  }

  const clearError = (key: keyof ErrorState) => {
    set((state) => ({
      errors: { ...state.errors, [key]: undefined },
    }))
  }

  const setLoading = (key: keyof LoadingState, value: boolean) => {
    set((state) => ({
      loading: { ...state.loading, [key]: value },
    }))
  }

  const fetchProjects = async () => {
    setLoading('projects', true)
    clearError('projects')
    try {
      const response = await apiClient.getProjects()
      if (response.success && response.data) {
        set({ projects: response.data })
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch projects'
      setError('projects', message)
      console.error('Error fetching projects:', error)
    } finally {
      setLoading('projects', false)
    }
  }

  const fetchSkills = async () => {
    setLoading('skills', true)
    clearError('skills')
    try {
      const response = await apiClient.getSkills()
      if (response.success && response.data) {
        set({ skills: response.data })
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch skills'
      setError('skills', message)
      console.error('Error fetching skills:', error)
    } finally {
      setLoading('skills', false)
    }
  }

  const startRealTimeUpdates = (interval?: number) => {
    if (pollInterval) return // Already polling

    // Update interval if provided
    if (interval) {
      pollIntervalMs = interval
    }

    // Fetch immediately
    fetchProjects()
    fetchSkills()

    // Poll at the specified interval
    pollInterval = setInterval(() => {
      fetchProjects()
      fetchSkills()
    }, pollIntervalMs)

    set({ _pollInterval: pollInterval })
  }

  const stopRealTimeUpdates = () => {
    const state = get()
    if (state._pollInterval) {
      clearInterval(state._pollInterval)
      set({ _pollInterval: null })
    }
  }

  const login = async (email: string, password: string) => {
    setLoading('login', true)
    clearError('login')
    try {
      const response = await apiClient.login({ email, password })
      if (response.success) {
        set({
          isLoggedIn: true,
          adminEmail: email,
          currentUser: response.data as User,
        })
        return true
      }
      return false
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed'
      setError('login', message)
      console.error('Login error:', error)
      return false
    } finally {
      setLoading('login', false)
    }
  }

  const logout = async () => {
    try {
      await apiClient.logout()
      set({
        isLoggedIn: false,
        adminEmail: null,
        currentUser: null,
      })
      // Stop real-time updates on logout
      stopRealTimeUpdates()
    } catch (error: any) {
      console.error('Logout error:', error)
    }
  }

  const createProject = async (
    data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>
  ) => {
    setLoading('createProject', true)
    clearError('general')
    try {
      const response = await apiClient.createProject(data)
      if (response.success) {
        // Refresh projects
        await fetchProjects()
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to create project'
      setError('general', message)
      throw error
    } finally {
      setLoading('createProject', false)
    }
  }

  const updateProject = async (id: string, data: Partial<Project>) => {
    setLoading('updateProject', true)
    clearError('general')
    try {
      const response = await apiClient.updateProject(id, data)
      if (response.success) {
        // Update local state optimistically
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
        }))
        // Verify with server
        await fetchProjects()
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to update project'
      setError('general', message)
      throw error
    } finally {
      setLoading('updateProject', false)
    }
  }

  const deleteProject = async (id: string) => {
    setLoading('deleteProject', true)
    clearError('general')
    try {
      const response = await apiClient.deleteProject(id)
      if (response.success) {
        // Remove from local state
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }))
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to delete project'
      setError('general', message)
      throw error
    } finally {
      setLoading('deleteProject', false)
    }
  }

  const createSkill = async (data: Omit<Skill, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    setLoading('createSkill', true)
    clearError('general')
    try {
      const response = await apiClient.createSkill(data)
      if (response.success) {
        // Refresh skills
        await fetchSkills()
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to create skill'
      setError('general', message)
      throw error
    } finally {
      setLoading('createSkill', false)
    }
  }

  const updateSkill = async (id: string, data: Partial<Skill>) => {
    setLoading('updateSkill', true)
    clearError('general')
    try {
      const response = await apiClient.updateSkill(id, data)
      if (response.success) {
        // Update local state optimistically
        set((state) => ({
          skills: state.skills.map((s) => (s.id === id ? { ...s, ...data } : s)),
        }))
        // Verify with server
        await fetchSkills()
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to update skill'
      setError('general', message)
      throw error
    } finally {
      setLoading('updateSkill', false)
    }
  }

  const deleteSkill = async (id: string) => {
    setLoading('deleteSkill', true)
    clearError('general')
    try {
      const response = await apiClient.deleteSkill(id)
      if (response.success) {
        // Remove from local state
        set((state) => ({
          skills: state.skills.filter((s) => s.id !== id),
        }))
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to delete skill'
      setError('general', message)
      throw error
    } finally {
      setLoading('deleteSkill', false)
    }
  }

  return {
    // UI State
    isDarkMode: false,
    toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    activeSection: 'home',
    setActiveSection: (section: string) => set({ activeSection: section }),
    isMobileMenuOpen: false,
    setMobileMenuOpen: (open: boolean) => set({ isMobileMenuOpen: open }),

    // Auth State
    isLoggedIn: false,
    currentUser: null,
    adminEmail: null,
    login,
    logout,

    // Data State
    projects: [],
    skills: [],

    // Loading & Error States
    loading: {
      projects: false,
      skills: false,
      login: false,
      createProject: false,
      updateProject: false,
      deleteProject: false,
      createSkill: false,
      updateSkill: false,
      deleteSkill: false,
    },
    errors: {},
    clearError,

    // Data Fetching
    fetchProjects,
    fetchSkills,
    startRealTimeUpdates,
    stopRealTimeUpdates,

    // Project Management
    createProject,
    updateProject,
    deleteProject,

    // Skill Management
    createSkill,
    updateSkill,
    deleteSkill,
    
    // Real-time Update Polling
    _pollInterval: null,
    _pollIntervalMs: 30000, // 30 seconds
  }
})

// Navigation items for header
export const navItems = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'work', label: 'Work', href: '#work' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]

