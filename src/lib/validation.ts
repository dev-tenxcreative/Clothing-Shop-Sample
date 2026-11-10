import { z } from "zod";

const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s-]{9,15}$/, "Enter a valid phone number");

export const emailSchema = z.object({ email: z.email("Enter a valid email address") });

export const contactStepSchema = z.object({
  email: z.email("Enter a valid email address"),
  phone,
  marketing: z.boolean().optional(),
});

export const addressSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  line1: z.string().trim().min(4, "Enter your street address"),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(2, "City is required"),
  district: z.string().trim().min(2, "Select your district"),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Postal code must be 5 digits"),
  phone,
  saveAddress: z.boolean().optional(),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z.email("Enter a valid email address"),
    password: z.string().min(8, "At least 8 characters").regex(/[A-Z]/, "Include an uppercase letter").regex(/[0-9]/, "Include a number"),
    confirm: z.string(),
    terms: z.boolean().refine((v) => v, "Please accept the terms"),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords don't match" });

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name"),
  email: z.email("Enter a valid email address"),
  topic: z.string().min(1, "Choose a topic"),
  order: z.string().optional(),
  message: z.string().trim().min(10, "A little more detail, please (10+ characters)"),
});

export const reviewSchema = z.object({
  name: z.string().trim().min(2, "Your name"),
  rating: z.number().min(1, "Choose a rating").max(5),
  title: z.string().trim().min(3, "Add a short title"),
  body: z.string().trim().min(15, "Tell us a little more (15+ characters)"),
});

export const trackSchema = z.object({
  order: z
    .string()
    .trim()
    .regex(/^VL-?\d{6}$/i, "Order numbers look like VL-240918"),
  email: z.email("Enter the email used at checkout"),
});

export const DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
];
