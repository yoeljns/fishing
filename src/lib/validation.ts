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
  visibility: z.enum(["private", "friends", "public"]).default("friends"),
  bait: optionalString,
  notes: optionalString,
});

export type CatchFormInput = z.infer<typeof catchFormSchema>;

export const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Letters, numbers, and underscores only",
    ),
  display_name: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(200),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1).max(40),
  password: z.string().min(1).max(200),
});
