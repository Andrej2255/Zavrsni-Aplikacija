<template>
  <q-page class="q-pa-md q-pa-lg-xl">
    <div class="gt-wrap">
      <div class="gt-banner q-mb-lg" :style="{ backgroundImage: `url(${banner})` }">
        <div class="text-caption text-weight-bold" style="letter-spacing:.14em; opacity:.85">
          {{ today.toUpperCase() }}
        </div>
        <div class="text-h4 text-weight-bold q-mt-xs">Pozdrav, {{ firstName }}! 💪</div>
        <div class="q-mt-xs" style="opacity:.9">
          {{ upcoming.length ? `Imaš ${upcoming.length} planiranih treninga.` : 'Nemaš zakazanih treninga — isplaniraj sljedeći.' }}
        </div>
        <div class="row q-gutter-sm q-mt-md">
          <q-btn color="white" text-color="primary" unelevated icon="add" label="Novi trening" to="/sessions" />
          <q-btn outline color="white" icon="event" label="Planiraj" to="/schedule" />
        </div>
      </div>

      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-6 col-md-3">
          <StatCard icon="local_fire_department" :value="stats.totalSessions" label="Odrađenih treninga" tone="orange" />
        </div>
        <div class="col-6 col-md-3">
          <StatCard icon="event_available" :value="upcoming.length" label="Planiranih treninga" tone="violet" />
        </div>
        <div class="col-6 col-md-3">
          <StatCard icon="assignment" :value="stats.plans" label="Planova treninga" tone="blue" />
        </div>
        <div class="col-6 col-md-3">
          <StatCard icon="flag" :value="stats.openGoals" label="Aktivnih ciljeva" tone="emerald" />
        </div>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-card class="gt-accent full-height">
            <div class="gt-card-head">
              <q-icon name="event" size="17px" /> Nadolazeći treninzi
              <q-space />
              <q-btn flat dense round icon="arrow_forward" color="primary" to="/schedule" />
            </div>
            <q-list separator>
              <q-item v-for="s in upcoming" :key="s.id">
                <q-item-section avatar>
                  <q-avatar rounded size="38px" class="gt-brand-gradient" text-color="white" icon="fitness_center" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-medium">{{ s.plan?.name || 'Slobodan trening' }}</q-item-label>
                  <q-item-label caption>{{ formatDate(s.scheduledDate) }}</q-item-label>
                </q-item-section>
                <q-item-section side><q-badge color="primary" label="Planirano" /></q-item-section>
              </q-item>
            </q-list>
            <div v-if="upcoming.length === 0" class="q-pa-md">
              <EmptyState icon="event_busy" title="Nema planiranih treninga"
                caption="Isplaniraj svoj sljedeći trening da ga vidiš ovdje.">
                <template #action><q-btn color="primary" unelevated icon="add" label="Planiraj trening" to="/schedule" /></template>
              </EmptyState>
            </div>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card class="gt-accent gt-accent--emerald full-height">
            <div class="gt-card-head" style="background: linear-gradient(180deg, rgba(16,194,133,.12), rgba(16,194,133,.03))">
              <q-icon name="history" size="17px" style="background: linear-gradient(135deg,#10C285,#38DEA9)" /> Nedavni treninzi
              <q-space />
              <q-btn flat dense round icon="arrow_forward" color="positive" to="/sessions" />
            </div>
            <q-list separator>
              <q-item v-for="s in recent" :key="s.id" clickable :to="`/sessions/${s.id}`">
                <q-item-section avatar>
                  <q-avatar rounded size="38px" style="background: linear-gradient(135deg,#10C285,#38DEA9)" text-color="white" icon="check" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-medium">{{ s.plan?.name || 'Slobodan trening' }}</q-item-label>
                  <q-item-label caption>{{ formatDate(s.date) }} · {{ s.exercises.length }} {{ vjezbe(s.exercises.length) }}</q-item-label>
                </q-item-section>
                <q-item-section side><q-icon name="chevron_right" color="grey-6" /></q-item-section>
              </q-item>
            </q-list>
            <div v-if="recent.length === 0" class="q-pa-md">
              <EmptyState icon="fitness_center" title="Još nema odrađenih treninga"
                caption="Započni prvi trening i pojavit će se ovdje.">
                <template #action><q-btn color="positive" unelevated icon="add" label="Novi trening" to="/sessions" /></template>
              </EmptyState>
            </div>
          </q-card>
        </div>

        <div class="col-12">
          <q-card class="gt-accent gt-accent--blue">
            <div class="gt-card-head" style="background: linear-gradient(180deg, rgba(59,130,246,.12), rgba(59,130,246,.03))">
              <q-icon name="donut_small" size="17px" style="background: linear-gradient(135deg,#3B82F6,#6AA8FF)" /> Volumen po mišićnoj skupini
              <q-space />
              <q-btn flat dense no-caps color="info" label="Detaljno" icon-right="arrow_forward" to="/progress" />
            </div>
            <q-card-section>
              <div v-if="volume.length" class="gt-vol">
                <div v-for="v in volume" :key="v.muscleGroup" class="gt-vol__row">
                  <div class="gt-vol__label">
                    <q-icon :name="muscleGroupMeta(v.muscleGroup).icon" size="15px"
                      :style="{ color: muscleGroupMeta(v.muscleGroup).color }" />
                    {{ v.muscleGroup }}
                  </div>
                  <div class="gt-vol__track">
                    <div class="gt-vol__bar"
                      :style="{ width: pct(v.volume) + '%', background: muscleGroupGradient(v.muscleGroup) }" />
                  </div>
                  <div class="gt-vol__val">{{ Math.round(v.volume).toLocaleString('hr-HR') }}</div>
                </div>
              </div>
              <EmptyState v-else icon="bar_chart" title="Nema podataka o volumenu"
                caption="Odradi nekoliko treninga da vidiš raspodjelu opterećenja." />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '@/boot/axios'
