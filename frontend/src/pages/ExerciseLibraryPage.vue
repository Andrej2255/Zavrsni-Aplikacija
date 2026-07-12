<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h5 col">Vježbe</div>
      <q-btn color="primary" icon="add" label="Nova vježba" @click="showCreate = true" />
    </div>

    <q-select
      v-model="muscleGroupFilter"
      :options="muscleGroupOptions"
      label="Filtriraj po mišićnoj skupini"
      clearable
      outlined
      dense
      class="q-mb-md"
      style="max-width: 300px"
      @update:model-value="load"
    />

    <q-list bordered separator>
      <q-item v-for="ex in exercises" :key="ex.id">
        <q-item-section>
          <q-item-label>{{ ex.name }}</q-item-label>
          <q-item-label caption>{{ ex.muscleGroup }} · {{ ex.equipment || 'bez opreme' }}</q-item-label>
        </q-item-section>
        <q-item-section side v-if="ex.isCustom">
          <q-badge color="secondary">vlastita</q-badge>
        </q-item-section>
      </q-item>
      <q-item v-if="exercises.length === 0">
        <q-item-section class="text-grey">Nema vježbi za odabrani filter.</q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="showCreate">
      <q-card style="width: 400px">
        <q-card-section class="text-h6">Nova vježba</q-card-section>
        <q-card-section>
          <q-form @submit="createExercise" class="q-gutter-md">
            <q-input v-model="form.name" label="Naziv" outlined required />
            <q-input v-model="form.muscleGroup" label="Mišićna skupina" outlined required />
            <q-input v-model="form.equipment" label="Oprema (opcionalno)" outlined />
            <q-input v-model="form.description" label="Opis (opcionalno)" type="textarea" outlined />
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

const exercises = ref([])
const muscleGroupFilter = ref(null)
const muscleGroupOptions = [
  'Prsa', 'Noge', 'Leđa', 'Ramena', 'Ruke', 'Trbušnjaci',
]

const showCreate = ref(false)
const form = ref({ name: '', muscleGroup: '', equipment: '', description: '' })

async function load() {
  const { data } = await api.get('/exercises', {
    params: muscleGroupFilter.value ? { muscleGroup: muscleGroupFilter.value } : {},
  })
  exercises.value = data.exercises
}

async function createExercise() {
  await api.post('/exercises', form.value)
  showCreate.value = false
  form.value = { name: '', muscleGroup: '', equipment: '', description: '' }
  await load()
}

onMounted(load)
</script>
