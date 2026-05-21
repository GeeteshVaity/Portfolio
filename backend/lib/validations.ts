import { z } from 'zod'

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
})

// Project validation schemas
export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required'),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
  link: z.string().url('Invalid project URL').optional().or(z.literal('')),
  githubLink: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
})

export const projectUpdateSchema = projectSchema.partial()

// Skills validation schemas
export const skillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).default('intermediate'),
  years: z.number().int().min(0).default(1),
  order: z.number().int().default(0),
})

export const skillUpdateSchema = skillSchema.partial()

// Type exports
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProjectInput = z.infer<typeof projectSchema>
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>
export type SkillInput = z.infer<typeof skillSchema>
export type SkillUpdateInput = z.infer<typeof skillUpdateSchema>
