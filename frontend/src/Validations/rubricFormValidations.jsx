import { z } from "zod";

export const rubricFormValidation = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title is required")
    .trim()
    .refine((val) => val.length > 0, {
      message: "Title cannot be empty",
    }),
  scoringScale: z
    .array(
      z.object({
        description: z
          .string({ required_error: "Description is required" })
          .min(1, "Description is required")
          .trim()
          .refine((val) => val.length > 0, {
            message: "Description cannot be empty",
          }),
        score: z
          .number({ required_error: "Score is required" })
          .min(0, "Score must be at least 0"),
      })
    )
    .min(1),
  criteriaArray: z
    .array(
      z.object({
        criterion: z
          .string({ required_error: "Criterion is required" })
          .min(1, "Criterion is required")
          .trim()
          .refine((val) => val.length > 0, {
            message: "Criterion cannot be empty",
          }),
        descriptor: z.array(
          z
            .string()
            .trim()
            .refine((val) => val.length > 0, {
              message: "Descriptor cannot be empty",
            })
        ),
      })
    )
    .min(1),
  total: z.number({ required_error: "Total is required" }),
});

export const rubricDefaultValues = {
  title: "",
  scoringScale: [
    {
      description: "",
      score: 0,
    },
  ],
  criteriaArray: [
    {
      criterion: "",
      descriptor: [""],
    },
  ],
  total: 0,
};
