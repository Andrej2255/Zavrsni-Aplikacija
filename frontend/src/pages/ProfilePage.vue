<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Profil</div>

    <q-card style="max-width: 400px">
      <q-card-section>
        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">{{ initials }}</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ auth.user?.name }}</q-item-label>
            <q-item-label caption>{{ auth.user?.email }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-card-actions>
        <q-btn flat color="negative" icon="logout" label="Odjava" @click="onLogout" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const initials = computed(() =>
  (auth.user?.name || '')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
)

function onLogout() {
  auth.logout()
  router.push('/login')
}
</script>
