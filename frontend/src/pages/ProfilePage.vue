<template>
  <div class="page-narrow" style="margin:0 auto">
    <PageHeader eyebrow="Račun" title="Profil" />

    <div class="card">
      <div class="card-body" style="text-align:center">
        <div class="avatar">{{ initials }}</div>
        <h3 class="mt-sm">{{ auth.user?.name }}</h3>
        <div class="muted">{{ auth.user?.email }}</div>
      </div>

      <div class="card-list-item">
        <div class="grow">
          <div class="caption">Ime i prezime</div>
          <div class="title">{{ auth.user?.name }}</div>
        </div>
      </div>
      <div class="card-list-item">
        <div class="grow">
          <div class="caption">Email</div>
          <div class="title">{{ auth.user?.email }}</div>
        </div>
      </div>

      <div class="card-body">
        <button class="btn btn-danger" @click="onLogout">Odjava</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { auth, logout } from '@/auth'
import PageHeader from '@/components/PageHeader.vue'

const router = useRouter()

const initials = computed(() =>
  (auth.user?.name || '?')
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
)

function onLogout() {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.avatar {
  width: 72px; height: 72px; border-radius: 50%;
  background: var(--primary); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; font-weight: 700;
  margin: 0 auto;
}
</style>
