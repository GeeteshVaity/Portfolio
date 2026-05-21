import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdminStore } from '@/store/useAdminStore'
import { apiClient } from '@/lib/api-client'
import { cn } from '@/lib/utils'

interface Project {
  id: string
  title: string
  description: string
  image?: string
  link?: string
  tags: string[]
  order: number
  published: boolean
}

export function AdminProjects() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAdminStore()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
      return
    }
    fetchProjects()
  }, [isAuthenticated, navigate])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getProjects()
      if (response.success && response.data) {
        setProjects(response.data)
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch projects'
      setError(message)
      console.error('Error fetching projects:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950">
      <motion.header
        className={cn(
          'bg-white dark:bg-stone-900 border-b-2 border-stone-800 dark:border-stone-700',
          'shadow-[0_4px_0px_0px_rgba(44,44,44,0.1)]'
        )}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="font-h1 text-2xl md:text-3xl text-stone-900 dark:text-stone-100">Projects Management</h1>
            <p className="font-label-hand text-stone-600 dark:text-stone-400 text-xs uppercase tracking-widest mt-1">
              Manage your portfolio projects
            </p>
          </div>
          <Link to="/admin/dashboard">
            <button className={cn(
              'px-4 py-2 rounded-lg font-label-hand text-sm',
              'bg-stone-800 dark:bg-stone-700 text-white hover:bg-stone-900',
              'transition-colors'
            )}>
              ← Back
            </button>
          </Link>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-600 rounded-lg"
          >
            <p className="text-red-800 dark:text-red-200 font-label-hand">{error}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="font-h2 text-2xl text-stone-900 dark:text-stone-100 mb-6">
            Your Projects ({projects.length})
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-stone-600 dark:text-stone-400 font-label-hand">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-stone-50 dark:bg-stone-900 border-2 border-dashed border-stone-300 dark:border-stone-700">
              <p className="text-stone-600 dark:text-stone-400 font-label-hand">No projects yet. Use the API to add projects.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'bg-white dark:bg-stone-900 p-6 rounded-2xl',
                    'border-2 border-stone-800 dark:border-stone-700',
                    'shadow-[4px_4px_0px_0px_rgba(44,44,44,0.1)]'
                  )}
                >
                  <h3 className="font-h3 text-lg text-stone-900 dark:text-stone-100">{project.title}</h3>
                  <p className="text-stone-600 dark:text-stone-400 text-sm mt-2">{project.description}</p>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-200 rounded-full text-xs font-label-hand"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
