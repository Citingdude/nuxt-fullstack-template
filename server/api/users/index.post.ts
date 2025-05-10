import bcrypt from 'bcrypt'
import { z } from 'zod'
import { users } from '~~/server/db/schema/users'

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export default defineEventHandler(async (event) => {
  const db = useDb()

  const body = await readBody(event)

  const parse = createUserSchema.safeParse(body)
  if (!parse.success) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid input', data: parse.error.flatten() }))
  }

  const { email, password } = parse.data

  const existingUser = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.email, email),
  })

  if (existingUser) {
    return sendError(event, createError({ statusCode: 409, statusMessage: 'Email already in use' }))
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const newUser = await db
    .insert(users)
    .values({ email, passwordHash })
    .returning()

  return { user: newUser[0], message: 'User created successfully' }
})
