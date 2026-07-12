<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Napredak</div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card class="q-pa-md">
          <div class="text-subtitle1 q-mb-sm">Napredak po vježbi</div>
          <q-select
            v-model="selectedExerciseId"
            :options="exerciseOptions"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            label="Odaberi vježbu"
            outlined
            dense
            class="q-mb-md"
            @update:model-value="loadExerciseProgress"
          />
          <Line v-if="exerciseChartData" :data="exerciseChartData" :options="chartOptions" />
          <div v-else class="text-grey">Odaberi vježbu za prikaz grafa.</div>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card class="q-pa-md">
          <div class="text-subtitle1 q-mb-sm">Volumen po mišićnoj skupini</div>
          <Bar v-if="muscleGroupChartData" :data="muscleGroupChartData" :options="chartOptions" />
        </q-card>
      </div>

      <div class="col-12">
        <q-card class="q-pa-md">
          <div class="row items-center q-mb-sm">
            <div class="text-subtitle1 col">Tjelesna težina kroz vrijeme</div>
            <q-btn flat dense color="primary" icon="add" label="Dodaj mjerenje" @click="showAddMeasurement = true" />
          </div>
          <Line v-if="bodyweightChartData" :data="bodyweightChartData" :options="chartOptions" />
        </q-card>
      </div>
    </div>

    <q-dialog v-model="showAddMeasurement">
      <q-card style="width: 350px">
        <q-card-section class="text-h6">Novo mjerenje</q-card-section>
        <q-card-section>
          <q-form @submit="addMeasurement" class="q-gutter-md">
            <q-input v-model="measurementForm.date" label="Datum" type="date" outlined required />
            <q-input v-model.number="measurementForm.weight" label="Težina (kg)" type="number" outlined />
            <q-input v-model.number="measurementForm.bodyFatPercent" label="% masti (opcionalno)" type="number" outlined />
            <q-btn type="submit" color="primary" label="Spremi" class="full-width" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Line, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement,
  CategoryScale, LinearScale, BarElement,
} from 'chart.js'
import { api } from '@/boot/axios'
import { date as qdate } from 'quasar'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, BarElement)

const chartOptions = { responsive: true, maintainAspectRatio: true }

const exerciseOptions = ref([])
const selectedExerciseId = ref(null)
const exerciseChartData = ref(null)
const muscleGroupChartData = ref(null)
const bodyweightChartData = ref(null)

const showAddMeasurement = ref(false)
const measurementForm = ref({ date: qdate.formatDate(Date.now(), 'YYYY-MM-DD'), weight: null, bodyFatPercent: null })

function fmtDate(d) {
  return qdate.formatDate(d, 'DD.MM.')
}

async function loadExerciseProgress() {
  if (!selectedExerciseId.value) return
  const { data } = await api.get(`/stats/exercise/${selectedExerciseId.value}`)
  exerciseChartData.value = {
    labels: data.points.map((p) => fmtDate(p.date)),
    datasets: [
      { label: 'Max kilaža (kg)', data: data.points.map((p) => p.maxWeight), borderColor: '#1976D2', tension: 0.3 },
      { label: 'Ukupni volumen', data: data.points.map((p) => p.totalVolume), borderColor: '#26A69A', tension: 0.3 },
    ],
  }
}

async function loadMuscleGroups() {
  const { data } = await api.get('/stats/muscle-groups')
  muscleGroupChartData.value = {
    labels: data.muscleGroups.map((m) => m.muscleGroup),
    datasets: [{ label: 'Volumen', data: data.muscleGroups.map((m) => m.volume), backgroundColor: '#1976D2' }],
  }
}

async function loadBodyweight() {
  const { data } = await api.get('/stats/bodyweight')
  bodyweightChartData.value = {
    labels: data.points.map((p) => fmtDate(p.date)),
    datasets: [{ label: 'Tjelesna težina (kg)', data: data.points.map((p) => p.weight), borderColor: '#F2C037', tension: 0.3 }],
  }
}

async function addMeasurement() {
  await api.post('/measurements', measurementForm.value)
  showAddMeasurement.value = false
  measurementForm.value = { date: qdate.formatDate(Date.now(), 'YYYY-MM-DD'), weight: null, bodyFatPercent: null }
  await loadBodyweight()
}

onMounted(async () => {
  const { data } = await api.get('/exercises')
  exerciseOptions.value = data.exercises
  await Promise.all([loadMuscleGroups(), loadBodyweight()])
})
</script>
