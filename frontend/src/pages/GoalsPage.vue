<template>
  <q-page class="q-pa-md q-pa-lg-xl">
    <div class="gt-wrap" style="max-width: 820px">
      <PageHeader eyebrow="Motivacija" title="Ciljevi"
        :subtitle="`${openCount} aktivnih · ${goals.length - openCount} ostvarenih`">
        <template #actions>
          <q-btn color="primary" unelevated icon="add" label="Novi cilj" @click="showCreate = true" />
        </template>
      </PageHeader>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6" v-for="(goal, i) in goals" :key="goal.id">
          <q-card class="gt-card-hover gt-goal" :class="{ 'gt-goal-done': goal.achieved }"
            :style="{ '--goal-c': goal.achieved ? '#12B981' : GOAL_COLORS[i % GOAL_COLORS.length] }">
            <q-card-section class="row items-start no-wrap">
              <q-checkbox :model-value="goal.achieved" color="positive" class="q-mt-none"
                @update:model-value="(val) => toggleAchieved(goal, val)" />
              <div class="col q-ml-sm">
                <div class="text-subtitle1 text-weight-bold" :class="{ 'text-strike gt-muted': goal.achieved }">
                  {{ goal.type }}
                </div>
                <div class="text-caption gt-muted q-mt-xs">
                  <q-icon name="flag" size="14px" /> Cilj: {{ goal.targetValue }}
                  <span v-if="goal.exercise"> · {{ goal.exercise.name }}</span>
                </div>
                <div v-if="goal.targetDate" class="text-caption gt-muted">
                  <q-icon name="schedule" size="14px" /> Do {{ formatDate(goal.targetDate) }}
                </div>
              </div>
              <q-btn flat round dense icon="delete" color="grey-6" @click="removeGoal(goal.id)" />
            </q-card-section>
          </q-card>
        </div>

        <div v-if="goals.length === 0" class="col-12">
          <q-card flat class="gt-flat">
            <EmptyState icon="flag" title="Još nemaš postavljenih ciljeva"
              caption="Postavi mjerljiv cilj i prati ga do ostvarenja.">
              <template #action><q-btn color="primary" unelevated icon="add" label="Novi cilj" @click="showCreate = true" /></template>
            </EmptyState>
          </q-card>
        </div>
      </div>

      <q-dialog v-model="showCreate">
        <q-card style="width: 440px; max-width: 92vw">
          <q-card-section class="text-h6">Novi cilj</q-card-section>
          <q-separator />
          <q-card-section>
            <q-form @submit="createGoal" class="q-gutter-md">
              <q-input v-model="form.type" label="Opis cilja" placeholder="npr. Bench press 100 kg" outlined required />
              <q-input v-model.number="form.targetValue" label="Ciljna vrijednost" type="number" outlined required />
              <q-select v-model="form.exerciseId" :options="exerciseOptions" option-value="id" option-label="name"
                emit-value map-options label="Povezana vježba (opcionalno)" outlined clearable />
              <q-input v-model="form.targetDate" label="Rok (opcionalno)" type="date" outlined stack-label />
              <q-btn type="submit" color="primary" unelevated label="Spremi" class="full-width" />
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '@/boot/axios'
import { date as qdate } from 'quasar'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'

const GOAL_COLORS = ['#5E3BEE', '#3B82F6', '#FF6B35', '#EC4899', '#F59E0B', '#12B981']
const goals = ref([])
const exerciseOptions = ref([])
const showCreate = ref(false)
const form = ref({ type: '', targetValue: null, exerciseId: null, targetDate: '' })

const openCount = computed(() => goals.value.filter((g) => !g.achieved).length)

function formatDate (d) {
  return qdate.formatDate(d, 'DD.MM.YYYY.')
}

async function load () {
  const [goalsRes, exercisesRes] = await Promise.all([api.get('/goals'), api.get('/exercises')])
  goals.value = goalsRes.data.goals
  exerciseOptions.value = exercisesRes.data.exercises
}

async function createGoal () {
  await api.post('/goals', form.value)
  showCreate.value = false
  form.value = { type: '', targetValue: null, exerciseId: null, targetDate: '' }
  await load()
}

async function toggleAchieved (goal, achieved) {
  await api.put(`/goals/${goal.id}`, { achieved })
  await load()
}

async function removeGoal (id) {
  await api.delete(`/goals/${id}`)
  await load()
}

onMounted(load)
</script>

<style scoped>
.gt-goal { border-left: 5px solid var(--goal-c); }
.gt-goal :deep(.text-caption .q-icon) { color: var(--goal-c); }
.gt-goal-done { background: rgba(18, 185, 129, .07); border-color: rgba(18, 185, 129, .3); }
</style>
