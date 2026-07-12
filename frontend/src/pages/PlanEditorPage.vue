<template>
  <q-page class="q-pa-md" v-if="plan">
    <div class="text-h5 q-mb-xs">{{ plan.name }}</div>
    <div class="text-caption text-grey q-mb-md">{{ plan.description }}</div>

    <q-list bordered separator class="q-mb-md">
      <q-item v-for="pe in plan.exercises" :key="pe.id">
        <q-item-section>
          <q-item-label>{{ pe.exercise.name }}</q-item-label>
          <q-item-label caption>
            {{ pe.targetSets || '-' }} serije × {{ pe.targetReps || '-' }} ponavljanja
            <span v-if="pe.targetWeight"> @ {{ pe.targetWeight }} kg</span>
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn flat round dense icon="delete" color="negative" @click="removeExercise(pe.id)" />
        </q-item-section>
      </q-item>
      <q-item v-if="plan.exercises.length === 0">
        <q-item-section class="text-grey">Plan još nema vježbi.</q-item-section>
      </q-item>
    </q-list>

    <q-btn color="primary" icon="add" label="Dodaj vježbu" @click="showAdd = true" />

    <q-dialog v-model="showAdd">
      <q-card style="width: 400px">
        <q-card-section class="text-h6">Dodaj vježbu u plan</q-card-section>
        <q-card-section>
          <q-form @submit="addExercise" class="q-gutter-md">
            <q-select
              v-model="addForm.exerciseId"
              :options="exerciseOptions"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              label="Vježba"
              outlined
              required
            />
            <q-input v-model.number="addForm.targetSets" label="Ciljni broj serija" type="number" outlined />
            <q-input v-model.number="addForm.targetReps" label="Ciljni broj ponavljanja" type="number" outlined />
            <q-input v-model.number="addForm.targetWeight" label="Ciljna kilaža (kg)" type="number" outlined />
            <q-btn type="submit" color="primary" label="Dodaj" class="full-width" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/boot/axios'

const route = useRoute()
const planId = route.params.id

const plan = ref(null)
const exerciseOptions = ref([])
const showAdd = ref(false)
const addForm = ref({ exerciseId: null, targetSets: 3, targetReps: 10, targetWeight: null })

async function loadPlan() {
  const { data } = await api.get(`/plans/${planId}`)
  plan.value = data.plan
}

async function loadExercises() {
  const { data } = await api.get('/exercises')
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
  await Promise.all([loadPlan(), loadExercises()])
})
</script>
