import { reactive } from 'vue'

// Jedan dijeljeni reaktivni objekt umjesto Pinia store-a.
// Svaka komponenta koja ga importa vidi promjene automatski.
export const auth = reactive({
  token: localStorage.getItem('gym_token') || null,
  user: JSON.parse(localStorage.getItem('gym_user') || 'null'),
})

export function isAuthenticated() {
  return !!auth.token
}

export function setSession(token, user) {
  auth.token = token
  auth.user = user
  localStorage.setItem('gym_token', token)
  localStorage.setItem('gym_user', JSON.stringify(user))
}

export function logout() {
  auth.token = null
  auth.user = null
  localStorage.removeItem('gym_token')
  localStorage.removeItem('gym_user')
}
