import { ApiResponse } from "@/types/api-response.type";
import { z } from "zod";

/**
 * 1. Zod schema for Creating a new delivery address
 */
export const addressSchema = z.object({
  recipientName: z.string().min(1, "Recipient name is required"),
  phone: z.string().min(1, "Phone number is required"),
  label: z.string().optional().default("Home"), // "Home" | "Work" | "Other"
  addressLine1: z.string().min(1, "Address Line 1 is required"),
  addressLine2: z.string().optional().nullable(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().default("India"),
  isDefault: z.boolean().optional().default(false),
});

/**
 * 2. Zod schema for Updating an existing address (all fields optional)
 */
export const updateAddressSchema = addressSchema.partial();

// Inferred TypeScript input types
export type Address = z.infer<typeof addressSchema>;
export type CreateAddressInput = Address;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;

/**
 * 3. Exact Saved Address Entity returned from Backend
 */
export interface UserAddress {
  id: string;
  recipientName: string;
  phone?: string | null;
  label?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Standardized API Response Types
export type AddressCreateResponse = ApiResponse<UserAddress>;
export type AddressUpdateResponse = ApiResponse<UserAddress>;
export type AddressListResponse = ApiResponse<UserAddress[]>;
export type AddressDetailResponse = ApiResponse<UserAddress>;
export type AddressDeleteResponse = ApiResponse<{ message?: string } | void>;