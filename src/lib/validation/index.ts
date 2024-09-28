import { z } from "zod"


export const signupValidarion = z.object({
   name: z.string().min(2, { message: 'too short name' }).max(50, { message: 'too long name' }),
   username: z.string().min(2, { message: 'too short' }).max(50, { message: 'too long' }),
   email: z.string().email({ message: 'invalid email' }),
   password: z.string().min(4, { message: 'too short' }).max(50, { message: 'too long password' }),
})