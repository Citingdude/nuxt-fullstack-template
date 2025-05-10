export default eventHandler(async (event) => {
  const user = event.context.user

  if (!user) {
    throw createError({
      message: 'No user found',
      statusCode: 400,
    })
  }

  const sessionId = getCookie(event, 'session') ?? null

  if (!sessionId) {
    event.context.session = null
    event.context.user = null

    deleteSessionTokenCookie(event)
    await sendRedirect(event, '/login')

    return
  }

  await invalidateSession(sessionId)
  deleteSessionTokenCookie(event)
  await sendRedirect(event, '/login')
})
