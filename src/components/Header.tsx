import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { usePortfolioStore, navItems } from '@/store/usePortfolioStore'
import { cn } from '@/lib/utils'

export function Header() {
  const { activeSection, setActiveSection, isMobileMenuOpen, setMobileMenuOpen } =
    usePortfolioStore()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sectionId)
    }
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
      <div
        className={cn(
          'mx-auto flex w-full max-w-[760px] items-center justify-between rounded-full border border-[#dedbd2] px-4 py-2.5 transition-all duration-300 sm:px-5 sm:py-3',
          isScrolled ? 'bg-[#f8f6ef]/95 shadow-[0_8px_30px_rgba(70,65,50,0.12)] backdrop-blur-md' : 'bg-[#f8f6ef]/90'
        )}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="font-h1 text-lg font-black italic tracking-[-0.06em] text-stone-900 sm:text-xl"
            whileHover={{ scale: 1.05, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            Geetesh
          </motion.div>

          {/* Social Icons */}
          <div className="ml-1 hidden items-center gap-1.5 sm:flex">
            <motion.a
              href="https://github.com/GeeteshVaity"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-stone-900 bg-white transition-colors hover:bg-stone-100"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              title="GitHub"
            >
              <img src="/assets/github-icon.png" alt="GitHub" className="w-5 h-5" />
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/geetesh-sanjay-vaity/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-stone-900 bg-white transition-colors hover:bg-stone-100"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              title="LinkedIn"
            >
              <img src="/assets/linkedin-icon.png" alt="LinkedIn" className="w-5 h-5" />
            </motion.a>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-5 font-h1 md:flex">
          {navItems.map(item => (
            <motion.button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                'cursor-pointer border-none bg-transparent text-xs font-medium transition-all duration-200 sm:text-sm',
                activeSection === item.id
                  ? 'font-bold text-orange-600'
                  : 'text-stone-600 hover:text-orange-500'
              )}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
            </motion.button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Say Hello Button */}
          <motion.button
            className="hidden rounded-full bg-[#e89032] px-4 py-2 text-xs font-bold text-white transition-transform hover:-translate-y-0.5 sm:block"
            whileHover={{ y: -2, boxShadow: '0px 0px 20px rgba(255, 179, 71, 0.4)' }}
            whileTap={{ y: 0, scale: 0.95 }}
            onClick={() => scrollToSection('contact')}
          >
            Say Hello
          </motion.button>

          {/* Mobile Menu Toggle */}
          <motion.button
            className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="w-6 h-0.5 bg-stone-900 block"
              animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="w-6 h-0.5 bg-stone-900 block"
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="w-6 h-0.5 bg-stone-900 block"
              animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.nav
        className="mt-2 overflow-hidden rounded-3xl border border-[#dedbd2] bg-[#f8f6ef] shadow-lg md:hidden"
        initial={{ height: 0, opacity: 0 }}
        animate={
          isMobileMenuOpen
            ? { height: 'auto', opacity: 1 }
            : { height: 0, opacity: 0 }
        }
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        <div className="flex flex-col gap-4 px-8 py-4">
          {navItems.map(item => (
            <motion.button
              key={item.id}
              onClick={() => {
                scrollToSection(item.id)
                setMobileMenuOpen(false)
              }}
              className={cn(
                'text-base font-medium transition-all duration-200 bg-none border-none cursor-pointer text-left',
                activeSection === item.id
                  ? 'text-orange-600 font-bold'
                  : 'text-stone-600 hover:text-orange-500'
              )}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
            </motion.button>
          ))}
          <motion.button 
            className="w-full bg-tertiary-container text-on-tertiary-container font-bold py-2 rounded-lg border-2 border-stone-900 shadow-sketch-sm mt-2"
            onClick={() => {
              scrollToSection('contact')
              setMobileMenuOpen(false)
            }}
          >
            Say Hello
          </motion.button>

          {/* Mobile Social Icons */}
          <div className="flex items-center gap-3 pt-4 border-t border-stone-200 mt-4">
            <motion.a
              href="https://github.com/GeeteshVaity"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 border-stone-900 bg-white hover:bg-stone-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="GitHub"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img src="/assets/github-icon.png" alt="GitHub" className="w-6 h-6" />
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/geetesh-sanjay-vaity/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 border-stone-900 bg-white hover:bg-stone-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="LinkedIn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img src="/assets/linkedin-icon.png" alt="LinkedIn" className="w-6 h-6" />
            </motion.a>
          </div>
        </div>
      </motion.nav>
    </header>
  )
}

