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

export const nicknameSchema = z.string().trim().max(30, "Nickname must not exceed 30 characters").optional();
export const bioSchema = z.string().trim().max(160, "Bio must not exceed 160 characters").optional();
export const addressSchema = z.string().trim().max(100, "Address must not exceed 100 characters").optional();

export const genderSchema = z.preprocess(
  (val) => {
    if (typeof val === "string" && val.trim() === "") return undefined;
    if (typeof val === "string") return val.toLowerCase();
    return val;
  },
  z.enum(["male", "female", "other"]).optional()
);



export const phoneSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().trim().regex(/^[0-9]{10,15}$/, "Invalid phone number").optional()
);

export const dobSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional()
);

export const UpdateProfileSchema = z.object({
  name: nameSchema.optional(),
  nickname: nicknameSchema,
  bio: bioSchema,
  phone: phoneSchema,
  dob: dobSchema,
  address: addressSchema,
  gender: genderSchema,
}).partial();