import { z } from "zod";

export const searchValidation = z.object({
  query: z
    .string()
    .trim()
    .min(1, "Search query cannot be empty")
    .max(100, "Search query must be less than 100 characters"),
});
