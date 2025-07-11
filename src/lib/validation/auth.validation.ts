import {z} from 'zod';

const emailSchema = z.string().email("Invalid email format");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters long").max(50, "Password must not exceed 50 characters");
const nameSchema = z.string().min(1, "Name is required").max(50, "Name must not exceed 50 characters");

export const registerSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    name: nameSchema
});

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema
});