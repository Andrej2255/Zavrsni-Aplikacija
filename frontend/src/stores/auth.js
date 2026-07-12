import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('gym_token') || null,
    user: JSON.parse(localStorage.getItem('gym_user') || 'null'),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setSession(token, user) {
      this.token = token
      this.user = user
      localStorage.setItem('gym_token', token)
      localStorage.setItem('gym_user', JSON.stringify(user))
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('gym_token')
      localStorage.removeItem('gym_user')
    },
  },
})
