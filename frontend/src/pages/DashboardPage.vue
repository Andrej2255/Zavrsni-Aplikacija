<template>
  <div>
    <div class="banner" :style="{ backgroundImage: `linear-gradient(90deg, rgba(20,10,40,.78), rgba(20,10,40,.4)), url(${banner})` }">
      <div class="eyebrow-light">{{ today.toUpperCase() }}</div>
      <h2>Pozdrav, {{ firstName }}! 💪</h2>
      <p>{{ upcoming.length ? `Imaš ${upcoming.length} planiranih treninga.` : 'Nemaš zakazanih treninga — isplaniraj sljedeći.' }}</p>
      <div class="actions">
        <router-link to="/sessions" class="btn btn-primary">+ Novi trening</router-link>
        <router-link to="/schedule" class="btn btn-ghost">Planiraj</router-link>
      </div>
    </div>

    <div class="grid grid-4 mt-md">
      <StatCard :value="stats.totalSessions" label="Odrađenih treninga" tone="orange" />
      <StatCard :value="upcoming.length" label="Planiranih treninga" tone="violet" />
      <StatCard :value="stats.plans" label="Planova treninga" tone="blue" />
      <StatCard :value="stats.openGoals" label="Aktivnih ciljeva" tone="emerald" />
    </div>

    <div class="grid grid-2 mt-md">
      <div class="card">
        <div class="card-body" style="border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center">
          <strong>Nadolazeći treninzi</strong>
          <router-link to="/schedule" class="muted">Svi →</router-link>
        </div>
        <div v-for="s in upcoming" :key="s.id" class="card-list-item">
          <div class="grow">
            <div class="title">{{ s.plan?.name || 'Slobodan trening' }}</div>
            <div class="caption">{{ formatDate(s.scheduledDate) }}</div>
          </div>
          <span class="badge badge-primary">Planirano</span>
        </div>
        <EmptyState v-if="upcoming.length === 0" title="Nema planiranih treninga" caption="Isplaniraj svoj sljedeći trening.">
          <template #action><router-link to="/schedule" class="btn btn-primary">+ Planiraj trening</router-link></template>
        </EmptyState>
      </div>

      <div class="card">
        <div class="card-body" style="border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center">
          <strong>Nedavni treninzi</strong>
          <router-link to="/sessions" class="muted">Svi →</router-link>
        </div>
        <router-link v-for="s in recent" :key="s.id" :to="`/sessions/${s.id}`" class="card-list-item">
          <div class="grow">
            <div class="title">{{ s.plan?.name || 'Slobodan trening' }}</div>
            <div class="caption">{{ formatDate(s.date) }} · {{ s.exercises.length }} {{ vjezbe(s.exercises.length) }}</div>
          </div>
          <div>›</div>
        </router-link>
        <EmptyState v-if="recent.length === 0" title="Još nema odrađenih treninga" caption="Započni prvi trening.">
          <template #action><router-link to="/sessions" class="btn btn-primary">+ Novi trening</router-link></template>
        </EmptyState>
      </div>

      <div class="card" style="grid-column: 1 / -1">
        <div class="card-body" style="border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center">
          <strong>Volumen po mišićnoj skupini</strong>
          <router-link to="/progress" class="muted">Detaljno →</router-link>
        </div>
        <div class="card-body">
          <BarList v-if="volume.length" :items="volumeItems" />
          <EmptyState v-else title="Nema podataka o volumenu" caption="Odradi nekoliko treninga da vidiš raspodjelu opterećenja." />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api'
import { auth } from '@/auth'
import { formatDate } from '@/utils/format'
import StatCard from '@/components/StatCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import BarList from '@/components/BarList.vue'
import banner from '@/assets/img/dashboard-banner.jpg'

const upcoming = ref([])
const recent = ref([])
const volume = ref([])
const stats = ref({ totalSessions: 0, plans: 0, openGoals: 0 })

const today = new Date().toLocaleDateString('hr-HR', { weekday: 'long', day: 'numeric', month: 'long' })
const firstName = computed(() => (auth.user?.name || '').split(' ')[0] || 'sportašu')
const volumeItems = computed(() => volume.value.map((v) => ({ label: v.muscleGroup, value: v.volume })))

function vjezbe(n) {
  return (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? 'vježbe' : 'vježbi'
}

onMounted(async () => {
  const scheduleRes = await api.get('/schedule')
  const sessionsRes = await api.get('/sessions')
  const plansRes = await api.get('/plans')
  const goalsRes = await api.get('/goals')
  const volRes = await api.get('/stats/muscle-groups')

  upcoming.value = scheduleRes.scheduledWorkouts.filter((s) => s.status === 'planned').slice(0, 5)
  recent.value = sessionsRes.sessions.slice(0, 5)
  volume.value = (volRes.muscleGroups || []).slice().sort((a, b) => b.volume - a.volume)
  stats.value = {
    totalSessions: sessionsRes.sessions.length,
    plans: plansRes.plans.length,
    openGoals: goalsRes.goals.filter((g) => !g.achieved).length,
  }
})
</script>
