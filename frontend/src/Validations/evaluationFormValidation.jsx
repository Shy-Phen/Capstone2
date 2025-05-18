import { z } from "zod";

export const evalValidationForm = z.object({
  title: z.string().trim().min(1).max(100),
  members: z
    .array(
      z.object({
        name: z.string().trim().nonempty(),
        score: z.number(),
      })
    )
    .nonempty(),
  assessmentFramework: z.string(),
  criteriaTotalScore: z.number(),
  criteriaAndScore: z
    .array(
      z.object({
        criteriaName: z.string().trim(),
        score: z.number(),
        _id: z.string(),
      })
    )
    .nonempty(),
});
