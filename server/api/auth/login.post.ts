import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { users } from '~~/server/db/schema/users'
import { useDb } from '~~/server/utils/db'
import { loginBodySchema } from '~~/shared/models/login/loginBody.model'

export default eventHandler(async (event) => {
  const db = useDb()

  const body = await readValidatedBody(event, loginBodySchema.safeParse)

  if (body.error) {
    throw createError({
      message: body.error.message,
      statusCode: 400,
    })
  }

  const { email, password } = body.data

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  // Secure password verification
  if (!user || !user.passwordHash) {
    // Perform dummy hash compare to mitigate timing attacks
    await bcrypt.compare(password, '$2b$10$invalidsaltstringforconsistency1234567890123456789012')
    throw createError({
      message: 'Incorrect email or password',
      statusCode: 400,
    })
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash)

  if (!validPassword) {
    throw createError({
      message: 'Incorrect email or password',
      statusCode: 400,
    })
  }

  const token = generateSessionToken()
  const session = await createSession(token, user.id)

  setSessionTokenCookie(event, session.id, session.expiresAt)
})
