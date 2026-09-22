<template>
  <div>
    <PageHeader eyebrow="Motivacija" title="Ciljevi" :subtitle="`${openCount} aktivnih · ${goals.length - openCount} ostvarenih`">
      <template #actions>
        <button class="btn btn-primary" @click="showCreate = true">+ Novi cilj</button>
      </template>
    </PageHeader>

    <div class="grid grid-2">
      <div v-for="goal in goals" :key="goal.id" class="card card-body" :class="{ 'goal-done': goal.achieved }">
        <div style="display:flex; align-items:flex-start; gap:10px">
          <input type="checkbox" :checked="goal.achieved" @change="toggleAchieved(goal, $event.target.checked)" style="margin-top:4px" />
          <div class="grow">
            <div class="title" :class="{ 'text-strike': goal.achieved }">{{ goal.type }}</div>
            <div class="caption">Cilj: {{ goal.targetValue }}<span v-if="goal.exercise"> · {{ goal.exercise.name }}</span></div>
            <div v-if="goal.targetDate" class="caption">Do {{ formatDate(goal.targetDate) }}</div>
          </div>
          <button class="btn btn-icon btn-ghost" title="Obriši" @click="removeGoal(goal.id)">🗑</button>
        </div>
      </div>

      <div v-if="goals.length === 0" class="card">
        <EmptyState title="Još nemaš postavljenih ciljeva" caption="Postavi mjerljiv cilj i prati ga do ostvarenja.">
          <template #action>
            <button class="btn btn-primary" @click="showCreate = true">+ Novi cilj</button>
          </template>
        </EmptyState>
      </div>
    </div>

    <Modal v-model="showCreate">
      <div class="modal-header">Novi cilj</div>
      <div class="modal-body">
        <form @submit.prevent="createGoal">
          <div class="field">
            <label>Opis cilja</label>
            <input v-model="form.type" type="text" class="input" placeholder="npr. Bench press 100 kg" required />
          </div>
          <div class="field">
            <label>Ciljna vrijednost</label>
            <input v-model.number="form.targetValue" type="number" class="input" required />
          </div>
          <div class="field">
            <label>Povezana vježba (opcionalno)</label>
            <select v-model="form.exerciseId" class="input">
              <option :value="null">Bez vježbe</option>
              <option v-for="ex in exerciseOptions" :key="ex.id" :value="ex.id">{{ ex.name }}</option>
            </select>
          </div>
          <div class="field">
            <label>Rok (opcionalno)</label>
            <input v-model="form.targetDate" type="date" class="input" />
          </div>
          <button type="submit" class="btn btn-primary btn-block">Spremi</button>
        </form>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api'
import { formatDate } from '@/utils/format'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'
import Modal from '@/components/Modal.vue'

const goals = ref([])
const exerciseOptions = ref([])
const showCreate = ref(false)
const form = ref({ type: '', targetValue: null, exerciseId: null, targetDate: '' })

const openCount = computed(() => goals.value.filter((g) => !g.achieved).length)

async function load() {
  const goalsRes = await api.get('/goals')
  goals.value = goalsRes.goals

  const exercisesRes = await api.get('/exercises')
  exerciseOptions.value = exercisesRes.exercises
}

async function createGoal() {
  await api.post('/goals', form.value)
  showCreate.value = false
  form.value = { type: '', targetValue: null, exerciseId: null, targetDate: '' }
  await load()
}

async function toggleAchieved(goal, achieved) {
  await api.put(`/goals/${goal.id}`, { achieved })
  await load()
}

async function removeGoal(id) {
  await api.delete(`/goals/${id}`)
  await load()
}

onMounted(load)
</script>

<style scoped>
.goal-done { background: rgba(23, 199, 139, 0.1); }
.text-strike { text-decoration: line-through; color: var(--muted); }
</style>
