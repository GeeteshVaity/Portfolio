import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'


const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

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

const skillLogos = [
  {
    name: 'Java',
    position: '-left-8 top-20',
    gradient: 'from-yellow-50 to-yellow-100',
    icon: 'coffee',
    animationDuration: 5,
    animationDelay: 0,
    image: '/assets/java-logo.png', // Add image path here to use image instead of icon
  },
  {
    name: 'Android',
    position: '-right-8 top-16',
    gradient: 'from-green-50 to-green-200',
    icon: 'android',
    animationDuration: 6,
    animationDelay: 0.5,
    image: '/assets/android-logo.png', // Add image path here to use image instead of icon
  },
  {
    name: 'Kotlin',
    position: '-left-6 bottom-32',
    gradient: 'from-pink-50 to-pink-200',
    icon: 'K',
    animationDuration: 5.5,
    animationDelay: 1,
    image: '/assets/Kotlin-logo.png', // Add image path here to use image instead of icon
    isText: true,
  },
  {
    name: 'MySQl',
    position: '-right-6 bottom-28',
    gradient: 'from-blue-100 to-cyan-200',
    icon: 'deployed_code',
    animationDuration: 6.5,
    animationDelay: 1.5,
    image: '/assets/MySQL-logo.png', // Add image path here to use image instead of icon
  },
  
  {
    name: 'Python',
    position: 'right-1/4 -bottom-4',
    gradient: 'from-blue-50 to-blue-50',
    icon: 'psychology',
    animationDuration: 6.2,
    animationDelay: 1.2,
    image: '/assets/Python-logo.png', // Add image path here to use image instead of icon
  },
  {
    name: 'Firebase',
    position: 'left-1/4 -top-4',
    gradient: 'from-orange-50 to-orange-70',
    icon: 'TS',
    animationDuration: 5.2,
    animationDelay: 0.3,
    image: '/assets/firebase-logo.png', // Add image path here to use image instead of icon
    isText: true,
  },
]

export function HeroSection() {
  const positions = ["Geetesh Vaity", "An Android Developer", "An Engineering Student"]
  const prefix = "Hi I am \n"
  
  const [displayedText, setDisplayedText] = useState(prefix)
  
  const stateRef = useRef({
    charIndex: 0,
    isDeleting: false,
    positionIndex: 0,
    timeoutId: null as ReturnType<typeof setTimeout> | null,
  })

  useEffect(() => {
    const typingSpeed = 120
    const deletingSpeed = 120
    const pauseDuration = 2000

    const type = () => {
      const state = stateRef.current
      const currentWord = positions[state.positionIndex]

      if (state.isDeleting) {
        // Delete phase
        if (state.charIndex > 0) {
          state.charIndex--
          setDisplayedText(prefix + currentWord.substring(0, state.charIndex))
          state.timeoutId = setTimeout(type, deletingSpeed)
        } else {
          // Finished deleting, move to next position
          state.positionIndex = (state.positionIndex + 1) % positions.length
          state.isDeleting = false
          state.charIndex = 0
          state.timeoutId = setTimeout(type, deletingSpeed)
        }
      } else {
        // Type phase
        if (state.charIndex < currentWord.length) {
          state.charIndex++
          setDisplayedText(prefix + currentWord.substring(0, state.charIndex))
          state.timeoutId = setTimeout(type, typingSpeed)
        } else {
          // Finished typing, pause then start deleting
          state.timeoutId = setTimeout(() => {
            state.isDeleting = true
            type()
          }, pauseDuration)
        }
      }
    }

    // Start the animation
    type()

    return () => {
      if (stateRef.current.timeoutId) {
        clearTimeout(stateRef.current.timeoutId)
      }
    }
  }, [])

  return (
    <main className="pt-24 sm:pt-32 max-w-screen-xl mx-auto px-4 sm:px-8 md:px-xl py-lg md:py-xl">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-12 gap-lg items-center lg:items-start"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Left Content */}
        <motion.div className="md:col-span-6 space-y-md" variants={heroVariants}>

          <motion.h1 className="font-h1 text-h1 text-on-surface leading-tight min-h-24 flex items-start">
            <span className="relative whitespace-pre-line">
              {displayedText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="inline-block w-1 h-12 bg-on-surface ml-1 align-text-top"
              />
            </span>
          </motion.h1>

          <motion.p
            className="font-body-lg text-body-lg text-on-surface-variant max-w-lg"
            variants={heroVariants}
          >
            Information Technology student passionate about Android development, interactive UI/UX, AI-powered applications, and creative digital experiences.
          </motion.p>

          <motion.div className="flex flex-wrap gap-sm pt-4" variants={heroVariants}>
            <motion.button
              className={cn(
                'relative overflow-hidden',
                'bg-gradient-to-br from-orange-500 to-orange-600 text-white',
                'font-h3 px-10 py-4 rounded-[18px] border-2 border-stone-900',
                'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
                'hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
                'active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
                'transition-all duration-200',
                'group'
              )}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              onClick={() => {
                const resumeUrl = import.meta.env.VITE_RESUME_URL || ''
                if (!resumeUrl) {
                  console.warn('Resume URL not configured')
                  return
                }
                const link = document.createElement('a')
                link.href = resumeUrl
                link.download = 'Geetesh_Vaity_Resume.pdf'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/0 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <span className="relative flex items-center gap-2.5">
                Resume
                <span className="material-symbols-outlined text-lg group-hover:animate-bounce">
                  download
                </span>
              </span>
            </motion.button>

            <motion.div
              className="flex items-center gap-4 px-4 py-4 font-body-md text-on-surface-variant italic"
              whileHover={{ x: 4 }}
            >
              <span className="material-symbols-outlined text-orange-500">gesture</span>
              Focused on clean design, smooth user experiences, and scalable development.
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Content - Hero Image */}
        <motion.div 
          className="md:col-span-6 flex justify-center items-center md:mt-0"
          variants={heroVariants}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full max-w-md"
          >
            {/* Floating Skill Squares */}
            {skillLogos.map((skill) => (
              <motion.div
                key={skill.name}
                className={`absolute ${skill.position} w-16 h-16 bg-gradient-to-br ${skill.gradient} rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-xl border-2 border-stone-900 z-20`}
                animate={{ y: [0, -20, 0], x: [0, 10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: skill.animationDuration, repeat: Infinity, ease: "easeInOut", delay: skill.animationDelay }}
              >
                {skill.image ? (
                  <img 
                    src={skill.image}
                    alt={skill.name}
                    className="w-10 h-10 object-contain"
                  />
                ) : skill.isText ? (
                  <span className="text-lg">{skill.icon}</span>
                ) : (
                  <span className="material-symbols-outlined text-2xl">{skill.icon}</span>
                )}
              </motion.div>
            ))}

            <img 
              src="/assets/hero-profile.png"
              alt="Geetesh Vaity Profile"
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  )
}
