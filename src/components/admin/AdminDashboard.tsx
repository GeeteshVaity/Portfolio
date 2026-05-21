import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdminStore } from '@/store/useAdminStore'
import { apiClient } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function AdminDashboard() {
  const navigate = useNavigate()
  const { isAuthenticated, logout, user } = useAdminStore()
  const [projectCount, setProjectCount] = useState(0)
  const [skillCount, setSkillCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats()
      
      // Auto-refresh stats every 30 seconds
      const interval = setInterval(fetchStats, 30000)
      
      // Refresh when page comes back into focus
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          fetchStats()
        }
      }
      
      document.addEventListener('visibilitychange', handleVisibilityChange)
      
      return () => {
        clearInterval(interval)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }
  }, [isAuthenticated])

  const fetchStats = async () => {
    try {
      setLoading(true)
      // Fetch projects
      const projectsResponse = await apiClient.getProjects()
      if (projectsResponse.success && projectsResponse.data) {
        setProjectCount(projectsResponse.data.length)
      }

      // Fetch skills
      const skillsResponse = await apiClient.getSkills()
      if (skillsResponse.success && skillsResponse.data) {
        setSkillCount(skillsResponse.data.length)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const menuItems = [
    { label: 'Projects Management', path: '/admin/projects', icon: '📁', description: 'Manage your projects' },
    { label: 'Skills Management', path: '/admin/skills', icon: '🛠️', description: 'Manage your skills' },
  ]

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
            <h1 className="font-h1 text-2xl md:text-3xl text-stone-900 dark:text-stone-100">Admin Dashboard</h1>
            <p className="font-label-hand text-stone-600 dark:text-stone-400 text-xs uppercase tracking-widest mt-1">
              Welcome, {user?.name || 'Admin'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchStats}
              disabled={loading}
              className={cn(
                'px-4 py-2 rounded-lg font-label-hand text-sm',
                'bg-stone-600 dark:bg-stone-700 text-white hover:bg-stone-700 dark:hover:bg-stone-600',
                'transition-colors',
                loading && 'opacity-50 cursor-not-allowed'
              )}
            >
              🔄 Refresh
            </button>
            <button
              onClick={handleLogout}
              className={cn(
                'px-4 py-2 rounded-lg font-label-hand text-sm',
                'bg-red-600 text-white hover:bg-red-700',
                'transition-colors'
              )}
            >
              Logout
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="font-h2 text-2xl text-stone-900 dark:text-stone-100 mb-2">Management Tools</h2>
          <div className="h-1 w-20 bg-orange-300 dark:bg-orange-600 rounded-full"></div>
        </motion.div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Link to={item.path}>
                <div
                  className={cn(
                    'bg-white dark:bg-stone-900 p-8 rounded-2xl',
                    'border-2 border-stone-800 dark:border-stone-700',
                    'shadow-[4px_4px_0px_0px_rgba(44,44,44,0.1)]',
                    'hover:shadow-[6px_6px_0px_0px_rgba(44,44,44,0.2)]',
                    'hover:-translate-y-1 transition-all',
                    'cursor-pointer group'
                  )}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <h3 className="font-h3 text-xl text-stone-900 dark:text-stone-100 mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {item.label}
                  </h3>
                  <p className="font-body-md text-stone-600 dark:text-stone-400 text-sm">{item.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="font-h2 text-2xl text-stone-900 dark:text-stone-100 mb-6">Quick Stats</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: 'Total Projects', value: loading ? '...' : projectCount, icon: '📊' },
              { label: 'Total Skills', value: loading ? '...' : skillCount, icon: '⭐' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={cn(
                  'bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-900/10',
                  'p-6 rounded-xl border border-orange-300 dark:border-orange-700',
                  'text-center'
                )}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className="font-label-hand text-orange-900 dark:text-orange-200 text-xs uppercase tracking-widest mb-2">
                  {stat.label}
                </p>
                <p className="font-h1 text-3xl text-stone-900 dark:text-stone-100">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
