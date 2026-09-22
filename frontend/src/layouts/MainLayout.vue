<template>
  <div>
    <header class="topbar">
      <router-link to="/dashboard" class="brand">Gym Tracker</router-link>
      <nav class="nav">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          :class="{ active: isActive(link) }"
        >{{ link.label }}</router-link>
      </nav>
      <div class="topbar-right">
        <span class="user-name">{{ auth.user?.name }}</span>
        <button class="btn btn-ghost btn-sm" @click="onLogout">Odjava</button>
      </div>
    </header>
    <main class="page">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { auth, logout } from '@/auth'

const router = useRouter()
const route = useRoute()

const links = [
  { label: 'Pregled', to: '/dashboard' },
  { label: 'Vježbe', to: '/exercises' },
  { label: 'Planovi', to: '/plans' },
  { label: 'Raspored', to: '/schedule' },
  { label: 'Povijest', to: '/sessions' },
  { label: 'Napredak', to: '/progress' },
  { label: 'Ciljevi', to: '/goals' },
  { label: 'Profil', to: '/profile' },
]

function isActive(link) {
  return route.path === link.to || route.path.startsWith(link.to + '/')
}

function onLogout() {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 12px 24px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}
.brand { font-weight: 700; font-size: 1.1rem; color: var(--ink); text-decoration: none; }
.nav { display: flex; gap: 4px; flex-wrap: wrap; }
.nav-link {
  padding: 6px 10px;
  border-radius: 6px;
  color: var(--muted);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.88rem;
}
.nav-link:hover { background: var(--surface-2); text-decoration: none; }
.nav-link.active { color: var(--primary); background: var(--surface-2); }
.topbar-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
.user-name { font-weight: 600; color: var(--muted); font-size: 0.88rem; }
</style>
