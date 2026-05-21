import { motion } from 'framer-motion'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { ErrorAlert, EmptyState, LoadingSkeleton } from '@/components/ErrorStates'
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates'

/**
 * Skills Section Component
 * Displays all skills grouped by category with real-time updates from API
 * Handles loading, error states, and empty states gracefully
 */
export function SkillsSection() {
  const { skills, loading, errors, clearError } = usePortfolioStore()
  
  // Enable real-time polling for skills (30 second intervals)
  useRealTimeUpdates(true, 30000)

  // Loading State
  if (loading.skills) {
    return (
      <section id="skills" className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-xl py-lg md:py-xl">
        <h2 className="font-h2 text-h2 text-on-surface mb-2">
          Skills &amp; <span className="yellow-highlight">Expertise</span>
        </h2>
        <LoadingSkeleton count={4} height="h-40" className="grid grid-cols-1 md:grid-cols-2 gap-lg" />
      </section>
    )
  }

  // Error State
  if (errors.skills) {
    return (
      <section id="skills" className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-xl py-lg md:py-xl">
        <h2 className="font-h2 text-h2 text-on-surface mb-2">
          Skills &amp; <span className="yellow-highlight">Expertise</span>
        </h2>
        <ErrorAlert
          message={errors.skills}
          title="Failed to Load Skills"
          onClose={() => clearError('skills')}
        />
      </section>
    )
  }

  // Empty State
  if (!skills || skills.length === 0) {
    return (
      <section id="skills" className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-xl py-lg md:py-xl">
        <h2 className="font-h2 text-h2 text-on-surface mb-2">
          Skills &amp; <span className="yellow-highlight">Expertise</span>
        </h2>
        <EmptyState
          title="No skills added yet"
          description="Skills will appear here once they're added."
          icon="⚙️"
        />
      </section>
    )
  }

  // Group skills by category
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, typeof skills>
  )

  // Sort by order within each category
  Object.keys(skillsByCategory).forEach((category) => {
    skillsByCategory[category].sort((a, b) => a.order - b.order)
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const categoryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const skillVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  }

  return (
    <section id="skills" className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-xl py-lg md:py-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="font-h2 text-h2 text-on-surface mb-2">
          Skills &amp; <span className="yellow-highlight">Expertise</span>
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg max-w-2xl">
          Crafted through years of building, breaking, and rebuilding digital solutions.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-lg"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <motion.div
            key={category}
            className="bg-surface-container-highest border-2 border-stone-900 rounded-xl p-6 shadow-sketch hover:shadow-sketch-lg transition-all duration-300"
            variants={categoryVariants}
          >
            <h3 className="font-h3 text-h3 text-on-surface mb-4">{category}</h3>
            <div className="flex flex-wrap gap-3">
              {categorySkills.map((skill) => (
                <motion.span
                  key={skill.id}
                  className="inline-block px-4 py-2 bg-tertiary-fixed text-on-tertiary-fixed font-label-hand text-label-hand rounded-full border-2 border-stone-900 cursor-pointer"
                  variants={skillVariants}
                  whileHover={{ scale: 1.15, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                  title={skill.years > 0 ? `${skill.years}+ years` : undefined}
                >
                  {skill.name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
