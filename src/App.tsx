import { useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { HeroSection } from '@/components/HeroSection'
import { ProjectsSection } from '@/components/ProjectsSection'
import { SkillsSection } from '@/components/SkillsSection'
import { AboutSection } from '@/components/AboutSection'
import { ContactSection } from '@/components/ContactSection'
import { usePortfolioStore } from '@/store/usePortfolioStore'

function Portfolio() {
  const { setActiveSection } = usePortfolioStore()

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 }
    )

    const sections = document.querySelectorAll('section[id]')
    sections.forEach(section => observer.observe(section))

    return () => {
      sections.forEach(section => observer.unobserve(section))
    }
  }, [setActiveSection])

  return (
    <div className="site-background min-h-screen text-on-surface">
      <Header />

      {/* Main Content */}
      <div className="pt-16">
        <section id="home">
          <HeroSection />
        </section>
        <section id="about">
          <AboutSection />
        </section>
        <section id="skills">
          <SkillsSection />
        </section>
        <section id="work">
          <ProjectsSection />
        </section>
        <section id="contact">
          <ContactSection />
        </section>
      </div>

      <Footer />
    </div>
  )
}

function App() {
  return <Portfolio />
}

export default App
