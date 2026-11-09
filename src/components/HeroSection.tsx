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
    <main className="hero-stage relative isolate min-h-[700px] overflow-hidden px-4 pt-14 sm:min-h-[680px] sm:px-8 sm:pt-16 lg:min-h-[700px]">
      <div className="relative mx-auto flex min-h-[640px] max-w-[1440px] items-center justify-center sm:min-h-[600px] lg:min-h-[620px]">
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-[5%] z-0 select-none text-center font-h1 text-[clamp(4.5rem,24vw,18rem)] font-black italic leading-[0.72] tracking-[-0.09em] text-[#d8d5ca] sm:top-[3%] sm:text-[clamp(5.5rem,19vw,18rem)]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          aria-hidden="true"
        >
          <span className="block">Geetesh</span>
          <span className="block pl-[0.25em]">Vaity</span>
        </motion.div>

        <motion.div
          className="absolute bottom-[17%] z-10 w-[min(100%,560px)] sm:bottom-[-5%] sm:w-[min(100%,760px)] lg:w-[min(62vw,820px)]"
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
          className="absolute bottom-[2%] left-0 z-20 w-[46%] max-w-[180px] sm:bottom-[16%] sm:block lg:left-[4%]"
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          <p className="font-body-md text-xs italic leading-tight text-[#3d3b36] sm:text-[20px]">
            Hello, I&apos;m
            <br />
            <strong className="text-sm not-italic sm:text-[26px]">Geetesh Vaity</strong>
          </p>
          <p className="mt-1 text-[9px] leading-snug text-[#77736a] sm:mt-2 sm:text-[14px]">
            Mobile App & Backend developer.
          </p>
          <button
            type="button"
            onClick={downloadResume}
            className="mt-3 rounded-full bg-[#2b2a27] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5 sm:mt-4 sm:px-4 sm:text-[10px]"
          >
            Resume
          </button>
        </motion.div>

        <div className="absolute bottom-[2%] right-0 z-20 w-[42%] max-w-[220px] text-right text-[11px] leading-relaxed text-[#5f5b52] sm:bottom-[12%] sm:text-[13px] lg:right-[4%] lg:text-[14px]">
          Focused on clean design, smooth user experiences, and scalable development.
        </div>
      </div>
    </main>
  )
}
