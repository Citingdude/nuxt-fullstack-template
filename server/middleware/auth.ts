import type { Session } from '~~/server/db/schema/sessions'
import type { User } from '~~/server/db/schema/users'
import { verifyRequestOrigin } from '~~/server/utils/request'

export default defineEventHandler(async (event) => {
  if (event.method !== 'GET') {
    const originHeader = getHeader(event, 'Origin') ?? null
    const hostHeader = getHeader(event, 'Host') ?? null
    if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
      return event.node.res.writeHead(403).end()
    }
  }

  const sessionId = getCookie(event, 'session') ?? null
  if (!sessionId) {
    event.context.session = null
    event.context.user = null
    return
  }

  const { session, user } = await validateSessionToken(sessionId)
  if (session === null) {
    deleteSessionTokenCookie(event)
    return
  }

  setSessionTokenCookie(event, session.id, session.expiresAt)

  event.context.session = session
  event.context.user = user
})

declare module 'h3' {
  interface H3EventContext {
    user: User | null
    session: Session | null
  }
}
