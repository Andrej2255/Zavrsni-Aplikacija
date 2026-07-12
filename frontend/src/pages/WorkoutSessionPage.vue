<template>
  <q-page class="q-pa-md" v-if="session">
    <div class="row items-center q-mb-xs">
      <div class="text-h5 col">{{ session.plan?.name || 'Slobodan trening' }}</div>
      <div class="text-caption text-grey">{{ formatDate(session.date) }}</div>
    </div>

    <q-input
      v-model="notes"
      label="Bilješke o treningu"
      outlined
      dense
      class="q-mb-md"
      @blur="saveNotes"
    />

    <q-card v-for="se in session.exercises" :key="se.id" class="q-mb-md">
      <q-card-section>
        <div class="text-h6">{{ se.exercise.name }}</div>
        <div class="text-caption text-grey">{{ se.exercise.muscleGroup }}</div>
      </q-card-section>

      <q-markup-table flat dense>
        <thead>
          <tr>
            <th>Serija</th>
            <th>Ponavljanja</th>
            <th>Kilaža (kg)</th>
            <th>Odrađeno</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="set in se.sets" :key="set.id">
            <td>{{ set.setNumber }}</td>
            <td>
              <q-input v-model.number="set.reps" type="number" dense borderless @blur="updateSet(se, set)" />
            </td>
            <td>
              <q-input v-model.number="set.weight" type="number" dense borderless @blur="updateSet(se, set)" />
            </td>
            <td>
              <q-checkbox v-model="set.completed" @update:model-value="updateSet(se, set)" />
            </td>
          </tr>
        </tbody>
      </q-markup-table>

      <q-card-actions>
        <q-btn flat color="primary" icon="add" label="Dodaj seriju" @click="addSet(se)" />
      </q-card-actions>
    </q-card>

    <q-btn color="primary" icon="add" label="Dodaj vježbu" @click="showAddExercise = true" />

    <q-dialog v-model="showAddExercise">
      <q-card style="width: 400px">
        <q-card-section class="text-h6">Dodaj vježbu</q-card-section>
        <q-card-section>
          <q-select
            v-model="newExerciseId"
            :options="exerciseOptions"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            label="Vježba"
            outlined
          />
          <q-btn color="primary" label="Dodaj" class="full-width q-mt-md" @click="addExercise" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/boot/axios'
import { date as qdate } from 'quasar'

const route = useRoute()
const sessionId = route.params.id

const session = ref(null)
const notes = ref('')
const exerciseOptions = ref([])
const showAddExercise = ref(false)
const newExerciseId = ref(null)

function formatDate(d) {
  return qdate.formatDate(d, 'DD.MM.YYYY.')
}

async function loadSession() {
  const { data } = await api.get(`/sessions/${sessionId}`)
  session.value = data.session
  notes.value = data.session.notes || ''
}

async function loadExercises() {
  const { data } = await api.get('/exercises')
  exerciseOptions.value = data.exercises
}

async function saveNotes() {
  await api.put(`/sessions/${sessionId}`, { notes: notes.value })
}

async function addExercise() {
  if (!newExerciseId.value) return
  await api.post(`/sessions/${sessionId}/exercises`, {
    exerciseId: newExerciseId.value,
    order: session.value.exercises.length,
  })
  showAddExercise.value = false
  newExerciseId.value = null
  await loadSession()
}

async function addSet(sessionExercise) {
  const nextSetNumber = sessionExercise.sets.length + 1
  await api.post(`/sessions/${sessionId}/exercises/${sessionExercise.id}/sets`, {
    setNumber: nextSetNumber,
    reps: 10,
    weight: 0,
    completed: false,
  })
  await loadSession()
}

async function updateSet(sessionExercise, set) {
  await api.put(`/sessions/${sessionId}/exercises/${sessionExercise.id}/sets/${set.id}`, {
    reps: set.reps,
    weight: set.weight,
    completed: set.completed,
  })
}

onMounted(async () => {
  await Promise.all([loadSession(), loadExercises()])
})
</script>
