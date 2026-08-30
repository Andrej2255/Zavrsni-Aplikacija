<template>
  <q-page class="q-pa-md q-pa-lg-xl">
    <div class="gt-wrap" style="max-width: 620px">
      <PageHeader eyebrow="Račun" title="Profil" />

      <q-card class="gt-accent">
        <div class="gt-profile-cover" :style="{ backgroundImage: `url(${cover})` }" />
        <q-card-section class="gt-profile-body">
          <q-avatar size="84px" color="primary" text-color="white" class="gt-profile-avatar text-h5 text-weight-bold">
            {{ initials }}
          </q-avatar>
          <div class="text-h6 text-weight-bold q-mt-sm">{{ auth.user?.name }}</div>
          <div class="gt-muted">{{ auth.user?.email }}</div>
        </q-card-section>

        <q-separator />
        <q-list>
          <q-item>
            <q-item-section avatar><q-icon name="badge" color="primary" /></q-item-section>
            <q-item-section>
              <q-item-label caption>Ime i prezime</q-item-label>
              <q-item-label>{{ auth.user?.name }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar><q-icon name="mail" color="primary" /></q-item-section>
            <q-item-section>
              <q-item-label caption>Email</q-item-label>
              <q-item-label>{{ auth.user?.email }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-separator />
        <q-card-actions class="q-pa-md">
          <q-btn unelevated color="negative" icon="logout" label="Odjava" @click="onLogout" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import PageHeader from '@/components/PageHeader.vue'
import cover from '@/assets/img/dashboard-banner.jpg'

const router = useRouter()
const auth = useAuthStore()

const initials = computed(() =>
  (auth.user?.name || '?')
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
)

function onLogout () {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.gt-profile-cover {
  height: 130px;
  background-size: cover;
  background-position: center;
  position: relative;
}
.gt-profile-cover::after {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(120deg, rgba(94,59,238,.85), rgba(192,38,211,.6) 60%, rgba(18,185,129,.4));
}
.gt-profile-body {
  text-align: center;
  padding-top: 0;
}
.gt-profile-avatar {
  margin-top: -46px;
  border: 4px solid var(--gt-surface);
  box-shadow: var(--gt-shadow);
}
</style>
