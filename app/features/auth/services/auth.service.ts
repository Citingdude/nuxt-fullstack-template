import type { LoginBody } from '~~/shared/models/login/loginBody.model'

export class AuthService {
  static async login(body: LoginBody) {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body,
    })
  }

  static async logout() {
    await $fetch('/api/auth/logout', {
      method: 'POST',
    })

    navigateTo('/login')
  }

  static async register(body: LoginBody) {
    await $fetch('/api/users', {
      method: 'POST',
      body,
    })
  }
}
