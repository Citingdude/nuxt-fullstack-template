import type { User } from '~~/server/db/schema/users'

type SanitizedUser = Pick<User, 'email' | 'id'>

export function useUser() {
  const user = useState<SanitizedUser | null>('user', () => null)
  return user
}

export function useAuthenticatedUser() {
  const user = useUser()
  return computed(() => {
    const userValue = unref(user)
    if (!userValue) {
      throw createError('useAuthenticatedUser() can only be used in protected pages')
    }
    return userValue
  })
}
