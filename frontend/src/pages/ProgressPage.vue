<template>
  <div>
    <PageHeader eyebrow="Analitika" title="Napredak" subtitle="Prati kilažu, volumen i tjelesnu težinu kroz vrijeme" />

    <div class="grid grid-2">
      <div class="card card-body">
        <strong>Napredak po vježbi</strong>
        <select v-model="selectedExerciseId" class="input mt-sm" @change="loadExerciseProgress">
          <option :value="null" disabled>Odaberi vježbu</option>
          <option v-for="ex in exerciseOptions" :key="ex.id" :value="ex.id">{{ ex.name }}</option>
        </select>

        <table v-if="exercisePoints.length" class="mt-md">
          <thead>
            <tr><th>Datum</th><th>Max kilaža (kg)</th><th>Volumen</th></tr>
          </thead>
          <tbody>
            <tr v-for="p in exercisePoints" :key="p.date">
              <td>{{ formatDate(p.date, { short: true }) }}</td>
              <td>{{ p.maxWeight }}</td>
              <td>{{ Math.round(p.totalVolume) }}</td>
            </tr>
          </tbody>
        </table>
        <EmptyState v-else title="Odaberi vježbu" caption="Tablica kilaže i volumena kroz vrijeme." />
      </div>

      <div class="card card-body">
        <strong>Volumen po mišićnoj skupini</strong>
        <div class="mt-md">
          <BarList v-if="hasMuscleData" :items="muscleGroupItems" />
          <EmptyState v-else title="Još nema podataka" caption="Odradi treninge da vidiš raspodjelu volumena." />
        </div>
      </div>

      <div class="card card-body" style="grid-column: 1 / -1">
        <div style="display:flex; justify-content:space-between; align-items:center">
          <strong>Tjelesna težina kroz vrijeme</strong>
          <button class="btn btn-primary btn-sm" @click="showAddMeasurement = true">+ Dodaj mjerenje</button>
        </div>

        <table v-if="bodyweightPoints.length" class="mt-md">
          <thead>
            <tr><th>Datum</th><th>Težina (kg)</th></tr>
          </thead>
          <tbody>
            <tr v-for="p in bodyweightPoints" :key="p.date">
              <td>{{ formatDate(p.date, { short: true }) }}</td>
              <td>{{ p.weight ?? '–' }}</td>
            </tr>
          </tbody>
        </table>
        <EmptyState v-else title="Nema unesenih mjerenja" caption="Dodaj prvo mjerenje težine da počneš pratiti trend.">
          <template #action>
            <button class="btn btn-primary" @click="showAddMeasurement = true">+ Dodaj mjerenje</button>
          </template>
        </EmptyState>
      </div>
    </div>

    <Modal v-model="showAddMeasurement">
      <div class="modal-header">Novo mjerenje</div>
      <div class="modal-body">
        <form @submit.prevent="addMeasurement">
          <div class="field">
            <label>Datum</label>
            <input v-model="measurementForm.date" type="date" class="input" required />
          </div>
          <div class="field">
            <label>Težina (kg)</label>
            <input v-model.number="measurementForm.weight" type="number" class="input" />
          </div>
          <div class="field">
            <label>% masti (opcionalno)</label>
            <input v-model.number="measurementForm.bodyFatPercent" type="number" class="input" />
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
import { formatDate, todayIso } from '@/utils/format'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'
import BarList from '@/components/BarList.vue'
import Modal from '@/components/Modal.vue'

const exerciseOptions = ref([])
const selectedExerciseId = ref(null)
const exercisePoints = ref([])
const muscleGroups = ref([])
const bodyweightPoints = ref([])

const hasMuscleData = computed(() => muscleGroups.value.length > 0)
const muscleGroupItems = computed(() => muscleGroups.value.map((m) => ({ label: m.muscleGroup, value: m.volume })))

const showAddMeasurement = ref(false)
const measurementForm = ref({ date: todayIso(), weight: null, bodyFatPercent: null })

async function loadExerciseProgress() {
  if (!selectedExerciseId.value) return
  const data = await api.get(`/stats/exercise/${selectedExerciseId.value}`)
  exercisePoints.value = data.points
}

async function loadMuscleGroups() {
  const data = await api.get('/stats/muscle-groups')
  muscleGroups.value = (data.muscleGroups || []).slice().sort((a, b) => b.volume - a.volume)
}

async function loadBodyweight() {
  const data = await api.get('/stats/bodyweight')
  bodyweightPoints.value = data.points
}

async function addMeasurement() {
  await api.post('/measurements', measurementForm.value)
  showAddMeasurement.value = false
  measurementForm.value = { date: todayIso(), weight: null, bodyFatPercent: null }
  await loadBodyweight()
}

onMounted(async () => {
  const data = await api.get('/exercises')
  exerciseOptions.value = data.exercises
  await loadMuscleGroups()
  await loadBodyweight()
})
</script>
