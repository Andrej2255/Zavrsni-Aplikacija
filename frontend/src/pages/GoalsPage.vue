<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h5 col">Ciljevi</div>
      <q-btn color="primary" icon="add" label="Novi cilj" @click="showCreate = true" />
    </div>

    <q-list bordered separator>
      <q-item v-for="goal in goals" :key="goal.id">
        <q-item-section>
          <q-checkbox
            :model-value="goal.achieved"
            @update:model-value="(val) => toggleAchieved(goal, val)"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label :class="{ 'text-strike text-grey': goal.achieved }">
            {{ goal.type }} — cilj: {{ goal.targetValue }}
            <span v-if="goal.exercise">({{ goal.exercise.name }})</span>
          </q-item-label>
          <q-item-label caption v-if="goal.targetDate">Do: {{ formatDate(goal.targetDate) }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn flat round dense icon="delete" color="negative" @click="removeGoal(goal.id)" />
        </q-item-section>
      </q-item>
      <q-item v-if="goals.length === 0">
        <q-item-section class="text-grey">Još nemaš postavljenih ciljeva.</q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="showCreate">
      <q-card style="width: 400px">
        <q-card-section class="text-h6">Novi cilj</q-card-section>
        <q-card-section>
          <q-form @submit="createGoal" class="q-gutter-md">
            <q-input v-model="form.type" label="Opis cilja (npr. 'Bench press 100kg')" outlined required />
            <q-input v-model.number="form.targetValue" label="Ciljna vrijednost" type="number" outlined required />
            <q-select
              v-model="form.exerciseId"
              :options="exerciseOptions"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              label="Povezana vježba (opcionalno)"
              outlined
              clearable
            />
            <q-input v-model="form.targetDate" label="Rok (opcionalno)" type="date" outlined />
            <q-btn type="submit" color="primary" label="Spremi" class="full-width" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/boot/axios'
import { date as qdate } from 'quasar'

const goals = ref([])
const exerciseOptions = ref([])
const showCreate = ref(false)
const form = ref({ type: '', targetValue: null, exerciseId: null, targetDate: '' })

function formatDate(d) {
  return qdate.formatDate(d, 'DD.MM.YYYY.')
}

async function load() {
  const [goalsRes, exercisesRes] = await Promise.all([api.get('/goals'), api.get('/exercises')])
  goals.value = goalsRes.data.goals
  exerciseOptions.value = exercisesRes.data.exercises
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
