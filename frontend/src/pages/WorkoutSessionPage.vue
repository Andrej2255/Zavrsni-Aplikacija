<template>
  <div v-if="session" class="page-narrow" style="margin:0 auto">
    <router-link to="/sessions" class="btn btn-ghost btn-sm mt-sm" style="margin-bottom:10px">← Povijest</router-link>

    <PageHeader eyebrow="Trening u tijeku" :title="session.plan?.name || 'Slobodan trening'" :subtitle="formatDate(session.date)" />

    <div class="card card-body mt-md">
      <label>Bilješke o treningu</label>
      <textarea v-model="notes" class="input" rows="2" placeholder="Kako je prošao trening?" @blur="saveNotes"></textarea>
    </div>

    <div v-for="se in session.exercises" :key="se.id" class="card mt-md">
      <div class="ex-head">
        <span class="badge" :style="{ background: muscleGroupColor(se.exercise.muscleGroup) }">{{ se.exercise.muscleGroup }}</span>
        <div class="title">{{ se.exercise.name }}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Serija</th>
            <th>Ponavljanja</th>
            <th>Kilaža (kg)</th>
            <th class="text-center">Gotovo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="set in se.sets" :key="set.id" :class="{ 'set-done': set.completed }">
            <td>{{ set.setNumber }}</td>
            <td><input v-model.number="set.reps" type="number" class="input" @blur="updateSet(se, set)" /></td>
            <td><input v-model.number="set.weight" type="number" class="input" @blur="updateSet(se, set)" /></td>
            <td class="text-center">
              <input type="checkbox" v-model="set.completed" @change="updateSet(se, set)" />
            </td>
          </tr>
        </tbody>
      </table>

      <div class="card-body">
        <button class="btn btn-ghost btn-sm" @click="addSet(se)">+ Dodaj seriju</button>
      </div>
    </div>

    <button class="btn btn-primary mt-md" @click="showAddExercise = true">+ Dodaj vježbu</button>

    <Modal v-model="showAddExercise">
      <div class="modal-header">Dodaj vježbu</div>
      <div class="modal-body">
        <div class="field">
          <label>Vježba</label>
          <select v-model="newExerciseId" class="input">
            <option :value="null" disabled>Odaberi...</option>
            <option v-for="ex in exerciseOptions" :key="ex.id" :value="ex.id">{{ ex.name }}</option>
          </select>
        </div>
        <button class="btn btn-primary btn-block" @click="addExercise">Dodaj</button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api'
import { formatDate } from '@/utils/format'
import PageHeader from '@/components/PageHeader.vue'
import Modal from '@/components/Modal.vue'
import { muscleGroupColor } from '@/utils/muscleGroups'

const route = useRoute()
const sessionId = route.params.id

const session = ref(null)
const notes = ref('')
const exerciseOptions = ref([])
const showAddExercise = ref(false)
const newExerciseId = ref(null)

async function loadSession() {
  const data = await api.get(`/sessions/${sessionId}`)
  session.value = data.session
  notes.value = data.session.notes || ''
}

async function loadExercises() {
  const data = await api.get('/exercises')
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
  await loadSession()
  await loadExercises()
})
</script>

<style scoped>
.ex-head { display: flex; align-items: center; gap: 10px; padding: 16px 18px 8px; }
.set-done td { background: rgba(23, 199, 139, 0.1); }
td .input { padding: 6px 8px; }
</style>
