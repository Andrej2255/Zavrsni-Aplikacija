<template>
  <q-page class="q-pa-md q-pa-lg-xl" v-if="plan">
    <div class="gt-wrap" style="max-width: 820px">
      <q-btn flat dense no-caps icon="arrow_back" label="Planovi" color="primary" to="/plans" class="q-mb-sm" />

      <PageHeader eyebrow="Plan treninga" :title="plan.name"
        :subtitle="plan.description || `${plan.exercises.length} vježbi u planu`">
        <template #actions>
          <q-btn color="primary" unelevated icon="add" label="Dodaj vježbu" @click="showAdd = true" />
        </template>
      </PageHeader>

      <q-card class="gt-accent">
        <q-list separator>
          <q-item v-for="(pe, i) in plan.exercises" :key="pe.id">
            <q-item-section avatar>
              <q-avatar rounded :style="{ background: muscleGroupMeta(pe.exercise.muscleGroup).color + '22', color: muscleGroupMeta(pe.exercise.muscleGroup).color }">
                {{ i + 1 }}
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ pe.exercise.name }}</q-item-label>
              <q-item-label caption>
                {{ pe.targetSets || '–' }} serije × {{ pe.targetReps || '–' }} ponavljanja
                <span v-if="pe.targetWeight"> @ {{ pe.targetWeight }} kg</span>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat round dense icon="delete" color="grey-6" @click="removeExercise(pe.id)" />
            </q-item-section>
          </q-item>
        </q-list>
        <div v-if="plan.exercises.length === 0">
          <EmptyState icon="fitness_center" title="Plan još nema vježbi"
            caption="Dodaj prvu vježbu i postavi ciljane serije, ponavljanja i kilažu.">
            <template #action><q-btn color="primary" unelevated icon="add" label="Dodaj vježbu" @click="showAdd = true" /></template>
          </EmptyState>
        </div>
      </q-card>

      <q-dialog v-model="showAdd">
        <q-card style="width: 440px; max-width: 92vw">
          <q-card-section class="text-h6">Dodaj vježbu u plan</q-card-section>
          <q-separator />
          <q-card-section>
            <q-form @submit="addExercise" class="q-gutter-md">
              <q-select v-model="addForm.exerciseId" :options="exerciseOptions" option-value="id" option-label="name"
                emit-value map-options label="Vježba" outlined required />
              <div class="row q-col-gutter-sm">
                <q-input class="col" v-model.number="addForm.targetSets" label="Serije" type="number" outlined />
                <q-input class="col" v-model.number="addForm.targetReps" label="Ponavljanja" type="number" outlined />
                <q-input class="col" v-model.number="addForm.targetWeight" label="Kilaža (kg)" type="number" outlined />
              </div>
              <q-btn type="submit" color="primary" unelevated label="Dodaj" class="full-width" />
            </q-form>
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
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'
import { muscleGroupMeta } from '@/utils/muscleGroups'

const route = useRoute()
const planId = route.params.id

const plan = ref(null)
const exerciseOptions = ref([])
const showAdd = ref(false)
const addForm = ref({ exerciseId: null, targetSets: 3, targetReps: 10, targetWeight: null })

async function loadPlan () {
  const { data } = await api.get(`/plans/${planId}`)
  plan.value = data.plan
}

async function loadExercises () {
  const { data } = await api.get('/exercises')
  exerciseOptions.value = data.exercises
}

async function addExercise () {
  await api.post(`/plans/${planId}/exercises`, {
    ...addForm.value,
    order: plan.value.exercises.length,
  })
  showAdd.value = false
  addForm.value = { exerciseId: null, targetSets: 3, targetReps: 10, targetWeight: null }
  await loadPlan()
}

async function removeExercise (peId) {
  await api.delete(`/plans/${planId}/exercises/${peId}`)
  await loadPlan()
}

onMounted(async () => {
  await Promise.all([loadPlan(), loadExercises()])
})
</script>
