<template>
  <q-page class="q-pa-md q-pa-lg-xl" v-if="session">
    <div class="gt-wrap" style="max-width: 820px">
      <q-btn flat dense no-caps icon="arrow_back" label="Povijest" color="primary" to="/sessions" class="q-mb-sm" />

      <PageHeader eyebrow="Trening u tijeku" :title="session.plan?.name || 'Slobodan trening'"
        :subtitle="formatDate(session.date)" />

      <q-card class="q-mb-lg">
        <q-card-section>
          <q-input v-model="notes" label="Bilješke o treningu" outlined autogrow
            placeholder="Kako je prošao trening?" @blur="saveNotes">
            <template #prepend><q-icon name="edit_note" /></template>
          </q-input>
        </q-card-section>
      </q-card>

      <q-card v-for="se in session.exercises" :key="se.id" class="q-mb-md">
        <div class="gt-ex-head">
          <q-avatar rounded size="38px"
            :style="{ background: muscleGroupMeta(se.exercise.muscleGroup).color + '22', color: muscleGroupMeta(se.exercise.muscleGroup).color }"
            :icon="muscleGroupMeta(se.exercise.muscleGroup).icon" />
          <div>
            <div class="text-subtitle1 text-weight-bold">{{ se.exercise.name }}</div>
            <div class="text-caption gt-muted">{{ se.exercise.muscleGroup }}</div>
          </div>
        </div>

        <q-markup-table flat dense class="gt-sets">
          <thead>
            <tr>
              <th class="text-left">Serija</th>
              <th class="text-left">Ponavljanja</th>
              <th class="text-left">Kilaža (kg)</th>
              <th class="text-center">Gotovo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="set in se.sets" :key="set.id" :class="{ 'gt-set-done': set.completed }">
              <td class="text-weight-bold">{{ set.setNumber }}</td>
              <td><q-input v-model.number="set.reps" type="number" dense borderless @blur="updateSet(se, set)" /></td>
              <td><q-input v-model.number="set.weight" type="number" dense borderless @blur="updateSet(se, set)" /></td>
              <td class="text-center">
                <q-checkbox v-model="set.completed" color="positive" @update:model-value="updateSet(se, set)" />
              </td>
            </tr>
          </tbody>
        </q-markup-table>

        <q-card-actions>
          <q-btn flat color="primary" icon="add" label="Dodaj seriju" @click="addSet(se)" />
        </q-card-actions>
      </q-card>

      <q-btn color="primary" unelevated icon="add" label="Dodaj vježbu" @click="showAddExercise = true" />

      <q-dialog v-model="showAddExercise">
        <q-card style="width: 440px; max-width: 92vw">
          <q-card-section class="text-h6">Dodaj vježbu</q-card-section>
          <q-separator />
          <q-card-section>
            <q-select v-model="newExerciseId" :options="exerciseOptions" option-value="id" option-label="name"
              emit-value map-options label="Vježba" outlined />
            <q-btn color="primary" unelevated label="Dodaj" class="full-width q-mt-md" @click="addExercise" />
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/boot/axios'
import { date as qdate } from 'quasar'
import PageHeader from '@/components/PageHeader.vue'
import { muscleGroupMeta } from '@/utils/muscleGroups'

const route = useRoute()
const sessionId = route.params.id

const session = ref(null)
const notes = ref('')
const exerciseOptions = ref([])
const showAddExercise = ref(false)
const newExerciseId = ref(null)

function formatDate (d) {
  return qdate.formatDate(d, 'DD.MM.YYYY.')
}

async function loadSession () {
  const { data } = await api.get(`/sessions/${sessionId}`)
  session.value = data.session
  notes.value = data.session.notes || ''
}

async function loadExercises () {
  const { data } = await api.get('/exercises')
  exerciseOptions.value = data.exercises
}

async function saveNotes () {
  await api.put(`/sessions/${sessionId}`, { notes: notes.value })
}

async function addExercise () {
  if (!newExerciseId.value) return
  await api.post(`/sessions/${sessionId}/exercises`, {
    exerciseId: newExerciseId.value,
    order: session.value.exercises.length,
  })
  showAddExercise.value = false
  newExerciseId.value = null
  await loadSession()
}

async function addSet (sessionExercise) {
  const nextSetNumber = sessionExercise.sets.length + 1
  await api.post(`/sessions/${sessionId}/exercises/${sessionExercise.id}/sets`, {
    setNumber: nextSetNumber,
    reps: 10,
    weight: 0,
    completed: false,
  })
  await loadSession()
}

async function updateSet (sessionExercise, set) {
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

<style scoped>
.gt-ex-head {
  display: flex; align-items: center; gap: 12px;
  padding: 16px 18px 4px;
}
.gt-sets th { color: var(--gt-muted); font-weight: 700; font-size: .78rem; }
.gt-set-done td { background: rgba(18, 185, 129, .06); }
</style>
