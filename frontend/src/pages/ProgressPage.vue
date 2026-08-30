<template>
  <q-page class="q-pa-md q-pa-lg-xl">
    <div class="gt-wrap">
      <PageHeader eyebrow="Analitika" title="Napredak"
        subtitle="Prati kilažu, volumen i tjelesnu težinu kroz vrijeme" />

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-card class="q-pa-md full-height gt-accent">
            <div class="gt-section-title q-mb-md"><q-icon name="show_chart" /> Napredak po vježbi</div>
            <q-select v-model="selectedExerciseId" :options="exerciseOptions" option-value="id" option-label="name"
              emit-value map-options label="Odaberi vježbu" outlined dense class="q-mb-md"
              @update:model-value="loadExerciseProgress" />
            <Line v-if="exerciseChartData" :data="exerciseChartData" :options="chartOptions" />
            <EmptyState v-else icon="query_stats" title="Odaberi vježbu" caption="Graf kilaže i volumena kroz vrijeme." />
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card class="q-pa-md full-height gt-accent gt-accent--emerald">
            <div class="gt-section-title q-mb-md"><q-icon name="bar_chart" style="background:linear-gradient(135deg,#12B981,#37D9A6)" /> Volumen po mišićnoj skupini</div>
            <Bar v-if="hasMuscleData" :data="muscleGroupChartData" :options="barOptions" />
            <EmptyState v-else icon="bar_chart" title="Još nema podataka" caption="Odradi treninge da vidiš raspodjelu volumena." />
          </q-card>
        </div>

        <div class="col-12">
          <q-card class="q-pa-md gt-accent gt-accent--orange">
            <div class="row items-center q-mb-md">
              <div class="gt-section-title col"><q-icon name="monitor_weight" style="background:linear-gradient(135deg,#FF7A2F,#FFA34D)" /> Tjelesna težina kroz vrijeme</div>
              <q-btn unelevated color="primary" icon="add" label="Dodaj mjerenje" @click="showAddMeasurement = true" />
            </div>
            <Line v-if="hasBodyweightData" :data="bodyweightChartData" :options="chartOptions" />
            <EmptyState v-else icon="monitor_weight" title="Nema unesenih mjerenja"
              caption="Dodaj prvo mjerenje težine da počneš pratiti trend.">
              <template #action><q-btn unelevated color="primary" icon="add" label="Dodaj mjerenje" @click="showAddMeasurement = true" /></template>
            </EmptyState>
          </q-card>
        </div>
      </div>

      <q-dialog v-model="showAddMeasurement">
        <q-card style="width: 380px; max-width: 92vw">
          <q-card-section class="text-h6">Novo mjerenje</q-card-section>
          <q-separator />
          <q-card-section>
            <q-form @submit="addMeasurement" class="q-gutter-md">
              <q-input v-model="measurementForm.date" label="Datum" type="date" outlined required stack-label />
              <q-input v-model.number="measurementForm.weight" label="Težina (kg)" type="number" outlined />
              <q-input v-model.number="measurementForm.bodyFatPercent" label="% masti (opcionalno)" type="number" outlined />
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
import { Line, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement,
  CategoryScale, LinearScale, BarElement,
} from 'chart.js'
import { api } from '@/boot/axios'
import { date as qdate } from 'quasar'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, BarElement)

const TICK = '#A6A2B8'
const GRID = 'rgba(255,255,255,.08)'

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 2.4,
  plugins: { legend: { labels: { usePointStyle: true, boxWidth: 8, color: TICK, font: { family: 'Roboto' } } } },
  scales: {
    x: { grid: { display: false }, ticks: { color: TICK } },
    y: { grid: { color: GRID }, ticks: { color: TICK }, grace: '12%' },
  },
}

const barOptions = {
  ...chartOptions,
  scales: {
    x: { grid: { display: false }, ticks: { color: TICK } },
    y: { grid: { color: GRID }, ticks: { color: TICK }, beginAtZero: true },
  },
}

const exerciseOptions = ref([])
const selectedExerciseId = ref(null)
const exerciseChartData = ref(null)
const muscleGroupChartData = ref(null)
const bodyweightChartData = ref(null)

const hasMuscleData = computed(() => !!muscleGroupChartData.value?.labels?.length)
const hasBodyweightData = computed(() => !!bodyweightChartData.value?.labels?.length)

const showAddMeasurement = ref(false)
const measurementForm = ref({ date: qdate.formatDate(Date.now(), 'YYYY-MM-DD'), weight: null, bodyFatPercent: null })

function fmtDate (d) {
  return qdate.formatDate(d, 'DD.MM.')
}

async function loadExerciseProgress () {
  if (!selectedExerciseId.value) return
  const { data } = await api.get(`/stats/exercise/${selectedExerciseId.value}`)
  exerciseChartData.value = {
    labels: data.points.map((p) => fmtDate(p.date)),
    datasets: [
      { label: 'Max kilaža (kg)', data: data.points.map((p) => p.maxWeight), borderColor: '#7C5CFF', backgroundColor: '#7C5CFF', tension: 0.35, pointRadius: 3 },
      { label: 'Ukupni volumen', data: data.points.map((p) => p.totalVolume), borderColor: '#12B981', backgroundColor: '#12B981', tension: 0.35, pointRadius: 3 },
    ],
  }
}

async function loadMuscleGroups () {
  const { data } = await api.get('/stats/muscle-groups')
  muscleGroupChartData.value = {
    labels: data.muscleGroups.map((m) => m.muscleGroup),
    datasets: [{ label: 'Volumen', data: data.muscleGroups.map((m) => m.volume), backgroundColor: '#7C5CFF', borderRadius: 8, maxBarThickness: 46 }],
  }
}

async function loadBodyweight () {
  const { data } = await api.get('/stats/bodyweight')
  bodyweightChartData.value = {
    labels: data.points.map((p) => fmtDate(p.date)),
    datasets: [{ label: 'Tjelesna težina (kg)', data: data.points.map((p) => p.weight), borderColor: '#FF6B35', backgroundColor: '#FF6B35', tension: 0.35, pointRadius: 3, fill: false }],
  }
}

async function addMeasurement () {
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
