import { useUser } from '~/features/auth/composables/user.composable'

export default defineNuxtRouteMiddleware(async () => {
  const user = useUser()
  if (!user.value)
    return navigateTo('/login')
})
