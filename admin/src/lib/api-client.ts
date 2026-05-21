import axios, { AxiosInstance, AxiosError } from 'axios'

interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: any
}

// Simple validation interfaces for frontend
interface LoginInput {
  email: string
  password: string
}

interface ProjectInput {
  title: string
  description: string
  image?: string
  technologies: string[]
  link?: string
  featured?: boolean
}

interface ProjectUpdateInput extends Partial<ProjectInput> {}

interface SkillInput {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category: string
}

interface SkillUpdateInput extends Partial<SkillInput> {}

class ApiClient {
  private client: AxiosInstance
  private baseURL: string

  constructor(baseURL = import.meta.env.VITE_API_URL || '/api') {
    this.baseURL = baseURL
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      // Remove withCredentials for public endpoints
      // withCredentials: true,
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse>) => {
        const message = error.response?.data?.message || error.message
        console.error('API Error:', message)
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  async login(credentials: LoginInput): Promise<ApiResponse> {
    const response = await this.client.post<ApiResponse>('/auth/login', credentials)
    return response.data
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.client.post<ApiResponse>('/auth/logout')
    return response.data
  }

  // Projects endpoints
  async getProjects(): Promise<ApiResponse> {
    const response = await this.client.get<ApiResponse>('/projects')
    return response.data
  }

  async createProject(data: ProjectInput): Promise<ApiResponse> {
    const response = await this.client.post<ApiResponse>('/projects', data)
    return response.data
  }

  async updateProject(id: string, data: ProjectUpdateInput): Promise<ApiResponse> {
    const response = await this.client.put<ApiResponse>(`/projects/${id}`, data)
    return response.data
  }

  async deleteProject(id: string): Promise<ApiResponse> {
    const response = await this.client.delete<ApiResponse>(`/projects/${id}`)
    return response.data
  }

  // Skills endpoints
  async getSkills(): Promise<ApiResponse> {
    const response = await this.client.get<ApiResponse>('/skills')
    return response.data
  }

  async createSkill(data: SkillInput): Promise<ApiResponse> {
    const response = await this.client.post<ApiResponse>('/skills', data)
    return response.data
  }

  async updateSkill(id: string, data: SkillUpdateInput): Promise<ApiResponse> {
    const response = await this.client.put<ApiResponse>(`/skills/${id}`, data)
    return response.data
  }

  async deleteSkill(id: string): Promise<ApiResponse> {
    const response = await this.client.delete<ApiResponse>(`/skills/${id}`)
    return response.data
  }

  // Set auth token
  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  // Clear auth token
  clearAuthToken(): void {
    delete this.client.defaults.headers.common['Authorization']
  }
}

export const apiClient = new ApiClient()
