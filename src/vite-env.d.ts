/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_RESUME_URL?: string
  readonly VITE_GITHUB_URL?: string
  readonly VITE_LEETCODE_URL?: string
  readonly VITE_LINKEDIN_URL?: string
  readonly VITE_EMAIL?: string
  readonly VITE_DRIBBBLE_URL?: string
  readonly VITE_EMAILJS_SERVICE_ID?: string
  readonly VITE_EMAILJS_TEMPLATE_ID?: string
  readonly VITE_EMAILJS_PUBLIC_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
