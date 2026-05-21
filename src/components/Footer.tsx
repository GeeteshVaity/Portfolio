import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-stone-100 dark:bg-stone-950 border-t-2 border-dashed border-stone-400 mt-20">
      <div className="w-full py-12 px-4 sm:px-10 flex flex-col md:flex-row justify-between items-center gap-6 max-w-screen-2xl mx-auto">
        <motion.div
          className="flex flex-col gap-2 cursor-pointer group"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className={cn(
            'font-black text-stone-900 dark:text-stone-100 font-h1 text-2xl',
            'hover:text-orange-600 dark:hover:text-orange-400 transition-colors'
          )}>
            Geetesh
          </div>
          <p className="font-label-hand text-xs uppercase tracking-widest text-stone-500">
            © {currentYear} Designed and developed by Geetesh using modern web technologies.
          </p>
        </motion.div>

        <motion.div
          className="flex gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {['LeetCode', 'GitHub', 'Dribbble'].map(link => {
            const socialLinks: Record<string, string | undefined> = {
              LeetCode: import.meta.env.VITE_LEETCODE_URL,
              GitHub: import.meta.env.VITE_GITHUB_URL,
              Dribbble: import.meta.env.VITE_DRIBBBLE_URL
            }
            
            return (
              <motion.a
                key={link}
                href={socialLinks[link] || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'font-label-hand text-xs uppercase tracking-widest text-stone-500',
                  'hover:text-stone-900 dark:hover:text-stone-100 hover:underline',
                  'decoration-wavy decoration-orange-500 transition-all'
                )}
                whileHover={{ skewX: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                {link}
              </motion.a>
            )
          })}
        </motion.div>
      </div>
    </footer>
  )
}
