import { z } from 'zod'

export const loginBodySchema = z.object({
  email: z.string(),
  password: z.string(),
})

export type LoginBody = z.infer<typeof loginBodySchema>
