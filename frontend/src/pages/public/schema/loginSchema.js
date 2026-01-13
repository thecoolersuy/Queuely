import {z} from 'zod';

export const loginSchema = z.object({
    email : z.string().email("Email not in right format, my good sir"),
    password :z.string().min(6,"Password should reach upto 6 characters long")
});