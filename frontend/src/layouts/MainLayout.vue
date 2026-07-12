<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Gym Tracker
        </q-toolbar-title>

        <q-btn flat dense icon="logout" label="Odjava" @click="onLogout" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header>{{ auth.user?.name }}</q-item-label>

        <q-item
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          clickable
          exact
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>{{ link.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const leftDrawerOpen = ref(false)

const links = [
  { label: 'Pregled', icon: 'dashboard', to: '/dashboard' },
  { label: 'Vježbe', icon: 'fitness_center', to: '/exercises' },
  { label: 'Planovi treninga', icon: 'checklist', to: '/plans' },
  { label: 'Raspored', icon: 'event', to: '/schedule' },
  { label: 'Povijest treninga', icon: 'history', to: '/sessions' },
  { label: 'Napredak', icon: 'trending_up', to: '/progress' },
  { label: 'Ciljevi', icon: 'flag', to: '/goals' },
  { label: 'Profil', icon: 'person', to: '/profile' },
]

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function onLogout() {
  auth.logout()
  router.push('/login')
}
</script>
