import { motion } from 'framer-motion'

export function HeroSection() {
  const downloadResume = () => {
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
  }

  return (
    <main className="hero-stage relative isolate min-h-[620px] overflow-hidden px-4 pt-14 sm:min-h-[680px] sm:px-8 sm:pt-16 lg:min-h-[700px]">
      <div className="relative mx-auto flex min-h-[560px] max-w-[1440px] items-center justify-center sm:min-h-[600px] lg:min-h-[620px]">
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-[3%] z-0 select-none text-center font-h1 text-[clamp(5.5rem,19vw,18rem)] font-black italic leading-[0.72] tracking-[-0.09em] text-[#d8d5ca]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          aria-hidden="true"
        >
          <span className="block">Geetesh</span>
          <span className="block pl-[0.25em]">Vaity</span>
        </motion.div>

        <motion.div
          className="absolute bottom-[-1%] z-10 w-[min(100%,760px)] sm:bottom-[-5%] lg:w-[min(62vw,820px)]"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: 'easeOut' }}
        >
          <img
            src="/assets/hero-profile.png"
            alt="Geetesh Vaity with sunflowers"
            className="h-auto w-full object-contain"
          />
        </motion.div>

        <motion.div
          className="absolute bottom-[16%] left-0 z-20 hidden max-w-[180px] sm:block lg:left-[4%]"
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          <p className="font-body-md text-sm italic leading-tight text-[#3d3b36]">
            Hello, I&apos;m
            <br />
            <strong className="text-base not-italic">Geetesh Vaity</strong>
          </p>
          <p className="mt-2 text-[10px] leading-snug text-[#77736a]">
            Android developer building thoughtful digital experiences.
          </p>
          <button
            type="button"
            onClick={downloadResume}
            className="mt-4 rounded-full bg-[#2b2a27] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5"
          >
            Resume
          </button>
        </motion.div>

        <div className="absolute bottom-[12%] right-0 z-20 hidden max-w-[150px] text-right text-[10px] leading-snug text-[#77736a] sm:block lg:right-[4%]">
          Focused on clean design, smooth user experiences, and scalable development.
        </div>
      </div>
    </main>
  )
}
