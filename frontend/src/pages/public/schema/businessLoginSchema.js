import { z } from 'zod';

export const businessLoginSchema = z.object({
    email: z.string()
        .email('Please enter a valid email address'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters'),
    acceptTerms: z.boolean()
        .refine(val => val === true, {
            message: 'You must accept the terms and conditions'
        })
});