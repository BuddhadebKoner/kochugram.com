import { z } from "zod"


export const signupValidarion = z.object({
   name: z.string().min(2).max(50),
   username: z.string().min(2).max(50,),
   email: z.string().email(),
   password: z.string().min(4).max(50),
})

export const signinValidarion = z.object({
   email: z.string().email(),
   password: z.string().min(4).max(50),
})

export const postValidation = z.object({
   caption: z.string().min(5).max(2200),
   file: z.custom<File>(),
   location: z.string().min(2).max(100),
   tags: z.string()
})