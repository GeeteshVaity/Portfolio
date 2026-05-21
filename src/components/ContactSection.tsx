import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import { useToast } from '../hooks/useToast'

// EmailJS Configuration from environment variables
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''

// Initialize EmailJS once when module loads
if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY)
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

// Form validation regex for email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface FormData {
  from_name: string
  from_email: string
  message: string
}

interface FormErrors {
  from_name?: string
  from_email?: string
  message?: string
}

export function ContactSection() {
  const { addToast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  // Form state management
  const [formData, setFormData] = useState<FormData>({
    from_name: '',
    from_email: '',
    message: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submissionMessage, setSubmissionMessage] = useState('')

  /**
   * Validates all form fields
   * Returns true if all fields are valid, false otherwise
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validate name field
    if (!formData.from_name.trim()) {
      newErrors.from_name = 'Name is required'
    } else if (formData.from_name.trim().length < 2) {
      newErrors.from_name = 'Name must be at least 2 characters'
    }

    // Validate email field
    if (!formData.from_email.trim()) {
      newErrors.from_email = 'Email is required'
    } else if (!EMAIL_REGEX.test(formData.from_email)) {
      newErrors.from_email = 'Please enter a valid email address'
    }

    // Validate message field
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handles form input changes
   * Updates form state and clears field errors when user corrects them
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  /**
   * Resets form to initial state
   */
  const resetForm = () => {
    setFormData({
      from_name: '',
      from_email: '',
      message: '',
    })
    setErrors({})
  }

  /**
   * Handles form submission and sends email via EmailJS
   * Uses async/await for clean code structure
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Prevent multiple submissions
    if (isLoading) return

    // Validate form before submission
    if (!validateForm()) {
      setSubmissionStatus('error')
      setSubmissionMessage('Please fix the errors above')
      setTimeout(() => setSubmissionStatus('idle'), 3000)
      return
    }

    setIsLoading(true)
    setSubmissionStatus('idle')

    try {
      // Send email through EmailJS
      // Template parameters must match your EmailJS template
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: formData.from_name.trim(),
        from_email: formData.from_email.trim(),
        message: formData.message.trim(),
        // Additional field useful for email tracking
        to_email: 'geeteshvaity22@gmail.com',
      })

      // Success handling
      setSubmissionStatus('success')
      setSubmissionMessage('✓ Message sent successfully! I\'ll get back to you soon.')
      addToast('Message sent successfully!', 'success', 4000)
      resetForm()

      // Auto-clear success message after 5 seconds
      setTimeout(() => setSubmissionStatus('idle'), 5000)

      // Focus back to form for accessibility
      formRef.current?.focus()
    } catch (error) {
      // Error handling
      console.error('EmailJS Error:', error)

      setSubmissionStatus('error')
      setSubmissionMessage('✗ Failed to send message. Please try again.')
      addToast('Error sending message', 'error', 4000)

      // Auto-clear error message after 5 seconds
      setTimeout(() => setSubmissionStatus('idle'), 5000)
    } finally {
      // Always reset loading state
      setIsLoading(false)
    }
  }

  return (
    <section id="contact" className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-xl py-lg md:py-xl">
      <motion.div
        className="text-center mb-lg"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="font-h2 text-h2 text-on-surface mb-2">
          Let's Get <span className="yellow-highlight">In Touch</span>
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Have a project idea, collaboration opportunity, or just want to connect? Feel free to reach out.
        </p>
      </motion.div>

      <motion.div
        className="max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6 bg-surface-container-highest border-2 border-stone-900 rounded-xl p-8 shadow-sketch"
          noValidate
        >
          {/* Name Field */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="from_name"
              className="block font-label-hand text-label-hand text-on-surface mb-2"
            >
              Your Name {formData.from_name === '' && <span className="text-red-500">*</span>}
            </label>
            <input
              id="from_name"
              type="text"
              name="from_name"
              value={formData.from_name}
              onChange={handleChange}
              placeholder="Peter Parker"
              disabled={isLoading}
              className={`w-full px-4 py-3 border-2 rounded-lg bg-background focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.from_name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-stone-900 focus:ring-primary'
              } ${isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-text hover:border-stone-700'}`}
              aria-invalid={!!errors.from_name}
              aria-describedby={errors.from_name ? 'from_name-error' : undefined}
            />
            {errors.from_name && (
              <motion.p
                id="from_name-error"
                className="text-red-500 font-body-sm text-body-sm mt-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.from_name}
              </motion.p>
            )}
          </motion.div>

          {/* Email Field */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="from_email"
              className="block font-label-hand text-label-hand text-on-surface mb-2"
            >
              Email Address {formData.from_email === '' && <span className="text-red-500">*</span>}
            </label>
            <input
              id="from_email"
              type="email"
              name="from_email"
              value={formData.from_email}
              onChange={handleChange}
              placeholder="spidey@example.com"
              disabled={isLoading}
              className={`w-full px-4 py-3 border-2 rounded-lg bg-background focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.from_email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-stone-900 focus:ring-primary'
              } ${isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-text hover:border-stone-700'}`}
              aria-invalid={!!errors.from_email}
              aria-describedby={errors.from_email ? 'from_email-error' : undefined}
            />
            {errors.from_email && (
              <motion.p
                id="from_email-error"
                className="text-red-500 font-body-sm text-body-sm mt-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.from_email}
              </motion.p>
            )}
          </motion.div>

          {/* Message Field */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="message"
              className="block font-label-hand text-label-hand text-on-surface mb-2"
            >
              Message {formData.message === '' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message here..."
              rows={5}
              disabled={isLoading}
              className={`w-full px-4 py-3 border-2 rounded-lg bg-background focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
                errors.message
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-stone-900 focus:ring-primary'
              } ${isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-text hover:border-stone-700'}`}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && (
              <motion.p
                id="message-error"
                className="text-red-500 font-body-sm text-body-sm mt-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.message}
              </motion.p>
            )}
          </motion.div>

          {/* Submit Button with Loading State */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className={`w-full font-h3 py-4 rounded-[16px] border-2 border-stone-900 shadow-sketch transition-all duration-200 ${
              isLoading
                ? 'bg-primary text-on-primary cursor-not-allowed opacity-90 hover:shadow-sketch'
                : 'bg-primary text-on-primary hover:bg-primary/90 active:scale-95'
            }`}
            whileHover={!isLoading ? { y: -4, boxShadow: '0px 0px 20px rgba(79, 55, 138, 0.4)' } : {}}
            whileTap={!isLoading ? { y: 0, scale: 0.95 } : {}}
            variants={itemVariants}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-block w-2 h-2 rounded-full bg-on-primary"
                />
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  className="inline-block w-2 h-2 rounded-full bg-on-primary"
                />
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  className="inline-block w-2 h-2 rounded-full bg-on-primary"
                />
                <span className="font-h3">Sending...</span>
              </span>
            ) : (
              'Send Message'
            )}
          </motion.button>

          {/* Success/Error Message Display */}
          {submissionStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`sketch-border rounded-[16px] p-4 font-label-hand text-label-hand text-center transition-all duration-200 ${
                submissionStatus === 'success'
                  ? 'bg-primary-fixed text-on-primary-fixed border-2 border-[#2c2c2c]'
                  : 'bg-error-container text-on-error-container border-2 border-[#2c2c2c]'
              }`}
              role="alert"
            >
              {submissionMessage}
            </motion.div>
          )}

          {/* Optional: Form hint text */}
          <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
            All fields are required
          </p>
        </form>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-md mt-xl text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {[
          { icon: 'mail', label: 'Email', value: 'geeteshvaity22@gmail.com' },
          { icon: 'phone', label: 'Phone', value: '+91 9987957904' },
          { icon: 'location_on', label: 'Location', value: 'Mumbai, India' },
        ].map(contact => (
          <motion.div
            key={contact.label}
            className="bg-surface-container-highest border-2 border-stone-900 rounded-xl p-6 shadow-sketch"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <span className="material-symbols-outlined text-orange-600 text-4xl block mb-2">
              {contact.icon}
            </span>
            <p className="font-label-hand text-on-surface-variant mb-1">{contact.label}</p>
            <p className="font-h3 text-on-surface">{contact.value}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
