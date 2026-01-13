import { z} from 'zod';

export const registerSchema = z.object({
    name: z.string()
           .min(1,'Name must be atleat 1 character'),
    location: z.string()
               .min(1,'Location not found'),
    email : z.string()
              .email('@gmail.com missing my good sir,correct the format'),
    password: z.string()
                .min(6,"My sir, Password should reach upto 6 characters")
});