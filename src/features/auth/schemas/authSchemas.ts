import { z } from "zod";

/**
 * ============================================================================
 * Validation Schemas & Types: Auth Module
 * ============================================================================
 *
 * USE CASE:
 * Defines strict, runtime validation rules and inferred TypeScript types for
 * all authentication flows using Zod.
 *
 * VALIDATION COVERS:
 * 1. signInSchema: Email format, minimum password length, rememberMe flag.
 * 2. signUpSchema: Name length, email, password strength (uppercase + number),
 *    password match confirmation, and required Terms agreement.
 * 3. forgotPasswordSchema: Email validation for password reset requests.
 * 4. verifyOtpSchema: 6-digit numeric verification code.
 * 5. resetPasswordSchema: New password complexity and confirmation match.
 */

// ----------------------------------------------------------------------------
// 1. Sign In Schema
// ----------------------------------------------------------------------------
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean(),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

// ----------------------------------------------------------------------------
// 2. Sign Up Schema
// ----------------------------------------------------------------------------
export const signUpSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, 'You must agree to terms & privacy policy'),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

// ----------------------------------------------------------------------------
// 3. Forgot Password Schema
// ----------------------------------------------------------------------------
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// ----------------------------------------------------------------------------
// 4. Verify OTP Schema
// ----------------------------------------------------------------------------
export const verifyOtpSchema = z.object({
  code: z
    .string()
    .min(4, "Please enter all 4 digits")
    .max(4, "Verification code must be 4 digits")
    .regex(/^\d+$/, "Code must contain only digits"),
});

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

// ----------------------------------------------------------------------------
// 5. Reset Password Schema
// ----------------------------------------------------------------------------
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