import { useAuthStore } from '@/stores/auth'
import { date as qdate } from 'quasar'
import StatCard from '@/components/StatCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { muscleGroupMeta, muscleGroupGradient } from '@/utils/muscleGroups'
import banner from '@/assets/img/dashboard-banner.jpg'

const auth = useAuthStore()
const upcoming = ref([])
const recent = ref([])
const volume = ref([])
const stats = ref({ totalSessions: 0, plans: 0, openGoals: 0 })

const today = qdate.formatDate(Date.now(), 'dddd, D. MMMM')
const firstName = computed(() => (auth.user?.name || '').split(' ')[0] || 'sportašu')
const maxVol = computed(() => Math.max(1, ...volume.value.map((v) => v.volume)))

function formatDate (d) { return qdate.formatDate(d, 'DD.MM.YYYY.') }
function pct (v) { return Math.max(4, Math.round((v / maxVol.value) * 100)) }
function vjezbe (n) { return (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? 'vježbe' : 'vježbi' }

onMounted(async () => {
  const [scheduleRes, sessionsRes, plansRes, goalsRes, volRes] = await Promise.all([
    api.get('/schedule'),
    api.get('/sessions'),
    api.get('/plans'),
    api.get('/goals'),
    api.get('/stats/muscle-groups'),
  ])
  upcoming.value = scheduleRes.data.scheduledWorkouts.filter((s) => s.status === 'planned').slice(0, 5)
  recent.value = sessionsRes.data.sessions.slice(0, 5)
  volume.value = (volRes.data.muscleGroups || []).slice().sort((a, b) => b.volume - a.volume)
  stats.value = {
    totalSessions: sessionsRes.data.sessions.length,
    plans: plansRes.data.plans.length,
    openGoals: goalsRes.data.goals.filter((g) => !g.achieved).length,
  }
})
</script>

<style scoped>
.gt-vol { display: flex; flex-direction: column; gap: 14px; }
.gt-vol__row { display: grid; grid-template-columns: 130px 1fr 70px; align-items: center; gap: 14px; }
.gt-vol__label { display: flex; align-items: center; gap: 7px; font-weight: 650; font-size: .88rem; color: var(--gt-ink-2); }
.gt-vol__track { height: 12px; border-radius: 999px; background: var(--gt-surface-3); overflow: hidden; }
.gt-vol__bar { height: 100%; border-radius: 999px; transition: width .5s ease; }
.gt-vol__val { text-align: right; font-weight: 700; font-size: .85rem; color: var(--gt-muted); font-variant-numeric: tabular-nums; }
@media (max-width: 600px) {
  .gt-vol__row { grid-template-columns: 96px 1fr 56px; gap: 10px; }
}
</style>
