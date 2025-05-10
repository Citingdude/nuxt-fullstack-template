import { useUser } from '~/features/auth/composables/user.composable'

export default defineNuxtRouteMiddleware(async () => {
  const user = useUser()
  const data = await useRequestFetch()('/api/users')

  if (data) {
    user.value = data
  }
})
