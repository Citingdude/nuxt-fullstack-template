import type { H3Event } from 'h3'
import type { Session } from '~~/server/db/schema/sessions'

import type { User } from '~~/server/db/schema/users'
import { sha256 } from '@oslojs/crypto/sha2'
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding'
import { eq } from 'drizzle-orm'
import { sessions } from '~~/server/db/schema/sessions'
import { users } from '~~/server/db/schema/users'
import { useDb } from '~~/server/utils/db'

const MONTH_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 30
const HALF_MONTH_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 30

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20)

  crypto.getRandomValues(bytes)

  const token = encodeBase32LowerCaseNoPadding(bytes)

  return token
}

export async function createSession(token: string, userId: number): Promise<Session> {
  const db = useDb()

  const sessionId = generateSessionId(token)
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + MONTH_IN_MILLISECONDS),
  }

  await db.insert(sessions).values(session)

  return session
}

export async function validateSessionToken(sessionId: string): Promise<SessionValidationResult> {
  const db = useDb()

  const result = await db
    .select({ user: users, session: sessions })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId))

  if (!result || result.length < 1 || !result[0]) {
    return { session: null, user: null }
  }

  const { user, session } = result[0]

  // Delete session if it has expired
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessions).where(eq(sessions.id, session.id))

    return { session: null, user: null }
  }

  // Update expiry date if expiry date is less half a month away from current date.
  // Then update expiry date with a month from now.
  if (Date.now() >= session.expiresAt.getTime() - HALF_MONTH_IN_MILLISECONDS) {
    session.expiresAt = new Date(Date.now() + MONTH_IN_MILLISECONDS)

    await db
      .update(sessions)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(sessions.id, session.id))
  }

  return { session, user }
}

export async function invalidateSession(sessionId: string): Promise<void> {
  const db = useDb()

  await db.delete(sessions).where(eq(sessions.id, sessionId))
}

function generateSessionId(token: string): string {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
}

export function setSessionTokenCookie(event: H3Event, token: string, expiresAt: Date): void {
  if (import.meta.env.PROD) {
    appendHeader(
      event,
      'Set-Cookie',
      `session=${token}; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}; Path=/; Secure;`,
    )
  }
  else {
    appendHeader(
      event,
      'Set-Cookie',
      `session=${token}; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}; Path=/`,
    )
  }
}

export function deleteSessionTokenCookie(event: H3Event): void {
  if (import.meta.env.PROD) {
    appendHeader(
      event,
      'Set-Cookie',
      'session=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/; Secure;',
    )
  }
  else {
    appendHeader(
      event,
      'Set-Cookie',
      'session=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/',
    )
  }
}

export type SessionValidationResult =
  | { session: Session, user: User }
  | { session: null, user: null }
