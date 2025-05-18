import { z } from "zod";

export const promptValidator = z.object({
  userPrompt: z
    .string()
    .trim()
    .min(1, "Input a valid word related to rubric creation"),
});
