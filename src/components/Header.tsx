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
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sketch-sm' : 'bg-background'
      )}
    >
      <div className="flex justify-between items-center w-full px-4 sm:px-8 py-4 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-3">
          <motion.div
            className="text-2xl sm:text-3xl font-h1 font-black italic -rotate-1 text-stone-900"
            whileHover={{ scale: 1.05, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            Geetesh
          </motion.div>

          {/* Social Icons */}
          <div className="flex items-center gap-2 ml-2">
            <motion.a
              href="https://github.com/GeeteshVaity"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg border-2 border-stone-900 bg-white hover:bg-stone-100 transition-colors"
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
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg border-2 border-stone-900 bg-white hover:bg-stone-100 transition-colors"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              title="LinkedIn"
            >
              <img src="/assets/linkedin-icon.png" alt="LinkedIn" className="w-5 h-5" />
            </motion.a>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-h1">
          {navItems.map(item => (
            <motion.button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                'text-base font-medium transition-all duration-200 bg-none border-none cursor-pointer',
                activeSection === item.id
                  ? 'text-orange-600 font-bold border-b-2 border-orange-500 pb-1'
                  : 'text-stone-600 hover:text-orange-500'
              )}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
            </motion.button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Say Hello Button */}
          <motion.button
            className="hidden sm:block bg-background border-2 border-stone-900 px-6 py-2 rounded-lg font-bold text-orange-600 shadow-sketch-sm"
            whileHover={{ y: -2, boxShadow: '0px 0px 20px rgba(255, 179, 71, 0.4)' }}
            whileTap={{ y: 0, scale: 0.95 }}
            onClick={() => scrollToSection('contact')}
          >
            Say Hello
          </motion.button>

          {/* Mobile Menu Toggle */}
          <motion.button
            className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5"
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
        className="md:hidden bg-white border-t-2 border-stone-200"
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


