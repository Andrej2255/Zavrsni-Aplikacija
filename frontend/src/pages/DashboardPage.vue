<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Pozdrav, {{ auth.user?.name }}!</div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Nadolazeći treninzi</div>
          </q-card-section>
          <q-list separator>
            <q-item v-for="s in upcoming" :key="s.id">
              <q-item-section>
                <q-item-label>{{ s.plan?.name || 'Slobodan trening' }}</q-item-label>
                <q-item-label caption>{{ formatDate(s.scheduledDate) }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="upcoming.length === 0">
              <q-item-section class="text-grey">Nema planiranih treninga.</q-item-section>
            </q-item>
          </q-list>
          <q-card-actions>
            <q-btn flat color="primary" label="Planiraj trening" to="/schedule" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Nedavni treninzi</div>
          </q-card-section>
          <q-list separator>
            <q-item v-for="s in recent" :key="s.id" clickable :to="`/sessions/${s.id}`">
              <q-item-section>
                <q-item-label>{{ s.plan?.name || 'Slobodan trening' }}</q-item-label>
                <q-item-label caption>{{ formatDate(s.date) }} · {{ s.exercises.length }} vježbi</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="recent.length === 0">
              <q-item-section class="text-grey">Još nema odrađenih treninga.</q-item-section>
            </q-item>
          </q-list>
          <q-card-actions>
            <q-btn flat color="primary" label="Novi trening" to="/sessions" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/boot/axios'
import { useAuthStore } from '@/stores/auth'
import { date as qdate } from 'quasar'

const auth = useAuthStore()
const upcoming = ref([])
const recent = ref([])

function formatDate(d) {
  return qdate.formatDate(d, 'DD.MM.YYYY.')
}

onMounted(async () => {
  const [scheduleRes, sessionsRes] = await Promise.all([
    api.get('/schedule'),
    api.get('/sessions'),
  ])
  upcoming.value = scheduleRes.data.scheduledWorkouts
    .filter((s) => s.status === 'planned')
    .slice(0, 5)
  recent.value = sessionsRes.data.sessions.slice(0, 5)
})
</script>
