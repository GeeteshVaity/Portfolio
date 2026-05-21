import { motion } from 'framer-motion'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { ErrorAlert, EmptyState, LoadingSkeleton } from '@/components/ErrorStates'
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates'
import { useRef, useState, useEffect, useCallback } from 'react'

/**
 * Projects Section Component
 * Displays all published projects with real-time updates from API
 * Handles loading, error states, and empty states gracefully
 */
export function ProjectsSection() {
  const { projects, loading, errors, clearError } = usePortfolioStore()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const isAnimatingRef = useRef(false)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>()
  
  // Enable real-time polling for projects (30 second intervals)
  useRealTimeUpdates(true, 30000)

  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current && !isAnimatingRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current && !isAnimatingRef.current) {
      isAnimatingRef.current = true
      const container = scrollContainerRef.current
      const cardWidth = 384 + 16 // w-96 (384px) + gap-md (16px)
      const currentScroll = container.scrollLeft
      
      const targetScroll = direction === 'left' 
        ? Math.max(0, currentScroll - cardWidth)
        : currentScroll + cardWidth
      
      const startScroll = container.scrollLeft
      const distance = targetScroll - startScroll
      const duration = 600
      let startTime: number | null = null

      const animateScroll = (currentTime: number) => {
        if (startTime === null) startTime = currentTime
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Cubic bezier easing for professional feel (ease-out)
        const easeProgress = 1 - Math.pow(1 - progress, 3)
        
        container.scrollLeft = startScroll + distance * easeProgress

        if (progress < 1) {
          requestAnimationFrame(animateScroll)
        } else {
          isAnimatingRef.current = false
          checkScroll()
        }
      }

      requestAnimationFrame(animateScroll)
    }
  }

  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      checkScroll()
    }, 100)
  }, [checkScroll])

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    
    return () => {
      window.removeEventListener('resize', checkScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [checkScroll])

  // Loading State
  if (loading.projects) {
    return (
      <section id="work" className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-xl py-lg md:py-xl">
        <h2 className="font-h2 text-h2 text-on-surface mb-2">
          Things I <span className="yellow-highlight">Built</span>
        </h2>
        <LoadingSkeleton count={3} height="h-72" className="grid grid-cols-1 md:grid-cols-2 gap-md" />
      </section>
    )
  }

  // Error State
  if (errors.projects) {
    return (
      <section id="work" className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-xl py-lg md:py-xl">
        <h2 className="font-h2 text-h2 text-on-surface mb-2">
          Things I <span className="yellow-highlight">Built</span>
        </h2>
        <ErrorAlert
          message={errors.projects}
          title="Failed to Load Projects"
          onClose={() => clearError('projects')}
        />
      </section>
    )
  }

  // Empty State
  if (!projects || projects.length === 0) {
    return (
      <section id="work" className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-xl py-lg md:py-xl">
        <h2 className="font-h2 text-h2 text-on-surface mb-2">
          Things I <span className="yellow-highlight">Built</span>
        </h2>
        <EmptyState
          title="No projects yet"
          description="Projects will appear here once they're added."
          icon="📁"
        />
      </section>
    )
  }

  // Filter published projects and sort by order
  const displayProjects = projects
    .filter((p) => p.published)
    .sort((a, b) => a.order - b.order)

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

  const projectVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="work" className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-xl py-lg md:py-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="font-h2 text-h2 text-on-surface mb-2">
          Things I <span className="yellow-highlight">Built</span>
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg max-w-2xl">
          A collection of projects that showcase my passion for building beautiful, functional, and scalable web applications.
        </p>
      </motion.div>

      <motion.div
        className="relative group"
        onViewportEnter={() => checkScroll()}
      >

        {/* Left Scroll Button */}
        <motion.button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-lg bg-gradient-to-br from-stone-700 to-stone-900 text-white shadow-xl disabled:hidden hover:from-stone-600 hover:to-stone-800 transition-all duration-200 backdrop-blur-sm border border-stone-600"
          whileHover={{ scale: 1.15, x: -2 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: canScrollLeft ? 1 : 0, x: canScrollLeft ? 0 : -20 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        {/* Right Scroll Button */}
        <motion.button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-lg bg-gradient-to-br from-stone-700 to-stone-900 text-white shadow-xl disabled:hidden hover:from-stone-600 hover:to-stone-800 transition-all duration-200 backdrop-blur-sm border border-stone-600"
          whileHover={{ scale: 1.15, x: 2 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: canScrollRight ? 1 : 0, x: canScrollRight ? 0 : 20 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>

        {/* Scroll Container */}
        <motion.div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-md pt-6 pb-6 scroll-smooth snap-none [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-stone-900/10 [&::-webkit-scrollbar-thumb]:bg-stone-700 [&::-webkit-scrollbar-thumb]:rounded-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          onScroll={handleScroll}
        >
          {displayProjects.map((project) => (
            <motion.a
              key={project.id}
              href={project.link || '#'}
              target={project.link ? '_blank' : undefined}
              rel={project.link ? 'noopener noreferrer' : undefined}
              className="group/card block flex-shrink-0 w-96 relative z-10 hover:z-20"
              variants={projectVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="relative bg-surface-container-highest border-2 border-stone-900 rounded-xl overflow-hidden shadow-sketch hover:shadow-sketch-lg transition-all duration-300 h-full">

                {/* Image */}
                {project.image && (
                  <div className="relative h-48 overflow-hidden bg-surface-container">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.15 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                )}

                {/* Content */}
                <div className="p-6 relative z-10">
                  <h3 className="font-h3 text-h3 text-on-surface mb-2 transition-colors">
                    {project.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <motion.span
                          key={tag}
                          className="inline-block px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed font-label-hand text-label-hand rounded-full border border-stone-900 text-xs"
                        whileHover={{ scale: 1.1 }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  )}


                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
