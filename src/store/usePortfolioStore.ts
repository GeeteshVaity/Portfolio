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
  // Languages
  { id: 'java', name: 'Java', category: 'Languages', proficiency: 'advanced', years: 3, order: 1 },
  { id: 'kotlin', name: 'Kotlin', category: 'Languages', proficiency: 'advanced', years: 2, order: 2 },
  { id: 'dart', name: 'Dart', category: 'Languages', proficiency: 'intermediate', years: 1, order: 3 },
  { id: 'python', name: 'Python', category: 'Languages', proficiency: 'intermediate', years: 1, order: 4 },
  { id: 'sql', name: 'SQL', category: 'Languages', proficiency: 'intermediate', years: 2, order: 5 },

  // Tools
  { id: 'git', name: 'Git', category: 'Tools', proficiency: 'intermediate', years: 2, order: 1 },
  { id: 'github', name: 'GitHub', category: 'Tools', proficiency: 'intermediate', years: 2, order: 2 },
  { id: 'android-studio', name: 'Android Studio', category: 'Tools', proficiency: 'advanced', years: 3, order: 3 },
  { id: 'intellij', name: 'IntelliJ IDEA', category: 'Tools', proficiency: 'intermediate', years: 2, order: 4 },
  { id: 'vscode', name: 'VS Code', category: 'Tools', proficiency: 'advanced', years: 2, order: 5 },
  { id: 'aws', name: 'AWS', category: 'Tools', proficiency: 'intermediate', years: 1, order: 6 },
  { id: 'firebase', name: 'Firebase', category: 'Tools', proficiency: 'intermediate', years: 2, order: 7 },
  { id: 'mysql', name: 'MySQL', category: 'Tools', proficiency: 'intermediate', years: 2, order: 8 },
  { id: 'postgresql', name: 'PostgreSQL', category: 'Tools', proficiency: 'intermediate', years: 2, order: 9 },

  // Mobile
  { id: 'android', name: 'Android Development', category: 'Mobile', proficiency: 'advanced', years: 3, order: 1 },
  { id: 'flutter', name: 'Flutter', category: 'Mobile', proficiency: 'intermediate', years: 1, order: 2 },
  { id: 'jetpack-compose', name: 'Jetpack Compose', category: 'Mobile', proficiency: 'intermediate', years: 1, order: 3 },
  { id: 'room', name: 'Room Database', category: 'Mobile', proficiency: 'intermediate', years: 1, order: 4 },
  { id: 'sqlite', name: 'SQLite', category: 'Mobile', proficiency: 'intermediate', years: 1, order: 5 },
  { id: 'datastore', name: 'DataStore', category: 'Mobile', proficiency: 'beginner', years: 1, order: 6 },

  // Backend
  { id: 'springboot', name: 'Spring Boot', category: 'Backend', proficiency: 'intermediate', years: 2, order: 1 },
  { id: 'rest-api', name: 'REST APIs', category: 'Backend', proficiency: 'intermediate', years: 2, order: 2 },
  { id: 'jpa', name: 'JPA', category: 'Backend', proficiency: 'intermediate', years: 1, order: 3 },
  { id: 'java-backend', name: 'Java Backend Development', category: 'Backend', proficiency: 'intermediate', years: 2, order: 4 },
];

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
