import { auth, logout } from './auth'

const BASE_URL = 'http://localhost:3000/api'

function buildUrl(path, params) {
  if (!params) return path
  const entries = Object.entries(params).filter(([, v]) => v !== null && v !== undefined && v !== '')
  if (entries.length === 0) return path
  return `${path}?${new URLSearchParams(entries).toString()}`
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth.token) headers.Authorization = `Bearer ${auth.token}`

  const res = await fetch(BASE_URL + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) {
    logout()
  }

  if (res.status === 204) return null

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.error || 'Zahtjev nije uspio')
  }

  return data
}

export const api = {
  get: (path, params) => request('GET', buildUrl(path, params)),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  delete: (path) => request('DELETE', path),
}
