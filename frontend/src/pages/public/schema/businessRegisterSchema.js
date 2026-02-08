import { z } from 'zod';

export const businessRegisterSchema = z.object({
    shopName: z.string()
        .min(1, 'Shop name is required')
        .min(2, 'Shop name must be at least 2 characters'),
    firstName: z.string()
        .min(1, 'First name is required')
        .min(2, 'First name must be at least 2 characters'),
    lastName: z.string()
        .min(1, 'Last name is required')
        .min(2, 'Last name must be at least 2 characters'),
    email: z.string()
        .email('Please enter a valid email address'),
    phoneNumber: z.string()
        .min(1, 'Phone number is required')
        .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters'),
    country: z.string()
        .min(1, 'Please select a country'),
    localLocation: z.string().optional(),
    businessFocus: z.array(z.string()).optional(),
    acceptTerms: z.boolean()
        .refine(val => val === true, {
            message: 'You must accept the terms and conditions'
        })
});