import * as z from 'zod/v4'

export const LoginData = z.object({
  email: z.email(),
  password: z.string().refine((val) => val.length > 7 && val.length < 25, {
    error: 'Password length must be within 8-24 characters',
  }),
})

export const RegisterData = z.object({
  username: z.string().refine((val) => val.length > 3 && val.length < 17, {
    error: 'Username length must be within 4-16 characters',
  }),
  email: z.email(),
  password: z.string().refine((val) => val.length > 8 && val.length < 24, {
    error: 'Password length must be within 8-24 characters',
  }),
})

export type LoginDataType = z.infer<typeof LoginData>
export type RegisterDataType = z.infer<typeof RegisterData>
