import { create } from 'zustand'

export interface Project {
  id: string
  title: string
  description: string
  image?: string
  link?: string
  githubLink?: string
  tags: string[]
  order: number
  published: boolean
  featured: boolean
}

export interface Skill {
  id: string
  name: string
  category: string
  proficiency: string
  years: number
  order: number
}

const projects: Project[] = [
  {
    id: 'settleup',
    title: 'SettleUp',
    description: 'A native Android expense-sharing app that simplifies group payments, tracks contributions, and calculates who owes whom.',
    image: '/assets/SettleUp Project Image.png',
    link: 'https://github.com/GeeteshVaity/SettleUp',
    githubLink: 'https://github.com/GeeteshVaity/SettleUp',
    tags: ['Kotlin', 'Jetpack Compose', 'Room DB'],
    order: 1,
    published: true,
    featured: true,
  },
  {
    id: 'floravision',
    title: 'FloraVision',
    description: 'An AI-powered mobile application that identifies flower species from camera images using on-device machine learning.',
    image: '/assets/FloraVision Project Image.png',
    link: 'https://github.com/GeeteshVaity/FloraVision',
    githubLink: 'https://github.com/GeeteshVaity/FloraVision',
    tags: ['Flutter', 'TensorFlow Lite', 'Riverpod'],
    order: 2,
    published: true,
    featured: true,
  },
  {
    id: 'ev-fleet-intelligence',
    title: 'EV Fleet Intelligence',
    description: 'A community-driven EV charging platform connecting electric vehicle owners with nearby private and public charging stations.',
    image: '/assets/EV Fleet Intelligence Project Image.png',
    tags: ['Spring Boot', 'PostgreSQL', 'AWS'],
    order: 3,
    published: true,
    featured: true,
  },
]

const skills: Skill[] = [
  { id: 'java', name: 'Java', category: 'Languages', proficiency: 'advanced', years: 3, order: 1 },
  { id: 'kotlin', name: 'Kotlin', category: 'Languages', proficiency: 'advanced', years: 2, order: 2 },
  { id: 'python', name: 'Python', category: 'Languages', proficiency: 'intermediate', years: 2, order: 3 },
  { id: 'react', name: 'React', category: 'Frontend', proficiency: 'intermediate', years: 2, order: 1 },
  { id: 'typescript', name: 'TypeScript', category: 'Frontend', proficiency: 'advanced', years: 3, order: 2 },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'Frontend', proficiency: 'advanced', years: 2, order: 3 },
  { id: 'android', name: 'Android Development', category: 'Mobile', proficiency: 'advanced', years: 3, order: 1 },
  { id: 'firebase', name: 'Firebase', category: 'Tools', proficiency: 'intermediate', years: 2, order: 1 },
  { id: 'mysql', name: 'MySQL', category: 'Tools', proficiency: 'intermediate', years: 2, order: 2 },
]

interface PortfolioStore {
  isDarkMode: boolean
  toggleDarkMode: () => void
  activeSection: string
  setActiveSection: (section: string) => void
  isMobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  projects: Project[]
  skills: Skill[]
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  activeSection: 'home',
  setActiveSection: (section) => set({ activeSection: section }),
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  projects,
  skills,
}))

export const navItems = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'work', label: 'Work', href: '#work' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]
