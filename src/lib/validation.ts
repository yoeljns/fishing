import { z } from "zod";

const optionalString = z
  .string()
  .trim()
  .max(2000)
  .optional()
  .transform((v) => (v && v.length > 0 ? v : null));

const optionalNumber = z
  .string()
  .trim()
  .optional()
  .transform((v, ctx) => {
    if (!v) return null;
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must be a non-negative number",
      });
      return z.NEVER;
    }
    return n;
  });

const optionalSignedNumber = (min: number, max: number) =>
  z
    .string()
    .trim()
    .optional()
    .transform((v, ctx) => {
      if (!v) return null;
      const n = Number(v);
      if (!Number.isFinite(n) || n < min || n > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Must be between ${min} and ${max}`,
        });
        return z.NEVER;
      }
      return n;
    });

export const catchFormSchema = z.object({
  species_name: z.string().trim().min(1, "Species is required").max(120),
  length_value: optionalNumber,
  length_unit: z.enum(["cm", "in"]).default("cm"),
  weight_value: optionalNumber,
  weight_unit: z.enum(["kg", "lb"]).default("kg"),
  caught_on: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  location: optionalString,
  latitude: optionalSignedNumber(-90, 90),
  longitude: optionalSignedNumber(-180, 180),
  bait: optionalString,
  notes: optionalString,
});

export type CatchFormInput = z.infer<typeof catchFormSchema>;
