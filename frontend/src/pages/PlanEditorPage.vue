<template>
  <div v-if="plan" class="page-narrow" style="margin:0 auto">
    <router-link to="/plans" class="btn btn-ghost btn-sm mt-sm" style="margin-bottom:10px">← Planovi</router-link>

    <PageHeader eyebrow="Plan treninga" :title="plan.name" :subtitle="plan.description || `${plan.exercises.length} vježbi u planu`">
      <template #actions>
        <button class="btn btn-primary" @click="showAdd = true">+ Dodaj vježbu</button>
      </template>
    </PageHeader>

    <div class="card">
      <div v-for="(pe, i) in plan.exercises" :key="pe.id" class="card-list-item">
        <span class="badge" :style="{ background: muscleGroupColor(pe.exercise.muscleGroup) }">{{ i + 1 }}</span>
        <div class="grow">
          <div class="title">{{ pe.exercise.name }}</div>
          <div class="caption">
            {{ pe.targetSets || '–' }} serije × {{ pe.targetReps || '–' }} ponavljanja
            <span v-if="pe.targetWeight"> @ {{ pe.targetWeight }} kg</span>
          </div>
        </div>
        <button class="btn btn-icon btn-ghost" title="Ukloni" @click="removeExercise(pe.id)">🗑</button>
      </div>

      <EmptyState
        v-if="plan.exercises.length === 0"
        title="Plan još nema vježbi"
        caption="Dodaj prvu vježbu i postavi ciljane serije, ponavljanja i kilažu."
      >
        <template #action>
          <button class="btn btn-primary" @click="showAdd = true">+ Dodaj vježbu</button>
        </template>
      </EmptyState>
    </div>

    <Modal v-model="showAdd">
      <div class="modal-header">Dodaj vježbu u plan</div>
      <div class="modal-body">
        <form @submit.prevent="addExercise">
          <div class="field">
            <label>Vježba</label>
            <select v-model="addForm.exerciseId" class="input" required>
              <option :value="null" disabled>Odaberi...</option>
              <option v-for="ex in exerciseOptions" :key="ex.id" :value="ex.id">{{ ex.name }}</option>
            </select>
          </div>
          <div class="field-row">
            <div class="field">
              <label>Serije</label>
              <input v-model.number="addForm.targetSets" type="number" class="input" />
            </div>
            <div class="field">
              <label>Ponavljanja</label>
              <input v-model.number="addForm.targetReps" type="number" class="input" />
            </div>
            <div class="field">
              <label>Kilaža (kg)</label>
              <input v-model.number="addForm.targetWeight" type="number" class="input" />
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Dodaj</button>
        </form>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'
import Modal from '@/components/Modal.vue'
import { muscleGroupColor } from '@/utils/muscleGroups'

const route = useRoute()
const planId = route.params.id

const plan = ref(null)
const exerciseOptions = ref([])
const showAdd = ref(false)
const addForm = ref({ exerciseId: null, targetSets: 3, targetReps: 10, targetWeight: null })

async function loadPlan() {
  const data = await api.get(`/plans/${planId}`)
  plan.value = data.plan
}

async function loadExercises() {
  const data = await api.get('/exercises')
  exerciseOptions.value = data.exercises
}

async function addExercise() {
  await api.post(`/plans/${planId}/exercises`, {
    ...addForm.value,
    order: plan.value.exercises.length,
  })
  showAdd.value = false
  addForm.value = { exerciseId: null, targetSets: 3, targetReps: 10, targetWeight: null }
  await loadPlan()
}

async function removeExercise(peId) {
  await api.delete(`/plans/${planId}/exercises/${peId}`)
  await loadPlan()
}

onMounted(async () => {
  await loadPlan()
  await loadExercises()
})
</script>
