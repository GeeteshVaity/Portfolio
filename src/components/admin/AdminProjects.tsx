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
  featured?: boolean
}

export function AdminProjects() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAdminStore()
  const [projects, setProjects] = useState<Project[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    link: '',
    image: '',
    published: true,
  })

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

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description) {
      setError('Title and description are required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const projectData = {
        title: formData.title,
        description: formData.description,
        image: formData.image || undefined,
        link: formData.link || undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        order: projects.length,
        published: formData.published,
      }

      if (editingId) {
        const response = await apiClient.updateProject(editingId, projectData)
        if (response.success) {
          await fetchProjects()
          setEditingId(null)
        }
      } else {
        const response = await apiClient.createProject(projectData)
        if (response.success) {
          await fetchProjects()
        }
      }

      setFormData({ title: '', description: '', tags: '', link: '', image: '', published: true })
      setShowForm(false)
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to save project'
      setError(message)
      console.error('Error saving project:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditProject = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      tags: project.tags.join(', '),
      link: project.link || '',
      image: project.image || '',
      published: project.published,
    })
    setEditingId(project.id)
    setShowForm(true)
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.deleteProject(id)
      if (response.success) {
        await fetchProjects()
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to delete project'
      setError(message)
      console.error('Error deleting project:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ title: '', description: '', tags: '', link: '', image: '', published: true })
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950">
      {/* Header */}
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-600 rounded-lg"
          >
            <p className="text-red-800 dark:text-red-200 font-label-hand">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 dark:text-red-400 underline"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {/* Add Project Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex gap-4"
        >
          {!showForm && (
            <>
              <button
                onClick={() => setShowForm(true)}
                disabled={loading}
                className={cn(
                  'px-6 py-3 rounded-xl font-label-hand',
                  'bg-orange-600 text-white hover:bg-orange-700',
                  'transition-colors shadow-[2px_2px_0px_0px_rgba(44,44,44,0.1)]',
                  loading && 'opacity-50 cursor-not-allowed'
                )}
              >
                + Add New Project
              </button>
              <button
                onClick={fetchProjects}
                disabled={loading}
                className={cn(
                  'px-6 py-3 rounded-xl font-label-hand',
                  'bg-stone-600 dark:bg-stone-700 text-white hover:bg-stone-700 dark:hover:bg-stone-600',
                  'transition-colors shadow-[2px_2px_0px_0px_rgba(44,44,44,0.1)]',
                  loading && 'opacity-50 cursor-not-allowed'
                )}
              >
                🔄 Refresh
              </button>
            </>
          )}
        </motion.div>

        {/* Add/Edit Project Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'bg-white dark:bg-stone-900 p-8 rounded-2xl mb-8',
              'border-2 border-stone-800 dark:border-stone-700',
              'shadow-[4px_4px_0px_0px_rgba(44,44,44,0.1)]'
            )}
          >
            <h2 className="font-h2 text-2xl text-stone-900 dark:text-stone-100 mb-6">
              {editingId ? 'Edit Project' : 'Add New Project'}
            </h2>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block font-label-hand text-stone-700 dark:text-stone-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  disabled={loading}
                  className={cn(
                    'w-full px-4 py-2 bg-stone-50 dark:bg-stone-800 border-2 border-stone-800 dark:border-stone-600',
                    'rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-400',
                    loading && 'opacity-50 cursor-not-allowed'
                  )}
                  placeholder="Project Title"
                />
              </div>
              <div>
                <label className="block font-label-hand text-stone-700 dark:text-stone-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  disabled={loading}
                  rows={4}
                  className={cn(
                    'w-full px-4 py-2 bg-stone-50 dark:bg-stone-800 border-2 border-stone-800 dark:border-stone-600',
                    'rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-400',
                    loading && 'opacity-50 cursor-not-allowed'
                  )}
                  placeholder="Project Description"
                />
              </div>
              <div>
                <label className="block font-label-hand text-stone-700 dark:text-stone-300 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  disabled={loading}
                  className={cn(
                    'w-full px-4 py-2 bg-stone-50 dark:bg-stone-800 border-2 border-stone-800 dark:border-stone-600',
                    'rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-400',
                    loading && 'opacity-50 cursor-not-allowed'
                  )}
                  placeholder="React, TypeScript, Tailwind"
                />
              </div>
              <div>
                <label className="block font-label-hand text-stone-700 dark:text-stone-300 mb-2">Link (optional)</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  disabled={loading}
                  className={cn(
                    'w-full px-4 py-2 bg-stone-50 dark:bg-stone-800 border-2 border-stone-800 dark:border-stone-600',
                    'rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-400',
                    loading && 'opacity-50 cursor-not-allowed'
                  )}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block font-label-hand text-stone-700 dark:text-stone-300 mb-2">Image URL (optional)</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  disabled={loading}
                  className={cn(
                    'w-full px-4 py-2 bg-stone-50 dark:bg-stone-800 border-2 border-stone-800 dark:border-stone-600',
                    'rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-400',
                    loading && 'opacity-50 cursor-not-allowed'
                  )}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  disabled={loading}
                  className="w-4 h-4"
                />
                <label htmlFor="published" className="ml-2 font-label-hand text-stone-700 dark:text-stone-300">
                  Publish this project
                </label>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    'px-6 py-2 rounded-lg font-label-hand',
                    'bg-orange-600 text-white hover:bg-orange-700 transition-colors',
                    loading && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {loading ? 'Saving...' : editingId ? 'Update Project' : 'Add Project'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className={cn(
                    'px-6 py-2 rounded-lg font-label-hand',
                    'bg-stone-300 dark:bg-stone-700 text-stone-900 dark:text-stone-100',
                    'hover:bg-stone-400 dark:hover:bg-stone-600 transition-colors',
                    loading && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Projects List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-h2 text-2xl text-stone-900 dark:text-stone-100 mb-6">
            Your Projects ({projects.length})
          </h2>
          {loading && !showForm && (
            <div className="text-center py-12">
              <p className="text-stone-600 dark:text-stone-400 font-label-hand">Loading projects...</p>
            </div>
          )}
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
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-h3 text-xl text-stone-900 dark:text-stone-100">{project.title}</h3>
                      <span className={cn(
                        'px-2 py-1 rounded text-xs font-label-hand',
                        project.published 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                          : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200'
                      )}>
                        {project.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-stone-600 dark:text-stone-400 mt-2">{project.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProject(project)}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      disabled={loading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-200 rounded-full text-xs font-label-hand"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-orange-600 dark:text-orange-400 hover:underline font-label-hand text-sm"
                  >
                    View Project →
                  </a>
                )}
              </motion.div>
            ))}
            {projects.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  'text-center py-12 rounded-2xl',
                  'bg-stone-50 dark:bg-stone-900 border-2 border-dashed border-stone-300 dark:border-stone-700'
                )}
              >
                <p className="text-stone-600 dark:text-stone-400 font-label-hand">No projects yet. Add your first project!</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
