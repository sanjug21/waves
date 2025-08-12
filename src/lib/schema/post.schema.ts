import { z } from 'zod';

export const PostSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  description: z.string().trim().optional().or(z.literal('')),
  imageUrl: z.string().url("Invalid image URL").trim().optional().or(z.literal('')),
  publicId: z.string().trim().optional().or(z.literal('')),
  likes: z.array(z.string()).optional(),
  comments: z.array(z.string()).optional(),
}).refine(data => {
  return (data.description && data.description.trim() !== '') || (data.imageUrl && data.imageUrl.trim() !== '');
}, {
  message: "Either description or imageUrl must be provided.",
  path: ["description", "imageUrl"],
});