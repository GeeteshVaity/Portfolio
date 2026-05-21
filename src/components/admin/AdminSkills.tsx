import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdminStore } from '@/store/useAdminStore'
import { apiClient } from '@/lib/api-client'
import { cn } from '@/lib/utils'

interface Skill {
  id: string
  name: string
  category: string
  proficiency: string
  years: number
  order: number
}

export function AdminSkills() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAdminStore()
  const [skills, setSkills] = useState<Skill[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    proficiency: 'intermediate',
    years: 1,
  })

  const proficiencyOptions = ['beginner', 'intermediate', 'advanced', 'expert']
  const categories = ['Language', 'Framework', 'Tool', 'Database', 'Cloud', 'Other']

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
      return
    }
    fetchSkills()
  }, [isAuthenticated, navigate])

  const fetchSkills = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getSkills()
      if (response.success && response.data) {
        setSkills(response.data)
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch skills'
      setError(message)
      console.error('Error fetching skills:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.category) {
      setError('Name and category are required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const skillData = {
        name: formData.name,
        category: formData.category,
        proficiency: formData.proficiency,
        years: formData.years,
        order: skills.length,
      }

      if (editingId) {
        const response = await apiClient.updateSkill(editingId, skillData)
        if (response.success) {
          await fetchSkills()
          setEditingId(null)
        }
      } else {
        const response = await apiClient.createSkill(skillData)
        if (response.success) {
          await fetchSkills()
        }
      }

      setFormData({ name: '', category: '', proficiency: 'intermediate', years: 1 })
      setShowForm(false)
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to save skill'
      setError(message)
      console.error('Error saving skill:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditSkill = (skill: Skill) => {
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      years: skill.years,
    })
    setEditingId(skill.id)
    setShowForm(true)
  }

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) {
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.deleteSkill(id)
      if (response.success) {
        await fetchSkills()
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to delete skill'
      setError(message)
      console.error('Error deleting skill:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', category: '', proficiency: 'intermediate', years: 1 })
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
            <h1 className="font-h1 text-2xl md:text-3xl text-stone-900 dark:text-stone-100">Skills Management</h1>
            <p className="font-label-hand text-stone-600 dark:text-stone-400 text-xs uppercase tracking-widest mt-1">
              Manage your technical skills
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

        {/* Add Skill Button */}
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
                + Add New Skill
              </button>
              <button
                onClick={fetchSkills}
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

        {/* Add/Edit Skill Form */}
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
              {editingId ? 'Edit Skill' : 'Add New Skill'}
            </h2>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block font-label-hand text-stone-700 dark:text-stone-300 mb-2">Skill Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={loading}
                  className={cn(
                    'w-full px-4 py-2 bg-stone-50 dark:bg-stone-800 border-2 border-stone-800 dark:border-stone-600',
                    'rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-400',
                    loading && 'opacity-50 cursor-not-allowed'
                  )}
                  placeholder="e.g., React"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-hand text-stone-700 dark:text-stone-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    disabled={loading}
                    className={cn(
                      'w-full px-4 py-2 bg-stone-50 dark:bg-stone-800 border-2 border-stone-800 dark:border-stone-600',
                      'rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-400',
                      loading && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-label-hand text-stone-700 dark:text-stone-300 mb-2">Proficiency</label>
                  <select
                    value={formData.proficiency}
                    onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
                    disabled={loading}
                    className={cn(
                      'w-full px-4 py-2 bg-stone-50 dark:bg-stone-800 border-2 border-stone-800 dark:border-stone-600',
                      'rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-400',
                      loading && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {proficiencyOptions.map(option => (
                      <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-label-hand text-stone-700 dark:text-stone-300 mb-2">Years of Experience</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.years}
                  onChange={(e) => setFormData({ ...formData, years: parseInt(e.target.value) })}
                  disabled={loading}
                  className={cn(
                    'w-full px-4 py-2 bg-stone-50 dark:bg-stone-800 border-2 border-stone-800 dark:border-stone-600',
                    'rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-400',
                    loading && 'opacity-50 cursor-not-allowed'
                  )}
                />
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
                  {loading ? 'Saving...' : editingId ? 'Update Skill' : 'Add Skill'}
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

        {/* Skills List by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-h2 text-2xl text-stone-900 dark:text-stone-100 mb-6">
            Your Skills ({skills.length})
          </h2>

          {loading && !showForm && (
            <div className="text-center py-12">
              <p className="text-stone-600 dark:text-stone-400 font-label-hand">Loading skills...</p>
            </div>
          )}

          {skills.length === 0 && !loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                'text-center py-12 rounded-2xl',
                'bg-stone-50 dark:bg-stone-900 border-2 border-dashed border-stone-300 dark:border-stone-700'
              )}
            >
              <p className="text-stone-600 dark:text-stone-400 font-label-hand">No skills yet. Add your first skill!</p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {categories.map(category => {
                const categorySkills = skills.filter(s => s.category === category)
                if (categorySkills.length === 0) return null
                
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="font-h3 text-lg text-stone-900 dark:text-stone-100 mb-4">{category}</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categorySkills.map((skill) => (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={cn(
                            'bg-white dark:bg-stone-900 p-6 rounded-xl h-full',
                            'border-2 border-stone-800 dark:border-stone-700',
                            'shadow-[2px_2px_0px_0px_rgba(44,44,44,0.1)]',
                            'flex flex-col'
                          )}
                        >
                          {/* Skill Info */}
                          <div className="mb-4">
                            <p className="font-h3 text-base text-stone-900 dark:text-stone-100">{skill.name}</p>
                            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                              {skill.proficiency.charAt(0).toUpperCase() + skill.proficiency.slice(1)} • {skill.years} {skill.years === 1 ? 'year' : 'years'}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 mt-auto pt-4 border-t border-stone-200 dark:border-stone-800">
                            <button
                              onClick={() => handleEditSkill(skill)}
                              disabled={loading}
                              className={cn(
                                'flex-1 px-4 py-2 rounded-lg font-label-hand text-sm',
                                'bg-blue-600 text-white hover:bg-blue-700',
                                'transition-colors shadow-[1px_1px_0px_0px_rgba(44,44,44,0.1)]',
                                loading && 'opacity-50 cursor-not-allowed'
                              )}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSkill(skill.id)}
                              disabled={loading}
                              className={cn(
                                'flex-1 px-4 py-2 rounded-lg font-label-hand text-sm',
                                'bg-red-600 text-white hover:bg-red-700',
                                'transition-colors shadow-[1px_1px_0px_0px_rgba(44,44,44,0.1)]',
                                loading && 'opacity-50 cursor-not-allowed'
                              )}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
