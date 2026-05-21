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
}

export function AdminSkills() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAdminStore()
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  if (!isAuthenticated) {
    return null
  }

  const categories = ['Language', 'Framework', 'Tool', 'Database', 'Cloud', 'Other']

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
        >
          <h2 className="font-h2 text-2xl text-stone-900 dark:text-stone-100 mb-6">
            Your Skills ({skills.length})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-stone-600 dark:text-stone-400 font-label-hand">Loading skills...</p>
            </div>
          ) : skills.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                'text-center py-12 rounded-2xl',
                'bg-stone-50 dark:bg-stone-900 border-2 border-dashed border-stone-300 dark:border-stone-700'
              )}
            >
              <p className="text-stone-600 dark:text-stone-400 font-label-hand">No skills yet. Use the API to add skills.</p>
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
                            'bg-white dark:bg-stone-900 p-6 rounded-xl',
                            'border-2 border-stone-800 dark:border-stone-700',
                            'shadow-[2px_2px_0px_0px_rgba(44,44,44,0.1)]'
                          )}
                        >
                          <h4 className="font-h4 text-base text-stone-900 dark:text-stone-100 mb-2">{skill.name}</h4>
                          <div className="flex gap-4">
                            <div>
                              <p className="text-xs font-label-hand text-stone-600 dark:text-stone-400 uppercase mb-1">Proficiency</p>
                              <p className="text-sm font-bold text-orange-600 dark:text-orange-400 capitalize">{skill.proficiency}</p>
                            </div>
                            <div>
                              <p className="text-xs font-label-hand text-stone-600 dark:text-stone-400 uppercase mb-1">Years</p>
                              <p className="text-sm font-bold text-orange-600 dark:text-orange-400">{skill.years}+</p>
                            </div>
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
