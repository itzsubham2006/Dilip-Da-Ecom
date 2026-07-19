import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

export const onboardingSchema = z.object({
  role: z.enum(['student', 'merchant', 'delivery'], { message: 'Please select a role' }),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, 'Invalid phone number').optional().or(z.literal('')),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;
export type OnboardingSchema = z.infer<typeof onboardingSchema>;
