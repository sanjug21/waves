import { z } from 'zod';

export const emailSchema = z.string().min(1, "Email is required").trim().email("Invalid email format");
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters long").trim().max(50, "Password must not exceed 50 characters");
export const nameSchema = z.string().min(1, "Name is required").trim().max(50, "Name must not exceed 50 characters");

export const SignupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema
});

export const LoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});