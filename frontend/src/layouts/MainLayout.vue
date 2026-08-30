<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="gt-topbar">
      <div class="gt-topbar__inner">
        <router-link to="/dashboard" class="gt-brand">
          <span class="gt-brand__mark"><q-icon name="bolt" size="16px" /></span>
          <span class="gt-brand__name">Gym Tracker</span>
        </router-link>

        <nav class="gt-nav gt-nav--desktop">
          <router-link
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="gt-nav__item"
            :class="{ 'is-active': isActive(link) }"
          >
            <q-icon :name="link.icon" size="17px" />
            <span>{{ link.label }}</span>
          </router-link>
        </nav>

        <div class="gt-topbar__right">
          <q-btn flat dense round icon="menu" class="gt-nav__burger" aria-label="Izbornik" @click="drawer = true" />
          <q-btn flat round dense class="gt-avatar-btn">
            <q-avatar size="34px" text-color="white" class="text-weight-bold gt-avatar"
              style="font-size:12px; background:linear-gradient(135deg,#6D4BFF,#C765F5)">
              {{ initials }}
            </q-avatar>
            <q-menu anchor="bottom right" self="top right">
              <div class="q-pa-md" style="min-width:210px">
                <div class="text-weight-bold">{{ auth.user?.name }}</div>
                <div class="text-caption gt-muted">{{ auth.user?.email }}</div>
              </div>
              <q-separator />
              <q-list>
                <q-item clickable v-close-popup to="/profile">
                  <q-item-section avatar><q-icon name="person" /></q-item-section>
                  <q-item-section>Profil</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="onLogout">
                  <q-item-section avatar><q-icon name="logout" color="negative" /></q-item-section>
                  <q-item-section class="text-negative">Odjava</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </q-header>

    <q-drawer v-model="drawer" side="left" overlay behavior="mobile" :width="260" class="gt-mdrawer">
      <div class="q-pa-md">
        <div class="gt-user-card">
          <q-avatar size="42px" class="gt-brand-gradient" text-color="white">{{ initials }}</q-avatar>
          <div class="q-ml-sm">
            <div class="text-weight-bold ellipsis" style="max-width:150px">{{ auth.user?.name }}</div>
            <div class="text-caption gt-muted">Sportaš</div>
          </div>
        </div>
      </div>
      <q-list>
        <q-item v-for="link in links" :key="link.to" :to="link.to" clickable v-close-popup
          :active="isActive(link)" active-class="gt-mdrawer__active">
          <q-item-section avatar><q-icon :name="link.icon" /></q-item-section>
          <q-item-section>{{ link.label }}</q-item-section>
        </q-item>
        <q-separator class="q-my-sm" />
        <q-item clickable v-close-popup @click="onLogout">
          <q-item-section avatar><q-icon name="logout" color="negative" /></q-item-section>
          <q-item-section class="text-negative">Odjava</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="gt-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const drawer = ref(false)

const links = [
  { label: 'Pregled', icon: 'dashboard', to: '/dashboard' },
  { label: 'Vježbe', icon: 'fitness_center', to: '/exercises' },
  { label: 'Planovi', icon: 'assignment', to: '/plans' },
  { label: 'Raspored', icon: 'event', to: '/schedule' },
  { label: 'Povijest', icon: 'history', to: '/sessions' },
  { label: 'Napredak', icon: 'trending_up', to: '/progress' },
  { label: 'Ciljevi', icon: 'flag', to: '/goals' },
]

function isActive (link) {
  return route.path === link.to || route.path.startsWith(link.to + '/')
}

const initials = computed(() =>
  (auth.user?.name || '?').split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
)

function onLogout () {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.gt-topbar {
  background: rgba(11, 10, 17, .74);
  backdrop-filter: saturate(160%) blur(16px);
  -webkit-backdrop-filter: saturate(160%) blur(16px);
  border-bottom: 1px solid var(--gt-border);
  color: var(--gt-ink);
}
.gt-topbar::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: -1px; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(124,92,255,.55), rgba(236,72,153,.4), transparent);
}
.gt-topbar__inner {
  max-width: 1240px; margin: 0 auto; width: 100%;
  height: 62px; padding: 0 22px;
  display: flex; align-items: center; gap: 22px;
}
.gt-topbar__right { margin-left: auto; display: flex; align-items: center; gap: 6px; }

.gt-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.gt-brand:hover { text-decoration: none; }
.gt-brand__mark {
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center;
  background: var(--gt-brand-gradient); color: #fff;
  box-shadow: 0 5px 14px rgba(124, 92, 255, .45);
}
.gt-brand__name { font-weight: 800; letter-spacing: -0.022em; font-size: 1.04rem; color: var(--gt-ink); }

.gt-nav { display: flex; align-items: stretch; gap: 2px; height: 62px; }
.gt-nav__item {
  position: relative;
  display: flex; align-items: center; gap: 7px;
  padding: 0 13px;
  font-weight: 650; font-size: .875rem;
  color: var(--gt-muted); text-decoration: none;
  transition: color .12s ease;
  white-space: nowrap;
}
.gt-nav__item .q-icon { opacity: .8; }
.gt-nav__item:hover { color: var(--gt-ink); text-decoration: none; }
.gt-nav__item.is-active { color: #fff; }
.gt-nav__item.is-active .q-icon { color: var(--gt-primary); opacity: 1; }
.gt-nav__item.is-active::after {
  content: ""; position: absolute; left: 10px; right: 10px; bottom: -1px; height: 2px;
  border-radius: 2px 2px 0 0;
  background: linear-gradient(90deg, var(--gt-primary), #C765F5);
  box-shadow: 0 -2px 12px rgba(124, 92, 255, .6);
}

.gt-nav__burger { display: none; }

.gt-avatar { box-shadow: 0 0 0 2px rgba(255,255,255,.14), 0 6px 16px rgba(124,92,255,.45); }

.gt-user-card {
  display: flex; align-items: center; padding: 12px;
  border-radius: 14px; background: var(--gt-surface-2); border: 1px solid var(--gt-border);
}
.gt-mdrawer { background: var(--gt-surface) !important; border-right: 1px solid var(--gt-border) !important; }
.gt-mdrawer :deep(.q-item) { border-radius: 11px; margin: 2px 10px; font-weight: 650; }
.gt-mdrawer__active { background: rgba(124, 92, 255, .16); color: #fff; }

@media (max-width: 1080px) {
  .gt-nav--desktop { display: none; }
  .gt-nav__burger { display: inline-flex; }
}

.gt-fade-enter-active, .gt-fade-leave-active { transition: opacity .16s ease, transform .16s ease; }
.gt-fade-enter-from { opacity: 0; transform: translateY(6px); }
.gt-fade-leave-to { opacity: 0; }
</style>
