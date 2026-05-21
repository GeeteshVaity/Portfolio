import { motion } from 'framer-motion'

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const features = [
  {
    icon: 'code',
    title: 'Problem Solver',
    description: 'Focused on building practical and efficient solutions through structured thinking and modern technologies.',
  },
  {
    icon: 'design_services',
    title: 'UI/UX Focused',
    description: 'Creating intuitive interfaces that combine beautiful design with excellent user experience.',
  },
  {
    icon: 'android',
    title: 'Mobile Expert',
    description: 'Specializing in Android development with Java and Kotlin for scalable mobile solutions.',
  },
  {
    icon: 'psychology',
    title: 'Continuous Learner',
    description: 'Actively exploring Android development, backend systems, UI/UX design, and AI technologies.',
  },
]

export function AboutSection() {
  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-xl py-lg md:py-xl">
      {/* Section Title */}
      <motion.div
        className="text-center mb-xl"
        initial="hidden"
        whileInView="visible"
        variants={itemVariants}
        viewport={{ once: true }}
      >
        <h2 className="font-h2 text-h2 text-on-surface mb-4">
          About <span className="yellow-highlight">Me</span>
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          An IT student passionate about building modern digital experiences through clean code, beautiful design, and innovative thinking.
        </p>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-xl items-center mb-xl"
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true }}
      >
        {/* Image Section */}
        <motion.div
          variants={itemVariants}
          className="relative md:order-first"
          whileHover={{ y: -8 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-stone-900 rounded-2xl p-6 shadow-sketch-lg overflow-hidden">
              <img
                src="/assets/about-image.jpeg"
                alt="Geetesh Vaity Profile"
                className="w-full h-auto rounded-xl border-2 border-stone-900 object-cover"
              />
              {/* Decorative corner elements */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-orange-400 rounded-tl-lg"></div>
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-orange-400 rounded-br-lg"></div>
            </div>
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <motion.div variants={itemVariants} className="space-y-6 md:order-last">
          <div className="space-y-4">
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              I'm an Information Technology student passionate about building modern digital experiences through development, design, and creativity. I enjoy creating applications that combine functionality with visually engaging interfaces and smooth user interactions.
            </p>

            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              My interests include Android development, full-stack web development, UI/UX design, and experimenting with AI-powered applications. I'm constantly exploring new technologies and improving my skills by building real-world projects and interactive experiences.
            </p>
            
            {/*<p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Beyond coding, I enjoy sketching, painting, video editing, solving Rubik's cubes, and finding inspiration from movies, games, and modern digital products. I believe great applications are not just functional, but also intuitive, meaningful, and enjoyable to use.
            </p> */ }
          </div>

          {/* Social Links - Styled like Hero button */}
          <motion.div
            className="flex flex-wrap gap-3 pt-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { label: 'GitHub', icon: 'code', url: import.meta.env.VITE_GITHUB_URL },
              { label: 'LinkedIn', icon: 'person', url: import.meta.env.VITE_LINKEDIN_URL },
              { label: 'Email', icon: 'mail', url: `mailto:${import.meta.env.VITE_EMAIL}` }
            ].map(social => (
              <motion.a
                key={social.label}
                href={social.url}
                target={social.label === 'Email' ? undefined : '_blank'}
                rel={social.label === 'Email' ? undefined : 'noopener noreferrer'}
                className="inline-flex items-center gap-2 px-5 py-3 bg-surface-container-highest text-on-surface border-2 border-stone-900 rounded-xl font-label-hand shadow-sketch-sm hover:shadow-sketch-md transition-all duration-200"
                whileHover={{ y: -2, x: 2 }}
                whileTap={{ scale: 0.95 }}
                variants={itemVariants}
              >
                <span className="material-symbols-outlined text-lg">{social.icon}</span>
                <span>{social.label}</span>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="p-6 bg-surface-container-highest border-2 border-stone-900 rounded-xl shadow-sketch-sm hover:shadow-sketch-md transition-shadow duration-200"
            variants={featureVariants}
            whileHover={{ y: -4, rotate: index % 2 === 0 ? -0.5 : 0.5 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white border-2 border-stone-900">
                <span className="material-symbols-outlined text-lg">{feature.icon}</span>
              </div>
              <h3 className="font-h3 text-h3 text-on-surface">{feature.title}</h3>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
